// Accounts DB services modules
import { sha256 } from "js-sha256"
import user from "./user.interface"
import { pc, createGET } from "../../base/index.services"


// Query for create user
export async function createAccount(user: user) {
    user.password = sha256(user.password)
    return await pc.user.create({
        data: user 
    })
}

// Check if the user is a prof
export async function isParameterRole(email, role) {
    return await pc.user.aggregate({
        where: { email, role },
        _count: true
    })
}

// Query for get user data by filter
export async function getUser(filterObj) {
    const obj = createGET('user', ['email', 'role', 'username', 'firstname', 'lastname', 'img_profile', 'id_class', 'registration_date'], filterObj)
    const { qf, select, where } = obj
    return await qf({ select, where })
}

// Query for get user data by filter
export async function getTeachersInClass(id_class) {
    return await pc.teachers_classes.findMany({
        where: { id_class },
        include: {
            user: true
        }
    })
}

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

// Query for delete user and all relaction
export async function delateAccount(obj: { email: string }) {
    return await pc.user.delete({
        where: { ...obj }
    })
}


