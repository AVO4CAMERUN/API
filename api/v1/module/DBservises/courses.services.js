// Courses DB services modules

const { createGET, pc } = require('./query-generate.services'); 

// Query for create course
async function createCourse(name, email_creator, description, img_cover = '', subject) {
    const response = await pc.course.create({
        data: { name, email_creator, description, img_cover, subject }
    })
    return response
}

// Query for get courses data by filter
async function getCoursesDataByFilter(filterObj) {
    const obj = createGET('course', ['*'], filterObj)
    const { qf, where} = obj
    return await qf({ where })
}

// Query for update course by id and option
async function updateCourses(id_course, newData){
    const response = await pc.course.update({
        where: { id_course },
        data: { ...newData }
    })
    return response
}

// Check if the prof is a creator
async function isCourseCreator(email_creator, id_course) {
    const response = await pc.course.aggregate({
        where: { email_creator, id_course },
        _count: true
    })
    return response
}

// Query for delete course
async function delateCourse(id_course) {
    const response = await pc.course.delete({
        where: { id_course }
    })
    return response
}

// Export functions 
module.exports = {
    createCourse,
    getCoursesDataByFilter,
    updateCourses,
    isCourseCreator,
    delateCourse
}