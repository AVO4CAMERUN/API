// Classes mini-router
import * as express from "express"
import * as bodyParser from "body-parser"
import BlobConvert from "../../utils/BlobConvert"
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

// Function for resolve multi query in array on array structure
const resolve = async (arrays) => {
    let r = []
    // [ {teachers: [...]} {students: [...]} ...]
    for (const objClassPeople of arrays) {
        r.push({
            teachers: await objClassPeople.teachers,
            students: await objClassPeople.students
        })
    }
    return r
}
// Function for formatter teacher user data
const teacherFormatter = (teachers) => {
    let t = teachers
    for (let k = 0; k < t.length; k++) {
        // Delete usless data
        delete t[k].user.password  //
        delete t[k].user.role      //
        delete t[k].id_class        //

        // Flat obj in top levet
        const obj = t[k].user
        for (const key in obj) t[k][key] = obj[key];
        delete t[k].user;

        // Cast img
        t[k].img_profile = BlobConvert.blobToBase64(teachers[k].img_profile);
    }
    return t
}

// Function for formatter user user data
const userFormatter = (users) => {
    for (const user of users)
        user.img_profile = BlobConvert.blobToBase64(user.img_profile);
    return users
}

// Routers for classes
router.route('/classes')

    // Create class
    .post(AuthJWT.authenticateJWT, async (req, res) => {
        try {
            const user = AuthJWT.parseAuthorization(req.headers.authorization)
            const { email, role } = user;
            let { name, img_cover, students, teachers } = req.body;

            // Check if prof | Cast img | Check input
            if (role !== USERROLE.TEACHER) return res.sendStatus(403)
            if (!img_cover) img_cover = BlobConvert.base64ToBlob(img_cover)
            if (!teachers) teachers = []
            if (!students) students = []

            // Create checkers (isParameterRole)
            let checkQuerys = [];
            for (const t of teachers) createCOUNT("user", { email: t, role: USERROLE.TEACHER })
            for (const s of students) createCOUNT("user", { email: s, role: USERROLE.STUDENT })

            // Check is professor | Check is student
            const result: any[] = await Promise.allSettled(checkQuerys)
            const sum = result.reduce((p, c) => p.value._count + c.value._count)
            if (sum !== checkQuerys.length) return res.sendStatus(400)

            // const sum = result.forEach(r => { sum += r.value._count }); // da vedere

            // Create class and save id
            const ack = await createPOST("groupclass", { name, img_cover, archived: false })

            // Query array for add profs
            const queryArray = [];

            // Push creator | Push others prof if there are | Push student invitations if there are
            queryArray.push(createPOST("teachers_classes", { email, id_class: ack.id, role: TEACHERSCLASSESROLE.CREATOR }))

            for (const t of teachers)
                queryArray.push(createPOST("teachers_classes", { email: t, id_class: ack.id, role: TEACHERSCLASSESROLE.NORMAL }))
            for (const s of students)
                queryArray.push(createPOST("invitation", { email: s, id_class: ack.id }))

            // Add relation  | Send
            await Promise.allSettled(queryArray)
            res.sendStatus(200)
        } catch (err) {
            errorManagment('POST classes', res, err)
        }
    })

    // DA RIVEDERE
    // Get class data by filter (TEACHER)
    .get(AuthJWT.authenticateJWT, async (req, res) => {
        try {
            const { email, role } = AuthJWT.parseAuthorization(req.headers.authorization)

            // Cast data for query
            if (role === USERROLE.TEACHER)
                for (const key of Object.keys(req.query))
                    req.query[key] = JSON.parse(req.query[key].toString())

            // Find ids
            let table;
            if (role === USERROLE.STUDENT) table = "user"
            if (role === USERROLE.TEACHER) table = "teachers_classes"

            // Save ids || Fetch classes by filter
            const ownclasses = await createGET(table, "*", { email }, null)
            const ids = ownclasses.map((c) => c.id_class)
            const classes = await createGET("groupclass", "*", { ...req.query, id: ids }, null)

            // Injected peeple
            const classesInjectedPeopleQuery = []

            // Cast img | Fetch TEACHER | Fetch STUDENT
            for (const c of classes) {
                c.img_cover = BlobConvert.blobToBase64(c.img_cover)

                // Save structured query
                const teachersQuery = await createGET("teachers_classes", "*", { id_class: c.id }, { include: { user: true } }) // getTeachersInClass
                const studentsQuery = await createGET("user", "*", { id_class: c.id, role: USERROLE.STUDENT }, null) // getTeachersInClass

                // [ {teachers: [...]} {students: [...]} ...]
                classesInjectedPeopleQuery.push({
                    teachers: teachersQuery,
                    students: studentsQuery
                })
            }

            // Take the DB answer F
            // POI CABIARE LE QUERY PER NON FARE
            const r = await resolve(classesInjectedPeopleQuery)

            // Insert member in class data
            classes.forEach((c, i) => {
                const teachers = teacherFormatter(r[i].teachers)
                const students = userFormatter(r[i].students)
                c.teachers = teachers
                c.students = students

                res.send(classes)
            })
        } catch (err) {
            errorManagment('GET classes', res, err)
        }
    })

