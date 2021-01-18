
const fs = require( 'fs' );

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


}

const test = async () => {
    const repo = new UsersRepository( "users.json" );
    const users = await repo.getAll();
    console.log( users );
}

test();