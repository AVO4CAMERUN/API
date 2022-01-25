//Version 1 on AVO4CUM REST API

const express = require('express');
const router = express.Router();    //Create router Object

// Import servesis module 
const login = require('./module/login');
const account = require('./module/account');
const class_resurce = require('./module/classes');
const course_resurce = require('./module/course');
//...

// Add mini-router
router.use(login);
router.use(account);
router.use(class_resurce);
//router.use();
//router.use(course_resurce);...

// Export v1 router 
module.exports = router