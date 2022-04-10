// Lesson DB services modules

const { createGET, pc } = require('./query-generate.services'); 

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

    const response = await pc.lesson.create({
        data: { id_unit, name, link_video, quiz, seqNumber: last }
    })
    return response
}

// Query for get lessons data by filter
async function getLessonsDataByFilter (filter) {
    const obj = createGET('lesson', ['*'], filter)
    const { qf, select, where} = obj
    return await qf({ select, where })
}

// Check if lesson belong unit
async function lessonBelongUnit (id_unit, id_lesson) {
    const response = await pc.lesson.aggregate({
        where: {id_lesson, id_unit},
        _count: true
    })
    return response
}

// Query for update lessons by id and option
async function updateLessons (id_lesson, newData) {
    const response = await pc.lesson.update({
        where: { id_lesson },
        data: { ...newData }
    })
    return response
}

// Query for delete lessons
async function deleteLessons (id_lesson) {
    const lessons = await pc.lesson.findMany({
        where: { id_unit },
        orderBy: { seqNumber: 'asc' }
    })

    // Next lesson in courses with seqNumber for order
    const breakPoint = units.findIndex(unit => unit.id_unit === id_unit)
    
    // Delete lesson
    const response = await pc.lesson.delete({
        where: { id_lesson }
    })

    // Update seqNumber scale one
    for (let i = breakPoint +1; i < lessons.length; i++) {
        const id = lessons[i].id_unit;
        const seqNumber = lessons[i].seqNumber -1
        await pc.lesson.update({
            where: { id_lesson: id },
            data: { seqNumber }
        })
    }
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