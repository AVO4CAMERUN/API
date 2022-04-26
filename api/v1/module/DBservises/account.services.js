// Accounts DB services modules

const { createGET, pc } = require('./query-generate.services'); 
const sha256 = require('js-sha256');

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
    const obj = createGET('user', ['email', 'role', 'username', 'firstname', 'lastname', 'img_profile', 'id_class', 'registration_date'], filterObj)
    const { qf, select, where} = obj
    const a = await qf({ select, where })
    // console.log(a);
    return a
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

// Query for update user by filter and option
async function updateUserInfo(email, newData) {
    // hash password if exist
    if (newData?.password !== undefined) 
        newData.password = sha256(newData.password)

    return await pc.user.update({
        where: { email },
        data: { ...newData }
    })
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


