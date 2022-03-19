// Login DB services modules

const sha256 = require('js-sha256');
const prisma = require('@prisma/client')
const pc = new prisma.PrismaClient()

// Check username and password (Auth) 
async function checkUsernamePassword(username, password){
    const response = await pc.users.aggregate({
        where: { 
            username,
            password: sha256(password)
        },
        _count: true
    })
    return response
}

// Get info for tokens    --// omologare a filtro by username
async function getUserInfoByUsername(username){
    const response = await pc.users.findUnique({
        where: { username }
    })
    return response
}

// isRegistred e isFreeUsername da unire

// Check registerd method  
async function isRegistred(email){
    const response = await pc.users.aggregate({
        where: { email },
        _count: true
    })
    return response
}

// Check free user  
async function isFreeUsername(username){
    const response = await pc.users.aggregate({
        where: { username },
        _count: true
    })
    return response
}

// Export functions
module.exports = {
    checkUsernamePassword,
    getUserInfoByUsername,
    isFreeUsername,
    isRegistred
}
