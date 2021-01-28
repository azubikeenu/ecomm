

// ------ setting up a new webserver -------------//

const express = require( "express" );
const bodyParser = require( "body-parser" );
const cookieSession = require( "cookie-session" );
const authRouter = require( './routes/admin/auth' );
const app = express();


// make the middleware global
app.use( bodyParser.urlencoded( { extended: true } ) );
app.use( cookieSession( { keys: ['kggfhhytwwttwuudhbxvfeettruzxcxv'] } ) );
app.use( authRouter );


// watch for incoming requests on port 3000!
app.listen( 3000, () => {
    console.log( 'App listening on port 3000!' );
} );




