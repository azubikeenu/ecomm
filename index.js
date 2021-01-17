

// ------ setting up a new webserver -------------//

const express = require( "express" );
const bodyParser = require( "body-parser" );
const app = express();

// make the middleware global
app.use( bodyParser.urlencoded( { extended: true } ) );


// add a route handler 
app.get( '/', ( req, res ) => {
    res.send( `
        <form method ="post">
        Email : <input type="text" placeholder="email" name = "email"/>
        <br/>
        <br/>
        Password : <input type="password" placeholder="password" name ="password"/>
        <br/>
        <br/>
        <button> SignUp</button>
        </form>
    
    ` );
} );


app.post( '/', ( req, res ) => {

    // get access to email and password 
    console.log( req.body )
    res.send( ` account created !!!` );
} );

app.listen( 3000, () => {
    console.log( 'App listening on port 3000!' );
} );




