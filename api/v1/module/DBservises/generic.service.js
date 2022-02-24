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

// fare tutte le generici cosi da aplicare lo staitmante a tutte stramite i generic
// Generic Query
function genericQuery(query){
    // console.log(query);
    return new Promise((res, rej) => {
        pool.query(query, (err, result) => {
            if (err) rej(err)  
            else res(result) 
        });
    });  
}

// Cycle Generic request
async function genericCycleQuery(...queryObjs){

    // Query execute
    let promises = []
    for (let i = 0; i < queryObjs.length; i++) {
        
        //console.log(queryObjs[i])
        let qf = queryObjs[i]?.queryMethod;
        let par = queryObjs[i]?.par;

        // Promise  //Spread array par
        promises.push(await qf(...par))
    }
    return Promise.allSettled(promises)   // Return results wrapped in promises array
}

// *** Generate query string function ***

// Generic methods generate PUT request
function createUpdateQuery(tableName, whereObj, putDataObj){
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

// Generic methods generate GET request 
//---> SELECT id_course FROM courses WHERE name LIKE 'ad%' OR name = 'sss';
function createGetQuery(tableName, fieldsDataRequest, filterObj, opLogic = ''){

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
                query += ` ${fKey} = '${value}' ${opLogic}`
            }
        }
        query = query.substring(0, query.length - opLogic.length)
    }
    return query;  
}

// da implementare
// Creare una query di n insert 
// Generic methods generate one insert of n record (use in relaction tab)
function createMultiInsertQuery(tableName, identifier, fieldsData, fieldsValue){
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
// FARE SELECT COUNT DIMANICA // e delete dimanica

// Export functions
module.exports = {
    genericQuery,
    genericCycleQuery,
    createUpdateQuery,
    createGetQuery,
    createMultiInsertQuery
};


