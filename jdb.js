const fs = require('fs')

// keywords for the module
const tokens = {
    'Db': 'database',
    'rGroup': 'relational group',
    'iGroup': 'individual group',
    'element': 'JSON object in r/i groups',
    'entry': 'serial no. (key) in an element of rGroup',
    'prime': 'key of iGroup element',
    'moral': 'value of an element',
    'create': 'function to create a new query'
}

function create(token, query1, query2, query3) {

    // check if token is valid
    if (Object.keys(tokens).includes(token)) {

        // creating a database folder
        if (token === 'Db') {
            let path = './Db-' + query1 // it starts with 'Db-'
            fs.mkdirSync(path)
        }

        // creating a relational group
        if (token === 'rGroup') {
            let folders = fs.readdirSync('./') // get list of all files and folders
            let dbDirectory = folders.find(folder => folder.startsWith('Db-')) // check if any starts with 'Db-'

            if (dbDirectory !== undefined) {
                let dbDirectoryPath = fs.statSync(process.cwd() + '/' + dbDirectory) // get stats of the file/folder

                if (dbDirectoryPath.isDirectory()) { // it should be a directory
                    let path = './' + dbDirectory + '/' + query1 // create path for the new relational group (dir) in database

                    if (!fs.existsSync(path)) { // relational group should not exist
                        fs.mkdirSync(path)
                    } else {
                        console.log('Relational group already exists')
                    }

                    let path2 = './' + dbDirectory + '/' + query1 + '/config.json' // add a config file to it, to distinguish between r/i groups
                    let config = {
                        'type': 'rGroup'
                    }
                    fs.writeFileSync(path2, JSON.stringify(config))
                }
            }
        }
    }
}

// create('Db', 'database')
// create('rGroup', 'player')
// create('rGroup', 'enemy')
