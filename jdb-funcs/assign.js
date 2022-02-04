const assignmentTokens = {
    'entry': 'serial no. (key) in an element of rGroup',
    'prime': 'key of iGroup element',
    'moral': 'value of an element'
}
const { __checkIfDatabaseExists } = require('./create.js')
const { __rGroupIsAuthentic } = require('./create.js')
const fs = require('fs')

function assign(token, group, moralObject) {
    // check if token is valid
    if (Object.keys(assignmentTokens).includes(token)) {
        let dbDirectory = __checkIfDatabaseExists() // checking if database exists
        if (dbDirectory !== null) {
            // check if group exists
            let checkGroupPath = './' + dbDirectory + '/' + group
            if (fs.existsSync(checkGroupPath)) {
                // check if group is relational group
                let checkGroupConfigPath = './' + dbDirectory + '/' + group + '/__config.json'

                let groupConfig = JSON.parse(fs.readFileSync(checkGroupConfigPath))["type"] // check the type of group
                if (groupConfig == 'rGroup') {
                    // check if group is authentic
                    if (__rGroupIsAuthentic(dbDirectory, group)) {
                        if (typeof moralObject == 'object') {
                            let allElementsOfGroup = fs.readdirSync(checkGroupPath)
                            // remove the config file from the list
                            allElementsOfGroup.splice(allElementsOfGroup.indexOf('__config.json'), 1)

                            let keysOfMoral = Object.keys(moralObject)
                            // check if all keys of moral are present in all elements of group

                            if (keysOfMoral.every(element => allElementsOfGroup.includes(element + '.json'))) {
                                // find the length of first element in group
                                let firstElement = JSON.parse(fs.readFileSync(checkGroupPath + '/' + allElementsOfGroup[0]))
                                let lengthOfFirstElement = Object.keys(firstElement).length // this value is the entry of new morals in all elements of group

                                // put all values of moralObject to elements same as keys
                                keysOfMoral.forEach(key => {
                                    let elementPath = './' + dbDirectory + '/' + group + '/' + key + '.json' // path of element to be updated
                                    let element = JSON.parse(fs.readFileSync(elementPath))
                                    element[lengthOfFirstElement] = moralObject[key] // put value of moralObject to element
                                    fs.writeFileSync(elementPath, JSON.stringify(element, null, 4))
                                    return lengthOfFirstElement // return the entry of the assigned morals
                                })
                                greenConsole('Morals assigned successfully')
                            } else {
                                console.error('\x1b[31m[Err]:\x1b[0m Some keys of moral are not present in all elements of group')
                            }
                        } else {
                            console.error('\x1b[31m[Err]:\x1b[0m Moral is not an object')
                        }
                    } else {
                        console.error('\x1b[31m[Err]:\x1b[0m Group is not authentic')
                    }
                } else {
                    console.error('\x1b[31m[Err]:\x1b[0m Group is not a relational group')
                }
            } else {
                console.error('\x1b[31m[Err]:\x1b[0m Group does not exist')
            }
        } else {
            console.error('\x1b[31m[Err]:\x1b[0m No database found')
        }
    } else {
        console.error('\x1b[31m[Err]:\x1b[0m Token is not valid')
    }
}

module.exports = { assign }

function greenConsole(text) {
    console.log('\x1b[32m' + text + '\x1b[0m')
}