
const fs = require( 'fs' );
const crypto = require( 'crypto' );
const util = require( 'util' );
const scrypt = util.promisify( crypto.scrypt );

class UsersRepository {
    constructor( fileName ) {
        if ( !fileName ) {
            throw new Error( "Creating a repository requires a file name" );
        }
        this.fileName = fileName;
        try {
            fs.accessSync( this.fileName );

        } catch ( err ) {
            fs.writeFileSync( this.fileName, '[]' );
        }

    }

    async getAll () {
        // read the file
        return JSON.parse( await fs.promises.readFile( this.fileName, { encoding: "utf-8" } ) );
    }
    async writeAll ( records ) {
        await ( fs.promises.writeFile( "users.json", JSON.stringify( records ), { encoding: "utf8" } ) );
    }


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

    randomId () {
        return crypto.randomBytes( 4 ).toString( 'hex' );

    }

    async findById ( id ) {
        const users = await this.getAll()
        return users.find( user => user.id === id );
    }

    async delete ( id ) {
        const users = await this.getAll();
        const filterdRecords = users.filter( user => user.id !== id );
        await this.writeAll( filterdRecords );
    }

    async update ( id, attribute ) {
        const users = await this.getAll();
        const user = users.find( user => user.id === id );
        if ( !user ) {
            throw new Error( `Record with id : ${id} is not found` );
        }

        Object.assign( user, attribute );
        await this.writeAll( users );

    }

    async getOneBy ( filters ) {
        const users = await this.getAll();
        for ( const user of users ) {
            let found = true;
            for ( const key in filters ) {
                if ( user[key] !== filters[key] ) found = false;
            }

            if ( found == true ) {
                return user;
            }
        }

    }

}




module.exports = new UsersRepository( 'users.json' );

