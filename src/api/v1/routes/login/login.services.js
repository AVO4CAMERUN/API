// Login DB services modules
import sha256 from "js-sha256"
import { createGET, pc } from "../../base/main.services.js"

// Check username and password (Auth) 
async function checkUsernamePassword(username, password){
    return await pc.user.aggregate({
        where: { 
            username,
            password: sha256(password)
        },
        _count: true
    })
}

// Get info for tokens
async function getUserInfoByUsername(username){
    return await pc.user.findUnique({
        where: { username }
    })
}

// Check registerd method  
async function isRegistred(email){
    return await pc.user.aggregate({
        where: { email },
        _count: true
    })
}

// Check free user  
async function isFreeUsername(username){
    return await pc.user.aggregate({
        where: { username },
        _count: true
    })
}

// Export functions
export {
    checkUsernamePassword,
    getUserInfoByUsername,
    isFreeUsername,
    isRegistred
}

// isRegistred e isFreeUsername da unire