// Units DB services modules

import { createGET, pc } from "../../base/main.services.js" 

// Query for create unit
async function createUnit (name, description, id_course) {
    const units = await pc.unit.findMany({
        where: { id_course },
        orderBy: { seqNumber: 'asc' }
    })

    // Next unit in courses with seqNumber for order
    let last;
    if (units.length !== 0) last = units.at(-1).seqNumber +1;
    else last = 1;

    // Create unit
    return await pc.unit.create({
        data: { name, description, id_course, seqNumber: last }
    }) 
}

// Check if unit belong Course
async function unitBelongCourse (id_course, id_unit) {
    return await pc.unit.aggregate({
        where: { id_unit, id_course },
        _count: true
    })
}

// Query for get units data by filter
async function getUnitsDataByFilter (filter, include) {
    const obj = createGET('unit', ['*'], filter)
    const { qf, select, where} = obj
    return await qf({ select, where, include})
}

// Query for update units by id and option
async function updateUnits (id_unit, newData) {
    return await pc.unit.update({
        where: { id_unit },
        data: { ...newData }
    })
}

// Query for delete unit
async function deleteUnit (id_course, id_unit) {
    const units = await pc.unit.findMany({
        where: { id_course },
        orderBy: { seqNumber: 'asc' }
    })

    // Next unit in courses with seqNumber for order
    const breakPoint = units.findIndex(unit => unit.id_unit === id_unit)
    
    // Delete
    const response = await pc.unit.delete({
        where: { id_unit }
    })

    // Update seqNumber scale one
    for (let i = breakPoint +1; i < units.length; i++) {
        const id = units[i].id_unit;
        const seqNumber = units[i].seqNumber -1
        await pc.unit.update({
            where: { id_unit: id },
            data: { seqNumber }
        })
    }
    return response
}

// Export functions 
export {
    createUnit,
    unitBelongCourse,
    getUnitsDataByFilter,
    updateUnits,
    deleteUnit
}