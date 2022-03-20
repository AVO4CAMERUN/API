// Lesson DB services modules

const { createGET } = require('./query-generate.services')
const prisma = require('@prisma/client')
const pc = new prisma.PrismaClient()

// Query for create lessons
async function createLesson (id_unit, name, link_video, quiz) {
    const response = await pc.lessons.create({
        data: { id_unit, name, link_video, quiz }
    })
    return response
}

// Query for get lessons data by filter
async function getLessonsDataByFilter (filter) {
    const obj = createGET('lessons', ['*'], filter)
    const { qf, select, where} = obj
    return await qf({ select, where })
}

// Check if lesson belong unit
async function lessonBelongUnit (id_unit, id_lesson) {
    const response = await pc.lessons.aggregate({
        where: {id_lesson, id_unit},
        _count: true
    })
    return response
}

// Query for update lessons by id and option
async function updateLessons (id_lesson, newData) {
    const response = await pc.lessons.update({
        where: { id_lesson },
        data: { ...newData }
    })
    return response
}

// Query for delete lessons
async function deleteLessons (id_lesson) {
    const response = await pc.lessons.delete({
        where: { id_lesson }
    })
    return response 
}

// Export functions 
module.exports = {
    createLesson,
    getLessonsDataByFilter,
    lessonBelongUnit,
    updateLessons,
    deleteLessons
}