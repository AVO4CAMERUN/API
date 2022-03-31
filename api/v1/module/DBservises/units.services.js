// Units DB services modules

const { createGET, pc } = require('./query-generate.services'); 

// Query for create unit
async function createUnit (name, description, id_course) {
    const response = await pc.unit.create({
        data: { name, description, id_course }
    })
    return response
}

// Check if unit belong Course
async function unitBelongCourse (id_course, id_unit) {
    const response = await pc.unit.aggregate({
        where: { id_unit, id_course },
        _count: true
    })
    return response
}

// Query for get units data by filter
async function getUnitsDataByFilter (filter, include) {
    const obj = createGET('unit', ['*'], filter)
    const { qf, select, where} = obj
    return await qf({ select, where, include})
}

// Query for update units by id and option
async function updateUnits (id_unit, newData) {
    const response = await pc.unit.update({
        where: { id_unit },
        data: { ...newData }
    })
    return response
}

// Query for delete unit
async function deleteUnit (id_unit) {
    const response = await pc.unit.delete({
        where: { id_unit }
    })
    return response  
}

// Export functions 
module.exports = {
    createUnit,
    unitBelongCourse,
    getUnitsDataByFilter,
    updateUnits,
    deleteUnit
}