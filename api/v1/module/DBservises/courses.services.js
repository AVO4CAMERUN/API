// Courses DB services modules

const { createGET } = require('./query-generate.services')
const prisma = require('@prisma/client')
const pc = new prisma.PrismaClient()

// Query for create course
async function createCourse(name, email, description, img_cover = '', subject){
    const response = await pc.courses.create({
        data: { name, email_creator: email, description, img_cover, subject }
    })
    return response
}

// Query for get courses data by filter
async function getCoursesDataByFilter(filterObj) {
    const obj = createGET('courses', ['*'], filterObj)
    const { qf, select, where} = obj
    return await qf({ select, where })
}

// Query for update course by id and option
async function updateCourses(id_course, newData){
    const response = await pc.courses.update({
        where: { id_course },
        data: { ...newData }
    })
    return response
}

// Check if the prof is a creator
async function isCourseCreator(email, id_course) {
    const response = await pc.prof_classes.aggregate({
        where: { email_creator: email, id_course },
        _count: true
    })
    return response
}

// Query for delete course
async function delateCourse(id) {
    const response = await pc.courses.delete({
        where: { id_course: id }
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