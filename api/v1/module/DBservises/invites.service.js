// Invites DB services modules

const {genericQuery} = require('./basic.service');
const {createPOST, createUPDATE, createGET, createDELETE} = require('../DBservises/query-generate.service'); 

// Query for add invite for join class 
async function addClassInvite(email, id_class){
    return genericQuery(createPOST('invitations', {email, id_class})) 
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
    createDELETE('invitations', {id: [id]})
    return genericQuery(createDELETE('invitations', {id: [id]}))
}

// Export functions 
module.exports = {
    addClassInvite,
    getInvitedDataByFilter,
    acceptInvitation,
    deleteInvitation
}