// Subscribe mini-router
import * as express from "express"
import * as bodyParser from "body-parser"
import AuthJWT from "../../utils/Auth"
import { errorManagment } from "../../utils/DBErrorManagment"
import {
    createPOST,
    createGET,
    createDELETE
} from "../../base/services/base.services"

// Middleware for parse http req
const router = express.Router()
    .use(bodyParser.json());

router.route('/subscribe')

    // Subscribe to course
    .post(AuthJWT.authenticateJWT, async (req, res) => {
        try {
            const { email } = AuthJWT.parseAuthorization(req.headers.authorization)
            const { id_course } = req.body;

            // Check if correct data
            if (!id_course) return res.sendStatus(400)

            // Subscription
            const ack = await createPOST("courses_users", { email, id_course })
            console.log(ack);

            if (!ack) return res.sendStatus(400)
            res.sendStatus(200)
        } catch (err) {
            errorManagment('POST subscribe', res, err)
        }
    })

    // Get subscribe by filter
    .get(AuthJWT.authenticateJWT, async (req, res) => {
        try {
            // Cast data for query
            for (const key of Object.keys(req.query))
                req.query[key] = JSON.parse(req.query[key].toString())

            // Fetch subscribes | Check lenght
            const subscribes = await createGET("courses_users", "*", req.query, null)
            if (!subscribes.length) return res.sendStatus(404)

            // Send subscribtions data
            res.send(subscribes)
        } catch (err) {
            errorManagment('GET subscribe', res, err)
        }
    })

    // Delete subscribe to course by id
    .delete(AuthJWT.authenticateJWT, async (req, res) => {
        try {
            const { email } = AuthJWT.parseAuthorization(req.headers.authorization)
            const { id_course } = req.body;

            // Check if correct data | Delete subscription
            if (!id_course) return res.sendStatus(400)
            const ack = await createDELETE("courses_users", {
                email_id_course: {
                    email,
                    id_course
                }
            })

            // Send responce
            res.sendStatus(200)
        } catch (err) {
            errorManagment('DELETE subscribe', res, err)
        }
    })

export default router

