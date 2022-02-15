const { __checkIfDatabaseExists } = require('./create');
const { __rGroupIsAuthentic } = require('./create');
const tokens = ['entry', 'moral']
const fs = require('fs');
const { get } = require('http');
const { on } = require('events');

function getR(group, param, query) {
    if (tokens.includes(param)) {
        let dbDirectory = __checkIfDatabaseExists();
        if (dbDirectory !== null && dbDirectory !== undefined) { // db exists?
            let elements = fs.readdirSync('./' + dbDirectory + '/' + group) // get all elements in the group
            elements.splice(elements.indexOf('__config.json'), 1) // remove the config file
            if (__rGroupIsAuthentic(dbDirectory, group)) { // rGroup is authentic?

                if (param === 'entry') { // get info of an entry based on its entry
                    // get morals of relational group elements of the same entry
                    let entry = query
                    if (entry > 0) { // entry is valid (not 0)?  [0=>refers to id]
                        let morals = {} // get morals of entry in all elements of group in this this object
                        elements.forEach(element => { // for each element in the group
                            let elementObj = JSON.parse(fs.readFileSync('./' + dbDirectory + '/' + group + '/' + element)) // get the element
                            let elementName = element.slice(0, -5) // remove .json from element name
                            morals['entry'] = query // get current entry
                            morals[elementName] = elementObj[entry] // set the morals of the entry as the value of elements
                        });
                        return morals
                    } else {
                        console.error('\x1b[31m[Err]:\x1b[0m entry must be greater than 0')
                    }
                }

                else if (param === 'moral') { // get info of an entry based on its moral (any)
                    // check if query is array
                    if (Array.isArray(query) && query.length == 2) { // query = [element, moral]
                        let element = query[0]
                        let moral = query[1]
                        if (elements.includes(element + '.json')) { // element exists in group?
                            let requiredEntry = __getEntry(dbDirectory, group, element, moral) // this will be the required entry if it exists
                            if (requiredEntry !== null) {
                                let requiredMorals = getR(group, 'entry', requiredEntry) // get details of the required entry
                                return requiredMorals
                            } else {
                                return null
                            }
                        } else {
                            console.error('\x1b[31m[Err]:\x1b[0m element does not exist in group')
                        }

                    } else {
                        console.error('\x1b[31m[Err]:\x1b[0m Query must be an array => [element, moral]')
                    }
                }

                else {
                    console.error('\x1b[31m[Err]:\x1b[0m Parameter is not valid')
                }

            } else {
                console.error('\x1b[31m[Err]:\x1b[0m rGroup is not authentic');
            }
        } else {
            console.error('\x1b[31m[Err]:\x1b[0m No database found')
        }
    } else {
        console.error('\x1b[31m[Err]:\x1b[0m Invalid parameter for getR')
    }
}

//get whole element from an iGroup
function __getIEl(group, element) {
    let dbDirectory = __checkIfDatabaseExists();
    if (dbDirectory !== null && dbDirectory !== undefined) { // db exists?
        if (fs.existsSync('./' + dbDirectory + '/' + group)) { // group exists?
            let elements = fs.readdirSync('./' + dbDirectory + '/' + group) // get all elements in the group
            // check if element exists in the group
            if (elements.includes(element + '.json')) {
                let elementObj = JSON.parse(fs.readFileSync('./' + dbDirectory + '/' + group + '/' + element + '.json'))
                return elementObj
            } else {
                console.error('\x1b[31m[Err]:\x1b[0m element does not exist in group')
            }
        } else {
            console.error('\x1b[31m[Err]:\x1b[0m group does not exist')
        }
    } else {
        console.error('\x1b[31m[Err]:\x1b[0m No database found')
    }
}


// get entry from a relational group by its moral
function __getEntry(dbDir, group, element, moral) {
    let elementObj = JSON.parse(fs.readFileSync('./' + dbDir + '/' + group + '/' + element + '.json'))
    // check if moral is in the element
    let entries = Object.keys(elementObj) // get all entries in the element
    let requiredEntry = null // this will be the required entry if it exists
    entries.forEach(entry => {
        if (elementObj[entry] === moral) { // if the moral is in the entry
            requiredEntry = entry // set the required entry
        }
    })

    return requiredEntry
}



function greenConsole(text) {
    console.log('\x1b[32m' + text + '\x1b[0m')
}

module.exports = { getR, __getIEl }