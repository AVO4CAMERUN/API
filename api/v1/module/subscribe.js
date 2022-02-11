// Subscribe mini-router

// Utils Module
const express = require('express');

const DBS = require('./utils/DBservices');
const authJWT = require('./utils/Auth');

const router = express.Router();    //Create router Object

router.route('/subscribe')

    // Subscribe to course
    .post(authJWT.authenticateJWT, (req, res) => {
        const user = authJWT.parseAuthorization(req.headers.authorization)
        const {email} = user;
        const {id_course} = req.body;
  
        if (!id_course)
            return res.sendStatus(400);    // id_course is not defined

        DBS.genericCycleQuery({
            queryMethod: DBS.subscription,  // Subscription
            par: [email, id_course]
        })
        .then(() => {
            res.sendStatus(200);    // You are subscriptioned
        })
        .catch((err) => {
            res.sendStatus(500); // Server error
        })
    })

    // Get subscribe by filter
    .get((req, res) => {

        // Cast data for query
        for (const key of Object.keys(req.query)) 
            req.query[key] = DBS.strToArray(req.query[key])

        DBS.genericCycleQuery( {
                queryMethod: DBS.getCoursesSubscriptionByFilter,
                par: [req.query]
        })
        .then((response) => {
            res.send(response[0].value);   // Send subscribtions data
        })
        .catch((err) => {
            res.sendStatus(500); // Server error
        })
    })
    // Delete subscribe to course by id
    .delete(authJWT.authenticateJWT, (req, res) => {
        const user = authJWT.parseAuthorization(req.headers.authorization)
        const {email} = user;
        const {id_course} = req.body;
  
        if (!id_course)
            return res.sendStatus(400);    // id_course is not defined

        DBS.genericCycleQuery({
            queryMethod: DBS.delateSubscription,  // Delete subscription
            par: [email, id_course]
        })
        .then(() => {
            res.sendStatus(200);    //
        })
        .catch(() => {
            res.sendStatus(500); // Server error
        })
    })

module.exports = router

