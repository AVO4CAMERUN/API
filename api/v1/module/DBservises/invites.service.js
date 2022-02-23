// Invites DB services modules

const {genericQuery, createGetQuery} = require('../DBservises/generic.service');

// Query for add invite for join class 
async function addClassInvite(email, id_class){
    return genericQuery(`INSERT INTO invitations (email, id_class) VALUES ('${email}','${id_class}');`)    
}

// Query for get invite data by filter
async function getInvitedDataByFilter(filterObj){
    return genericQuery(createGetQuery("invitations", ["*"], filterObj, "AND"))
}

// Accept invitations
async function acceptInvitation(id, email){
    return genericQuery(`UPDATE users SET id_class = '${id}' WHERE email = '${email}'`)
}

// Delete invitations by id
async function deleteInvitation(id){
    return genericQuery(`DELETE FROM invitations WHERE id = '${id}'`)
}

// Export functions 
module.exports = {
    addClassInvite,
    getInvitedDataByFilter,
    acceptInvitation,
    deleteInvitation
}