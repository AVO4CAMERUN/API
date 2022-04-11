// Courses mini-router

// Dependences
const express = require('express');

// Utils servises
const BlobConvert = require('../utils/BlobConvert');
const AuthJWT = require('../utils/Auth');
const { errorManagment } = require('../Utils/DBErrorManagment');
const Validator = require('../Validators/courses.validator');

// Import DBservices and deconstruct function
const {
    createCourse, 
    getCoursesDataByFilter, 
    getCoursesSubject,
    isCourseCreator, 
    updateCourses, 
    delateCourse,
} = require('../DBservises/courses.services'); // Courseservices

// Allocate obj
const router = express.Router();    //Create router Object

router.route('/courses')

    // Create new courses
    .post(AuthJWT.authenticateJWT, Validator.postCourses, (req, res) => {
        const user = AuthJWT.parseAuthorization(req.headers.authorization)
        const { email, role } = user;
        const { name, description, subject } = req.body;
        let { img_cover } = req.body;

        if (role !== 'TEACHER')
            return res.sendStatus(403);    // You aren't a prof

        if (img_cover !== undefined) 
            img_cover = BlobConvert.base64ToBlob(img_cover)
        
        createCourse(name, email, description, img_cover, subject)     // Create courses and save id
            .then((result) => res.sendStatus(200))                     // You create a your new courses
            .catch((err) => errorManagment('POST courses', res, err))  // Server error
    })

    // Get courses data by filter
    .get(AuthJWT.authenticateJWT, (req, res) => {

        // Cast data for query
        for (const key of Object.keys(req.query)) 
            req.query[key] = JSON.parse(req.query[key])

        getCoursesDataByFilter(req.query)
            .then((courses) => {
                // Code img in base64 for send
                if (Array.isArray(courses)) 
                    for (const course of courses)
                        course['img_cover'] = BlobConvert.blobToBase64(course['img_cover']);
                else return res.sendStatus(404); // Courses data not found

                res.send(courses); // Send courses data   
            })
            .catch((err) => errorManagment('GET courses', res, err)) // Server error
    })

router.route('/courses/:id')
    
    // Update courses data by id
    .put(AuthJWT.authenticateJWT, Validator.putCourses, (req, res) => {
        const user = AuthJWT.parseAuthorization(req.headers.authorization)
        const {email, role} = user;
        const id_course = req.params.id;
        
        if (role !== 'TEACHER') return res.sendStatus(403);    // You aren't a prof
        if (req.body?.email_creator) return res.sendStatus(403);  

        if (req.body?.img_cover)
            req.body.img_cover = BlobConvert.base64ToBlob(req.body.img_cover)

        
        isCourseCreator(email, +id_course)
            .then((result) => {
                // Check if you are the creator of course
                if(result['_count'] !== 1)
                    return Promise.reject(403);    // You aren't the tutor   

                // if you are a creator commit query for change course data
                return updateCourses(+id_course, req.body)    
            })
            .then((newData) =>  {
                newData.img_cover = BlobConvert.blobToBase64(newData.img_cover)
                res.send(newData) // Ok
            })
            .catch((err) => errorManagment('PUT courses/id', res, err)) // Server error
    })

    // Delete courses by id
    .delete(AuthJWT.authenticateJWT, (req, res) => {
        const user = AuthJWT.parseAuthorization(req.headers.authorization)
        const {email, role} = user;
        const id_course = req.params.id;
        
        if (role !== 'TEACHER') 
            return res.sendStatus(403);    // You aren't a prof   

        
        isCourseCreator(email, +id_course)
            .then((result) => {

                // Check if you are the creator of course
                if(result['_count'] !== 1)
                    return Promise.reject(403);    // You aren't the tutor   

                // if you are a creator commit query for delete course
                return delateCourse(+id_course)
            })
            .then(() => res.sendStatus(200))
            .catch((err) => errorManagment('DELETE courses/id', res, err)) // Server error
    })

router.route('/courses/subject')

    // Get possible subject for courses
    .get((req, res) => {
        getCoursesSubject()
            .then((subjects) => res.send(subjects)) // Ok
            .catch((err) => errorManagment('GET courses/subject', res, err)) // Server error
    })

module.exports = router