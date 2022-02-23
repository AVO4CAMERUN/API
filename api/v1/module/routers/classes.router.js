// Dependences
const express = require('express');

// Utils servises
const BlobConvert = require('../utils/BlobConvert');
const AuthJWT = require('../utils/Auth');
const Utils = require('../utils/Utils');

// Import DBservices and deconstruct function
const {genericCycleQuery} = require('../DBservises/generic.service');   // GenericService                       
const {isParameterRole} = require('../DBservises/account.service'); // AccountService 
const {addClassInvite} = require('../DBservises/invites.service'); // InvitesService;
const {  // ClassService
    createClass, 
    addProfsClass, 
    getClassDataByFilter,
    getClassDataByID, 
    isParameterRoleInClass,
    updateClass,
    delateClass
} = require('../DBservises/classes.service');   

// Allocate obj
const router = express.Router();    //Create router Object    

// Routers for classes
router.route('/classes')

    // Create new class
    .post(AuthJWT.authenticateJWT, (req, res) => {
        const user = AuthJWT.parseAuthorization(req.headers.authorization)
        const {email, role} = user;
        let {name, img_cover, students, profs} = req.body;

        if (role !== "02") 
            return res.sendStatus(403);    // You aren't a prof (conviene cosi non si fanno richieste al db)

        if (img_cover)
            img_cover = `x'${BlobConvert.base64ToHex(img_cover)}'`

        // Create query
        let checkQuerys = [];
        if(Array.isArray(profs)){
            for (const prof of profs) {
                checkQuery.push({
                    queryMethod: isParameterRole,  // Check is professor
                    par: [prof, "02"]
                })
            }
        }

        if(Array.isArray(students)){
            for (const stud of students) {
                checkQuerys.push({
                    queryMethod: isParameterRole,  // Check is student
                    par: [stud, "01"]
                })
            }
        }

        // Send dynamic querys
        genericCycleQuery(...checkQuerys)
        .then((result) => {

            // Sum for check that only email is register users
            let sum = 0; result.forEach(r => {sum += r.value[0]["COUNT(*)"] });

            // somma di result
            if(sum !== checkQuerys.length)
                return Promise.reject(400)

            return genericCycleQuery( 
                {
                    queryMethod: createClass,  // Create class and save id
                    par: [name, img_cover]
                }
            )
                
        })
        .then((result) => {
            const id = result[0].value.insertId; // id class

            // Query array for add profs
            const queryArray = [];
            
            // Push tutor
            queryArray.push({
                queryMethod: addProfsClass,
                par: [email, id, 'tutor']
            })

            // Push others prof if there are
            if(Array.isArray(profs)){
                for (const prof of profs) {
                    queryArray.push({       // controllare se sono prof
                        queryMethod: addProfsClass,
                        par: [prof, id, 'normal']
                    })
                }
            }
            
            // Push student invitations if there are
            if (Array.isArray(students)) {
                for (const stud of students) {
                    queryArray.push({
                        queryMethod: addClassInvite,
                        par: [stud, id]
                    })
                }
            }

            // Add relation in the class (start up student and profs) if there are
            return genericCycleQuery(...queryArray) // Send dynamic querys               
        })
        .then(() => {
            res.sendStatus(200);     // You create a your new class
        })
        .catch((err) => {
            console.log(err);
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
        genericCycleQuery(
            {
                queryMethod: getClassDataByFilter,
                par: [req.query]
            }
        )
        .then((result) => {
            // Take the DB answer 
            let classesData = result[0].value;

            // Convert img in base64
            for (const classData of classesData) {
                classData['img_cover'] = BlobConvert.blobToBase64(classData['img_cover']);
            }

            // Responce 
            res.send(classesData);
        })
        .catch((err)=>{
            console.log(err);
            res.sendStatus(500); // Server error
        })
    })

router.route('/classes/:id')

    // Get class data by id
    .get((req, res) => {
        const id = req.params.id;

        // Indirect call 
        genericCycleQuery(
            {
                queryMethod: getClassDataByID,
                par: [id]
            }
        )
        .then((result) => {
            // Take the DB answer 
            let classData = result[0].value[0];
            
            // Convert img in base64
            if(result[0].value[0]){
                classData['img_cover'] = BlobConvert.blobToBase64(classData['img_cover']);
                res.send(classData)
            } else {
                res.sendStatus(404) // Not found
            }

        })
        .catch((err)=>{
            console.log(err);
            res.sendStatus(500); // Server error
        })
    })
    
    // Update class data by id
    .put(AuthJWT.authenticateJWT, (req, res) =>{
        const user = AuthJWT.parseAuthorization(req.headers.authorization)
        const {email, role} = user;
        const id = req.params.id;
        
        if (role !== "02")
            return res.sendStatus(403);

        if (req.body?.img_cover)
            req.body.img_cover = `x'${BlobConvert.base64ToHex(req.body.img_cover)}'`

        //console.log(req.body)
        genericCycleQuery(
            {
                queryMethod: isParameterRoleInClass,
                par: [email, id, "tutor"]
            }
        )
        .then((result) => {
            // Check if you are the tutur of class
            if(result[0]?.value[0]['COUNT(*)'] == 0)
                return Promise.reject(403);    // You aren't the tutor    
            
            // if you are a tutor commit query for change class data
            return genericCycleQuery({
                queryMethod: updateClass,
                par: [{id}, req.body]
            })
            
        })
        .then(() => {
            res.sendStatus(200);
        })
        .catch((err) => {
            if(err === 400 || err === 403)
                res.sendStatus(err);    // Error in parameter
            else
                res.sendStatus(500); // Server error
        })
    })

    // Delete class by id
    .delete(AuthJWT.authenticateJWT, (req, res) => {
        const user = AuthJWT.parseAuthorization(req.headers.authorization)
        const {email, role} = user;
        const id = req.params.id;
        
        if (role !== "02")
            res.sendStatus(403)

        genericCycleQuery(
            {
                queryMethod: isParameterRoleInClass,
                par: [email, id, "tutor"]
            }
        )
        .then((result) => {
            // Check if you are the tutur of class
            if(result[0]?.value[0]['COUNT(*)'] === 0)
                return Promise.reject(403);    // You aren't the tutor    
                
            // if you are a tutor commit query for delete class
            return genericCycleQuery({
                queryMethod: delateClass,
                par: [id]
            })
            
        })
        .then(() => {
            res.sendStatus(200);    // You changed a class data
        })
        .catch((err) => {
            if(err === 400 || err === 403)
                res.sendStatus(err);    // Error in parameter
            else
                res.sendStatus(500); // Server error
        })
    })

module.exports = router