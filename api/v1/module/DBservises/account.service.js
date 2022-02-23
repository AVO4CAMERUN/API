const Utils = require('../utils/Utils');    // Utils fucntions
const {genericQuery, createGetQuery, createUpdateQuery} = require('../DBservises/generic.service'); // DBgeneric services

// --------------------------- Account ---------------------------

// Query for create user
async function createAccount(name, surname, username, password, email, role){
    const date = Utils.getDateString();

    return genericQuery(
        `INSERT INTO users (email, role, username, firstname, lastname, password, registration_date, img_profile, id_class) 
        VALUES ('${email}', '${role}', '${username}', '${name}', '${surname}', SHA2('${password}', 256), '${date}', NULL, NULL);`
    )
}

// Query for get all data user for email
async function getUserInfoByEmail(email){
    return genericQuery(`SELECT role, username, firstname, lastname, registration_date, img_profile, id_class FROM users WHERE email = '${email}'`)
}

// Check if the user is a prof
async function isParameterRole(email, role){
    return genericQuery(`SELECT COUNT(*) FROM users WHERE email = '${email}' AND role = '${role}'`)
}

// Query for get user data by filter
async function getUserDataByFilter(filterObj){
    return genericQuery(createGetQuery('users', ["email", "role", "username", "firstname", "lastname", "img_profile", "id_class"], filterObj, 'OR'))
}

// Query for update user by filter and option
async function updateUserInfo(whereObj, putDataObj){
    console.log(putDataObj, whereObj);
    return genericQuery(createUpdateQuery('users', whereObj, putDataObj))
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


