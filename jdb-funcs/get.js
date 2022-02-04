const { __checkIfDatabaseExists } = require('./create');
const { __rGroupIsAuthentic } = require('./create');
const fs = require('fs');

// get value of relational group elements of the same key
function getR(group, key) {
    let dbDirectory = __checkIfDatabaseExists();
    if (dbDirectory !== null && dbDirectory !== undefined) {
        let elements = fs.readdirSync('./' + dbDirectory + '/' + group)
        // remove config file
        elements.splice(elements.indexOf('__config.json'), 1)
        // check if rGroup is authentic
        if (__rGroupIsAuthentic(dbDirectory, group)) {
            if (key > 0) {
                // get value of key in all elements of group
                let values = {}
                elements.forEach(element => {
                    let moral = JSON.parse(fs.readFileSync('./' + dbDirectory + '/' + group + '/' + element))
                    // remove .json from element name
                    let elementName = element.slice(0, -5)
                    values[elementName] = moral[key]
                });
                return values
            } else {
                console.error('\x1b[31m[Err]:\x1b[0m Key must be greater than 0')
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