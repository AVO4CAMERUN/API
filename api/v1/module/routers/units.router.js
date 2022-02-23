// Units mini-router

// Utils Module
const express = require('express');
const DBS = require('../utils/DBservices');
const authJWT = require('../utils/Auth');

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

    // Get units data by filter (id corso)  // solo se sei iscritto -- cosa marginale
    .get((req, res) => {
        let units;  // detto dalla fidanzatina

        // Cast data for query
        for (const key of Object.keys(req.query)) 
            req.query[key] = DBS.strToArray(req.query[key])

        DBS.genericCycleQuery({
            queryMethod: DBS.getUnitsDataByFilter,
            par: [req.query]
        })
        .then((response) => {
            units = response[0].value;
            
            // Make querys
            let querys = [];
            for (const unit of units){
                querys.push({
                    queryMethod: DBS.getLessonsDataByFilter,  //
                    par: [{id_unit: [unit.id_unit]}]
                })
            }
            
            // cosina per arrichire cosaltra
            return DBS.genericCycleQuery(...querys) 
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
        .catch((err) => {
            console.log(err);
            res.sendStatus(500); // Server error
        })
    })

router.route('/units/:id')

    // Update units data by id
    .put(authJWT.authenticateJWT, (req, res) => {
        
        const user = authJWT.parseAuthorization(req.headers.authorization)
        const {email, role} = user;
        const {id_course} = req.body;
        const id_unit = req.params.id;
        
        if (role !== "02") 
            return res.sendStatus(403);    // You aren't a prof   
            
        if (!id_course || req.body?.id_unit)
            return res.sendStatus(400);     // Bad reqest

        // Get course_id on body request
        delete req.body.id_course;

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
                queryMethod: DBS.updateUnits,
                par: [{id_unit}, req.body]
            })
        })
        .then(() => {
            res.sendStatus(200);
        })
        .catch((err) => {
            console.log(err);
            if(err === 400 || err === 403)
                res.sendStatus(err);    // Error in parameter
            else 
                res.sendStatus(500); // Server error
        })
    })

    // Delete units by id
    .delete(authJWT.authenticateJWT, (req, res) => {
        const user = authJWT.parseAuthorization(req.headers.authorization)
        const {email, role} = user;
        const id_unit = req.params.id;
        const {id_course} = req.body;

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