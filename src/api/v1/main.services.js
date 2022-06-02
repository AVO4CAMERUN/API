// Generic DB services modules
import prisma from '@prisma/client'

// Start DB function
function startDB() {
    return new prisma.PrismaClient()
    // { log: ['query']}
}

// ADD like regex se no sono un pagliaccio 🤡
// Generic function generate GET request
function createGET(table, selectField, filter, opLogic = '') { // SERVE gestore

    // Create obj filter query
    let where = {}

    // Insert filter paramater
    for (const key in filter) {
        if (!Array.isArray(filter[key])) {
            // forse da modificare facendo cats per possibili num
            where[key] = filter[key]
        } else {
            // Cast possible number data
            filter[key].forEach((value, index) => {
                if (!isNaN(+value)) {
                    filter[key][index] = +value
                    // console.log(filter[key][index])
                }
            })
            where[key] = { in: filter[key] }
        }
    }
    // test ad afre dentro al ciclo
    // console.log(where);
    // console.log(value)
    // console.log(+value)
    // console.log(!isNaN(+value))

    // if all return fields
    if (selectField[0] === '*') return { qf: pc[table].findMany, where }

    // else return specific fields
    let select = {};
    for (const iterator of selectField) select[iterator] = true

    return { qf: pc[table].findMany, select, where } // fare la ricerca non containece
}

// Export functions
const pc = startDB() // default connection
export { pc, startDB, createGET }

