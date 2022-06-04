// Version 1 on AVO4CAM REST API
import * as express from "express";

import login from "./routes/login/login.router"
/*import account from "./routes/accounts/account.router.js"
import classes from "./routes/classes/classes.router.js"
import invites from "./routes/invites/invites.router.js"
import courses from "./routes/courses/courses.router.js"
import subscribe from "./routes/subscribes/subscribe.router.js"
import units from "./routes/units/units.router.js"
import lessons from "./routes/lessons/lessons.router.js"*/

// Wrap all router on v1 router
const router = 
    express.Router()
    .use(login)
    /*.use(account)
    .use(classes)
    .use(invites)
    .use(courses)
    .use(subscribe)
    .use(units)
    .use(lessons)
    //...*/

export default router