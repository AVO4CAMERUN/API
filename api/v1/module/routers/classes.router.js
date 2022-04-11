// Classes mini-router

// Dependences
const express = require('express');

// Utils servises
const BlobConvert = require('../utils/BlobConvert');
const AuthJWT = require('../utils/Auth');
const { errorManagment } = require('../Utils/DBErrorManagment');
const Validator = require('../Validators/classes.validator');

// Import DBservices and deconstruct function                    
const { isParameterRole } = require('../DBservises/account.services');     // Account services 
const { addClassInvite } = require('../DBservises/invites.services');      // Invites services
const { getUserDataByFilter, getTeachersInClass } = require('../DBservises/account.services');   // Account services
const {  // Class services
    createClass, 
    addProfsClass, 
    getClassDataByFilter,
    getClassDataByID,
    getOwnClassesIDS,
    isParameterRoleInClass,
    updateClass,
    deleteClass
} = require('../DBservises/classes.services');

// Allocate obj
const router = express.Router();    //Create router Object    

// Functions for formatter classes data people 

// Function for resolve multi query in array on array structure
const resolve = async (arrays) => {
    let r = []
    // [ {teachers: [...]} {students: [...]} ...]
    for (const objClassPeople of arrays) {
        r.push({
            teachers: await objClassPeople.teachers,
            students: await objClassPeople.students
        })
    }
    return r
}
// Function for formatter teacher user data
const teacherFormatter = (teachers) => {
    let t = teachers
    for (let k = 0; k < t.length; k++) {
        // Delete usless data
        delete t[k].user.password  //
        delete t[k].user.role      //
        delete t[k].id_class        //

        // Flat obj in top levet
        const obj = t[k].user
        for (const key in obj) t[k][key] = obj[key];
        delete t[k].user;

        // Cast img
        t[k].img_profile = 0 // BlobConvert.blobToBase64(teachers[k].img_profile);
    }
    return t
}

// Routers for classes
router.route('/classes')

    // Create new class
    .post(AuthJWT.authenticateJWT, Validator.postClass, (req, res) => {
        const user = AuthJWT.parseAuthorization(req.headers.authorization)
        const {email, role} = user;
        let {name, img_cover, students, teachers} = req.body;

        if (role !== 'TEACHER')
            return res.sendStatus(403);    // You aren't a prof (conviene cosi non si fanno richieste al db)

        if (img_cover !== undefined) 
            img_cover = BlobConvert.base64ToBlob(img_cover)

        if (teachers === undefined) teachers = []
        if (students === undefined) students = []

        // Create query
        let checkQuerys = [];
        
        for (const prof of teachers)
            checkQuery.push(isParameterRole(prof, 'TEACHER'))// Check is professor
        
        for (const stud of students)
            checkQuerys.push(isParameterRole(stud, 'STUDENT')) // Check is student

        // Send dynamic querys
        Promise.allSettled(checkQuerys)
            .then((result) => {
                // Sum for check that only email is register users
                let sum = 0; result.forEach(r => {sum += r.value[0]['_count'] });

                // somma di result
                if(sum !== checkQuerys.length)
                    return Promise.reject(400)

                return Promise.allSettled([
                    createClass(name, img_cover) // Create class and save id
                ])       
            })
            .then((result) => {
                const id = result[0].value.id; // id class

                // Query array for add profs
                const queryArray = [addProfsClass(email, id, 'CREATOR')]; // Push tutor

                // Push others prof if there are
                for (const prof of teachers)  // controllare se sono prof 
                    queryArray.push(addProfsClass(prof, id, 'NORMAL'))

                // Push student invitations if there are
                for (const stud of students)
                    queryArray.push(addClassInvite(stud, id))  

                // Add relation in the class (start up student and profs) if there are
                return Promise.allSettled(queryArray) // Send dynamic querys               
            })
            .then(() => res.sendStatus(200)) // You create a your new class 
            .catch((err) => {
                console.log(err);
                errorManagment('POST classes', err)
                if(err === 400) res.sendStatus(400) // Error in parameter
                else res.sendStatus(500)
            }) // Server error
    })

    // Get class data by filter (TEACHER)
    .get(AuthJWT.authenticateJWT, Validator.getClass, (req, res) => {
        const user = AuthJWT.parseAuthorization(req.headers.authorization)
        const {email} = user;

        // Cast data for query
        for (const key of Object.keys(req.query)) 
            req.query[key] = JSON.parse(req.query[key])

        // Get classes
        const classes = []
        getClassDataByFilter(req.query, email)
            .then((result) => {
                classes.push(...result)    // save classes
                const classesInjectedPeopleQuery = []

                // Convert img in base64 and query student
                for (const c of classes) {
                    c['img_cover'] = BlobConvert.blobToBase64(c['img_cover'])

                    // Save stryctured query
                    const teachersQuery = getTeachersInClass(c.id)
                    const studentsQuery = getUserDataByFilter({id_class: c.id, role: 'STUDENT'})

                    // [ {teachers: [...]} {students: [...]} ...]
                    classesInjectedPeopleQuery.push({
                        teachers: teachersQuery,
                        students: studentsQuery
                    })
                }
                return resolve(classesInjectedPeopleQuery) // Take the DB answer
            })
            .then((result) => {
                // Insert member in class data
                classes.forEach((c, i) => {
                    const teachers = teacherFormatter(result[i].teachers)
                    const students = result[i].students
                 
                    c.teachers = teachers
                    c.students = students
                })
                res.send(classes)
            })
            .catch((err) => {
                console.log(err);
                errorManagment('GET classes', err)
                res.sendStatus(500)
            }) // Server error
    })

