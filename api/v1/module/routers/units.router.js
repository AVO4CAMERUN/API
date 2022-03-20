// Units mini-router

// Dependences
const express = require('express');

// Utils servises
const AuthJWT = require('../utils/Auth');
const Utils = require('../utils/Utils');

// Import DBservices and deconstruct function
   // Basicservices
const {isCourseCreator} = require('../DBservises/courses.services'); // Courseservices
const {getLessonsDataByFilter} = require('../DBservises/lessons.services'); // Lessonsservices
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

        if (role !== "02") 
            return res.sendStatus(403);    // You aren't a prof

        multiQuerysCaller( 
            {
                queryMethod: isCourseCreator,  // Check is your courses 
                par: [email, id_course]
            }
        )
        .then((result) => {
        
            // Check if you are the creator of course
            if(result[0]?.value[0]['COUNT(*)'] === 0)
                return Promise.reject(403);    // You aren't the creator
            
            // if you are a creator
            return multiQuerysCaller({
                queryMethod: createUnit,
                par: [name, description, id_course]
            })
        })
        .then(() => res.sendStatus(200)) // Ok
        .catch((err) => {
            if(err === 400 || err === 403) res.sendStatus(err)  // Error in parameter
            else res.sendStatus(500) // Server error
        })
    })

    // Get units data by filter (id corso)  // solo se sei iscritto -- cosa marginale
    .get((req, res) => {
        let units;

        // Cast data for query
        for (const key of Object.keys(req.query)) 
            req.query[key] = Utils.strToArray(req.query[key])

        multiQuerysCaller({
            queryMethod: getUnitsDataByFilter,
            par: [req.query]
        })
        .then((response) => {
            units = response[0].value;
            
            // Make querys
            let querys = [];
            for (const unit of units){
                querys.push({
                    queryMethod: getLessonsDataByFilter,  //
                    par: [{id_unit: [unit.id_unit]}]
                })
            }
            
            // cosina per arrichire cosaltra
            return multiQuerysCaller(...querys) 
        })
        .then((response) => {
            
            // Add lessons on units
            for (let i = 0; i < units.length; i++) {
                let lessons = response[i].value;    // Extract data on query array 
                units[i].lessons = [];  // Declarete array prop

                //  Push lessons in its unit
                lessons.forEach(l => {
                    units[i].lessons.push({
                        name: l.name,
                        id: l.id_lesson
                    })
                });
            }
          
            // Send courses data
            res.send(units); 
        })
        .catch((err) => res.sendStatus(500)) // Server error
    })

router.route('/units/:id')

    // Update units data by id
    .put(AuthJWT.authenticateJWT, (req, res) => {
        const user = AuthJWT.parseAuthorization(req.headers.authorization)
        const {email, role} = user;
        const {id_course} = req.body;
        const id_unit = req.params.id;
        
        if (role !== "02") 
            return res.sendStatus(403);    // You aren't a prof   
            
        if (!id_course || req.body?.id_unit)
            return res.sendStatus(400);     // Bad reqest

        // Get course_id on body request
        delete req.body.id_course;

        multiQuerysCaller(
            {queryMethod: isCourseCreator, par: [email, id_course]}
        )
        .then((result) => {
            // Check if you are the creator of course
            if(result[0]?.value[0]['COUNT(*)'] == 0)
                return Promise.reject(403);    // You aren't the tutor   

            // if you are a creator check if unit belong course 
            return multiQuerysCaller({
                queryMethod: unitBelongCourse,
                par: [id_course, id_unit]
            })
        })
        .then((result) => {
            if(result[0]?.value[0]['COUNT(*)'] == 0)
                return Promise.reject(403);    // You aren't the tutor   

            // delete unit 
            return multiQuerysCaller({
                queryMethod: updateUnits,
                par: [{id_unit}, req.body]
            })
        })
        .then(() => res.sendStatus(200))
        .catch((err) => {
            console.log(err);
            if(err === 400 || err === 403) res.sendStatus(err);    // Error in parameter
            else res.sendStatus(500); // Server error
        })
    })

    // Delete units by id
    .delete(AuthJWT.authenticateJWT, (req, res) => {
        const user = AuthJWT.parseAuthorization(req.headers.authorization)
        const {email, role} = user;
        const id_unit = req.params.id;
        const {id_course} = req.body;

        if (role !== "02") 
            return res.sendStatus(403);    // You aren't a prof   
        
        multiQuerysCaller(
            {queryMethod: isCourseCreator, par: [email, id_course]}
        )
        .then((result) => {
            // Check if you are the creator of course
            if(result[0]?.value[0]['COUNT(*)'] == 0)
                return Promise.reject(403);    // You aren't the tutor   

            // if you are a creator check if unit belong course 
            return multiQuerysCaller({
                queryMethod: unitBelongCourse,
                par: [id_course, id_unit]
            })
        })
        .then((result) => {
            // 
            if(result[0]?.value[0]['COUNT(*)'] == 0)
                return Promise.reject(403);    // You aren't the tutor   

            // delete unit 
            return multiQuerysCaller({
                queryMethod: deleteUnit,
                par: [id_unit]
            })
        })
        .then(() => res.sendStatus(200))
        .catch((err) => {
            if(err === 400 || err === 403) res.sendStatus(err);    // Error in parameter
            else res.sendStatus(500); // Server error
        })
    })

module.exports = router