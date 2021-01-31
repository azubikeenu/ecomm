
const crypto = require( 'crypto' );
const util = require( 'util' );
const scrypt = util.promisify( crypto.scrypt );
const Repository = require( "./repository" );
class UsersRepository extends Repository {

    async create ( attribute ) {
        // read the an extract the array 
        attribute.id = this.randomId();
        const salt = crypto.randomBytes( 8 ).toString( 'hex' );
        const buff = await scrypt( attribute.password, salt, 64 )
        const users = await this.getAll();
        const record = { ...attribute, password: `${buff.toString( 'hex' )}.${salt}` };
        // add the object to an array 
        users.push( record );
        // write to the file system 
        await this.writeAll( users );
        return record;

    }


    async comparePassword ( savedPassword, suppliedPassword ) {
        const [hashed, salt] = savedPassword.split( "." );
        const buff = await scrypt( suppliedPassword, salt, 64 );
        return hashed === buff.toString( 'hex' );

    }


}




module.exports = new UsersRepository( 'users.json' );

