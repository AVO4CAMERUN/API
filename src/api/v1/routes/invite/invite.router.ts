// Invites mini-router
import * as express from "express"
import * as bodyParser from "body-parser"
import AuthJWT from "../../utils/Auth"
import { errorManagment } from "../../utils/DBErrorManagment"
import { USERROLE, TEACHERSCLASSESROLE } from ".prisma/client"
import {
    createPOST,
    createGET,
    createUPDATE,
    createDELETE,
    createCOUNT
} from "../../base/services/base.services"

// Middleware for parse http req
const router = express.Router()
    .use(bodyParser.json());

// Routers for class invites
router.route('/invites')

    // Create invites for stundents
    .post(AuthJWT.authenticateJWT, async (req, res) => {
        try {
            const { email, role } = AuthJWT.parseAuthorization(req.headers.authorization)
            const { class_id, students } = req.body;

            // Check if prof
            if (role !== USERROLE.TEACHER) return res.sendStatus(403)

            // Check is prof in class
            const flag = await Promise.allSettled([
                createCOUNT("teachers_classes", { email, id_class: class_id, role: TEACHERSCLASSESROLE.CREATOR }), // isParameterRoleInClass
                createCOUNT("teachers_classes", { email, id_class: class_id, role: TEACHERSCLASSESROLE.NORMAL })   // isParameterRoleInClass
            ])
            const isProf = flag[0]["_count"] + flag[1]["_count"]
            if (!isProf) return Promise.reject(403)

            // Check students is iterable
            if (!Array.isArray(students)) return Promise.reject(400)

            // Check class | Check students
            let checkQuerys = [createCOUNT("groupclass", { id: class_id })]  // isExistClassByid(class_id)
            for (const s of students)
                checkQuerys.push(createCOUNT("teachers_classes", { email: s, id_class: class_id, role: USERROLE.STUDENT })) // Check is student

            // Check all
            const checks: any[] = await Promise.allSettled(checkQuerys)
            const sum = checks.reduce((p, c) => p.value._count + c.value._count)
            // let sum = 0; checks.forEach(r => { sum += r.value['_count'] });
            if (sum !== checks.length) return Promise.reject(400)

            // Query array for add profs
            const queryArray = [];

            // Push student invitations if there are
            for (const s of students) queryArray.push(createPOST("invitation", { email: s, id_class: class_id })) // addClassInvite

            // Send invite | Send response
            await Promise.allSettled(queryArray)
            res.sendStatus(200)
        } catch (err) {
            errorManagment('POST invites', res, err)
        }
    })

    // Get all your invites by email
    .get(AuthJWT.authenticateJWT, async (req, res) => {
        try {
            const { email } = AuthJWT.parseAuthorization(req.headers.authorization)

            // Get own invited | Send inviteds
            const inviteds = await createGET("invitation", "*", { email }, null) // getInvitedDataByFilter
            res.send(inviteds)
        } catch (err) {
            errorManagment('GET invites', res, err)
        }
    })

router.route('/invites/:id')

    // Accept invites
    .get(AuthJWT.authenticateJWT, async (req, res) => {
        try {
            const { email } = AuthJWT.parseAuthorization(req.headers.authorization)
            const id = +req.params.id

            // Indirect call | Check class_id
            const invited = await createGET("invitation", "*", { id, email }, null) // getInvitedDataByFilter
            const id_class = invited[0].id_class;
            if (!id_class) return res.sendStatus(400);

            // Accept invitation | Delete old invitation
            await Promise.allSettled([
                createUPDATE("user", { id_class }, { email }), // acceptInvitation
                createDELETE("invitation", { id })             // deleteInvitation
            ])

            res.sendStatus(200)
        } catch (err) {
            errorManagment('GET invites/id', res, err)
        }
    })

    // Reject invites
    .delete(AuthJWT.authenticateJWT, async (req, res) => {
        try {
            const { email } = AuthJWT.parseAuthorization(req.headers.authorization)
            const id = +req.params.id;

            // Check if is
            const invitations = await createGET("invitation", "*", { id, email }, null) // getInvitedDataByFilter
            if (!invitations) return res.sendStatus(400);

            // Delete invitation
            await createDELETE("invitation", { id })
            res.sendStatus(200)
        } catch (err) {
            errorManagment('DELETE invites/id', res, err)
        }
    })

export default router