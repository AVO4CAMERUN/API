// Lessons mini-router

// Dependences
const express = require('express');

// Utils servises
const AuthJWT = require('../utils/Auth');
const Utils = require('../utils/Utils');

// Import DBservices and deconstruct function
const {genericCycleQuery} = require('../DBservises/generic.service'); // GenericService        
const {isCourseCreator} = require('../DBservises/courses.service');   // CoursesService
const {unitBelongCourse} = require('../DBservises/units.service');    // UnitsService
const { // LessonsService
    createLesson, 
    updateLessons,
    lessonBelongUnit,
    getLessonsDataByFilter,
    deleteLessons
} = require('../DBservises/lessons.service');   

// Allocate obj
const router = express.Router();    //Create router Object

router.route('/lessons')

    // Create new lessons 
    .post(AuthJWT.authenticateJWT, (req, res) => {
        const user = AuthJWT.parseAuthorization(req.headers.authorization)
        const {email, role} = user;
        const {name, link_video, quiz, id_course, id_unit} = req.body;

        if (role !== "02") 
            return res.sendStatus(403);    // You aren't a prof

        genericCycleQuery(
            {
                queryMethod: isCourseCreator,
                par: [email, id_course]
            }
        )
        .then((result) => {

            // Check if you are the creator of course
            if(result[0]?.value[0]['COUNT(*)'] == 0)
                return Promise.reject(403);    // You aren't the creator 

            // if you are a creator check if unit belong course 
            return DBS.genericCycleQuery({
                queryMethod: unitBelongCourse,
                par: [id_course, id_unit]
            })
        })
        .then((result) => {
            if(result[0]?.value[0]['COUNT(*)'] == 0)
                return Promise.reject(403);    // You aren't the tutor   

            // delete unit 
            return DBS.genericCycleQuery({
                queryMethod: createLesson,
                par: [id_unit, name, link_video, quiz]   // aggiungere data
            })
        })
        .then(() => res.sendStatus(200))
        .catch((err) => {
            if(err === 400 || err === 403) res.sendStatus(err)    // Error in parameter
            else res.sendStatus(500) // Server error
        })
    })

    // Get courses data by filter
    .get((req, res) => {

        // Cast data for query
        for (const key of Object.keys(req.query)) 
            req.query[key] = Utils.strToArray(req.query[key])

        // Query
        genericCycleQuery({
            queryMethod: getLessonsDataByFilter,
            par: [req.query]
        })
        .then((response) => res.send(response[0].value))// Send lessons data
        .catch(() => res.sendStatus(500))               // Server error
    })

router.route('/lessons/:id')
    
    // Update lessons data by id
    .put(AuthJWT.authenticateJWT, (req, res) => {
        const user = AuthJWT.parseAuthorization(req.headers.authorization)
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

        genericCycleQuery(
            {
                queryMethod: isCourseCreator,
                par: [email, id_course]
            }
        )
        .then((result) => {
            // Check if you are the creator of course
            if(result[0]?.value[0]['COUNT(*)'] == 0)
                return Promise.reject(403);    // You aren't the creator 

            // if you are a creator check if unit belong course and lesson belong in unit
            return genericCycleQuery(
                {
                    queryMethod: unitBelongCourse,
                    par: [id_course, id_unit]
                },
                {
                    queryMethod: lessonBelongUnit,
                    par: [id_unit, id_lesson]
                }
            )
        })
        .then((result) => {
            if(result[0]?.value[0]['COUNT(*)'] == 0 || result[1]?.value[0]['COUNT(*)'] == 0)
                return Promise.reject(403);    //   

            // Delete unit
            return genericCycleQuery({
                queryMethod: updateLessons,
                par: [{id_lesson}, req.body]
            })
        })
        .then(() => res.sendStatus(200))    // Ok
        .catch((err) => {
            if(err === 400 || err === 403)res.sendStatus(err)    // Error in parameter
            else res.sendStatus(500) // Server error
            // fare gestione tramite codici restituita da mysql
        })
    })

    // Delete lessons by id
    .delete(AuthJWT.authenticateJWT, (req, res) => {
        const user = AuthJWT.parseAuthorization(req.headers.authorization)
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

        genericCycleQuery(
            {
                queryMethod: isCourseCreator,
                par: [email, id_course]
            }
        )
        .then((result) => {

            // Check if you are the creator of course
            if(result[0]?.value[0]['COUNT(*)'] == 0)
                return Promise.reject(403);    // You aren't the creator 

            // if you are a creator check if unit belong course and lesson belong in unit
            return genericCycleQuery(
                {
                    queryMethod: unitBelongCourse,
                    par: [id_course, id_unit]
                },
                {
                    queryMethod: lessonBelongUnit,
                    par: [id_unit, id_lesson]
                }
            )
        })
        .then((result) => {
            if(result[0]?.value[0]['COUNT(*)'] == 0 || result[1]?.value[0]['COUNT(*)'] == 0)
                return Promise.reject(403);    // 

            // delete unit 
            return genericCycleQuery({
                queryMethod: deleteLessons,
                par: [id_lesson]
            })
        })
        .then(() => res.sendStatus(200)) // ok
        .catch((err) => {
            console.log(err);
            if(err === 400 || err === 403) res.sendStatus(err)    // Error in parameter
            else res.sendStatus(500) // Server error
            // fare gestione tramite codici restituita da mysql
        })
    })

module.exports = router