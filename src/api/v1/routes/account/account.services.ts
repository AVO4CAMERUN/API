// Accounts DB services modules
import { sha256 } from "js-sha256"
import user from "./user.interface"
import pc from "../../base/services/index.services"
import { createGET } from "../../base/services/base.services"



// Query for update user by filter and option
export async function updateUserInfo(email, newData) {
    // hash password if exist
    if (newData?.password !== undefined)
        newData.password = sha256(newData.password)

    return await pc.user.update({
        where: { email },
        data: { ...newData }
    })
}

// Check if the user is a prof
export async function isParameterRole(email, role) {
    return await pc.user.aggregate({
        where: { email, role },
        _count: true
    })
}
