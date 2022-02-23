// Courses DB services modules
const {genericQuery, createGetQuery, createUpdateQuery} = require('../DBservises/generic.service');

// --------------------------- Courses ---------------------------

// Query for create course
async function createCourse(name, email, description, img_cover = '', subject){
    return genericQuery(`INSERT INTO courses (name, email_creator, description, img_cover, subject) 
    VALUES ('${name}','${email}','${description}', '${img_cover}', '${subject}');`)
}

// Query for get courses data by filter
async function getCoursesDataByFilter(filterObj){
    return genericQuery(createGetQuery("courses", ["*"], filterObj, "OR"))
}

// Query for update course by id and option
async function updateCourses(whereObj, putDataObj){
    return genericQuery(createUpdateQuery('courses', whereObj, putDataObj))
}

// Check if the prof is a creator
async function isCourseCreator(email, id_course){
    return genericQuery(`SELECT COUNT(*) FROM courses WHERE email_creator = '${email}' AND id_course = '${id_course}'`)   
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