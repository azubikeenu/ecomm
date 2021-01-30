const layout = require( '../layout' );
const { getError } = require( "../../helpers" );


module.exports = ( { errors } ) => {
    return layout( {
        content: `
            <form method = 'POST' enctype ="multipart/form-data">
            Title   <input type="text" placeholder ="title" name = "title"/>
            ${getError( errors, 'title' )}
            <br/>
            <br/>
            Price   <input type="text" placeholder ="price" name = "price"/>
            ${getError( errors, 'price' )}
            <br/>
            <br/>
            <input type="file" name ="image"/>
            <br/>
            <br/>
            <button> SUBMIT</button>  
            </form>
  
  `} )


}