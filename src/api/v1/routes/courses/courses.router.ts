// Courses mini-router
import * as express from "express"
import * as bodyParser from "body-parser"
import AuthJWT from "../../utils/Auth"
import BlobConvert from "../..//utils/BlobConvert"
import { errorManagment } from "../../utils/DBErrorManagment"

import {
    createCourse,
    getCoursesDataByFilter,
    getCoursesSubject,
    isCourseCreator,
    updateCourses,
    delateCourse,
} from "./courses.services"
import { USERROLE } from ".prisma/client"

// Allocate obj
const router = express.Router()
    .use(bodyParser.json())

router.route("/courses")

    // Create new courses
    .post(AuthJWT.authenticateJWT, async (req, res) => {
        try {
            // Extract data
            const { email, role } = AuthJWT.parseAuthorization(req.headers.authorization)
            const { name, description, subject } = req.body;
            let { cover } = req.body;

            // Check id you are prof | Cast img
            if (USERROLE.TEACHER !== role) return res.sendStatus(403)
            if (!cover) cover = BlobConvert.base64ToBlob(cover)

            // Create courses | Send responce
            const ack = await createCourse({ name, email, description, img_cover: cover, subject })
            res.sendStatus(200)

        } catch (err) {
            errorManagment("POST courses", res, err)
        }
    })

    // Get courses data by filter
    .get(AuthJWT.authenticateJWT, async (req, res) => {
        try {
            // Cast data for query
            for (const key of Object.keys(req.query))
                req.query[key] = JSON.parse(req.query[key])

            // Fetch courses | Check is it 
            const courses = await getCoursesDataByFilter(req.query)
            if (!Array.isArray(courses)) return res.sendStatus(404);

            // Cast img base64
            for (const course of courses)
                course["img_cover"] = BlobConvert.blobToBase64(course["img_cover"]);

            // Send courses data   
            res.send(courses); 
        } catch (err) {
            errorManagment("GET courses", res, err)
        }
    })
    // rirpendere da qui
router.route("/courses/:id")

    // Update courses data by id
    .put(AuthJWT.authenticateJWT, (req, res) => {
        const user = AuthJWT.parseAuthorization(req.headers.authorization)
        const { email, role } = user;
        const id_course = req.params.id;

        if (role !== "TEACHER") return res.sendStatus(403);    // You aren"t a prof
        if (req.body?.email_creator) return res.sendStatus(403);

        if (req.body?.img_cover !== undefined)
            req.body.img_cover = BlobConvert.base64ToBlob(req.body.img_cover)

        isCourseCreator(email, +id_course)
            .then((result) => {
                // Check if you are the creator of course
                if (result["_count"] !== 1)
                    return Promise.reject(403);    // You aren"t the tutor   

                // if you are a creator commit query for change course data
                return updateCourses(+id_course, req.body)
            })
            .then((newData) => {
                newData.img_cover = BlobConvert.blobToBase64(newData.img_cover)
                res.send(newData) // Ok
            })
            .catch((err) => errorManagment("PUT courses/id", res, err)) // Server error
    })

    // Delete courses by id
    .delete(AuthJWT.authenticateJWT, (req, res) => {
        const user = AuthJWT.parseAuthorization(req.headers.authorization)
        const { email, role } = user;
        const id_course = req.params.id;

        if (role !== "TEACHER")
            return res.sendStatus(403);    // You aren"t a prof   


        isCourseCreator(email, +id_course)
            .then((result) => {

                // Check if you are the creator of course
                if (result["_count"] !== 1)
                    return Promise.reject(403);    // You aren"t the tutor   

                // if you are a creator commit query for delete course
                return delateCourse(+id_course)
            })
            .then(() => res.sendStatus(200))
            .catch((err) => errorManagment("DELETE courses/id", res, err)) // Server error
    })

router.route("/courses/subject")    // ad rifare con prisma

    // Get possible subject for courses
    .get((req, res) => {
        getCoursesSubject()
            .then((subjects) => res.send(subjects)) // Ok
            .catch((err) => errorManagment("GET courses/subject", res, err)) // Server error
    })

export default router