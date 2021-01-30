const express = require( 'express' );
const router = express.Router();
const productsRepo = require( "../../repositories/products" );
const { validationResult } = require( 'express-validator' );
const newProductsTemplate = require( '../../views/admin/products/new' );
const { requireTitle, requirePrice } = require( '../admin/validators' )

router.get( "/admin/products", ( req, res ) => {
    res.send( "LIST PRODUCTS" );


} )


router.get( "/admin/products/new", [], ( req, res ) => {

    return res.send( newProductsTemplate( {} ) )

} )


router.post( "/admin/products/new", [requirePrice, requireTitle], ( req, res ) => {
    const errors = validationResult( req );
    console.log( req.body );
    req.on( 'data', ( data ) => {
        console.log( data.toString() );

    } )
    if ( !errors.isEmpty() ) {
        console.log( errors )
        return res.send( newProductsTemplate( { errors } ) );
    }

    res.send( "Form Submittted!" );
} )


module.exports = router;