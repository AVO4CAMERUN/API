// Generic DB services modules
import { PrismaClient } from '@prisma/client'

// Default connection
const pc = new PrismaClient()

// Start DB function
function startDB() {
    return new PrismaClient()
    // { log: ['query']}
}

// ADD like regex se no sono un pagliaccio 🤡
// Generic generate GET request
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

// Generic count
async function createCOUNT(table, filter) {
    return await pc[table].aggregate({
        where: { ...filter },
        _count: true
    })
}

// Export functions
export { pc, startDB, createGET, createCOUNT }
export default pc
