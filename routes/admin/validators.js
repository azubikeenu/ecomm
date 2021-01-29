const { check } = require( "express-validator" );
const usersRepo = require( "../../repositories/users" );


module.exports = {
    requireEmail: check( 'email' )
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

    requirePassword: check( 'password' )
        .trim()
        .isLength( { min: 4, max: 20 } )
        .withMessage( "Must be between 4 to 20 characters" ),

    requirePasswordConfirmation: check( 'passwordConfirmation' )
        .trim()
        .isLength( { min: 4, max: 20 } )
        .withMessage( "Must be between 4 to 20 characters" )
        .custom( ( passwordConfirmation, { req } ) => {
            if ( req.body.password !== passwordConfirmation ) {
                throw new Error( "Passwords must match" );
            }
        } ),

    requireValidEmail: check( 'email' )
        .trim()
        .normalizeEmail()
        .isEmail()
        .withMessage( "Must provide a valid email" )
        .custom( async ( email ) => {
            const user = await usersRepo.getOneBy( { email } );
            if ( !user ) {
                throw new Error( "Email not found !!" );
            }
        } ),

    requireValidUserPassword: check( 'password' )
        .trim()
        .custom( async ( password, { req } ) => {
            const user = await usersRepo.getOneBy( { email: req.body.email } );
            if ( !user ) {
                throw new Error( "Invalid Password !!" );
            }
            const isValidPassword = await usersRepo.comparePassword( user.password, password );
            if ( !isValidPassword ) {
                throw new Error( "Invalid Password !!" );
            }

        } )


};