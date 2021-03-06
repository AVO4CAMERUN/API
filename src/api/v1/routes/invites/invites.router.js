// Invites mini-router

// Dependences
import express from 'express'
import AuthJWT from '../../utils/Auth.js'
import { errorManagment } from '../../utils/DBErrorManagment.js'

// Routes Services
import {isParameterRole} from '../accounts/account.services.js'
import {isParameterRoleInClass, isExistClassByid} from '../classes/classes.services.js'
import {
    addClassInvite, 
    getInvitedDataByFilter,
    acceptInvitation, 
    deleteInvitation
} from './invites.services.js'


// Allocate obj
const router = express.Router();    //Create router Object    

// Routers for class invites
router.route('/invites')

    // Create invites for stundents
    .post(AuthJWT.authenticateJWT, (req, res) => {
        const user = AuthJWT.parseAuthorization(req.headers.authorization)
        const {email, role} = user;
        const {class_id, students} = req.body;
        
        if(role !== 'TEACHER')
            return res.sendStatus(403);    // You aren't a prof

        Promise.allSettled([
            isParameterRoleInClass(email, class_id, 'CREATOR'),
            isParameterRoleInClass(email, class_id, 'NORMAL')
        ])
        .then((result) => {
            const isProf = result[0].value['_count'] + result[1].value['_count'];

            // Check is prof in class
            if(!isProf) return Promise.reject(403);    // You aren't a prof in class

            // Check students is iterable
            if(!Array.isArray(students)) return Promise.reject(400); // Error in parameter

            // Create query for check student profile and class exist
            let checkQuerys = [];
            checkQuerys.push(isExistClassByid(class_id)) // Check class

            for (const stud of students) 
                checkQuerys.push(isParameterRole(stud, 'STUDENT')) // Check is student
            
            // Send dynamic querys
            return Promise.allSettled(checkQuerys)
        })
        .then((result) => {
            // Sum for check that all email is register users
            let sum = 0; result.forEach(r => {sum += r.value['_count'] });

            // console.log(sum, result.length);
            if(sum !== result.length)
                return Promise.reject(400); // Error in parameter

            // Query array for add profs
            const queryArray = [];
            
            // Push student invitations if there are
            for (const stud of students)
                queryArray.push(addClassInvite(stud, class_id))
            
            // Send invite for class
            return Promise.allSettled(queryArray) // Send dynamic querys
        })
        .then((ww) => res.sendStatus(200)) // You invieted students
        .catch((err) => errorManagment('POST invites', res, err)) // Server error
        
    })

    // Get all your invites by email
    .get(AuthJWT.authenticateJWT, (req, res) => {
        const user = AuthJWT.parseAuthorization(req.headers.authorization)
        const {email} = user;

        // Get own invited
        getInvitedDataByFilter({email})
            .then((invited) => res.send(invited)) // Send invites
            .catch((err) => errorManagment('GET invites', res, err)) // Server error
    })

router.route('/invites/:id')

    // Accept invites
    .get(AuthJWT.authenticateJWT, (req, res) => {
        const id = req.params.id;
        const user = AuthJWT.parseAuthorization(req.headers.authorization)
        const {email} = user;

        // Indirect call
        Promise.allSettled([
            getInvitedDataByFilter({id: +id, email})
        ])
        .then((result) => {
            const class_id = result[0].value[0]?.id_class;

            // if invited exist 
            if(class_id === undefined)
                return res.sendStatus(400); // Error in parameter

            // Accept
            return Promise.allSettled([
                acceptInvitation(class_id, email),
                deleteInvitation(+id)
            ])
        })
        .then(() => res.sendStatus(200)) // Send ok
        .catch((err) => errorManagment('GET invites/id', res, err)) // Server error
    })
    
    // Reject invites
    .delete(AuthJWT.authenticateJWT, (req, res) => {
        const id = req.params.id;
        const user = AuthJWT.parseAuthorization(req.headers.authorization)
        const {email} = user;
        
        // Indirect call
        getInvitedDataByFilter({id: +id, email})
            .then((result) => {
                // if invited exist 
                if(result === undefined)
                    res.sendStatus(400); // Error in parameter

                // Reject
                return deleteInvitation(+id)
            })
            .then(() => res.sendStatus(200)) // ok
            .catch((err) => errorManagment('DELETE invites/id', res, err)) // Server error
    })

export default router