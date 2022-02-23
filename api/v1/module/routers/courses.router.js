// Courses mini-router

// Dependences
const express = require('express');

// Utils servises
const BlobConvert = require('../utils/BlobConvert');
const AuthJWT = require('../utils/Auth');
const Utils = require('../utils/Utils');

// Import DBservices and deconstruct function
const {genericCycleQuery} = require('../DBservises/generic.service');   // GenericService
const {
    createCourse, 
    getCoursesDataByFilter, 
    isCourseCreator, 
    updateCourses, 
    delateCourse
} = require('../DBservises/courses.service'); // CourseService

const router = express.Router();    //Create router Object

router.route('/courses')

    // Create new courses 
    .post(AuthJWT.authenticateJWT, (req, res) => {
        const user = AuthJWT.parseAuthorization(req.headers.authorization)
        const {email, role} = user;
        let {name, description, img_cover, subject} = req.body;

        // 
        if (img_cover)
            img_cover = `x'${BlobConvert.base64ToHex(img_cover)}'`
          
        if (role !== "02")
            return res.sendStatus(403);    // You aren't a prof

        genericCycleQuery( 
            {
                queryMethod: createCourse,  // Create courses and save id
                par: [name, email, description, img_cover, subject]
            }
        )
        .then(() => {
            res.sendStatus(200);    // You create a your new courses
        })
        .catch((err) => {
            res.sendStatus(500); // Server error
        })
    })

    // Get courses data by filter
    .get((req, res) => {
        // Cast data for query
        for (const key of Object.keys(req.query)) 
            req.query[key] = Utils.strToArray(req.query[key])

        genericCycleQuery( 
            {
                queryMethod: getCoursesDataByFilter,
                par: [req.query]
            }
        )
        .then((response) => {
            let courseData = response[0].value;
            // Code img in base64 for send
            for (const course of courseData) 
                course['img_cover'] = BlobConvert.blobToBase64(course['img_cover']);
            
            // Send courses data
            res.send(courseData);    
        })
        .catch((err) => {
            res.sendStatus(500); // Server error
        })
    })

router.route('/courses/:id')

    // Get courses data by id
    .get((req, res) => {
        const id = req.params.id;

        // Indirect call 
        genericCycleQuery(
            {
                queryMethod: getCoursesDataByFilter,
                par: [{id_course: [id]}]
            }
        )
        .then((result) => {
            // Take the DB answer 
            let classData = result[0].value[0];
            
            // Convert img in base64
            if(result[0].value[0]){
                classData['img_cover'] = BlobConvert.blobToBase64(classData['img_cover']);
                res.send(classData)
            } else {
                res.sendStatus(404) // Not found
            }

        })
        .catch((err)=>{
            console.log(err);
            res.sendStatus(500); // Server error
        })
    })
    
    // Update courses data by id
    .put(AuthJWT.authenticateJWT, (req, res) => {
        const user = AuthJWT.parseAuthorization(req.headers.authorization)
        const {email, role} = user;
        const id_course = req.params.id;
        
        if (role !== "02") 
            return res.sendStatus(403);    // You aren't a prof

        if (req.body?.email_creator) 
            return res.sendStatus(403);  

        if (req.body?.img_cover)
            req.body.img_cover = `x'${BlobConvert.base64ToHex(req.body.img_cover)}'`
          
        genericCycleQuery(
            {
                queryMethod: isCourseCreator,
                par: [email, id_course]
            }
        )
        .then((result) => {

            // Check if you are the creator of course
            if(result[0]?.value[0]['COUNT(*)'] == 0)
                return Promise.reject(403);    // You aren't the tutor   

            // if you are a creator commit query for change course data
            return genericCycleQuery({
                queryMethod: updateCourses,
                par: [{id_course}, req.body]
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

    // Delete courses by id
    .delete(AuthJWT.authenticateJWT, (req, res) => {
        const user = AuthJWT.parseAuthorization(req.headers.authorization)
        const {email, role} = user;
        const id_course = req.params.id;
        
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
                return Promise.reject(403);    // You aren't the tutor   

            // if you are a creator commit query for delete course
            return genericCycleQuery({
                queryMethod: delateCourse,
                par: [id_course]
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