// Subscribe mini-router

// Dependences
const express = require('express');

// Utils servises
const AuthJWT = require('../utils/Auth');
const Utils = require('../utils/Utils');

// Import DBservices and deconstruct function
const {genericCycleQuery} = require('../DBservises/generic.service');   // GenericService
const { 
    subscription, 
    getCoursesSubscriptionByFilter,
    delateSubscription
} = require('../DBservises/subscribe.service'); // CourseService

const router = express.Router();    //Create router Object

router.route('/subscribe')

    // Subscribe to course
    .post(AuthJWT.authenticateJWT, (req, res) => {
        const user = AuthJWT.parseAuthorization(req.headers.authorization)
        const {email} = user;
        const {id_course} = req.body;
  
        if (!id_course)
            return res.sendStatus(400);    // id_course is not defined

        genericCycleQuery({
            queryMethod: subscription,  // Subscription
            par: [email, id_course]
        })
        .then(() => res.sendStatus(200))     // You are subscriptioned
        .catch(() => res.sendStatus(500)) // Server error
    })

    // Get subscribe by filter
    .get((req, res) => {

        // Cast data for query
        for (const key of Object.keys(req.query)) 
            req.query[key] = Utils.strToArray(req.query[key])

        genericCycleQuery( {
                queryMethod: getCoursesSubscriptionByFilter,
                par: [req.query]
        })
        .then((response) => res.send(response[0].value)) // Send subscribtions data
        .catch(() => res.sendStatus(500)) // Server error
    })
    
    // Delete subscribe to course by id
    .delete(AuthJWT.authenticateJWT, (req, res) => {
        const user = AuthJWT.parseAuthorization(req.headers.authorization)
        const {email} = user;
        const {id_course} = req.body;
  
        if (!id_course)
            return res.sendStatus(400);    // id_course is not defined

        genericCycleQuery({
            queryMethod: delateSubscription,  // Delete subscription
            par: [email, id_course]
        })
        .then(() => res.sendStatus(200))  // ok
        .catch(() => res.sendStatus(500)) // Server error
    })

module.exports = router

