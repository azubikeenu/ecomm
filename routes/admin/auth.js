const express = require( 'express' );
const { check, validationResult } = require( 'express-validator' );
const usersRepo = require( "../../repositories/users" );
const router = express.Router();
const signUpTemplate = require( "../../views/admin/auth/signup" );
const signInTemplate = require( '../../views/admin/auth/signin' );

// add a route handler 
router.get( '/signup', ( req, res ) => {
    res.send( signUpTemplate( { req } ) );
} );


router.post( '/signup', [
    check( 'email' )
        .trim()
        .normalizeEmail()
        .isEmail()
        .withMessage( "Must be a valid email" ).custom( async ( email ) => {
            const isExistingUser = await usersRepo.getOneBy( { email } );
            // perform validation on email and password 
            if ( isExistingUser ) {
                throw new Error( "Email already in use!!" )
            }
        } ),
    check( 'password' )
        .trim()
        .isLength( { min: 4, max: 20 } )
        .withMessage( "Must be between 4 to 20 characters" ),
    check( 'passwordConfirmation' )
        .trim()
        .isLength( { min: 4, max: 20 } )
        .withMessage( "Must be between 4 to 20 characters" )
        .custom( ( passwordConfirmation, { req } ) => {
            if ( req.body.password !== passwordConfirmation ) {
                throw new Error( "Passwords must match" );
            }
        } )
], async ( req, res ) => {

    const errors = validationResult( req );
    console.log( errors );
    // get access to email and password 
    const { email, password, passwordConfirmation } = req.body;
    //create user in our user repository that represents the user 
    const user = await usersRepo.create( { email, password } );
    // store the id inside the users cookie  ==> req.session is added by the cookie-session 
    req.session.userId = user.id;
    res.send( ` account created !!!` );
} );

//signout
router.get( '/signout', ( req, res ) => {
    req.session = null;
    res.send( "You are logged out!!" );
} )

// signin 

router.get( '/signin', ( req, res ) => {
    res.send( signInTemplate() )

} )


router.post( '/signin', async ( req, res ) => {
    const { email, password } = req.body;
    const user = await usersRepo.getOneBy( { email } );
    if ( !user ) {
        res.send( "Email not found!!!" );
    }
    const validPassword = await usersRepo.comparePassword( user.password, password );
    if ( !validPassword ) {
        res.send( "Invalid password!!!" );
    }
    req.session.userId = user.id;

    res.send( "You are signed in " );


} )

module.exports = router;
