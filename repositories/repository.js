
const fs = require( 'fs' );
const crypto = require( 'crypto' );

module.exports = class Repository {

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

    async create ( attribute ) {
        attribute.id = this.randomId();
        const records = await this.getAll();
        records.push( attribute );
        await this.writeAll( records );
        return attribute;

    }

    async getAll () {
        // read the file
        return JSON.parse( await fs.promises.readFile( this.fileName, { encoding: "utf-8" } ) );
    }
    async writeAll ( records ) {
        await ( fs.promises.writeFile( "users.json", JSON.stringify( records ), { encoding: "utf8" } ) );
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