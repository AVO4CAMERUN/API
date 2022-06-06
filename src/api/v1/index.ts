// Version 1 on AVO4CAM REST API
import * as express from "express"
import login from "./routes/login/login.router"
import account from "./routes/account/account.router"
import course from "./routes/courses/course.router"
import unit from "./routes/unit/unit.router"
import lesson from "./routes/lesson/lesson.router"
import subscribe from "./routes/subscribe/subscribe.router"
import groupClass from "./routes/class/class.router"
import invite from "./routes/invite/invite.router"

// Wrap all router on v1 router
const router = 
    express.Router()
    .use(login)
    .use(account)
    .use(subscribe)
    .use(course)
    .use(unit)
    .use(lesson)
    .use(groupClass) // da rivedere get
    .use(invite)

export default router