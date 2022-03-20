// Classes DB services modules

const { createGET } = require('./query-generate.services')
const prisma = require('@prisma/client')
const pc = new prisma.PrismaClient()

// Query for create class
async function createClass(name, img) {
    const response = await pc.classes.create({
        data: { name, img_cover: img, archived: false }
    })
    return response
}

// Query for add relaction prof and class
async function addProfsClass(email, id_class, role) {
    const response = await pc.prof_classes.create({
        data: { email, id_class, role}
    })
    return response
}

// Query for get data class for id
async function getClassDataByID (id) {
    const response = await pc.classes.findUnique({
        where: { id }
    })
    return response
}

// Query for get user data by filter
async function getClassDataByFilter(filterObj) { // modificare createGET con joinObj ----------------------------------------------
    const obj = createGET('classes', ['id', 'name', 'img_cover', 'archived'], filterObj)
    const { qf, select, where} = obj
    return await qf({ select, where })
}

// Check if the class is exist
async function isExistClassByid(class_id) {
    const response = await pc.classes.aggregate({
        where: { id: class_id },
        _count: true
    })
    return response
}

// Check if the prof is tutor in the class 
async function isParameterRoleInClass(email, id_class, role) {
    const response = await pc.prof_classes.aggregate({
        where: { email, id_class, role },
        _count: true
    })
    return response 
}

// Query for update class by filter and option
async function updateClass(id, newData) {
    const response = await pc.classes.update({
        where: { id },
        data: { ...newData }
    })
    return response
}

// Query for delete class
async function deleteClass(id) {
    const response = await pc.classes.delete({
        where: { id }
    })
    return response
}

// Export functions
module.exports = {
    createClass,
    addProfsClass,
    getClassDataByID,
    getClassDataByFilter,
    isExistClassByid,
    isParameterRoleInClass,
    updateClass,
    deleteClass
}
