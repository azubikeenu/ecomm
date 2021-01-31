const express = require( 'express' );
const { handleErrors } = require( './middlewares' );
const usersRepo = require( "../../repositories/users" );
const router = express.Router();
const signUpTemplate = require( "../../views/admin/auth/signup" );
const signInTemplate = require( '../../views/admin/auth/signin' );
const { requireEmail, requirePassword, requirePasswordConfirmation, requireValidEmail, requireValidUserPassword } = require( "./validators" );

// add a route handler 
router.get( '/signup', ( req, res ) => {
    res.send( signUpTemplate( { req } ) );
} );


router.post( '/signup', [requireEmail, requirePassword, requirePasswordConfirmation], handleErrors( signUpTemplate ), async ( req, res ) => {
    try {
        // get access to email and password 
        const { email, password, passwordConfirmation } = req.body;
        //create user in our user repository that represents the user 
        const user = await usersRepo.create( { email, password } );
        // store the id inside the users cookie  ==> req.session is added by the cookie-session 
        req.session.userId = user.id;
        res.redirect( "/admin/products" );
    } catch ( err ) { }

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


router.post( '/signin', [requireValidEmail, requireValidUserPassword], handleErrors( signInTemplate ), async ( req, res ) => {
    try {
        const { email } = req.body;
        const user = await usersRepo.getOneBy( { email } );
        if ( !user ) {
            throw new Error( "Email not found !!" );
        }

        req.session.userId = user.id;

        res.redirect( "/admin/products" );
    } catch ( err ) {

    }



} )

module.exports = router;
