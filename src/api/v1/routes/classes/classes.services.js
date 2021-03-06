// Classes DB services modules
import { createGET, pc } from "../../base/connection.services.js"

// Query for create class
export async function createClass(name, img) {
    return await pc.groupclass.create({
        data: { name, img_cover: img, archived: false }
    })
}

// Query for add relaction prof and class
export async function addProfsClass(email, id_class, role) {
    return await pc.teachers_classes.create({
        data: { email, id_class, role}
    })
}

// Query for get data class for id
export async function getClassDataByID (id) {
    return await pc.groupclass.findUnique({
        where: { id }
    })
}

// Query for get 
export async function getOwnClassesIDS(email, role) {
    let results;
    if (role === 'TEACHER') results = await pc.teachers_classes.findMany({ where: { email } })
    if (role === 'STUDENT') results = await pc.user.findMany({ where: { email } })
    
    // 
    const ids = [];
    for (const c of results) ids.push(c.id_class)
    return ids
}

// Query for get classes data by filter
export async function getClassDataByFilter(filter, email, role) {
    // Add filter for only own classes + own filter
    filter.id = await getOwnClassesIDS(email, role)

    // Create get and execute
    const obj = createGET('groupclass', ['*'], filter)
    const { qf, select, where} = obj
    return await qf({ select, where })
}

// Check if the class is exist
export async function isExistClassByid(class_id) {
    return await pc.groupclass.aggregate({
        where: { id: class_id },
        _count: true
    })
}

// Check if the prof is tutor in the class 
export async function isParameterRoleInClass(email, id_class, role) {
    return await pc.teachers_classes.aggregate({
        where: { email, id_class, role },
        _count: true
    })
}

// Query for update class by filter and option
export async function updateClass(id, newData) {
    return await pc.groupclass.update({
        where: { id },
        data: { ...newData }
    })
}

// Query for delete class
export async function deleteClass(id) {
    return await pc.groupclass.delete({
        where: { id }
    })
}
