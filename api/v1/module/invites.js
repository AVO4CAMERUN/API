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

        if(role === "02"){
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
                if(isProf){

                    // Check students is iterable
                    if(Array.isArray(students)){

                        // Create query for check student profile and class exist
                        let checkQuerys = [];
                        checkQuerys.push({
                            queryMethod: DBS.isExistClassByid,  // Check is student
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
                        
                    } else { 
                        return Promise.reject(400); /* Error in parameter*/ 
                    }
                } else { 
                    return Promise.reject(403);    /* You aren't a prof in class*/
                }
            })
            .then((result) => {
                // Sum for check that only email is register users
                let sum = 0; result.forEach(r => {sum += r.value[0]["COUNT(*)"] });

                if(sum === result.length){

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
                } else {
                    return Promise.reject(400); /* Error in parameter*/
                }
                
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
        }  else {
            res.sendStatus(403);    // You aren't a prof
        }
    })

    // Get all your invites by email
    .get(authJWT.authenticateJWT, (req, res) => {
        const user = authJWT.parseAuthorization(req.headers.authorization)
        const {email} = user;

        // Indirect call 
        DBS.genericCycleQuery(
            {
                queryMethod: DBS.getInvitedDataByEmail,
                par: [email]
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
    .get(authJWT.authenticateJWT, (req, res) => {})
    
    // Reject invites
    .delete(authJWT.authenticateJWT, (req, res) => {})

module.exports = router