// Invites mini-router

// Utils Module
const express = require('express');
const DBS = require('./utils/DBservices');
const BlobConvert = require('./utils/BlobConvert');
const authJWT = require('./utils/Auth');

const router = express.Router();    //Create router Object    

// Routers for class invites
router.route('/invites')

    // Create invites for stundents
    .post(authJWT.authenticateJWT, (req, res) => {
        const user = authJWT.parseAuthorization(req.headers.authorization)
        const {email, role} = user;
        const {class_id, students} = req.body;

        if(role === "02")
            return res.sendStatus(403);    // You aren't a prof
        
        DBS.genericCycleQuery(
            {
                queryMethod: DBS.isParameterRoleInClass,
                par: [email, class_id, "tutor"]
            },
            {
                queryMethod: DBS.isParameterRoleInClass,
                par: [email, class_id, "normal"]
            }
        )
        .then((result) => {
            const isProf = result[0].value[0]["COUNT(*)"] + result[1].value[0]["COUNT(*)"];
            console.log(isProf);

            // Check is prof in class
            if(!isProf)
                return Promise.reject(403);    // You aren't a prof in class

            // Check students is iterable
            if(!Array.isArray(students))
                return Promise.reject(400); // Error in parameter

            // Create query for check student profile and class exist
            let checkQuerys = [];
            checkQuerys.push({
                queryMethod: DBS.isExistClassByid,  // Check class
                par: [class_id]
            })

            for (const stud of students) {
                checkQuerys.push({
                    queryMethod: DBS.isParameterRole,  // Check is student
                    par: [stud, "01"]
                })
            }
            
            // Send dynamic querys
            return DBS.genericCycleQuery(...checkQuerys);
        })
        .then((result) => {
            // Sum for check that only email is register users
            let sum = 0; result.forEach(r => {sum += r.value[0]["COUNT(*)"] });

            if(sum !== result.length)
                return Promise.reject(400); // Error in parameter

            // Query array for add profs
            const queryArray = [];
            
            // Push student invitations if there are
            for (const stud of students) {
                queryArray.push({
                    queryMethod: DBS.addClassInvite,
                    par: [stud, class_id]
                })
            }

            // Send invite for class
            return DBS.genericCycleQuery(...queryArray) // Send dynamic querys
        })
        .then(() => {
            res.sendStatus(200);    // You invieted students
        })
        .catch((err) => {
            // console.log(err);
            
            if(err === 400 || err === 403)
                res.sendStatus(err);    // Error in parameter
            else
                res.sendStatus(500); // Server error
        })
        
    })

    // Get all your invites by email
    .get(authJWT.authenticateJWT, (req, res) => {
        const user = authJWT.parseAuthorization(req.headers.authorization)
        const {email} = user;

        // Indirect call 
        DBS.genericCycleQuery(
            {
                queryMethod: DBS.getInvitedDataByFilter,
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
    .get(authJWT.authenticateJWT, (req, res) => {
        const id = req.params.id;
        const user = authJWT.parseAuthorization(req.headers.authorization)
        const {email} = user;

        // Indirect call 
        DBS.genericCycleQuery(
            {
                queryMethod: DBS.getInvitedDataByFilter,
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
            return DBS.genericCycleQuery(
                {
                    queryMethod: DBS.acceptInvitation,
                    par: [class_id, email]
                },
                {
                    queryMethod: DBS.deleteInvitation,
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
    .delete(authJWT.authenticateJWT, (req, res) => {
        const id = req.params.id;
        const user = authJWT.parseAuthorization(req.headers.authorization)
        const {email} = user;
        
        // Indirect call 
        DBS.genericCycleQuery(
            {
                queryMethod: DBS.getInvitedDataByFilter,
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
            return DBS.genericCycleQuery(
                {
                    queryMethod: DBS.deleteInvitation,
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