// Courses DB services modules

const {genericQuery} = require('./basic.services');
const {createPOST, createUPDATE, createGET, createDELETE} = require('./query-generate.services');

// Query for create course
async function createCourse(name, email, description, img_cover = '', subject){
    const insert = {name, email_creator: email, description, img_cover, subject}
    return genericQuery(createPOST('courses', insert))
}

// Query for get courses data by filter
async function getCoursesDataByFilter(filterObj){
    return genericQuery(createGET('courses', ['*'], filterObj, 'OR'))
}

// Query for update course by id and option
async function updateCourses(whereObj, putDataObj){
    return genericQuery(createUPDATE('courses', whereObj, putDataObj))
}

// Check if the prof is a creator
async function isCourseCreator(email, id_course){
    const filter = {
        email_creator: [email],
        id_course: [id_course]
    }
    return genericQuery(createGET('courses', ['COUNT(*)'], filter, 'AND'))
}

// Query for delete course
async function delateCourse(id){
    return genericQuery(createDELETE('courses', {id_course: [id]}))   
}

// Export functions 
module.exports = {
    createCourse,
    getCoursesDataByFilter,
    updateCourses,
    isCourseCreator,
    delateCourse
}