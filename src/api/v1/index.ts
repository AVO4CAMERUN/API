// Version 1 on AVO4CAM REST API
import * as express from "express";
import login from "./routes/login/login.router"
import account from "./routes/account/account.router"
import course from "./routes/courses/course.router"
import unit from "./routes/unit/unit.router"
/*
import lessons from "./routes/lessons/lessons.router.js"
import classes from "./routes/classes/classes.router.js"
import invites from "./routes/invites/invites.router.js"
import subscribe from "./routes/subscribes/subscribe.router.js"
*/

// Wrap all router on v1 router
const router = 
    express.Router()
    .use(login)
    .use(account)
    .use(course)
    .use(unit)
/*
    .use(lessons)
    .use(subscribe)
    .use(classes)
    .use(invites)
*/

export default router