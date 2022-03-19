// Accounts DB services modules

const Utils = require('../utils/Utils');    // Utils fucntions
const {genericQuery} = require('./basic.services');
const {createPOST, createUPDATE, createGET, createDELETE, createGET2} = require('./query-generate.services'); 

const sha256 = require('js-sha256');
const prisma = require('@prisma/client')
const pc = new prisma.PrismaClient()


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
    const obj = createGET2('users', ['email', 'role', 'username', 'firstname', 'lastname', 'img_profile', 'id_class'], filterObj, 'OR')
    const { qf, select, where} = obj
    return await qf({ select, where })
}

// Query for update user by filter and option
async function updateUserInfo(email, newData){
    // hash password if exist
    if (newData?.password !== undefined) 
        newData.password = sha256(newData.password)

    const response = await pc.users.update({
        where: { email },
        data: { ...newData }
    })
    return response
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


