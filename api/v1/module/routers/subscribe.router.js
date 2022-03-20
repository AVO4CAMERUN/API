// Subscribe mini-router

// Dependences
const express = require('express');

// Utils servises
const AuthJWT = require('../utils/Auth');
const Utils = require('../utils/Utils');

// Import DBservices and deconstruct function
const { 
    subscription, 
    getCoursesSubscriptionByFilter,
    delateSubscription
} = require('../DBservises/subscribe.services'); // Courseservices

const router = express.Router();    //Create router Object

router.route('/subscribe')

    // Subscribe to course
    .post(AuthJWT.authenticateJWT, (req, res) => {
        const user = AuthJWT.parseAuthorization(req.headers.authorization)
        const {email} = user;
        const {id_course} = req.body;

        if (id_course === undefined)
            return res.sendStatus(400);    // id_course is not defined

        // Subscription
        Promise.allSettled([
            subscription(email, +id_course)
        ])
        .then((result) => {
            if (result[0].status !== 'fulfilled')
                return res.sendStatus(400)
            
            res.sendStatus(200) // You are subscriptioned
        })     
        .catch(() => res.sendStatus(500)) // Server error
    })

    // Get subscribe by filter
    .get((req, res) => {

        // Cast data for query
        for (const key of Object.keys(req.query)) 
            req.query[key] = Utils.strToArray(req.query[key])

        Promise.allSettled([
            getCoursesSubscriptionByFilter(req.query)
        ])
        .then((response) => {

            if (response[0].value?.length <= 0) 
                return res.send(404)

            res.send(response[0].value)
        }) // Send subscribtions data
        .catch(() => res.sendStatus(500)) // Server error
    })
    
    // Delete subscribe to course by id
    .delete(AuthJWT.authenticateJWT, (req, res) => {
        const user = AuthJWT.parseAuthorization(req.headers.authorization)
        const {email} = user;
        const {id_course} = req.body;
  
        if (id_course === undefined)
            return res.sendStatus(400);    // id_course is not defined

        // Delete subscription
        Promise.allSettled([
            delateSubscription(email, id_course)
        ])
        .then((response) => {
            console.log(response);
            res.sendStatus(200)
        })  // ok
        .catch((err) => res.sendStatus(500)) // Server error
    })

module.exports = router

