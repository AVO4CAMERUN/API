// Basic DB services modules

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
// Export functions
module.exports = {
    genericQuery,
    multiQuerysCaller
};


// const {genericQuery, multiQuerysCaller} = require('./basic.service');
// importare in tutte le cose