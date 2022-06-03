// Login DB services modules
import sha256 from "js-sha256"
import { createGET, pc } from "../../base/connection.services.js"

// Check username and password (Auth) 
export async function checkUsernamePassword(username, password){
    return await pc.user.aggregate({
        where: { 
            username,
            password: sha256(password)
        },
        _count: true
    })
}

// Get info for tokens
export async function getUserInfoByUsername(username){
    return await pc.user.findUnique({
        where: { username }
    })
}

// Check registerd method  
export async function isRegistred(email){
    return await pc.user.aggregate({
        where: { email },
        _count: true
    })
}

// Check free user  
export async function isFreeUsername(username){
    return await pc.user.aggregate({
        where: { username },
        _count: true
    })
}

// isRegistred e isFreeUsername da unire