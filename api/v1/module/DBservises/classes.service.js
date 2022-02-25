// Classes DB services modules

const {
    genericQuery, 
    createGET, 
    createUPDATE
} = require('../DBservises/generic.service');

// Query for create class
async function createClass(name, img){
    return genericQuery(`INSERT INTO classes (name, img_cover, archived) VALUES ('${name}',${img}, '0');`)
}

// Query for add relaction prof and class
async function addProfsClass(email, id_class, role){
    return genericQuery(`INSERT INTO prof_classes (email, id_class, role) VALUES ('${email}','${id_class}', '${role}');`)
}

// Query for get data class for id
async function getClassDataByID(id){
    return genericQuery(createGET('classes', ['id', 'name', 'img_cover' ,'archived'], {id: [id]}))
}

// Query for get user data by filter
async function getClassDataByFilter(filterObj){ // modificare createGET con joinObj
    return genericQuery(createGET('classes', ["id", "name", "img_cover", "archived"], filterObj, "OR"))
}

// Check if the class is exist
async function isExistClassByid(class_id){
    return genericQuery(createGET('classes', ['COUNT(*)'], {id: [class_id]})) 
}

// Check if the prof is tutor in the class 
async function isParameterRoleInClass(email, id_class, role){
    const filter = {
        email: [email],
        id_class: [id_class],
        role: [role]
    }
    return genericQuery(createGET('prof_classes', ['COUNT(*)'], filter, 'AND'))   
}

// Query for update class by filter and option
async function updateClass(whereObj, putDataObj){
    return genericQuery(createUPDATE('classes', whereObj, putDataObj))
}

// Query for delete class
async function delateClass(id){
    return genericQuery(`DELETE FROM classes WHERE id = '${id}';`)   
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
    delateClass
}
