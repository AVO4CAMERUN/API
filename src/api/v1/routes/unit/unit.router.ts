// Units mini-router
import * as express from "express"
import * as bodyParser from "body-parser"
import AuthJWT from "../../utils/Auth"
import { errorManagment } from "../../utils/DBErrorManagment"
import { USERROLE } from ".prisma/client"
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

router.route('/units')

    // Create new units 
    .post(AuthJWT.authenticateJWT, async (req, res) => {
        try {
            const { email, role } = AuthJWT.parseAuthorization(req.headers.authorization)
            const { name, description, id_course } = req.body;

            // Check is prof
            if (role !== USERROLE.TEACHER) return res.sendStatus(403)

            // Check if course creator 
            const isCreator = await createCOUNT("course", { email_creator: email, id_course })
            if (!isCreator._count) return res.sendStatus(403)

            // Fetch other unit | Next seqNumber for order
            let last;
            const units = await createGET("unit", "*", { id_course }, { orderBy: { seqNumber: 'asc' } })
            if (units.length !== 0) last = units.at(-1).seqNumber + 1;
            else last = 1;

            // Create unit
            const ack = await createPOST("unit", { name, description, id_course, seqNumber: last })

            res.sendStatus(200)
        } catch (err) {
            errorManagment('POST units', res, err)
        }
    })

    // Get units
    .get(AuthJWT.authenticateJWT, async (req, res) => {
        try {
            // Cast data for query
            for (const key of Object.keys(req.query))
                req.query[key] = JSON.parse(req.query[key].toString())

            // Fetch units
            res.send(await createGET("unit", "*", req.query, { lesson: true }))
        } catch (err) {
            errorManagment('GET units', res, err)
        }
    })

router.route('/units/:id')

    // Update units data by id
    .put(AuthJWT.authenticateJWT, async (req, res) => {
        try {
            const { email, role } = AuthJWT.parseAuthorization(req.headers.authorization)
            const id_course = +req.body.id_course;
            const id_unit = req.params.id;

            // Check prof | Check correct data
            if (role !== USERROLE.TEACHER) return res.sendStatus(403)
            if (!id_course || !id_unit) return res.sendStatus(400)


            // Delete Extra data | Check if course creator 
            delete req.body.id_course;
            const isCreator = await createCOUNT("course", { email_creator: email, id_course })
            if (!isCreator._count) return Promise.reject(403)

            // Check if unit belong in course
            const isBelongCourse = await createCOUNT("unit", { id_course, id_unit })  // unitBelongCourse
            if (!isBelongCourse._count) return Promise.reject(403)

            // Update unit | Send new data
            res.send(await createUPDATE("unit", req.body, { id_unit }))

        } catch (err) {
            errorManagment('PUT units/id', res, err)
        }
    })

    // Delete units by id
    .delete(AuthJWT.authenticateJWT, async (req, res) => {
        try {
            const { email, role } = AuthJWT.parseAuthorization(req.headers.authorization)
            const id_course = +req.body.id_course;
            const id_unit = req.params.id;

            // Check prof
            if (role !== USERROLE.TEACHER) return res.sendStatus(403)

            // Delete Extra data | Check if course creator 
            delete req.body.id_course;
            const isCreator = await createCOUNT("course", { email_creator: email, id_course })
            if (!isCreator._count) return Promise.reject(403)

            // Check if unit belong in course
            const isBelongCourse = await createCOUNT("unit", { id_course, id_unit })  // unitBelongCourse
            if (!isBelongCourse._count) return Promise.reject(403)


            // Fetch all units to sort
            const units = await createGET("unit", "*", { id_course }, { orderBy: { seqNumber: 'asc' } })
            const breakPoint = units.findIndex(unit => unit.id_unit === id_unit)

            // Delete unit
            const ack = await createDELETE("unit", { id_unit })

            // Update seqNumber scale one
            for (let i = breakPoint + 1; i < units.length; i++) {
                const id = units[i].id_unit;
                const seqNumber = units[i].seqNumber - 1
                await createUPDATE("unit", { seqNumber }, { id_unit: id })
            }

            res.sendStatus(200)
        } catch (err) {
            errorManagment('DELETE units/id', res, err)
        }
    })

export default router