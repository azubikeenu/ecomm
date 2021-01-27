

// ------ setting up a new webserver -------------//

const express = require( "express" );
const bodyParser = require( "body-parser" );
const cookieSession = require( "cookie-session" );
const usersRepo = require( "./repositories/users" );
const e = require( "express" );
const app = express();


// make the middleware global
app.use( bodyParser.urlencoded( { extended: true } ) );
app.use( cookieSession( {
    keys: ['kggfhhytwwttwuudhbxvfeettruzxcxv']
} ) )

// add a route handler 
app.get( '/signup', ( req, res ) => {
    res.send( `
        Your ID is  ${req.session.userId}
        <form method ="post">
        Email : <input type="text" placeholder="email" name = "email"/>
        <br/>
        <br/>
        Password : <input type="password" placeholder="password" name ="password"/>
        <br/>
        <br/>
        Confirm Password : <input type="password" placeholder="confirm password" name ="passwordConfirmation"/>
        <br/>
        <br/>
        <button> SignUp</button>
        </form>
    
    ` );
} );


app.post( '/signup', async ( req, res ) => {

    // get access to email and password 
    const { email, password, passwordConfirmation } = req.body;

    const isExistingUser = await usersRepo.getOneBy( { email } );

    // perform validation on email and password 
    if ( isExistingUser ) {
        return res.send( "Email already in use!!!" );
    }
    if ( password !== passwordConfirmation ) {
        return res.send( "Passwords must match" );
    }

    //create user in our user repository that represents the user 
    const user = await usersRepo.create( { email, password } );
    // store the id inside the users cookie  ==> req.session is added by the cookie-session 
    req.session.userId = user.id;
    res.send( ` account created !!!` );
} );

//signout
app.get( '/signout', ( req, res ) => {
    req.session = null;
    res.send( "You are logged out!!" );
} )

// signin 

app.get( '/signin', ( req, res ) => {
    res.send( `
    <form method ="post">
    Email : <input type="text" placeholder="email" name = "email"/>
    <br/>
    <br/>
    Password : <input type="password" placeholder="password" name ="password"/>
    <br/>
    <br/>
    <button> Sign In</button>
    </form>

`)

} )


app.post( '/signin', async ( req, res ) => {
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

// watch for incoming requests on port 3000!
app.listen( 3000, () => {
    console.log( 'App listening on port 3000!' );
} );




