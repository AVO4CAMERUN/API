// Courses DB services modules

const {genericQuery, createGET, createUPDATE} = require('../DBservises/generic.service');

// Query for create course
async function createCourse(name, email, description, img_cover = '', subject){
    return genericQuery(`INSERT INTO courses (name, email_creator, description, img_cover, subject) 
    VALUES ('${name}','${email}','${description}', '${img_cover}', '${subject}');`)
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
    return genericQuery(`DELETE FROM courses WHERE id_course = '${id}';`)   
}

// Export functions 
module.exports = {
    createCourse,
    getCoursesDataByFilter,
    updateCourses,
    isCourseCreator,
    delateCourse
}