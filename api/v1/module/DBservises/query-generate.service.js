// Generic DB services modules

const {pool} = require('./basic.service');

// Generic function to generate POST request
function createPOST(table, insertData){
    const keys = Object.keys(insertData)
    const values = Object.values(insertData)
    
    // Generete selected fields
    let query = `INSERT INTO ${table} (` 

    // Add fields
    for (const key of keys) query += `${pool.escape(key)}, `
    
    // Add VALUES
    query = query.substring(0, query.length -2); // Troncate last comma
    query += ") VALUES (";          
    
    // Add values
    for (const value of values) query += `'${pool.escape(value)}', `
    
    // Add last )
    query = query.substring(0, query.length -2)  // Troncate last comma
    query += ');';

    return query;
}

// Generic function generate GET request ==> ADD like regex
function createGET(table, fieldsDataRequest, filterObj, opLogic = ''){ 

    // Generete selected fields
    let query = `SELECT` 
    for (const key of fieldsDataRequest) {
        query += ` ${pool.escape(key)},`
    }
    query = query.substring(0, query.length -1) // Troncate last comma
    query += ` FROM ${table}`               // Add table target

    // Checks if the filter obj exists
    if(typeof filterObj === 'object' && Object.keys(filterObj).length > 0){ 
        let fKeys = Object.keys(filterObj)  //

        // Build Cycle of WHERE condition 
        query +=` WHERE ` 
        for (const fKey of fKeys) {
            for (const value of filterObj[fKey]) {
                if (fKey === 'password') 
                    query += ` ${pool.escape(fKey)} = ${pool.escape(value)} ${opLogic}`
                else 
                    query += ` ${pool.escape(fKey)} = '${pool.escape(value)}' ${opLogic}`
            }
        }
        query = query.substring(0, query.length - opLogic.length)
    }
    return query;  
}

// Generic function to generate PUT request
function createUPDATE(table, whereObj, putDataObj){
    let query = `UPDATE ${table} SET`;
    let putDatakeys = Object.keys(putDataObj)
    let whereKey = Object.keys(whereObj)
    const regex = new RegExp('img_*');

    // Check special fields
    for (const key of putDatakeys) {
        if (regex.test(key) || key === "password") 
            query += ` ${pool.escape(key)} = ${pool.escape(putDataObj[key])},`
        else 
            query += ` ${pool.escape(key)} = '${pool.escape(putDataObj[key])}',`
    }
    query = query.substring(0, query.length -1)
    query += ` WHERE ${pool.escape(whereKey)} = '${pool.escape(whereObj[whereKey])}'`

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
            query += ` ${pool.escape(key)} = '${pool.escape(value)}' ${opLogic}`
        
    //
    query = query.substring(0, query.length - opLogic.length)

    // Troncate last comma and add ;
    query = query.substring(0, query.length -1)  
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

