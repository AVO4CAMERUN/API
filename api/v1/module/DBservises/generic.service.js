// Generic DB services modules

// Import dependences
const mysql = require('mysql');

// Init pool 
const pool = mysql.createPool({
    connectionLimit : 100,
    host:"localhost",
    user: "root",
    password: "",
    database: "avo4cam"
});     

// --------------------------- Generic query function ---------------------------

// Generic Query by pool (async function)
function genericQuery(query){
    return new Promise((res, rej) => {
        pool.query(query, (err, result) => {
            if (err) rej(err)  
            else res(result) 
        });
    });  
}

// Multi querys caller for Generic requests --> ex name: genericCycleQuery
async function multiQuerysCaller(...queryObjs){
    // Query execute
    let promises = [] 
    for (let i = 0; i < queryObjs.length; i++) {
        // Extract function and parameter from queryObjs array
        const qf = queryObjs[i]?.queryMethod;
        const par = queryObjs[i]?.par;
        promises.push(await qf(...par))  // Add promise in result array 
    }
    // Return results wrapped in promises array
    return Promise.allSettled(promises)  
}
// forse saparere in altro modulo
// --------------------------- Generate query string function ---------------------------


// Generic function to generate POST request
function createPOST(table, insertData){
    const keys = Object.keys(insertData)
    const values = Object.values(insertData)
    
    // Generete selected fields
    let query = `INSERT INTO ${table} (` 

    // Add fields
    for (const key of keys) query += `${key}, `
    
    // Add VALUES
    query = query.substring(0, query.length -2); // Troncate last comma
    query += ") VALUES (";          
    
    // Add values
    for (const value of values) query += `${value}, `
    
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
        query += ` ${key},`
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
                    query += ` ${fKey} = ${value} ${opLogic}`
                else 
                    query += ` ${fKey} = '${value}' ${opLogic}`
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
            query += ` ${key} = ${putDataObj[key]},`
        else 
            query += ` ${key} = '${putDataObj[key]}',`
    }
    query = query.substring(0, query.length -1)
    query += ` WHERE ${whereKey} = '${whereObj[whereKey]}'`

    return query;
}

// `DELETE FROM users WHERE email='${email}';` {email:[ssss,ssss,sss]}  //da finire
// Generic function to generate DELETE request  
function createDELETE(table, whereDelete){
    const keys = Object.keys(whereDelete)
    const values = Object.values(whereDelete)
    
    // Generete selected fields
    let query = `DELETE FROM ${table} WHERE ` 

    // Add delete where fields
    for (const key of keys) query += `${key}, `
    
    // Add VALUES
    query = query.substring(0, query.length -2); // Troncate last comma
    query += ") VALUES (";          
    
    // Add values
    for (const value of values) query += `${value}, `
    
    // Add last )
    query = query.substring(0, query.length -2)  // Troncate last comma
    query += ');';

    return query;


}

// Export functions
module.exports = {
    genericQuery,
    multiQuerysCaller,
    createPOST,
    createGET,
    createUPDATE,
    createDELETE
    
};


