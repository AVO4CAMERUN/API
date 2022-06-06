// Classes mini-router

// Dependences
import express from 'express'

// Utils Servises
import BlobConvert from '../../utils/BlobConvert.js'
import AuthJWT from '../../utils/Auth.js'
import { errorManagment } from '../../utils/DBErrorManagment.js'
import Validator from './classes.validator.js'

// Route Services               
import {
    isParameterRole,
    getUserDataByFilter,
    getTeachersInClass
} from '../accounts/account.services.js'
import { addClassInvite } from '../invites/invites.services.js'
import {
    createClass, 
    addProfsClass, 
    getClassDataByFilter,
    getClassDataByID,
    getOwnClassesIDS,
    isParameterRoleInClass,
    updateClass,
    deleteClass
} from './classes.services.js'

// Allocate obj
const router = express.Router()



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
        t[k].img_profile = BlobConvert.blobToBase64(teachers[k].img_profile);
    }
    return t
}

// Function for formatter user user data
const userFormatter = (users) => {
    for (const user of users)
        user.img_profile = BlobConvert.blobToBase64(user.img_profile);
    return users
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
            checkQuerys.push(isParameterRole(prof, 'TEACHER'))// Check is professor
        
        for (const stud of students)
            checkQuerys.push(isParameterRole(stud, 'STUDENT')) // Check is student

        // Send dynamic querys
        Promise.allSettled(checkQuerys)
            .then((result) => {
                // Sum for check that only email is register users
                let sum = 0; result.forEach(r => {sum += r.value._count });

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
            .catch((err) => errorManagment('POST classes', res, err)) // Server error
    })

    // Get class data by filter (TEACHER)
    .get(AuthJWT.authenticateJWT, Validator.getClass, (req, res) => {
        const user = AuthJWT.parseAuthorization(req.headers.authorization)
        const {email, role} = user;

        // Cast data for query
        if (role !== 'STUDENT')
            for (const key of Object.keys(req.query)) 
                req.query[key] = JSON.parse(req.query[key])

        // Get classes
        const classes = []
        getClassDataByFilter(req.query, email, role)
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
                    const students = userFormatter(result[i].students)

                    console.log(students)

                    c.teachers = teachers
                    c.students = students
                })
                res.send(classes)
            })
            .catch((err) => errorManagment('GET classes', res, err)) // Server error
    })

router.route('/classes/:id')
    
    // Get by id only own classes (TEACHER AND STUDENT) // forse da togliere
    .get(AuthJWT.authenticateJWT, (req, res) => {
        const user = AuthJWT.parseAuthorization(req.headers.authorization)
        const {email, role} = user;
        const id = +req.params.id

        // 
        let ownclass;
        getClassDataByID(id)
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
            .catch((err) => errorManagment('GET classes/id', res, err)) // Server error
    })

    // Update class data by id
    .put(AuthJWT.authenticateJWT, /*Validator.putClass,*/ (req, res) =>{
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
            .catch((err) => errorManagment('PUT classes/id', res, err)) // Server error
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
            .catch((err) => errorManagment('DELETE classes/id', res, err)) // Server error
    })

export default router