// Units mini-router

// Dependences
const express = require('express');

// Utils servises
const AuthJWT = require('../utils/Auth');
const { errorManagment } = require('../Utils/DBErrorManagment');

// Import DBservices and deconstruct function
const { 
    addResult,
    getResultByFilter,
    delateResult
} = require('../DBservises/statisticsQuiz.services'); // statisticsQuiz services
const router = express.Router();

router.route('/quizresult')

    // Create quiz result 
    .post(AuthJWT.authenticateJWT, (req, res) => {
        const user = AuthJWT.parseAuthorization(req.headers.authorization)
        const { email } = user;
        const {} = req.body


        addResult()
            .then((result) => {
                // Check if you are the creator of course
                if(result['_count'] !== 1)
                    return Promise.reject(403);    // You aren't the creator
                
                // if you are a creator
                return createUnit(name, description, +id_course) 
            })
            .then(() => res.sendStatus(200)) // Ok
            .catch((err) => {
                console.log(err);
                if(err === 400 || err === 403) res.sendStatus(err)  // Error in parameter
                else {
                    errorManagment('POST/ quizresult', err) 
                    res.sendStatus(500) 
                } // Server error
            })
    })

    // Get
    .get(AuthJWT.authenticateJWT, (req, res) => {})

router.route('/')

    // Update
    .put(AuthJWT.authenticateJWT, (req, res) => {})

    // Delete
    .delete(AuthJWT.authenticateJWT, (req, res) => {})

module.exports = router