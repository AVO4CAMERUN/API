// Lessons mini-router
import express from 'express'

// Utils Servises
import AuthJWT from '../../utils/Auth.js'
import { errorManagment } from '../../utils/DBErrorManagment.js'

// Route Services   
import { isCourseCreator } from '../courses/courses.services.js'
import { unitBelongCourse } from '../units/units.services.js'
import {
    createLesson, 
    updateLessons,
    lessonBelongUnit,
    getLessonsDataByFilter,
    deleteLessons
} from './lessons.services.js'

// Allocate obj
const router = express.Router();

router.route('/lessons')

    // Create new lessons 
    .post(AuthJWT.authenticateJWT, (req, res) => {
        const user = AuthJWT.parseAuthorization(req.headers.authorization)
        const {email, role} = user;
        const {name, link_video, quiz, id_course, id_unit} = req.body;

        if (role !== 'TEACHER') 
            return res.sendStatus(403);    // You aren't a prof

        isCourseCreator(email, +id_course)
            .then((result) => {
                // Check if you are the creator of course
                if(result['_count'] !== 1)
                    return Promise.reject(403);    // You aren't the creator 

                // if you are a creator check if unit belong course 
                return unitBelongCourse(+id_course, +id_unit)
            })
            .then((result) => {
                if(result['_count'] !== 1)
                    return Promise.reject(403);    // Unit in not belong in course 

                // delete unit 
                return createLesson(+id_unit, name, link_video, quiz) // aggiungere data
            })
            .then(() => res.sendStatus(200))
            .catch((err) => errorManagment('POST lessons', res, err))
    })

    // Get courses data by filter
    .get(AuthJWT.authenticateJWT, (req, res) => {
        // Cast data for query
        for (const key of Object.keys(req.query)) 
            req.query[key] = JSON.parse(req.query[key])

        // Query
        getLessonsDataByFilter(req.query)
            .then((response) => res.send(response))  // Send lessons data
            .catch((err) => errorManagment('GET lessons', res, err))  // Server error
    })

router.route('/lessons/:id')
    
    // Update lessons data by id
    .put(AuthJWT.authenticateJWT, (req, res) => {
        const user = AuthJWT.parseAuthorization(req.headers.authorization)
        const {email, role} = user;

        if (role !== 'TEACHER') 
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

        isCourseCreator(email, id_course)
            .then((result) => {
                // Check if you are the creator of course
                if(result['_count'] !== 1)
                    return Promise.reject(403);    // You aren't the creator 

                // if you are a creator check if unit belong course and lesson belong in unit
                return Promise.allSettled([
                    unitBelongCourse(+id_course, +id_unit),
                    lessonBelongUnit(+id_unit, +id_lesson)
                ])
            })
            .then((result) => {
                console.log(result);
                if(result[0]?.value['_count'] == 0 || result[1]?.value['_count'] == 0)
                    return Promise.reject(403);    //   

                // Delete unit
                return updateLessons(+id_lesson, req.body)
            })
            .then((newData) =>  res.send(newData)) // Ok
            .catch((err) => errorManagment('PUT lessons/id', res, err)) // Server error
    })

    // Delete lessons by id
    .delete(AuthJWT.authenticateJWT, (req, res) => {
        const user = AuthJWT.parseAuthorization(req.headers.authorization)
        const {email, role} = user;
        
        if (role !== 'TEACHER') 
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

        isCourseCreator(email, +id_course)
            .then((result) => {
                // Check if you are the creator of course
                if(result[0]?.value[0]['_count'] == 0)
                    return Promise.reject(403);    // You aren't the creator 

                // if you are a creator check if unit belong course and lesson belong in unit
                return Promise.allSettled([
                    unitBelongCourse(+id_course, +id_unit),
                    lessonBelongUnit(+id_unit, +id_lesson)
                ])
            })
            .then((result) => {
                if(result[0]?.value['_count'] == 0 || result[1]?.value['_count'] == 0)
                    return Promise.reject(403);    // 

                // delete unit 
                return deleteLessons(+id_lesson, +id_unit)
            })
            .then(() => res.sendStatus(200)) // ok
            .catch((err) => errorManagment('DELETE lessons/id', res, err))// Server error
    })

export default router