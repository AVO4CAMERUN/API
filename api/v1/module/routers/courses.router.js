// Courses mini-router

// Dependences
const express = require('express');

// Utils servises
const BlobConvert = require('../utils/BlobConvert');
const AuthJWT = require('../utils/Auth');
const Utils = require('../utils/Utils');
const { errorManagment } = require('../Utils/DBErrorManagment');

// Import DBservices and deconstruct function
const {
    createCourse, 
    getCoursesDataByFilter, 
    isCourseCreator, 
    updateCourses, 
    delateCourse
} = require('../DBservises/courses.services'); // Courseservices

// Allocate obj
const router = express.Router();    //Create router Object

router.route('/courses')

    // Create new courses
    .post(AuthJWT.authenticateJWT, (req, res) => {
        const user = AuthJWT.parseAuthorization(req.headers.authorization)
        const { email, role } = user;
        const { name, description, subject } = req.body;
        let { img_cover } = req.body;

        // 
        if (img_cover !== undefined) 
            img_cover = BlobConvert.base64ToBlob(img_cover)
          
        if (role !== 'TEACHER')
            return res.sendStatus(403);    // You aren't a prof
        
        createCourse(name, email, description, img_cover, subject) // Create courses and save id
            .then((result) => {
                console.log(result);
                res.sendStatus(200);    // You create a your new courses
            })
            .catch((err) => {
                errorManagment('courses', err)
                res.sendStatus(500) // Server error
            }) // Server error
    })

    // Get courses data by filter
    .get(AuthJWT.authenticateJWT, (req, res) => {

        // Cast data for query
        for (const key of Object.keys(req.query)) 
            req.query[key] = Utils.strToArray(req.query[key])

        Promise.allSettled([
            getCoursesDataByFilter(req.query)
        ])
        .then((response) => {
            let courses = response[0].value;

            // Code img in base64 for send
            if (Array.isArray(courses)) 
                for (const course of courses)
                    course['img_cover'] = BlobConvert.blobToBase64(course['img_cover']);
            else 
                return res.sendStatus(404); // Courses data not found

            res.send(courses); // Send courses data   
        })
        .catch((err) => {
            errorManagment('courses', err)
            res.sendStatus(500)
        }) // Server error
    })

router.route('/courses/:id')
    
    // Update courses data by id
    .put(AuthJWT.authenticateJWT, (req, res) => {
        const user = AuthJWT.parseAuthorization(req.headers.authorization)
        const {email, role} = user;
        const id_course = req.params.id;
        
        if (role !== 'TEACHER')
            return res.sendStatus(403);    // You aren't a prof

        if (req.body?.email_creator)
            return res.sendStatus(403);  

        if (req.body?.img_cover)
            req.body.img_cover = BlobConvert.base64ToBlob(req.body.img_cover)

        Promise.allSettled([
            isCourseCreator(email, +id_course)
        ])
        .then((result) => {
            // Check if you are the creator of course
            if(result[0]?.value['_count'] !== 1)
                return Promise.reject(403);    // You aren't the tutor   

            // if you are a creator commit query for change course data
            return Promise.allSettled([
                updateCourses(+id_course, req.body)
            ])   
        })
        .then((result) => res.sendStatus(200))
        .catch((err) => {
            errorManagment('courses', err)
            if(err === 400 || err === 403) res.sendStatus(err)    // Error in parameter
            else res.sendStatus(500) // Server error
        }) // Server error
    })

    // Delete courses by id
    .delete(AuthJWT.authenticateJWT, (req, res) => {
        const user = AuthJWT.parseAuthorization(req.headers.authorization)
        const {email, role} = user;
        const id_course = req.params.id;
        
        if (role !== 'TEACHER') 
            return res.sendStatus(403);    // You aren't a prof   

        Promise.allSettled([
            isCourseCreator(email, +id_course)
        ])
        .then((result) => {

            // Check if you are the creator of course
            if(result[0]?.value['_count'] !== 1)
                return Promise.reject(403);    // You aren't the tutor   

            // if you are a creator commit query for delete course
            return Promise.allSettled([
                delateCourse(+id_course)
            ])
        })
        .then(() => res.sendStatus(200))
        .catch((err) => {
            errorManagment('courses', err)
            if(err === 400 || err === 403) res.sendStatus(err)    // Error in parameter
            else res.sendStatus(500) // Server error
        }) // Server error
    })

module.exports = router