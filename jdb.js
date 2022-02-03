const fs = require('fs')
const { v4: uuidv4 } = require('uuid')

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
            // check if the folder already exists
            if (!fs.existsSync(path)) {
                fs.mkdirSync(path)
                console.log('Database created successfully')
            } else {
                console.error('Database already exists')
            }
        }

        // creating a group
        if (token === 'rGroup' || token === 'iGroup') {
            let dbDirectory = __checkIfDatabaseExists() // checking if database exists

            if (dbDirectory !== null) {
                let path = './' + dbDirectory + '/' + query1 // create path for the new relational group (dir) in database

                if (!fs.existsSync(path)) { // Group should not already exist
                    fs.mkdirSync(path)
                    console.log('Group created successfully')
                } else {
                    console.error('Group already exists')
                }

                let path2 = './' + dbDirectory + '/' + query1 + '/__config.json' // add a config file to it, to separate
                let rConfig = { 'type': 'rGroup' } // respective to the type of group
                let iConfig = { 'type': 'iGroup' }

                fs.writeFileSync(path2, JSON.stringify(
                    token == 'rGroup' ? rConfig : iConfig // write config file
                ))
            } else {
                console.error('No database found')
            }
        }

        // creating an element
        if (token === 'element') {
            let dbDirectory = __checkIfDatabaseExists() // checking if database exists
            if (dbDirectory !== null) {
                // here query1 will be the group in which element needs to be created
                // query2 will be the name of the element

                // check if the group exists
                let checkPathOfElement = './' + dbDirectory + '/' + query1
                if (fs.existsSync(checkPathOfElement)) {
                    let path = './' + dbDirectory + '/' + query1 + '/' + query2 + '.json' // create path for the new element in respective group
                    // get the config file of the group
                    let config = JSON.parse(fs.readFileSync('./' + dbDirectory + '/' + query1 + '/__config.json'))

                    let element = {} // create an empty element which will be written to the file and edited below

                    // check type of group
                    if (config['type'] === 'rGroup') {
                        // get name of a any element in the group (if any)
                        let existingElements = fs.readdirSync('./' + dbDirectory + '/' + query1)
                        if (existingElements.length === 0) { // if no element exists
                            element = {
                                0: `${uuidv4()}` // create a new element with a unique key
                            }
                        } else {
                            // create a new element with a unique key based on previous elements
                            element = __createElementsInRGroupsAccordingToAlreadyExisting(dbDirectory, existingElements, query1)
                        }

                        // check if the element already exists and create a new one if it does
                        if (!fs.existsSync(path)) {
                            // create new file path
                            fs.writeFileSync(path, JSON.stringify(element, null, 4)) // write the element to the file
                            console.log('Element created successfully')
                        } else {
                            console.error('Element already exists')
                        }
                    }
                } else {
                    console.error('Group does not exist')
                }
            }
        }

    }
}

function __checkIfDatabaseExists() {
    let __folders = fs.readdirSync('./') // get list of all files and folders
    let __dbDirectory = __folders.find(_folder => _folder.startsWith('Db-')) // check if any starts with 'Db-'

    if (__dbDirectory !== undefined) {
        let __dbDirectoryPath = fs.statSync(process.cwd() + '/' + __dbDirectory) // get stats of the file/folder
        if (__dbDirectoryPath.isDirectory()) { // it should be a directory
            return __dbDirectory // return folder name if it exists
        } else {
            return null // return null if it is not a directory
        }
    }
}

function __createElementsInRGroupsAccordingToAlreadyExisting(dbDirectory, existingElements, query1) {
    let existingEl = existingElements[0]
    // get the keys of the existing element
    let existingElKeys = Object.keys(JSON.parse(fs.readFileSync('./' + dbDirectory + '/' + query1 + '/' + existingEl)))
    // remove the first key (0)
    existingElKeys.shift()
    // create element with a unique key
    let newElement = {
        0: `${uuidv4()}`
    }
    // create more keys for the element from the existing keys
    existingElKeys.forEach(_key => {
        newElement[_key] = null
    })

    return newElement
}

// create('Db', 'database')
// create('rGroup', 'workers')
// create('rGroup', 'clients')
// create('iGroup', 'office hardware')
// create('element', 'clients', 'names')