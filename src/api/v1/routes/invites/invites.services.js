// Invites DB services modules
import { createGET, pc } from "../../base/main.services.js"

// Query for add invite for join class 
async function addClassInvite (email, id_class) {
    return await pc.invitation.create({
        data: { email, id_class }
    })
}

// Query for get invite data by filter
async function getInvitedDataByFilter (filter) {
    const obj = createGET('invitation', ['*'], filter)
    const { qf, where} = obj
    return await qf({ where })
}

// Accept invitations
async function acceptInvitation (id, email) {
    return await pc.user.update({
        where: { email },
        data: { id_class: id }
    })
}

// Delete invitations by id
async function deleteInvitation (id) {
    return await pc.invitation.delete({
        where: { id }
    })
}

// Export functions 
export {
    addClassInvite,
    getInvitedDataByFilter,
    acceptInvitation,
    deleteInvitation
}