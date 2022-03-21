// Subscribe DB services modules

const { createGET } = require('./query-generate.services')
const prisma = require('@prisma/client')
const pc = new prisma.PrismaClient()

// Query to subscription
async function subscription (email, id_course) {
    const response = await pc.courses_users.create({
        data: { email, id_course }
    })
    return response
}

// Query for get courses subscription by filter
async function getCoursesSubscriptionByFilter (filter) {
    const obj = createGET('courses_users', ['*'], filter)
    const { qf, where} = obj
    return await qf({ where })
}

// Query to delete subscription
async function deleteSubscription (email, id_course) {  // qui ce iìun errorone non so quale sia
    console.log(email, id_course)
    const response = await pc.courses_users.delete({
        where: { 
            email_id_course: {
                email,
                id_course
            } 
        }
    })
    return response   
}

// Export functions 
module.exports = {
    subscription,
    getCoursesSubscriptionByFilter,
    deleteSubscription
}