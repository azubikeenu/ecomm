const express = require( 'express' );
const { validationResult } = require( 'express-validator' );
const usersRepo = require( "../../repositories/users" );
const router = express.Router();
const signUpTemplate = require( "../../views/admin/auth/signup" );
const signInTemplate = require( '../../views/admin/auth/signin' );
const { requireEmail, requirePassword, requirePasswordConfirmation, requireValidEmail, requireValidUserPassword } = require( "./validators" );

// add a route handler 
router.get( '/signup', ( req, res ) => {
    res.send( signUpTemplate( { req } ) );
} );


router.post( '/signup', [requireEmail, requirePassword, requirePasswordConfirmation], async ( req, res ) => {
    const errors = validationResult( req );
    if ( !errors.isEmpty() ) {
        return res.send( signUpTemplate( { req, errors } ) );
    }
    // get access to email and password 
    const { email, password } = req.body;
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
    res.send( signInTemplate( {} ) )

} )


router.post( '/signin', [requireValidEmail, requireValidUserPassword], async ( req, res ) => {
    const errors = validationResult( req );
    if ( !errors.isEmpty() ) {
        return res.send( signInTemplate( { errors } ) );
    }
    const { email } = req.body;
    const user = await usersRepo.getOneBy( { email } );
    if ( !user ) {
        throw new Error( "Email not found !!" );
    }

    req.session.userId = user.id;

    res.send( "You are signed in " );


} )

module.exports = router;
