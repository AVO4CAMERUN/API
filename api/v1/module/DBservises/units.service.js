// Units DB services modules

const DBSG = require('../DBservises/generic.service');
const {genericQuery, createGetQuery, createUpdateQuery} = DBSG;

// --------------------------- Units ---------------------------

    // Query for create unit
    async function createUnit(name, description, id_course){
        return genericQuery(`INSERT INTO units (id_course, name, description) 
        VALUES ('${id_course}','${name}','${description}');`)
    }
    
    // Check if unit belong Course
    async function unitBelongCourse(id_course, id_unit){
        return genericQuery(`SELECT COUNT(*) FROM units WHERE id_unit = '${id_unit}' AND id_course = '${id_course}'`)   
    }

    // Query for get units data by filter
    async function getUnitsDataByFilter(filterObj){
        return genericQuery(createGetQuery("units", ["*"], filterObj, "OR"))
    }

    // Query for update units by id and option
    async function updateUnits(whereObj, putDataObj){
        return genericQuery(createUpdateQuery('units', whereObj, putDataObj))
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