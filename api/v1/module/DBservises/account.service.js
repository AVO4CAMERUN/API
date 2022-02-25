// Accounts DB services modules

const Utils = require('../utils/Utils');    // Utils fucntions
const { // DBgeneric services
    genericQuery, 
    createGET,
    createUPDATE
} = require('../DBservises/generic.service'); 

// Query for create user
async function createAccount(name, surname, username, password, email, role){
    return genericQuery(
        `INSERT INTO users (email, role, username, firstname, lastname, password, registration_date, img_profile, id_class) 
        VALUES ('${email}', '${role}', '${username}', '${name}', '${surname}', SHA2('${password}', 256), '${Utils.getDateString()}', NULL, NULL);`
    )
}

// Query for get all data user for email
async function getUserInfoByEmail(email){
    return genericQuery(createGET('users', ['*'], {email: [email]}))
}

// Check if the user is a prof
async function isParameterRole(email, role){
    const filter = {
        email: [email],
        role: [role]
    }
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
    return genericQuery(`DELETE FROM users WHERE email='${email}';`)   
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


