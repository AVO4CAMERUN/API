// Generic DB services modules

const prisma = require('@prisma/client')
const pc = new prisma.PrismaClient()

// ADD like regex se no sono un pagliaccio 🤡
// Generic function generate GET request
function createGET(table, selectField, filter, opLogic = ''){ // SERVE gestore
    
    // Create obj filter query
    let where = {}
    const cast = (value, index) => {
        if (typeof +value === 'number') filter[key][index] = +value   
    }

    // Insert filter paramater
    for (const key in filter) {
        if (!Array.isArray(filter)) {
            // forse da modificare facendo cats per possibili num
            where[key] = filter[key]
        } else {
            // Cast possible number data
            filter[key].forEach(cast)
            where[key] = { in: filter[key] }
        }
    }
    
    // if all return fields
    if (selectField[0] === '*') return { qf: pc[table].findMany, where }

    // else return specific fields
    let select = {}; 
    for (const iterator of selectField) select[iterator] = true
    
    return { qf: pc[table].findMany, select, where } // fare la ricerca non containece
}

// Export functions
module.exports = {
    createGET
};

