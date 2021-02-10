const express = require( 'express' );
const multer = require( 'multer' );
const { handleErrors, requireAuth } = require( './middlewares' );
const productsIndexTemplate = require( '../../views/admin/products/index' );

const productsRepo = require( "../../repositories/products" );
const newProductsTemplate = require( '../../views/admin/products/new' );
const productEditTemplate = require( '../../views/admin/products/edit' );
const { requireTitle, requirePrice } = require( '../admin/validators' );


const router = express.Router();
const upload = multer( { storage: multer.memoryStorage() } )

router.get( "/admin/products", requireAuth, async ( req, res ) => {
    const products = await productsRepo.getAll();
    return res.send( productsIndexTemplate( { products } ) );
} )


router.get( "/admin/products/new", requireAuth, ( req, res ) => {
    return res.send( newProductsTemplate( {} ) );
} )


router.post( "/admin/products/new", requireAuth, upload.single( 'image' ), [requirePrice, requireTitle], handleErrors( newProductsTemplate ), async ( req, res ) => {

    const image = req.file.buffer.toString( 'base64' );//the base64 string safely represents an image in a string format 
    const { title, price } = req.body
    await productsRepo.create( { title, price, image } );
    return res.redirect( "/admin/products" );

} )

router.get( "/admin/products/:id/edit", requireAuth, async ( req, res ) => {
    const product = await productsRepo.findById( req.params.id );
    if ( !product ) {
        return res.send( `Product not found!!` )

    }

    res.send( productEditTemplate( { product } ) );



} )


router.post( "/admin/products/:id/edit", requireAuth, upload.single( 'image' ),
    [requirePrice, requireTitle], handleErrors( productEditTemplate, async ( req ) => {
        const product = await productsRepo.findById( req.params.id );
        return { product };
    } ),
    async ( req, res ) => {
        const changes = req.body;
        if ( req.file ) {
            changes.image = req.file.buffer.toString( 'base64' );
        }
        try {
            await productsRepo.update( req.params.id, changes );

        } catch ( err ) {
            return res.send( "Product not found" );
        }

        return res.redirect( '/admin/products' )
    } )

router.post( "/admin/products/:id/delete", requireAuth, async ( req, res ) => {
    await productsRepo.delete( req.params.id );
    return res.redirect( '/admin/products' );

} )


module.exports = router