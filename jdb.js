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
    'element': 'JSON object in r/i groups'
}


create('Db', 'database')
create('rGroup', 'Users')
create('iGroup', 'Office')
create('element', 'Users', 'name')
create('element', 'Users', 'id')
create('element', 'Office', 'hardwares')

let data = {
    'name': 'John',
    'id': '12345'
}
assign('moral', 'Users', data)


module.exports = { create, assign, getR }
