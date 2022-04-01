// Accounts DB services modules

const { createGET, pc } = require('./query-generate.services'); 
const sha256 = require('js-sha256');

// console.log(pc.);

// Query for create user
async function createAccount (firstname, lastname, username, password, email, role) {
    const response = await pc.user.create({
        data: { firstname, lastname, username, password: sha256(password), email, role}
    })
    return response
}

// Check if the user is a prof
async function isParameterRole(email, role) {
    const response = await pc.user.aggregate({
        where: { email, role },
        _count: true
    })
    return response
}

// Query for get user data by filter
async function getUserDataByFilter(filterObj) {
    const obj = createGET('user', ['email', 'role', 'username', 'firstname', 'lastname', 'img_profile', 'id_class', 'registration_date'], filterObj, 'OR')
    const { qf, select, where} = obj
    return await qf({ select, where })
}

// Query for get user data by filter
async function getTeachersInClass(id_class) {
    const response = await pc.teachers_classes.findMany({
        where: { id_class },
        include: {
            user: true
        }   
    })
    return response
}
 
// email: 'avogadro4camerun@gmail.com',

// Query for update user by filter and option
async function updateUserInfo(email, newData) {
    // hash password if exist
    if (newData?.password !== undefined) 
        newData.password = sha256(newData.password)

    const response = await pc.user.update({
        where: { email },
        data: { ...newData }
    })
    return response
}

// Query for delete user and all relaction
async function delateAccount(email) {
    const response = await pc.user.delete({
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


