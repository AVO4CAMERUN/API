// Courses DB services modules
import { createGET, pc } from "../../main.services.js"

// Query for create course
async function createCourse(name, email_creator, description, img_cover = '', subject) {
    return await pc.course.create({
        data: { name, email_creator, description, img_cover, subject }
    })
}

// Query for get courses data by filter
async function getCoursesDataByFilter(filterObj) {
    const obj = createGET('course', ['*'], filterObj)
    const { qf, where} = obj
    return await qf({ where })
}

// Query for get courses subject
async function getCoursesSubject() {
    const objs =  await pc.course_subject.findMany()
    let subjects = [];
    for (const obj of objs) subjects.push(obj.subject)
    return subjects
}

// Query for update course by id and option
async function updateCourses(id_course, newData) {
    return await pc.course.update({
        where: { id_course },
        data: { ...newData }
    })
}

// Check if the prof is a creator
async function isCourseCreator(email_creator, id_course) {
    return await pc.course.aggregate({
        where: { email_creator, id_course },
        _count: true
    })
}

// Query for delete course
async function delateCourse(id_course) {
    return await pc.course.delete({
        where: { id_course }
    })
}

// Export functions 
export {
    createCourse,
    getCoursesDataByFilter,
    getCoursesSubject,
    updateCourses,
    isCourseCreator,
    delateCourse
}