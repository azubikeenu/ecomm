const layout = require( './layout' );

module.exports = ( { req } ) => {

    return layout( {
        content:
            `Your ID is  ${req.session.userId}
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
    ` } );


}