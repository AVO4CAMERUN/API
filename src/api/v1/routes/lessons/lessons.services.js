// Lesson DB services modules
import { createGET, pc } from '../../utils/main.services.js' 

// Query for create lessons
async function createLesson (id_unit, name, link_video, quiz) {
    const lessons = await pc.lesson.findMany({
        where: { id_unit },
        orderBy: { seqNumber: 'asc' }
    })

    // Next lesson in unit with seqNumber for order
    let last;
    if (lessons.length !== 0) last = lessons.at(-1).seqNumber +1;
    else last = 1;

    return await pc.lesson.create({
        data: { id_unit, name, link_video, quiz, seqNumber: last }
    })
}

// Query for get lessons data by filter
async function getLessonsDataByFilter (filter) {
    const obj = createGET('lesson', ['*'], filter)
    const { qf, select, where} = obj
    return await qf({ select, where })
}

// Check if lesson belong unit
async function lessonBelongUnit (id_unit, id_lesson) {
    return await pc.lesson.aggregate({
        where: {id_lesson, id_unit},
        _count: true
    })
}

// Query for update lessons by id and option
async function updateLessons (id_lesson, newData) {
    return await pc.lesson.update({
        where: { id_lesson },
        data: { ...newData }
    })
}

// Query for delete lessons
async function deleteLessons (id_lesson, id_unit) {
    const lessons = await pc.lesson.findMany({
        where: { id_unit },
        orderBy: { seqNumber: 'asc' }
    })

    // Next lesson in courses with seqNumber for order
    const breakPoint = lessons.findIndex(lesson => lesson.id_lesson === id_lesson)
    
    // Delete lesson
    const response = await pc.lesson.delete({
        where: { id_lesson }
    })

    // Update seqNumber scale one
    for (let i = breakPoint +1; i < lessons.length; i++) {
        const id = lessons[i].id_lesson;
        const seqNumber = lessons[i].seqNumber -1
        await pc.lesson.update({
            where: { id_lesson: id },
            data: { seqNumber }
        })
    }
    return response
}

// Export functions 
export {
    createLesson,
    getLessonsDataByFilter,
    lessonBelongUnit,
    updateLessons,
    deleteLessons
}