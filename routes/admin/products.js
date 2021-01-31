const express = require( 'express' );
const { handleErrors } = require( './middlewares' );
const multer = require( 'multer' );
const productsIndexTemplate = require( '../../views/admin/products/index' );

const productsRepo = require( "../../repositories/products" );
const newProductsTemplate = require( '../../views/admin/products/new' );
const { requireTitle, requirePrice } = require( '../admin/validators' );


const router = express.Router();
const upload = multer( { storage: multer.memoryStorage() } )

router.get( "/admin/products", async ( req, res ) => {
    const products = await productsRepo.getAll();
    res.send( productsIndexTemplate( { products } ) );


} )


router.get( "/admin/products/new", [], ( req, res ) => {

    return res.send( newProductsTemplate( {} ) )

} )


router.post( "/admin/products/new", upload.single( 'image' ), [requirePrice, requireTitle], handleErrors( newProductsTemplate ), async ( req, res ) => {
    try {
        const image = req.file.buffer.toString( 'base64' );
        const { title, price } = req.body
        await productsRepo.create( { title, price, image } );
        res.redirect( "/admin/products" );
    } catch ( err ) { }

} )


module.exports = router;