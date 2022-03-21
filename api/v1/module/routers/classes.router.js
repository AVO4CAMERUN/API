// Classes mini-router

// Dependences
const express = require('express');

// Utils servises
const BlobConvert = require('../utils/BlobConvert');
const AuthJWT = require('../utils/Auth');
const Utils = require('../utils/Utils');

// Import DBservices and deconstruct function                    
const { isParameterRole } = require('../DBservises/account.services');     // Account services 
const { addClassInvite } = require('../DBservises/invites.services');      // Invites services
const { getUserDataByFilter, getTeachersInClass } = require('../DBservises/account.services');   // Account services
const {  // Class services
    createClass, 
    addProfsClass, 
    getClassDataByFilter,
    getClassDataByID, 
    isParameterRoleInClass,
    updateClass,
    deleteClass
} = require('../DBservises/classes.services');


// Allocate obj
const router = express.Router();    //Create router Object    

// Routers for classes
router.route('/classes')

    // Create new class
    .post(AuthJWT.authenticateJWT, (req, res) => {
        const user = AuthJWT.parseAuthorization(req.headers.authorization)
        const {email, role} = user;
        let {name, img_cover, students, profs} = req.body;

        if (role !== 'TEACHER')
            return res.sendStatus(403);    // You aren't a prof (conviene cosi non si fanno richieste al db)

        if (img_cover !== undefined)
            img_cover = BlobConvert.base64ToBlob(img_cover)

        // Create query
        let checkQuerys = [];
        if(Array.isArray(profs)) {
            for (const prof of profs)
                checkQuery.push(isParameterRole(prof, 'TEACHER'))// Check is professor
        }

        if(Array.isArray(students)) {
            for (const stud of students)
                checkQuerys.push(isParameterRole(stud, 'STUDENT')) // Check is student
        }

        // Send dynamic querys
        Promise.allSettled(checkQuerys)
        .then((result) => {
            console.log(result)
            
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
            const queryArray = [];
            
            // Push tutor
            queryArray.push(addProfsClass(email, id, 'TUTOR'))

            // Push others prof if there are
            if(Array.isArray(profs)) {
                for (const prof of profs)  // controllare se sono prof 
                    queryArray.push(addProfsClass(prof, id, 'NORMAL'))
            }
            
            // Push student invitations if there are
            if (Array.isArray(students)) {
                for (const stud of students)
                    queryArray.push(addClassInvite(stud, id))  
            }

            // Add relation in the class (start up student and profs) if there are
            return Promise.allSettled(queryArray) // Send dynamic querys               
        })
        .then(() => res.sendStatus(200)) // You create a your new class 
        .catch((err) => {
            console.log(err)
            if(err === 400) res.sendStatus(400);    // Error in parameter
            else res.sendStatus(500); // Server error
        })  
    })

    // Get class data by filter     // => da fare join per i prof e i studs 
    .get((req, res) => {
     
        // Cast data for query
        for (const key of Object.keys(req.query)) 
            req.query[key] = Utils.strToArray(req.query[key])
            
        // console.log(req.query[key])      

        // Indirect call
        let studentsQuery = [] 
        let teachersQuery = []
        let classes = []
        
        // 
        const resolve = async (arrays) => {
            //console.log(arrays)
            let r = []
            for (const query of arrays) {
                r.push(await Promise.allSettled(query))
            }
            return r
        }

        // Get classes
        getClassDataByFilter(req.query)
            .then((result) => {
                classes = result    // save classes 

                // Convert img in base64 and query student
                for (const c of classes) {
                    c['img_cover'] = BlobConvert.blobToBase64(c['img_cover'])
                    teachersQuery.push(getTeachersInClass(c.id))
                    studentsQuery.push(getUserDataByFilter({id_class: c.id, role: 'STUDENT'}))
                }

                return resolve([teachersQuery, studentsQuery]) // Take the DB answer
            })
            .then((result) => {
                // Insert member in class data
                classes.forEach((c, i) => {
                    classes[i].teachers = result[0][i].value
                    classes[i].students = result[1][i].value
                })
                res.send(classes)
            })
            .catch((err) => res.sendStatus(500))  // Server error
    })

router.route('/classes/:id')

    // Get class data by id
    .get((req, res) => {
        const id = req.params.id;

        // Indirect call
        Promise.allSettled([
            getClassDataByID(+id)
        ])
        .then((result) => {
            // Take the DB answer 
            let classData = result[0].value;

            // Convert img in base64
            if (result[0].value) {
                classData['img_cover'] = BlobConvert.blobToBase64(classData['img_cover']);
                res.send(classData)
            } else {
                res.sendStatus(404) // Not found
            }
        })
        .catch((err) => {
            console.log(err);
            res.sendStatus(500)
        })  // Server error
    })
    
    // Update class data by id
    .put(AuthJWT.authenticateJWT, (req, res) =>{
        const user = AuthJWT.parseAuthorization(req.headers.authorization)
        const {email, role} = user;
        const id = req.params.id;
        
        if (role !== 'TEACHER')
            return res.sendStatus(403);

        if (req.body?.img_cover !== undefined)
            img_cover = BlobConvert.base64ToBlob(img_cover)

        //console.log(req.body)
        Promise.allSettled([
            isParameterRoleInClass(email, +id, 'TUTOR')
        ])
        .then((result) => {
            // Check if you are the tutur of class
            if(result[0]?.value['_count'] == 0)
                return Promise.reject(403);    // You aren't the tutor    
            
            // if you are a tutor commit query for change class data
            return Promise.allSettled([
                updateClass(+id, req.body)
            ])  
        })
        .then(() => res.sendStatus(200))  // Ok
        .catch((err) => {
            console.log(err);
            if(err === 400 || err === 403) res.sendStatus(err) // Error in parameter
            else res.sendStatus(500) // Server error
        })
    })

    // Delete class by id
    .delete(AuthJWT.authenticateJWT, (req, res) => {
        const user = AuthJWT.parseAuthorization(req.headers.authorization)
        const {email, role} = user;
        const id = req.params.id;

        if (role !== 'TEACHER') 
            return res.sendStatus(403)

        Promise.allSettled([
            isParameterRoleInClass(email, +id, 'TUTOR')
        ])
        .then((result) => {
            // Check if you are the tutur of class
            if(result[0]?.value['_count'] !== 1)
                return Promise.reject(403); // Forbidden
                
            // if you are a tutor commit query for delete class
            return Promise.allSettled([
                deleteClass(id)
            ])
        })
        .then(() =>  res.sendStatus(200))  // You changed a class data
        .catch((err) => {
            if (err === 400 || err === 403) res.sendStatus(err);    // Error in parameter
            else res.sendStatus(500); // Server error
        })
    })

module.exports = router