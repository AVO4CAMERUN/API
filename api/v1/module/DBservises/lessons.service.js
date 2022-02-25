// Lesson DB services modules

const Utils = require('../utils/Utils');
const {genericQuery, createPOST, createUPDATE, createGET, createDELETE} = require('../DBservises/generic.service');

// Query for create lessons
async function createLesson(id_unit, name, link_video, quiz){
    const insert = {id_unit, name, link_video, quiz, creation_date: Utils.getDateString()}
    return genericQuery(createPOST('lessons', insert)) 
}

// Query for get lessons data by filter
async function getLessonsDataByFilter(filterObj){
    return genericQuery(createGET('lessons', ['*'], filterObj, 'OR'))
}

// Check if lesson belong unit
async function lessonBelongUnit(id_unit, id_lesson){
    const filter = {id_lesson: [id_lesson], id_unit: [id_unit]}
    return genericQuery(createGET('lessons', ['COUNT(*)'], filter, 'AND')) 
}

// Query for update lessons by id and option
async function updateLessons(whereObj, putDataObj){
    return genericQuery(createUPDATE('lessons', whereObj, putDataObj))
}

// Query for delete lessons
async function deleteLessons(id){
    return genericQuery(`DELETE FROM lessons WHERE id_lesson = '${id}';`)   
}

// Export functions 
module.exports = {
    createLesson,
    getLessonsDataByFilter,
    lessonBelongUnit,
    updateLessons,
    deleteLessons
}