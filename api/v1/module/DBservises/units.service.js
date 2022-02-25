// Units DB services modules

const DBSG = require('../DBservises/generic.service');
const {genericQuery, createGET, createUPDATE} = DBSG;

// --------------------------- Units ---------------------------

// Query for create unit
async function createUnit(name, description, id_course){
    return genericQuery(`INSERT INTO units (id_course, name, description) 
    VALUES ('${id_course}','${name}','${description}');`)
}

// Check if unit belong Course
async function unitBelongCourse(id_course, id_unit){
    const filter = {
        id_unit: [id_unit],
        id_course: [id_course]
    }
    return genericQuery(createGET('units', ['COUNT(*)'], filter, 'AND')) 
}

// Query for get units data by filter
async function getUnitsDataByFilter(filterObj){
    return genericQuery(createGET('units', ['*'], filterObj, 'OR'))
}

// Query for update units by id and option
async function updateUnits(whereObj, putDataObj){
    return genericQuery(createUPDATE('units', whereObj, putDataObj))
}

// Query for delete unit
async function deleteUnit(id){
    return genericQuery(`DELETE FROM units WHERE id_unit = '${id}';`)   
}

// Export functions 
module.exports = {
    createUnit,
    unitBelongCourse,
    getUnitsDataByFilter,
    updateUnits,
    deleteUnit
}