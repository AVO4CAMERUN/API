// Subscribe DB services modules
import { createGET, pc } from "../../base/main.services.js"

// Query to subscription
async function subscription (email, id_course) {
    return await pc.courses_users.create({
        data: { email, id_course }
    })
}

// Query for get courses subscription by filter
async function getCoursesSubscriptionByFilter (filter) {
    const obj = createGET('courses_users', ['*'], filter)
    const { qf, where} = obj
    return await qf({ where })
}

// Query to delete subscription
async function deleteSubscription (email, id_course) {  // qui ce iìun errorone non so quale sia
    return await pc.courses_users.delete({
        where: { 
            email_id_course: {
                email,
                id_course
            } 
        }
    })   
}

// Export functions 
export {
    subscription,
    getCoursesSubscriptionByFilter,
    deleteSubscription
}