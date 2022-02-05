const { __checkIfDatabaseExists } = require('./create');
const { __rGroupIsAuthentic } = require('./create');
const fs = require('fs');

function getR(group, param, query) {
    let dbDirectory = __checkIfDatabaseExists();
    if (dbDirectory !== null && dbDirectory !== undefined) {
        let elements = fs.readdirSync('./' + dbDirectory + '/' + group)
        // remove config file
        elements.splice(elements.indexOf('__config.json'), 1)
        // check if rGroup is authentic
        if (__rGroupIsAuthentic(dbDirectory, group)) {

            if (param == 'entry') { // get morals based on entry
                // get value of relational group elements of the same entry
                let entry = query
                if (entry > 0) {
                    let morals = {} // get morals of entry in all elements of group in this this object
                    elements.forEach(element => { // for each element in the group
                        let elementObj = JSON.parse(fs.readFileSync('./' + dbDirectory + '/' + group + '/' + element)) // get the element
                        let elementName = element.slice(0, -5) // remove .json from element name
                        morals[elementName] = elementObj[entry] // set the morals of the entry as the value of elements
                    });
                    return morals
                } else {
                    console.error('\x1b[31m[Err]:\x1b[0m entry must be greater than 0')
                }
            }

        } else {
            console.error('\x1b[31m[Err]:\x1b[0m rGroup is not authentic');
        }
    } else {
        console.error('\x1b[31m[Err]:\x1b[0m No database found')
    }
}

function greenConsole(text) {
    console.log('\x1b[32m' + text + '\x1b[0m')
}

module.exports = { getR }