router.route('/classes/:id')
    
    // Get by id only own classes (TEACHER AND STUDENT)
    .get(AuthJWT.authenticateJWT, (req, res) => {
        const user = AuthJWT.parseAuthorization(req.headers.authorization)
        const {email, role} = user;
        const id = +req.params.id

        // 
        let ownclass;
        getOwnClassesIDS(email, role)
            .then((ids) => {
                // Check is own class
                if (!ids.includes(id)) return Promise.reject(403)
                return getClassDataByID(id)
            })
            .then((result) => {
                ownclass = [result]  // save class
                const classesInjectedPeopleQuery = []

                // Convert img in base64 and query student
                for (const c of ownclass) {
                    c['img_cover'] = BlobConvert.blobToBase64(c['img_cover'])

                    // Save stryctured query
                    const teachersQuery = getTeachersInClass(c.id)
                    const studentsQuery = getUserDataByFilter({id_class: c.id, role: 'STUDENT'})

                    // [ {teachers: [...]} {students: [...]} ...]
                    classesInjectedPeopleQuery.push({
                        teachers: teachersQuery,
                        students: studentsQuery
                    })
                }
                return resolve(classesInjectedPeopleQuery) // Take the DB answer
            })
            .then((result) => {
                // Insert member in class data
                ownclass.forEach((c, i) => {
                    const teachers = teacherFormatter(result[i].teachers)
                    const students = result[i].students
                 
                    c.teachers = teachers
                    c.students = students
                })
                res.send(...ownclass)
            })
            .catch((err) => {
                console.log(err);
                errorManagment('GET classes/id', err)
                if(err === 400 || err === 403) res.sendStatus(err) // Error in parameter
                else res.sendStatus(500)
            }) // Server error
    })

    // Update class data by id
    .put(AuthJWT.authenticateJWT, Validator.putClass, (req, res) =>{
        const user = AuthJWT.parseAuthorization(req.headers.authorization)
        const {email, role} = user;
        const id = req.params.id;
        
        if (role !== 'TEACHER')
            return res.sendStatus(403);

        if (req.body?.img_cover !== undefined)
            req.body.img_cover = BlobConvert.base64ToBlob(req.body.img_cover)

        isParameterRoleInClass(email, +id, 'CREATOR')
            .then((result) => {
                // Check if you are the tutur of class
                if(result['_count'] !== 1)
                    return Promise.reject(403);    // You aren't the tutor    

                // if you are a tutor commit query for change class data
                return updateClass(+id, req.body)
            })
            .then((newData) =>  {
                newData.img_cover = BlobConvert.blobToBase64(newData.img_cover)
                res.send(newData) // Ok
            })
            .catch((err) => {
                errorManagment('PUT classes/id', err)
                if(err === 400 || err === 403) res.sendStatus(err) // Error in parameter
                else res.sendStatus(500)
            }) // Server error
    })

    // Delete class by id
    .delete(AuthJWT.authenticateJWT, (req, res) => {
        const user = AuthJWT.parseAuthorization(req.headers.authorization)
        const {email, role} = user;
        const id = req.params.id;

        if (role !== 'TEACHER') 
            return res.sendStatus(403)

        // Check if this class is own
        isParameterRoleInClass(email, +id, 'CREATOR')
            .then((result) => {
                // Check if you are the tutur of class
                if(result['_count'] !== 1)
                    return Promise.reject(403); // Forbidden
                    
                // if you are a tutor commit query for delete class
                return deleteClass(+id)
            })
            .then(() =>  res.sendStatus(200))  // You changed a class data
            .catch((err) => {
                errorManagment('DELETE classes/id', err)
                if(err === 400 || err === 403) res.sendStatus(err) // Error in parameter
                else res.sendStatus(500)
            }) // Server error
    })

module.exports = router