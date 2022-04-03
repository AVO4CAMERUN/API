//Version 1 on AVO4CAM REST API

const express = require('express');
const router = express.Router();    //Create router Object

// Import servesis module and add mini-router
router.use(require('./module/Routers/login.router'));
router.use(require('./module/Routers/account.router'));
router.use(require('./module/Routers/classes.router'));
router.use(require('./module/Routers/invites.router'));
router.use(require('./module/Routers/courses.router'));
router.use(require('./module/Routers/subscribe.router'));
router.use(require('./module/Routers/units.router'));
router.use(require('./module/Routers/lessons.router'));
//...

// Export v1 router 
module.exports = router

// DA VEDERE PER CHI VUOLE AIUTARMI CON SWAGGER
// https://github.com/kriscfoster/express-swagger-docs/blob/master/app.js
// http://localhost/api/v1/docs (it's magic)
// https://swagger.io/docs/specification/grouping-operations-with-tags/
// https://swagger.io/docs/specification/about/