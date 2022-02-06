// Units mini-router

// Utils Module
const express = require('express');

const DBS = require('./utils/DBservices');
const BlobConvert = require('./utils/BlobConvert');
const authJWT = require('./utils/Auth');

const router = express.Router();    //Create router Object

router.route('/units')

    // Create new units 
    .post(authJWT.authenticateJWT, (req, res) => {
        const user = authJWT.parseAuthorization(req.headers.authorization)
        const {email, role} = user;
        const {name, description, id_course} = req.body;

        if (role !== "02") 
            return res.sendStatus(403);    // You aren't a prof

        DBS.genericCycleQuery( 
            {
                queryMethod: DBS.isCourseCreator,  // Check is your courses 
                par: [email, id_course]
            }
        )
        .then((result) => {
        
            // Check if you are the creator of course
            if(result[0]?.value[0]['COUNT(*)'] === 0)
                return res.sendStatus(403);    // You aren't the creator
            
            // if you are a creator
            return DBS.genericCycleQuery({
                queryMethod: DBS.createUnit,
                par: [name, description, id_course]
            })
        })
        .then((result) => {
            res.sendStatus(200);    // You create a your new courses
        })
        .catch((err) => {
            res.sendStatus(500); // Server error
        })

    })

    // Get units data by filter (id corso)  // solo se sei iscritto
    .get((req, res) => {})

router.route('/units/:id')

    // Update units data by id
    .put(authJWT.authenticateJWT, (req, res) => {})

    // Delete courses by id
    .delete(authJWT.authenticateJWT, (req, res) => {})

module.exports = router