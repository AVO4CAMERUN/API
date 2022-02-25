// Invites DB services modules

const {genericQuery, createGET} = require('../DBservises/generic.service');

// Query for add invite for join class 
async function addClassInvite(email, id_class){
    return genericQuery(`INSERT INTO invitations (email, id_class) VALUES ('${email}','${id_class}');`)    
}

// Query for get invite data by filter
async function getInvitedDataByFilter(filterObj){
    return genericQuery(createGET("invitations", ["*"], filterObj, "AND"))
}

// Accept invitations
async function acceptInvitation(id, email){
    return genericQuery(createUPDATE('users', {email}, {id_class: id}))
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