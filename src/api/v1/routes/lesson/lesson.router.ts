// Lessons mini-router
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

router.route('/lessons')

    // Create new lessons 
    .post(AuthJWT.authenticateJWT, async (req, res) => {
        try {
            const { email, role } = AuthJWT.parseAuthorization(req.headers.authorization)
            const { name, link_video, quiz, id_course, id_unit } = req.body;

            // Check if prof
            if (role !== USERROLE.TEACHER) return res.sendStatus(403)

            // Delete Extra data | Check if course creator 
            const isCreator = await createCOUNT("course", { email_creator: email, id_course })
            if (!isCreator._count) return res.sendStatus(403)

            // Check if unit belong in course
            const isBelongCourse = await createCOUNT("unit", { id_course, id_unit })  // unitBelongCourse
            if (!isBelongCourse._count) return res.sendStatus(403)

            // Fetch lesson
            const lessons = await createGET("lesson", "*", { id_unit }, { orderBy: { seqNumber: 'asc' } })

            // Next lesson in unit with seqNumber for order
            let last;
            if (lessons.length !== 0) last = lessons.at(-1).seqNumber + 1;
            else last = 1;

            // Create lesson
            const ack = await createPOST("lesson", { id_unit, name, link_video, quiz, seqNumber: last })
            res.sendStatus(200)
        } catch (err) {
            errorManagment('POST lessons', res, err)
        }
    })

    // Get courses data by filter
    .get(AuthJWT.authenticateJWT, async (req, res) => {
        try {
            // Cast data for query
            for (const key of Object.keys(req.query))
                req.query[key] = JSON.parse(req.query[key].toString())

            // Fetch lessons | Response lessons
            res.send(await createGET("lesson", "*", req.query, null))
        } catch (err) {
            errorManagment('GET lessons', res, err)
        }
    })

router.route('/lessons/:id')

    // Update lessons data by id
    .put(AuthJWT.authenticateJWT, async (req, res) => {
        try {
            // Check if prof
            const { email, role } = AuthJWT.parseAuthorization(req.headers.authorization)
            if (role !== USERROLE.TEACHER) return res.sendStatus(403)

            // Extract data and cast
            const id_lesson = +req.params.id;
            const id_course = +req.body.id_course;
            const id_unit = +req.body.id_unit;

            // Check data
            if (isNaN(id_course) || isNaN(id_unit) || isNaN(id_lesson))
                return res.sendStatus(400);

            // Delate utils data
            delete req.body.id_course;
            delete req.body.id_unit;

            // Delete Extra data | Check if course creator 
            const isCreator = await createCOUNT("course", { email_creator: email, id_course })
            if (!isCreator._count) return res.sendStatus(403)

            // Check if unit belong in course || Check if lesson elong in unit
            const [isBelongCourse, isBelongLesson] = await Promise.allSettled([
                createCOUNT("unit", { id_course, id_unit }),    // unitBelongCourse
                createCOUNT("lesson", { id_lesson, id_unit }),  // lessonBelongUnit
            ])
            if (!isBelongCourse["_count"]) return res.sendStatus(403)
            if (!isBelongLesson["_count"]) return res.sendStatus(403)

            // Update lesson | Send new data
            res.send(await createUPDATE("lesson", req.body, { id_lesson }))
        } catch (err) {
            errorManagment('PUT lessons/id', res, err)
        }
    })

    // Delete lessons by id
    .delete(AuthJWT.authenticateJWT, async (req, res) => {
        try {
            // Check if prof
            const { email, role } = AuthJWT.parseAuthorization(req.headers.authorization)
            if (role !== USERROLE.TEACHER) return res.sendStatus(403)

            // Extract data and cast
            const id_lesson = +req.params.id;
            const id_course = +req.body.id_course;
            const id_unit = +req.body.id_unit;

            // Check data
            if (isNaN(id_course) || isNaN(id_unit) || isNaN(id_lesson))
                return res.sendStatus(400);

            // Delate utils data
            delete req.body.id_course;
            delete req.body.id_unit;

            // Delete Extra data | Check if course creator 
            const isCreator = await createCOUNT("course", { email_creator: email, id_course })
            if (!isCreator._count) return res.sendStatus(403)

            // Check if unit belong in course || Check if lesson elong in unit
            const [isBelongCourse, isBelongLesson] = await Promise.allSettled([
                createCOUNT("unit", { id_course, id_unit }),    // unitBelongCourse
                createCOUNT("lesson", { id_lesson, id_unit }),  // lessonBelongUnit
            ])
            if (!isBelongCourse["_count"]) return res.sendStatus(403)
            if (!isBelongLesson["_count"]) return res.sendStatus(403)

            // Fetch lesson | Find break index || Delete 
            const lessons = await createGET("lesson", "*", { id_unit }, { orderBy: { seqNumber: 'asc' } })
            const breakPoint = lessons.findIndex(lesson => lesson.id_lesson === id_lesson)
            const ack = await createDELETE("lesson", { id_lesson, id_unit })
    
            // Update seqNumber scale one
            for (let i = breakPoint + 1; i < lessons.length; i++) {
                const id = lessons[i].id_lesson;
                const seqNumber = lessons[i].seqNumber - 1
                createUPDATE("lesson", { seqNumber }, { id_lesson: id })
            }

            res.sendStatus(ack)
        } catch (err) {
            errorManagment('DELETE lessons/id', res, err)
        }
    })

export default router