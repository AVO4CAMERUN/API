// Units DB services modules

const { createGET } = require('./query-generate.services')
const prisma = require('@prisma/client')
const pc = new prisma.PrismaClient()

// Query for create unit
async function createUnit (name, description, id_course) {
    const response = await pc.units.create({
        data: { name, description, id_course }
    })
    return response
}

// Check if unit belong Course
async function unitBelongCourse (id_course, id_unit) {
    const response = await pc.classes.aggregate({
        where: { id_unit, id_course },
        _count: true
    })
    return response
}

// Query for get units data by filter
async function getUnitsDataByFilter (filter) {
    const obj = createGET('units', ['*'], filter)
    const { qf, select, where} = obj
    return await qf({ select, where })
}

// Query for update units by id and option
async function updateUnits (id_unit, newData) {
    const response = await pc.units.update({
        where: { id_unit },
        data: { ...newData }
    })
    return response
}

// Query for delete unit
async function deleteUnit (id_unit) {
    const response = await pc.units.delete({
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