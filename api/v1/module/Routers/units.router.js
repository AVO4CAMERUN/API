// Units mini-router

// Dependences
const express = require('express');

// Utils servises
const AuthJWT = require('../utils/Auth');
const { errorManagment } = require('../utils/DBErrorManagment');

// Import DBservices and deconstruct function
const { isCourseCreator } = require('../DBservises/courses.services'); // Courseservices
const {
    createUnit,
    getUnitsDataByFilter,
    unitBelongCourse,
    updateUnits,
    deleteUnit
} = require('../DBservises/units.services'); // Unitsservices

// Allocate obj
const router = express.Router();    //Create router Object

router.route('/units')

    // Create new units 
    .post(AuthJWT.authenticateJWT, (req, res) => {
        const user = AuthJWT.parseAuthorization(req.headers.authorization)
        const {email, role} = user;
        const {name, description, id_course} = req.body;

        if (role !== 'TEACHER') 
            return res.sendStatus(403);    // You aren't a prof

        isCourseCreator(email, +id_course) // Check is your courses 
            .then((result) => {
                // Check if you are the creator of course
                if(result['_count'] !== 1)
                    return Promise.reject(403);    // You aren't the creator
                
                // if you are a creator
                return createUnit(name, description, +id_course) 
            })
            .then(() => res.sendStatus(200)) // Ok
            .catch((err) => errorManagment('POST units', res, err))
    })

    // Get units data by filter (id corso)  // solo se sei iscritto -- cosa marginale
    .get(AuthJWT.authenticateJWT, (req, res) => {

        // Cast data for query
        for (const key of Object.keys(req.query)) 
            req.query[key] = JSON.parse(req.query[key])

        getUnitsDataByFilter(req.query, {lesson: true})
            .then((response) => res.send(response)) // Send units data
            .catch((err) => errorManagment('GET units', res, err))  // Server error
    })

router.route('/units/:id')

    // Update units data by id
    .put(AuthJWT.authenticateJWT, (req, res) => {
        const user = AuthJWT.parseAuthorization(req.headers.authorization)
        const {email, role} = user;
        const {id_course} = req.body;
        const id_unit = req.params.id;

        // Check
        if (role !== 'TEACHER') return res.sendStatus(403);             // You aren't a prof   
        if (!id_course || req.body?.id_unit) return res.sendStatus(400);// Bad reqest
        delete req.body.id_course;                                      // Get course_id on body request

        isCourseCreator(email, +id_course)
            .then((result) => {
                // Check if you are the creator of course
                if(result['_count'] !== 1)
                    return Promise.reject(403);    // You aren't the tutor   

                // if you are a creator check if unit belong course 
                return unitBelongCourse(+id_course, +id_unit)
            })
            .then((result) => {
                if(result['_count'] == 0)
                    return Promise.reject(403);    // You aren't the tutor   

                // delete unit 
                return updateUnits(+id_unit, req.body)
            })
            .then((newData) => res.send(newData)) // Ok
            .catch((err) => errorManagment('PUT units/id', res, err)) // Server error
    })

    // Delete units by id
    .delete(AuthJWT.authenticateJWT, (req, res) => {
        const user = AuthJWT.parseAuthorization(req.headers.authorization)
        const {email, role} = user;
        const id_unit = req.params.id;
        const {id_course} = req.body;

        if (role !== 'TEACHER') 
            return res.sendStatus(403);    // You aren't a prof   

        isCourseCreator(email, +id_course)
            .then((result) => {
                // Check if you are the creator of course
                if(result['_count'] !== 1)
                    return Promise.reject(403);    // You aren't the tutor   

                // if you are a creator check if unit belong course 
                return unitBelongCourse(+id_course, +id_unit)
            })
            .then((result) => {
                // 
                if(result['_count'] !== 1)
                    return Promise.reject(403);    // You aren't the tutor   

                // delete unit 
                return deleteUnit(+id_course, +id_unit)
            })
            .then(() => res.sendStatus(200))
            .catch((err) => errorManagment('DELETE units/id', err)) // Server error
    })

module.exports = router
