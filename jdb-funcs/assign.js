const assignmentTokens = {
    'entry': 'serial no. (key) in an element of rGroup',
    'prime': 'key of iGroup element',
    'moral': 'value of an element'
}
const { __checkIfDatabaseExists } = require('./create.js')
const { __rGroupIsAuthentic } = require('./create.js')
const fs = require('fs')

function assignR(group, moralObject) {

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

                        let entriesOfMoral = Object.keys(moralObject)
                        let entriesOfMoralNew = [] // new array of entries
                        // add .json from the element names
                        entriesOfMoral.forEach(element => {
                            element = element + '.json'
                            entriesOfMoralNew.push(element)
                        })
                        entriesOfMoral = entriesOfMoralNew // set the new array as the old array

                        // check if all entries of moral are present in all elements of group

                        if (allElementsOfGroup.every(element => entriesOfMoral.includes(element + '.json'))) {
                            // find the length of first element in group
                            let firstElement = JSON.parse(fs.readFileSync(checkGroupPath + '/' + allElementsOfGroup[0]))
                            let lengthOfFirstElement = Object.keys(firstElement).length // this value is the entry of new morals in all elements of group

                            // put all values of moralObject to elements same as entries
                            entriesOfMoral.forEach(key => {
                                let elementPath = './' + dbDirectory + '/' + group + '/' + key // path of element to be updated
                                let element = JSON.parse(fs.readFileSync(elementPath))
                                element[lengthOfFirstElement] = moralObject[key] // put value of moralObject to element
                                fs.writeFileSync(elementPath, JSON.stringify(element, null, 4)) // write the updated element to file
                            })
                            greenConsole('R-Morals assigned successfully')
                            return lengthOfFirstElement // return the entry of the assigned morals
                        } else {
                            // console.log(entriesOfMoral)
                            // console.log(allElementsOfGroup)

                            // if the entriesOfMoral does not include all elements of group, we will get the missing elements and assign them to null in moralObject

                            let remainingEntries = allElementsOfGroup.filter(element => !entriesOfMoral.includes(element) && allElementsOfGroup.includes(element))
                            if (remainingEntries.length !== 0) {
                                remainingEntries.forEach(element => {
                                    entriesOfMoral.push(element)
                                    // remove the .json from the element name
                                    element = element.slice(0, -5)
                                    moralObject[element] = null
                                })
                                console.log(moralObject)

                                let firstElement = JSON.parse(fs.readFileSync(checkGroupPath + '/' + allElementsOfGroup[0]))
                                let lengthOfFirstElement = Object.keys(firstElement).length // this value is the entry of new morals in all elements of group

                                // put all values of moralObject to elements same as entries
                                entriesOfMoral.forEach(key => {
                                    let elementPath = './' + dbDirectory + '/' + group + '/' + key // path of element to be updated
                                    let element = JSON.parse(fs.readFileSync(elementPath))
                                    key = key.slice(0, -5)
                                    element[lengthOfFirstElement] = moralObject[key] // put value of moralObject to element
                                    fs.writeFileSync(elementPath, JSON.stringify(element, null, 4)) // write the updated element to file
                                })
                                return lengthOfFirstElement // return the entry of the assigned morals
                                greenConsole('R-Morals assigned successfully')
                            } else {
                                console.error('\x1b[31m[Err]:\x1b[0m Morals of unkown entries')
                            }
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
}


function assignI(group, element, primeMoralObject) {

    // object's key => prime and value => moral

    let dbDirectory = __checkIfDatabaseExists() // checking if database exists
    if (dbDirectory !== null) {
        // check if group exists
        let checkGroupPath = './' + dbDirectory + '/' + group
        if (fs.existsSync(checkGroupPath)) {
            // check individual group
            let checkGroupConfigPath = './' + dbDirectory + '/' + group + '/__config.json'
            let groupConfig = JSON.parse(fs.readFileSync(checkGroupConfigPath))["type"] // check the type of group
            if (groupConfig == 'iGroup') {
                let elementPath = checkGroupPath + '/' + element + '.json'
                if (fs.existsSync(elementPath)) {
                    let element = JSON.parse(fs.readFileSync(elementPath))
                    // merge the primeMoralObject with element to make a new element with assigned primeMoralObject [Work in progress]
                    let newElement = Object.assign(element, primeMoralObject)
                    fs.writeFileSync(elementPath, JSON.stringify(newElement, null, 4))
                    greenConsole('I-Element assigned successfully')
                } else {
                    console.error('\x1b[31m[Err]:\x1b[0m Element does not exist')
                }
            } else {
                console.error('\x1b[31m[Err]:\x1b[0m Group is not an individual group')
            }
        } else {
            console.error('\x1b[31m[Err]:\x1b[0m Group does not exist')
        }
    } else {
        console.error('\x1b[31m[Err]:\x1b[0m No database found')
    }
}



module.exports = { assignR, assignI }

function greenConsole(text) {
    console.log('\x1b[32m' + text + '\x1b[0m')
}