router.route('/classes/:id')

    // DA RIVEDERE
    // forse da togliere
    // Get by id only own classes (TEACHER AND STUDENT) 
    .get(AuthJWT.authenticateJWT, async (req, res) => {
        try {
            const { email, role }  = AuthJWT.parseAuthorization(req.headers.authorization)
            const id = +req.params.id


        } catch (err) {
            errorManagment('GET classes/id', res, err)
        }


        // 
        /*let ownclass;
        getClassDataByID(id)
            .then((result) => {
                ownclass = [result]  // save class
                const classesInjectedPeopleQuery = []

                // Convert img in base64 and query student
                for (const c of ownclass) {
                    c['img_cover'] = BlobConvert.blobToBase64(c['img_cover'])

                    // Save stryctured query
                    const teachersQuery = getTeachersInClass(c.id)
                    const studentsQuery = getUserDataByFilter({ id_class: c.id, role: 'STUDENT' })

                    // [ {teachers: [...]} {students: [...]} ...]
                    classesInjectedPeopleQuery.push({
                        teachers: teachersQuery,
                        students: studentsQuery
                    })
                }
                return resolve(classesInjectedPeopleQuery) // Take the DB answer
            })
            .then((result) => {
                // Insert member in class data
                ownclass.forEach((c, i) => {
                    const teachers = teacherFormatter(result[i].teachers)
                    const students = result[i].students

                    c.teachers = teachers
                    c.students = students
                })
                res.send(...ownclass)
            })
            .catch((err) => ) // Server error*/
    })

    // Update class
    .put(AuthJWT.authenticateJWT, async (req, res) => {
        try {
            const { email, role } = AuthJWT.parseAuthorization(req.headers.authorization)
            const id = req.params.id;
            const cover = req.body.img_cover;

            // Check prof
            if (role !== USERROLE.TEACHER) return res.sendStatus(403)

            // Check if this class is own
            const isTutor = await createCOUNT("teachers_classes", { email, id_class: id, role: TEACHERSCLASSESROLE.CREATOR })
            if (!isTutor._count) return res.sendStatus(403)

            // Cast img
            if (!cover) req.body.img_cover = BlobConvert.base64ToBlob(cover)

            // Update class | Cast img | Send new data
            const newData = await createUPDATE("groupclass", req.body, { id })
            newData.img_cover = BlobConvert.blobToBase64(newData.img_cover)
            res.send(newData)
        } catch (err) {
            errorManagment('PUT classes/id', res, err)
        }
    })

    // Delete class
    .delete(AuthJWT.authenticateJWT, async (req, res) => {
        try {
            const { email, role } = AuthJWT.parseAuthorization(req.headers.authorization)
            const id = req.params.id;

            // Check prof
            if (role !== USERROLE.TEACHER) return res.sendStatus(403)

            // Check if this class is own
            const isTutor = await createCOUNT("teachers_classes", { email, id_class: id, role: TEACHERSCLASSESROLE.CREATOR })
            if (!isTutor._count) return res.sendStatus(403)

            // Delete class
            const ack = await createDELETE("groupclass", { id })
            res.sendStatus(200)
        } catch (err) {
            errorManagment('DELETE classes/id', res, err)
        }
    })

export default router