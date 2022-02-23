//Version 1 on AVO4CAM REST API

const express = require('express');
const router = express.Router();    //Create router Object

// Import servesis module and add mini-router
router.use(require('./module/routers/login.router'));
router.use(require('./module/routers/account.router'));
router.use(require('./module/routers/classes.router'));
router.use(require('./module/routers/invites.router'));
router.use(require('./module/routers/courses.router'));
/*
router.use(require('./module/routers/subscribe.router'));
router.use(require('./module/routers/units.router'));
router.use(require('./module/routers/lessons.router'));*/
//...

// Export v1 router 
module.exports = router