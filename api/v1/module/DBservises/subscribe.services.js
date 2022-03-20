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
    const { qf, select, where} = obj
    return await qf({ select, where })
}

// Query to delete subscription
async function delateSubscription (email, id_course) {
    const response = await pc.courses_users.delete({
        where: { email, id_course }
    })
    return response   
}

// Export functions 
module.exports = {
    subscription,
    getCoursesSubscriptionByFilter,
    delateSubscription
}