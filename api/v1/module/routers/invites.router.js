// Invites mini-router

// Dependences
const express = require('express');

// Utils servises
const BlobConvert = require('../utils/BlobConvert');
const AuthJWT = require('../utils/Auth');

// Import DBservices and deconstruct function
const {genericCycleQuery} = require('../DBservises/generic.service');   // GenericService
const {isParameterRole} = require('../DBservises/account.service');     // AccountService
const {isParameterRoleInClass, isExistClassByid} = require('../DBservises/classes.service'); // ClassService
const { // InvitesService
    addClassInvite, 
    getInvitedDataByFilter,
    acceptInvitation, 
    deleteInvitation
} = require('../DBservises/invites.service'); 


// Allocate obj
const router = express.Router();    //Create router Object    

// Routers for class invites
router.route('/invites')

    // Create invites for stundents
    .post(AuthJWT.authenticateJWT, (req, res) => {
        const user = AuthJWT.parseAuthorization(req.headers.authorization)
        const {email, role} = user;
        const {class_id, students} = req.body;
        
        if(role !== "02")
            return res.sendStatus(403);    // You aren't a prof
        
        genericCycleQuery(
            {
                queryMethod: isParameterRoleInClass,
                par: [email, class_id, "tutor"]
            },
            {
                queryMethod: isParameterRoleInClass,
                par: [email, class_id, "normal"]
            }
        )
        .then((result) => {
            const isProf = result[0].value[0]["COUNT(*)"] + result[1].value[0]["COUNT(*)"];

            // Check is prof in class
            if(!isProf)
                return Promise.reject(403);    // You aren't a prof in class

            // Check students is iterable
            if(!Array.isArray(students))
                return Promise.reject(400); // Error in parameter

            // Create query for check student profile and class exist
            let checkQuerys = [];
            checkQuerys.push({
                queryMethod: isExistClassByid,  // Check class
                par: [class_id]
            })

            for (const stud of students) {
                checkQuerys.push({
                    queryMethod: isParameterRole,  // Check is student
                    par: [stud, "01"]
                })
            }
            
            // Send dynamic querys
            return genericCycleQuery(...checkQuerys);
        })
        .then((result) => {
            // Sum for check that all email is register users
            let sum = 0; result.forEach(r => {sum += r.value[0]["COUNT(*)"] });

            // console.log(sum, result.length);
            if(sum !== result.length)
                return Promise.reject(400); // Error in parameter

            // Query array for add profs
            const queryArray = [];
            
            // Push student invitations if there are
            for (const stud of students) {
                queryArray.push({
                    queryMethod: addClassInvite,
                    par: [stud, class_id]
                })
            }

            // Send invite for class
            return genericCycleQuery(...queryArray) // Send dynamic querys
        })
        .then(() => {
            res.sendStatus(200);    // You invieted students
        })
        .catch((err) => {
            if(err === 400 || err === 403)res.sendStatus(err);    // Error in parameter
            else res.sendStatus(500); // Server error
        })
        
    })

    // Get all your invites by email
    .get(AuthJWT.authenticateJWT, (req, res) => {
        const user = AuthJWT.parseAuthorization(req.headers.authorization)
        const {email} = user;

        // Indirect call 
        genericCycleQuery(
            {
                queryMethod: getInvitedDataByFilter,
                par: [{email: [email]}] // Array con un obj di filtri accompatiti per colonna
            }
        )
        .then((result) => {
            res.send(result[0].value)   // Send invites
        })
        .catch((err) => {
            console.log(err);
            res.sendStatus(500); // Server error
        })
    })

router.route('/invites/:id')

    // Accept invites
    .get(AuthJWT.authenticateJWT, (req, res) => {
        const id = req.params.id;
        const user = AuthJWT.parseAuthorization(req.headers.authorization)
        const {email} = user;

        // Indirect call 
        genericCycleQuery(
            {
                queryMethod: getInvitedDataByFilter,
                par: [{
                        id :[id], 
                        email:[email]
                    }]
            }
        )
        .then((result) => {
            const class_id = result[0].value[0]?.id_class;

            // if invited exist 
            if(class_id === undefined)
                return res.sendStatus(400); // Error in parameter

            // Accept 
            return genericCycleQuery(
                {
                    queryMethod: acceptInvitation,
                    par: [class_id, email]
                },
                {
                    queryMethod: deleteInvitation,
                    par: [id]
                }
            ) 
        })
        .then(() => {
            res.sendStatus(200)   // Send ok
        })
        .catch(() => {
            res.sendStatus(500); // Server error
        })
    })
    
    // Reject invites
    .delete(AuthJWT.authenticateJWT, (req, res) => {
        const id = req.params.id;
        const user = AuthJWT.parseAuthorization(req.headers.authorization)
        const {email} = user;
        
        // Indirect call 
        genericCycleQuery(
            {
                queryMethod: getInvitedDataByFilter,
                par: [{
                        id : [id], 
                        email: [email]
                    }]
            }
        )
        .then((result) => {
            
            // if invited exist 
            if(result[0].value[0] === undefined)
                res.sendStatus(400); // Error in parameter

            // Reject
            return genericCycleQuery(
                {
                    queryMethod: deleteInvitation,
                    par: [id]
                }
            )
        })
        .then(() => {
            res.sendStatus(200)   // Send ok
        })
        .catch(() => {
            res.sendStatus(500); // Server error
        })
    })

module.exports = router
