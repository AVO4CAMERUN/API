// Invites DB services modules

const { createGET } = require('./query-generate.services')
const prisma = require('@prisma/client')
const pc = new prisma.PrismaClient()

// Query for add invite for join class 
async function addClassInvite (email, id_class) {
    const response = await pc.invitations.create({
        data: { email, id_class }
    })
    return response
}

// Query for get invite data by filter
async function getInvitedDataByFilter (filter) {
    const obj = createGET('invitations', ['*'], filter)
    const { qf, where} = obj
    return await qf({ where })
}

// Accept invitations
async function acceptInvitation (id, email) {
    const response = await pc.users.update({
        where: { email },
        data: { id_class: id }
    })
    return response
}

// Delete invitations by id
async function deleteInvitation (id) {
    const response = await pc.invitations.delete({
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