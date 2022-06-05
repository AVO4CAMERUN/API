// Login DB services modules
import { sha256 } from "js-sha256"
import { pc } from "../../base/index.services"

// Check username and password (Auth) 
export async function checkUsernamePassword(obj: { username:string, password:string }) {
    const {username, password} = obj
    return await pc.user.aggregate({
        where: { 
            username,
            password: sha256(password)
        },
        _count: true
    })
}