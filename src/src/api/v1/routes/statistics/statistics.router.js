// Units mini-router
import express from "express";
import AuthJWT from "../../utils/Auth.js"
import { errorManagment } from "../../utils/DBErrorManagment.js"
import { addResult, getResultByFilter, delateResult } from "./statistics.services.js"

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
            .catch((err) => errorManagment('POST/ quizresult', res, err))
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
