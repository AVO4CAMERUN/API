// Courses DB services modules
import { createGET, pc } from "../../base/connection.services.js"

// {name, email_creator, description, img_cover = '', subject (interface)

// Query for create course
export async function createCourse(course) {
    return await pc.course.create({
        data: course
    })
}

// Query for get courses data by filter
export async function getCoursesDataByFilter(filterObj) {
    const obj = createGET('course', ['*'], filterObj)
    const { qf, where } = obj
    return await qf({ where })
}

// Query for get courses subject
export async function getCoursesSubject() {
    const objs = await pc.course_subject.findMany()
    let subjects = [];
    for (const obj of objs) subjects.push(obj.subject)
    return subjects
}

// Query for update course by id and option
export async function updateCourses(id_course, newData) {
    return await pc.course.update({
        where: { id_course },
        data: { ...newData }
    })
}

// Check if the prof is a creator
export async function isCourseCreator(email_creator, id_course) {
    return await pc.course.aggregate({
        where: { email_creator, id_course },
        _count: true
    })
}

// Query for delete course
export async function delateCourse(id_course) {
    return await pc.course.delete({
        where: { id_course }
    })
}