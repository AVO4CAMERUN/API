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
                return Promise.reject(403);    // You aren't the creator
            
            // if you are a creator
            return DBS.genericCycleQuery({
                queryMethod: DBS.createUnit,
                par: [name, description, id_course]
            })
        })
        .then(() => {
            res.sendStatus(200);
        })
        .catch((err) => {
            if(err === 400 || err === 403)
                res.sendStatus(err)    // Error in parameter
            else
                res.sendStatus(500) // Server error
        })

    })

    // Get units data by filter (id corso)  // solo se sei iscritto
    .get((req, res) => {})

router.route('/units/:id')

    // Update units data by id
    .put(authJWT.authenticateJWT, (req, res) => {})

    // Delete units by id
    .delete(authJWT.authenticateJWT, (req, res) => {
        const user = authJWT.parseAuthorization(req.headers.authorization)
        const {email, role} = user;
        const id_unit = req.params.id;
        
        if (role !== "02") 
            return res.sendStatus(403);    // You aren't a prof   
            
        DBS.genericCycleQuery(
            {
                queryMethod: DBS.isCourseCreator,
                par: [email, id_course]
            }
        )
        .then((result) => {

            // Check if you are the creator of course
            if(result[0]?.value[0]['COUNT(*)'] == 0)
                return Promise.reject(403);    // You aren't the tutor   

            // if you are a creator commit query for delete course
            return DBS.genericCycleQuery({
                queryMethod: DBS.deleteUnit,
                par: [id_unit]
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

module.exports = router