// Courses mini-router
import * as express from "express"
import * as bodyParser from "body-parser"
import AuthJWT from "../../utils/Auth"
import BlobConvert from "../../utils/BlobConvert"
import { errorManagment } from "../../utils/DBErrorManagment"
import { USERROLE, COURSESUBJECT } from ".prisma/client"
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

router.route("/courses")

    // Create courses
    .post(AuthJWT.authenticateJWT, async (req, res) => {
        try {
            // Extract data
            const { email, role } = AuthJWT.parseAuthorization(req.headers.authorization)
            const { img_cover } = req.body;

            console.log(email, role)
            
            // Check id you are prof | Cast img
            if (USERROLE.TEACHER !== role) return res.sendStatus(403)
            if (!img_cover) req.body.img_cover = BlobConvert.base64ToBlob(img_cover)
            
            // Create courses | Send responce
            // { name, email, description, img_cover: cover, subject }
            const ack = await createPOST("course", { ...req.body, email_creator: email})
            res.sendStatus(200)
        } catch (err) {
            errorManagment("POST courses", res, err)
        }
    })

    // ERRORE
    // Get courses
    .get(AuthJWT.authenticateJWT, async (req, res) => {
        try {
            // Cast data for query
            for (const key of Object.keys(req.query))
                req.query[key] = JSON.parse(req.query[key].toString())

            // Fetch courses | Check is it 
            const courses = await createGET('course', ['*'], req.query, null)
            console.log(courses)
            
            if (!Array.isArray(courses)) return res.sendStatus(404);

            // Cast img base64
            for (const course of courses)
                course.img_cover = BlobConvert.blobToBase64(course.img_cover)

            // Send courses data   
            res.send(courses);
        } catch (err) {
            errorManagment("GET courses", res, err)
        }
    })

router.route("/courses/:id")

    // Update courses
    .put(AuthJWT.authenticateJWT, async (req, res) => {
        try {
            const { email, role } = AuthJWT.parseAuthorization(req.headers.authorization)
            const courseID = +req.params.id;

            // Check if is prof | Bad request
            if (role !== USERROLE.TEACHER) return res.sendStatus(403)
            if (req.body?.email_creator) return res.sendStatus(403)

            // Cast input img
            if (!req.body?.img_cover)
                req.body.img_cover = BlobConvert.base64ToBlob(req.body.img_cover)

            // Check if course creator
            const isCreator = await createCOUNT("course", { email_creator: email, id_course: courseID })
            if (!isCreator._count) return Promise.reject(403);

            // Update course | Cast response img
            const newCourse = await createUPDATE("course", req.body, {id_course: courseID})
            newCourse.img_cover = BlobConvert.blobToBase64(newCourse.img_cover)

            res.send(newCourse)
        } catch (err) {
            errorManagment("PUT courses/id", res, err)
        }
    })

    // Delete courses
    .delete(AuthJWT.authenticateJWT, async (req, res) => {
        try {
            const { email, role } = AuthJWT.parseAuthorization(req.headers.authorization)
            const id_course = +req.params.id;

            // Check prof 
            if (role !== USERROLE.TEACHER) return res.sendStatus(403)  

            // Check if course creator
            const isCreator = await createCOUNT("course", { email_creator: email, id_course })
            if (!isCreator._count) return Promise.reject(403) 

            // Delete course
            const ack = await createDELETE("course", { id_course })
            res.sendStatus(200)
        } catch (err) {
            errorManagment("DELETE courses/id", res, err)
        }
    })

router.route("/courses/subject")

    // Get possible subject for courses
    .get((req, res) => {
        // Extract subject
        const subjects = []
        for (const subject in COURSESUBJECT) subjects.push(subject)
        res.send(subjects)
    })

export default router