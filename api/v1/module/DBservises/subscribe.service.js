// Subscribe DB services modules

const DBSG = require('../DBservises/generic.service');
const {genericQuery, createGetQuery} = DBSG;

// --------------------------- Subscribe ---------------------------

// Query to subscription
async function subscription(email, id_course){
    return genericQuery(`INSERT INTO courses_users (email, id_course) VALUES ('${email}','${id_course}');`)
}

// Query for get courses subscription by filter
async function getCoursesSubscriptionByFilter(filterObj){
    return genericQuery(createGetQuery("courses_users", ["*"], filterObj, "OR"))
}

// Query to delete subscription
async function delateSubscription(email, id_course){
    return genericQuery(`DELETE FROM courses_users WHERE email = '${email}' AND id_course = '${id_course}';`)   
}

// Export functions 
module.exports = {
    subscription,
    getCoursesSubscriptionByFilter,
    delateSubscription
}