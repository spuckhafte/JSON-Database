const assignmentTokens = {
    'entry': 'serial no. (key) in an element of rGroup',
    'prime': 'key of iGroup element',
    'moral': 'value of an element'
}
const { __checkIfDatabaseExists } = require('./create.js')
const { __rGroupIsAuthentic } = require('./create.js')
const { getR } = require('./get.js')
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
                                let lengthOfFirstElement = Object.keys(firstElement).length

                                // check if moralObject matches any output of getR
                                let moralsAlreadyExists = false
                                for (let i = 1; i < lengthOfFirstElement; i++) {
                                    let recieveMoralObject = getR(group, i)
                                    console.log(checkUnorderedObjects(recieveMoralObject, moralObject))

                                    // this ineqality is not working
                                    if (checkUnorderedObjects(recieveMoralObject, moralObject)) {
                                        moralsAlreadyExists = true
                                        break
                                    }
                                }
                                if (!moralsAlreadyExists) {
                                    // put all values of moralObject to elements same as keys
                                    keysOfMoral.forEach(key => {
                                        let elementPath = './' + dbDirectory + '/' + group + '/' + key + '.json'
                                        let element = JSON.parse(fs.readFileSync(elementPath))
                                        element[lengthOfFirstElement] = moralObject[key]
                                        fs.writeFileSync(elementPath, JSON.stringify(element, null, 4))
                                        return lengthOfFirstElement
                                    })
                                    console.log('Morals assigned successfully')
                                } else {
                                    console.error('[Err]: Morals already exists')
                                }
                            } else {
                                console.error('[Err]: Some keys of moral are not present in all elements of group')
                            }
                        } else {
                            console.error('[Err]: Moral is not an object')
                        }
                    } else {
                        console.error('[Err]: Group is not authentic')
                    }
                } else {
                    console.error('[Err]: Group is not a relational group')
                }
            } else {
                console.error('[Err]: Group does not exist')
            }
        } else {
            console.error('[Err]: No database found')
        }
    } else {
        console.error('[Err]: Token is not valid')
    }
}


// this function is not working
function checkUnorderedObjects(obj1, obj2) {
    // obj1 and obj2 keys and values are unordered but are same, check if they are same
    let keys1 = Object.keys(obj1)
    let keys2 = Object.keys(obj2)
    let values1 = Object.values(obj1)
    let values2 = Object.values(obj2)
    let isSame = true
    for (let i = 0; i < keys1.length; i++) {
        if (keys1[i] != keys2[i] || values1[i] != values2[i]) {
            isSame = false
            break
        }
    }
    return isSame
}

module.exports = { assign }