import pc from "./index.services"

// ADD like regex se no sono un pagliaccio 🤡
// Generic generate GET request
export async function createGET(table, selectField, filter, other) { // SERVE gestore

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

    if(!other) other = {}
    // if all return fields
    if (selectField[0] === '*') return await pc[table].findMany({ where })

    // else return specific fields
    let select = {};
    for (const iterator of selectField) select[iterator] = true

    return await pc[table].findMany({ select, where, ...other })
}

// Generic post
export async function createPOST(table, data) {
    return await pc[table].create({ data })
}

// Generic update
export async function createUPDATE(table, data, where) {
    return await pc[table].create({ data, where })
}

// Generic Delete
export async function createDELETE(table, where) {
    return await pc[table].create({ where })
}

// Generic count
export async function createCOUNT(table, filter) {
    return await pc[table].aggregate({
        where: { ...filter },
        _count: true
    })
}

export default { 
    createPOST, 
    createUPDATE, 
    createDELETE, 
    createCOUNT 
}