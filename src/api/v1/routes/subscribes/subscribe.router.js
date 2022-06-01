// Subscribe mini-router
import express from 'express'
import AuthJWT from '../../utils/Auth.js'
import { errorManagment } from '../../utils/DBErrorManagment.js'
import { 
    subscription, 
    getCoursesSubscriptionByFilter,
    deleteSubscription
} from './subscribe.services.js'

const router = express.Router()

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
        .catch((err) => errorManagment('POST subscribe', res, err)) // Server error
    })

    // Get subscribe by filter
    .get(AuthJWT.authenticateJWT, (req, res) => {

        // Cast data for query
        for (const key of Object.keys(req.query)) 
            req.query[key] = JSON.parse(req.query[key])

        getCoursesSubscriptionByFilter(req.query)
            .then((response) => {
                if (response.length <= 0) 
                    return res.sendStatus(404)

                // Send subscribtions data
                res.send(response)
            }) 
            .catch((err) => errorManagment('GET subscribe', res, err)) // Server error
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
            deleteSubscription(email, id_course)
        ])
        .then((response) => {
            console.log(response);
            res.sendStatus(200)
        })  // ok
        .catch((err) => errorManagment('DELETE subscribe', res, err)) // Server error
    })

export default router

