// Version 1 on AVO4CAM REST API
import * as express from "express"
import login from "./routes/login/login.router"
import account from "./routes/account/account.router"
import course from "./routes/courses/course.router"
import unit from "./routes/unit/unit.router"
import lessons from "./routes/lesson/lesson.router"
import subscribe from "./routes/subscribe/subscribe.router"
import classgroup from "./routes/class/class.router"

/*
import invites from "./routes/invites/invite.router.js"

*/

// Wrap all router on v1 router
const router = 
    express.Router()
    .use(login)
    .use(account)
    .use(subscribe)
    .use(course)
    .use(unit)
    .use(lessons)
    .use(classgroup)
   // .use(invites)

export default router