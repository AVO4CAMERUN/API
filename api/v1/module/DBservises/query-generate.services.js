// Generic DB services modules

const {pool} = require('./basic.services');

// Functions for managment specific prop (codice brutto poco generico :( )
function managmentEscape(key, value) {
    const regex = new RegExp('img_*');

    // test
    if (key === 'password') return `SHA2(${pool.escape(value)}, 256)`;
    if (regex.test(key)) return value;

    return pool.escape(value)
}

// Generic function to generate POST request
function createPOST(table, insertData){
    const keys = Object.keys(insertData)

    // Generete selected fields
    let query = `INSERT INTO ${table} (` 
    let value = ` ) VALUES (`

    // Add fields and 
    for (const key of keys){
        query += ` ${key},`
        value += ` ${managmentEscape(key, insertData[key])},`
    }
    query = query.substring(0, query.length -1); // Troncate last comma
    value = value.substring(0, value.length -1); // Troncate last comma
    query += value + ' );'     // Add last )

    return query;
}

// Generic function generate GET request ==> ADD like regex
function createGET(table, fieldsDataRequest, filterObj, opLogic = ''){ // SERVE gestore

    // Generete selected fields
    let query = `SELECT` 
    for (const key of fieldsDataRequest) query += ` ${key},`
    
    query = query.substring(0, query.length -1) // Troncate last comma
    query += ` FROM ${table}`                   // Add table target

    // Checks if the filter obj exists
    if(typeof filterObj === 'object' && Object.keys(filterObj).length > 0){ 
        let fKeys = Object.keys(filterObj)

        // Build Cycle of WHERE condition 
        query +=` WHERE `
        for (const fKey of fKeys)
            for (const value of filterObj[fKey])
                query += ` ${fKey} = ${managmentEscape(fKey, value)} ${opLogic}`
        
        query = query.substring(0, query.length - opLogic.length)
    }
    return query;  
}

// Generic function to generate PUT request
function createUPDATE(table, whereObj, putDataObj){
    let query = `UPDATE ${table} SET`;
    let putDatakeys = Object.keys(putDataObj)
    let whereKey = Object.keys(whereObj)

    // Check special fields
    for (const key of putDatakeys) 
        query += ` ${key} = ${managmentEscape(key, putDataObj[key])},`

    query = query.substring(0, query.length -1)
    query += ` WHERE ${whereKey} = ${pool.escape(whereObj[whereKey])}`  // fare ciclo rendere where con piu parametri
    
    return query;
}

// Generic function to generate DELETE request  
function createDELETE(table, whereDelete, opLogic = 'AND'){
    const keys = Object.keys(whereDelete)
    
    // Generete selected fields
    let query = `DELETE FROM ${table} WHERE ` 
    
    // Iterator in obj and in singol props
    for (const key of keys) 
        for (const value of whereDelete[key]) 
            query += ` ${key} = ${managmentEscape(key, value)} ${opLogic}`
    
    // Troncate last OP and add ;
    query = query.substring(0, query.length - opLogic.length - 1)
    query += ';';

    return query;
}

// Export functions
module.exports = {
    createPOST,
    createGET,
    createUPDATE,
    createDELETE
};

