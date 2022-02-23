// Lessons mini-router

// Utils Module
const express = require('express');
const DBS = require('../utils/DBservices');
const authJWT = require('../utils/Auth');

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
                par: [id_unit, name, link_video, quiz]   // aggiungere data
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
    .get((req, res) => {

        // Cast data for query
        for (const key of Object.keys(req.query)) 
            req.query[key] = DBS.strToArray(req.query[key])

        // Query
        DBS.genericCycleQuery({
                queryMethod: DBS.getLessonsDataByFilter,
                par: [req.query]
        })
        .then((response) => {
            let lessonsData = response[0].value;
       
            // Send courses data
            res.send(lessonsData);    
        })
        .catch(() => {
            res.sendStatus(500); // Server error
        })
    })

router.route('/lessons/:id')
    
    // Update lessons data by id
    .put(authJWT.authenticateJWT, (req, res) => {
        const user = authJWT.parseAuthorization(req.headers.authorization)
        const {email, role} = user;

        if (role !== "02")
            return res.sendStatus(403);    // You aren't a prof

        // Extract data and cast
        const id_lesson = +req.params.id;
        const id_course = +req.body.id_course;
        const id_unit =   +req.body.id_unit;
        
        // Check data
        if (isNaN(id_course) || isNaN(id_unit) || isNaN(id_lesson)) 
            return res.sendStatus(400);
            
        // Delate utils data
        delete req.body.id_course;
        delete req.body.id_unit;

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

            
            // if you are a creator check if unit belong course and lesson belong in unit
            return DBS.genericCycleQuery(
                {
                    queryMethod: DBS.unitBelongCourse,
                    par: [id_course, id_unit]
                },
                {
                    queryMethod: DBS.lessonBelongUnit,
                    par: [id_unit, id_lesson]
                }
            )
        })
        .then((result) => {
            
            if(result[0]?.value[0]['COUNT(*)'] == 0 || result[1]?.value[0]['COUNT(*)'] == 0)
                return Promise.reject(403);    //    

            // delete unit
            return DBS.genericCycleQuery({
                queryMethod: DBS.updateLessons,
                par: [{id_lesson}, req.body]
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
                // fare gestione tramite codici restituita da mysql
        })
    })

    // Delete lessons by id
    .delete(authJWT.authenticateJWT, (req, res) => {
        const user = authJWT.parseAuthorization(req.headers.authorization)
        const {email, role} = user;

        if (role !== "02")
            return res.sendStatus(403);    // You aren't a prof
        
        // Extract data and cast
        const id_lesson = +req.params.id;
        const id_course = +req.body.id_course;
        const id_unit =   +req.body.id_unit;
        
        // Check data
        if (isNaN(id_course) || isNaN(id_unit) || isNaN(id_lesson)) 
            return res.sendStatus(400);

        // Delate utils data
        delete req.body.id_course;
        delete req.body.id_unit;

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

            // if you are a creator check if unit belong course and lesson belong in unit
            return DBS.genericCycleQuery(
                {
                    queryMethod: DBS.unitBelongCourse,
                    par: [id_course, id_unit]
                },
                {
                    queryMethod: DBS.lessonBelongUnit,
                    par: [id_unit, id_lesson]
                }
            )
        })
        .then((result) => {
    
            if(result[0]?.value[0]['COUNT(*)'] == 0 || result[1]?.value[0]['COUNT(*)'] == 0)
                return Promise.reject(403);    // 

            // delete unit 
            return DBS.genericCycleQuery({
                queryMethod: DBS.deleteLessons,
                par: [id_lesson]
            })
        })
        .then(() => {
            res.sendStatus(200);
        })
        .catch((err) => {
            console.log(err);
            if(err === 400 || err === 403)
                res.sendStatus(err)    // Error in parameter
            else
                res.sendStatus(500) // Server error
                // fare gestione tramite codici restituita da mysql
        })
    })

module.exports = router