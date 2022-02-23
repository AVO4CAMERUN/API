// Lesson DB services modules

const Utils = require('../utils/Utils');
const {genericQuery, createGetQuery, createUpdateQuery} = require('../DBservises/generic.service');

// Query for create lessons
async function createLesson(id_unit, name, link_video, quiz){
    return genericQuery(`INSERT INTO lessons (id_unit, name, creation_date, link_video, quiz) 
    VALUES ('${id_unit}', '${name}', '${Utils.getDateString()}','${link_video}','${quiz}');`)
}

// Query for get lessons data by filter
async function getLessonsDataByFilter(filterObj){
    return genericQuery(createGetQuery("lessons", ["*"], filterObj, "OR"))
}

// Check if lesson belong unit
async function lessonBelongUnit(id_unit, id_lesson){
    return genericQuery(`SELECT COUNT(*) FROM lessons WHERE id_lesson = '${id_lesson}' AND id_unit = '${id_unit}'`)   
}

// Query for update lessons by id and option
async function updateLessons(whereObj, putDataObj){
    return genericQuery(createUpdateQuery('lessons', whereObj, putDataObj))
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