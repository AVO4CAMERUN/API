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

// createPOST
// Generic function to generate POST request
// Generic function to generate one insert of n record (use in relaction tab)
function createPOST(tableName, identifier, fieldsData, fieldsValue){
    // INSERT INTO classes (name, img_cover, archived) VALUES ('${name}','${img}', '0');
    // Generete selected fields
    let query = `INSERT INTO ${tableName} (` 
    for (const key of fieldsData) {
        query += ` ${key},`
    }
    //query = query.substring(0, query.length -1) // Troncate last comma

    // (value_list_1),
    // (value_list_2)

    // Build Cycle of n insert 
    for (const field of fieldsValue) { 
        query += `(${identifier}, '${value}'),`
    }
    query = query.substring(0, query.length -2)
    query += ';';
    return query;  
}

//---> SELECT id_course FROM courses WHERE name LIKE 'ad%' OR name = 'sss'; ADD like regex
// Generic function generate GET request 
function createGET(tableName, fieldsDataRequest, filterObj, opLogic = ''){

    // Generete selected fields
    let query = `SELECT` 
    for (const key of fieldsDataRequest) {
        query += ` ${key},`
    }
    query = query.substring(0, query.length -1) // Troncate last comma
    query += ` FROM ${tableName}`               // Add table target

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
function createUPDATE(tableName, whereObj, putDataObj){
    let query = `UPDATE ${tableName} SET`;
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

// Generic function to generate DELETE request
function createDELETE(tableName, identifier, fieldsData, fieldsValue){}

// Export functions
module.exports = {
    genericQuery,
    multiQuerysCaller,
    createGET,
    createUPDATE,
    createPOST
};


