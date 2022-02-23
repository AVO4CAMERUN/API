// Login DB services modules

const DBSG = require('../DBservises/generic.service');
const {genericQuery} = DBSG;

// Check username and password (Auth) 
async function checkUsernamePassword(username, password){
    return genericQuery(`SELECT COUNT(*) FROM users WHERE username = '${username}' and password = SHA2('${password}', 256)`)
}

// Get info for tokens    --// omologare a filtro by username
async function getUserInfoByUsername(username){
    return genericQuery(`SELECT * FROM users WHERE username = '${username}'`)
}

// Check registerd method  
async function isRegistred(email){
    return genericQuery(`SELECT COUNT(*) FROM users WHERE email = '${email}'`)
}

// Check free user  
async function isFreeUsername(username){
    return genericQuery(`SELECT COUNT(*) FROM users WHERE username = '${username}'`)   
}

// Export functions
module.exports = {
    checkUsernamePassword,
    getUserInfoByUsername,
    isFreeUsername,
    isRegistred
}
