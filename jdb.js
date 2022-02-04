const fs = require('fs')
const { v4: uuidv4 } = require('uuid')
const { create } = require('./jdb-funcs/create')
const { assign } = require('./jdb-funcs/assign')
const { getR } = require('./jdb-funcs/get')

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



// create('Db', 'database')
// create('rGroup', 'workers')
// create('rGroup', 'clients')
// create('iGroup', 'office-hardware')

// create('element', 'clients', 'names')
// create('element', 'workers', 'names')
// create('element', 'clients', 'address')

// let data = {
//     'names': 'John Doe',
//     'address': '123, ABC Street, XYZ City'
// }

// assign('moral', 'clients', data)
console.log(getR('clients', 1))


module.exports = { create, assign, getR }
