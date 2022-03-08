// Accounts DB services modules

const Utils = require('../utils/Utils');    // Utils fucntions
const {genericQuery} = require('./basic.services');
const {createPOST, createUPDATE, createGET, createDELETE} = require('./query-generate.services'); 


// Query for create user
async function createAccount(firstname, lastname, username, password, email, role){
    const insert = {firstname, role, lastname, username, email, password}
    return genericQuery(createPOST('users', insert))
}

// Query for get all data user for email
async function getUserInfoByEmail(email){
    return genericQuery(createGET('users', ['*'], {email: [email]}))
}

// Check if the user is a prof
async function isParameterRole(email, role){
    const filter = { email: [email], role: [role] }
    return genericQuery(createGET('users', ['COUNT(*) '], filter, 'AND'))
}

// Query for get user data by filter
async function getUserDataByFilter(filterObj){
    return genericQuery(createGET('users', ['email', 'role', 'username', 'firstname', 'lastname', 'img_profile', 'id_class'], filterObj, 'OR'))
}

// Query for update user by filter and option
async function updateUserInfo(whereObj, putDataObj){
    return genericQuery(createUPDATE('users', whereObj, putDataObj))
}

// Query for delete user and all relaction
async function delateAccount(email){
    return genericQuery(createDELETE('users', {email: [email]}, 'AND'))   
}

// Export functions
module.exports = {
    createAccount,
    getUserInfoByEmail,
    isParameterRole,
    getUserDataByFilter,
    updateUserInfo,
    delateAccount
};


