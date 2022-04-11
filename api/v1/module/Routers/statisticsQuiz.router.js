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
        const {id_lesson, numCorrect, numWrong} = req.body

        // Add result
        addResult(id_lesson, email, numCorrect, numWrong)
            .then(() => res.sendStatus(200)) // Ok
            .catch((err) => {
                errorManagment('POST/ quizresult', err) 
                res.sendStatus(500) 
            })
    })

    // Get quiz result 
    .get(AuthJWT.authenticateJWT, (req, res) => {
        const user = AuthJWT.parseAuthorization(req.headers.authorization)
        const { email } = user;

        // Professore i dati dei suo corsi o classi (da decidere)
        // Student i propri dati 
        getResultByFilter()
    })

router.route('/quizresult/:id')

    // Delete
    .delete(AuthJWT.authenticateJWT, (req, res) => {

        // Penso mai solo per evitare il sovraccarico
        // ma non da esporre come api
        delateResult()
    })

module.exports = router