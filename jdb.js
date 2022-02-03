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
            if (dbDirectory !== null && dbDirectory !== undefined) {
                // here query1 will be the group in which element needs to be created
                // query2 will be the name of the element

                // check if the group exists
                let checkPathOfGroup = './' + dbDirectory + '/' + query1
                if (fs.existsSync(checkPathOfGroup)) {
                    let path = './' + dbDirectory + '/' + query1 + '/' + query2 + '.json' // create path for the new element in respective group

                    if (!fs.existsSync(path)) { // element should not already exist
                        // get the config file of the group
                        let config = JSON.parse(fs.readFileSync('./' + dbDirectory + '/' + query1 + '/__config.json'))

                        let element = {} // create an empty element which will be written to the file and edited below

                        // check type of group
                        if (config['type'] === 'rGroup') { // relational group
                            let authenticity = __rGroupIsAuthentic(dbDirectory, query1) // check if all elements have the same keys
                            if (authenticity) { // if all elements have the same keys
                                // get name of any element in the group (if any)
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
                                    fs.writeFileSync(path, JSON.stringify(element, null, 4)) // write the element to folder
                                    console.log('Element created successfully')
                                } else {
                                    console.error('[Err]: Element already exists')
                                }
                            } else {
                                console.error('[Err]: Elements in the group do not have the same keys, rGroup lost authenticity')
                            }

                        } else { // individual group

                            //get name of any element in the group (if any)
                            let existingElements = fs.readdirSync('./' + dbDirectory + '/' + query1)
                            existingElements.shift() // remove the first element (0)
                            if (existingElements.length === 0) { // if no element exists
                                element = {
                                    "id": uuidv4()
                                }
                                // write the element to folder
                                fs.writeFileSync(path, JSON.stringify(element, null, 4))
                                console.log('Element created successfully')
                            } else {
                                console.error('[Err]: An element already exists, iGroups can only have one element')
                            }

                        }
                    } else {
                        console.error('[Err]: Element already exists')
                    }
                } else {
                    console.error('[Err]: Group does not exist')
                }
            } else {
                console.error('[Err]: No database found')
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


function __rGroupIsAuthentic(dbDir, rGroup) {
    // in relational groups, all elements should have the same keys
    // check if all elements have the same keys
    let __files = fs.readdirSync('./' + dbDir + '/' + rGroup) // get list of all files
    __files = __files.filter(_file => _file !== '__config.json') // remove config file
    // check if all files have the same keys
    let __keys = [] // this array will contains arrays of keys of all elements
    __files.forEach(__file => {
        __keys.push(Object.keys(JSON.parse(fs.readFileSync('./' + dbDir + '/' + rGroup + '/' + __file)))) // get keys of each element
    });

    // check if all keys are the same
    let __keysAreSame = true
    for (let i = 0; i < __keys.length; i++) { // iterate through all key arrays
        if (JSON.stringify(__keys[i]) !== JSON.stringify(__keys[0])) {
            __keysAreSame = false
            break
        }
    }
    return __keysAreSame
}

// create('Db', 'database')
// create('rGroup', 'workers')
// create('rGroup', 'clients')
// create('iGroup', 'office-hardware')

// create('element', 'clients', 'names')
// create('element', 'workers', 'names')
// create('element', 'office-hardware', 'hardwares')
// create('element', 'clients', 'address')
