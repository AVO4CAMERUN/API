// Subscribe DB services modules

const {genericQuery} = require('./basic.services');
const {createPOST, createGET, createDELETE} = require('../DBservises/query-generate.services'); 

// Query to subscription
async function subscription(email, id_course){
    return genericQuery(createPOST('courses_users', {email, id_course})) 
}

// Query for get courses subscription by filter
async function getCoursesSubscriptionByFilter(filterObj){
    return genericQuery(createGET('courses_users', ['*'], filterObj, 'OR'))
}

// Query to delete subscription
async function delateSubscription(email, id_course){
    return genericQuery(createDELETE('courses_users', {email: [email], id_course: [id_course]}, 'AND'))   
}

// Export functions 
module.exports = {
    subscription,
    getCoursesSubscriptionByFilter,
    delateSubscription
}