const layout = require( './layout' );
module.exports = () => {
    return layout( {
        content: ` <form method ="post">
    Email : <input type="text" placeholder="email" name = "email"/>
    <br/>
    <br/>
    Password : <input type="password" placeholder="password" name ="password"/>
    <br/>
    <br/>
    <button> Sign In</button>
    </form>` }

    );


}