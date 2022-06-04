// Subscribe DB services modules
import { createGET, pc } from "../../base/connection.services.js"

// Query to subscription
export async function subscription (email, id_course) {
    return await pc.courses_users.create({
        data: { email, id_course }
    })
}

// Query for get courses subscription by filter
export async function getCoursesSubscriptionByFilter (filter) {
    const obj = createGET('courses_users', ['*'], filter)
    const { qf, where} = obj
    return await qf({ where })
}

// Query to delete subscription
export async function deleteSubscription (email, id_course) {  // qui ce iìun errorone non so quale sia
    return await pc.courses_users.delete({
        where: { 
            email_id_course: {
                email,
                id_course
            } 
        }
    })   
}