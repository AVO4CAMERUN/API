// Accounts DB services modules

const { createGET } = require('./query-generate.services'); 
const sha256 = require('js-sha256');
const prisma = require('@prisma/client')
const pc = new prisma.PrismaClient()


// Query for create user
async function createAccount (firstname, lastname, username, password, email, role) {
    const response = await pc.users.create({
        data: { firstname, lastname, username, password: sha256(password), email, role}
    })
    return response
}

// Check if the user is a prof
async function isParameterRole(email, role) {
    const response = await pc.users.aggregate({
        where: { email, role },
        _count: true
    })
    return response
}

// Query for get user data by filter
async function getUserDataByFilter(filterObj) {
    const obj = createGET('users', ['email', 'role', 'username', 'firstname', 'lastname', 'img_profile', 'id_class'], filterObj, 'OR')
    const { qf, select, where} = obj
    return await qf({ select, where })
}

// Query for get user data by filter
async function getTeachersInClass(id_class) {
    const response = await pc.prof_classes.findMany({
        where: { id_class }
    })
    return response
}
/*include: {
          author: true, // Return all fields
        }, */

// Query for update user by filter and option
async function updateUserInfo(email, newData) {
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
async function delateAccount(email) {
    const response = await pc.users.delete({
        where: { email }
    })
    return response
}

// Export functions
module.exports = {
    createAccount,
    isParameterRole,
    getUserDataByFilter,
    getTeachersInClass,
    updateUserInfo,
    delateAccount
};


