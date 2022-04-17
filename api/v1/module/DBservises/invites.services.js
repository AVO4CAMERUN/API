// Invites DB services modules

const { createGET, pc } = require('./query-generate.services'); 

// Query for add invite for join class 
async function addClassInvite (email, id_class) {
    const response = await pc.invitation.create({
        data: { email, id_class }
    })
    return response
}

// Query for get invite data by filter
async function getInvitedDataByFilter (filter) {
    const obj = createGET('invitation', ['*'], filter)
    const { qf, where} = obj
    return await qf({ where })
}

// Accept invitations
async function acceptInvitation (id, email) {
    const response = await pc.user.update({
        where: { email },
        data: { id_class: id }
    })
    return response
}

// Delete invitations by id
async function deleteInvitation (id) {
    const response = await pc.invitation.delete({
        where: { id }
    })
    return response
}

// Export functions 
module.exports = {
    addClassInvite,
    getInvitedDataByFilter,
    acceptInvitation,
    deleteInvitation
}