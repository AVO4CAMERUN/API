// Classes DB services modules

const { createGET, pc } = require('./query-generate.services'); 

// Query for create class
async function createClass(name, img) {
    const response = await pc.groupclass.create({
        data: { name, img_cover: img, archived: false }
    })
    return response
}

// Query for add relaction prof and class
async function addProfsClass(email, id_class, role) {
    const response = await pc.teachers_classes.create({
        data: { email, id_class, role}
    })
    return response
}

// Query for get data class for id
async function getClassDataByID (id) {
    return await pc.groupclass.findUnique({
        where: { id }
    })
}

// Query for get 
async function getOwnClassesIDS(email, role) {
    let results;
    if (role === 'TEACHER') results = await pc.teachers_classes.findMany({ where: { email } })
    if (role === 'STUDENT') results = await pc.user.findMany({ where: { email } })

    // 
    const ids = [];
    for (const c of results) ids.push(c.id_class)
    // console.log(results);
    // console.log(ids);
    return ids
}


// Query for get classes data by filter
async function getClassDataByFilter(filter, email) {
    // Add filter for only own classes + own filter
    filter.id = getOwnClassesIDS(email, 'STUDENT')

    // Create get and execute
    const obj = createGET('groupclass', ['*'], filter)
    const { qf, select, where} = obj
    return await qf({ select, where })
}
/*
   const classes = await pc.teachers_classes.findMany({ where: { email } })

    // Add filter for only own classes + own filter
    const ids = [];
    for (const c of classes) ids.push(c.id_class)
    filter.id = getIDClasses(email)

*/

// Check if the class is exist
async function isExistClassByid(class_id) {
    return await pc.groupclass.aggregate({
        where: { id: class_id },
        _count: true
    })
}

// Check if the prof is tutor in the class 
async function isParameterRoleInClass(email, id_class, role) {
    const response = await pc.teachers_classes.aggregate({
        where: { email, id_class, role },
        _count: true
    })
    return response 
}

// Query for update class by filter and option
async function updateClass(id, newData) {
    const response = await pc.groupclass.update({
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
    getOwnClassesIDS,
    isExistClassByid,
    isParameterRoleInClass,
    updateClass,
    deleteClass
}
