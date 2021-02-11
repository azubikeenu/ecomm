const express = require( "express" );
const carts = require( "../repositories/carts" );
const cartsRepo = require( "../repositories/carts" );
const productsRepo = require( "../repositories/products" );
const showCartTemplate = require( '../views/carts/showcart' );

const router = express.Router();




/**
 * receive a post request handler to add an item to the cart 
 * recieve a get request to show all cart items 
 * receive a post request to delete items from the cart 
 */


router.post( "/cart/products", async ( req, res ) => {
    const id = req.body.productId;

    // check if the cart session exists  
    let cart;
    if ( !req.session.cartId ) {
        //  we dont have a cart we need to create one 
        cart = await cartsRepo.create( { items: [] } );
        req.session.cartId = cart.id;

    } else {
        // get it from the repository 
        cart = await cartsRepo.findById( req.session.cartId );
    }

    // Add an increment for an existing product or add a new item in the items array 
    const foundItem = cart.items.find( item => item.id === id );
    if ( foundItem ) {
        foundItem.quantity++;
    } else {
        cart.items.push( { id, quantity: 1 } );
    }
    await cartsRepo.update( cart.id, cart );

    //
    res.redirect( "/cart" );
} )


router.get( "/cart", async ( req, res ) => {
    if ( !req.session.cartId ) {
        res.redirect( "/" );
    }

    const cart = await cartsRepo.findById( req.session.cartId );
    for ( const item of cart.items ) {
        item.product = await productsRepo.findById( item.id );
    }

    res.send( showCartTemplate( { items: cart.items } ) )



} )


router.post( "/cart/products/delete", async ( req, res ) => {

    if ( req.session.cartId ) {
        // get the cart 
        const cart = await cartsRepo.findById( req.session.cartId );
        const newItems = cart.items.filter( item => item.id !== req.body.itemId );
        // update the cart 
        await cartsRepo.update( req.session.cartId, { items: newItems } );

        res.redirect( "/cart" );

    }


} )


module.exports = router;