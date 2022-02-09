// Lessons mini-router

// Utils Module
const express = require('express');

const DBS = require('./utils/DBservices');
const authJWT = require('./utils/Auth');

const router = express.Router();    //Create router Object

router.route('/lessons')

    // Create new lessons 
    .post(authJWT.authenticateJWT, (req, res) => {
        const user = authJWT.parseAuthorization(req.headers.authorization)
        const {email, role} = user;
        const {name, link_video, quiz, id_course, id_unit} = req.body;

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
                return Promise.reject(403);    // You aren't the creator 

            // if you are a creator check if unit belong course 
            return DBS.genericCycleQuery({
                queryMethod: DBS.unitBelongCourse,
                par: [id_course, id_unit]
            })
        })
        .then((result) => {
    
            if(result[0]?.value[0]['COUNT(*)'] == 0)
                return Promise.reject(403);    // You aren't the tutor   

            // delete unit 
            return DBS.genericCycleQuery({
                queryMethod: DBS.createLesson,
                par: [name, link_video, quiz]   // aggiungere data
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

    // Get courses data by filter
    .get((req, res) => {})

router.route('/lessons/:id')

    // Get courses data by id
    .get((req, res) => {})
    
    // Update courses data by id
    .put(authJWT.authenticateJWT, (req, res) =>{})

    // Delete courses by id
    .delete(authJWT.authenticateJWT, (req, res) => {})


module.exports = router