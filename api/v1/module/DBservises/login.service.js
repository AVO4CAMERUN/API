// Login DB services modules


const {genericQuery} = require('./basic.service');
const {createGET} = require('../DBservises/query-generate.service'); 

// Check username and password (Auth) 
async function checkUsernamePassword(username, password){
    const filter =  {username: [username], password: [`SHA2('${password}', 256)`]}
    return genericQuery(createGET('users', ['COUNT(*)'], filter, 'AND'))
}

// Get info for tokens    --// omologare a filtro by username
async function getUserInfoByUsername(username){
    return genericQuery(createGET('users', ['*'], {username: [username]}))
}

// Check registerd method  
async function isRegistred(email){
    return genericQuery(createGET('users', ['COUNT(*)'], {email: [email]}))
}

// Check free user  
async function isFreeUsername(username){
    return genericQuery(createGET('users', ['COUNT(*)'], {username: [username]}))
}

// Export functions
module.exports = {
    checkUsernamePassword,
    getUserInfoByUsername,
    isFreeUsername,
    isRegistred
}
