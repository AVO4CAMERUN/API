//Version 1 on AVO4CUM REST API

const express = require('express');
const router = express.Router();    //Create router Object

// Import servesis module 
const login = require('./module/login');
const account = require('./module/account');
const class_resurce = require('./module/classes');
const invites = require('./module/invites');
const courses = require('./module/courses');
const subscribe = require('./module/subscribe');
const units = require('./module/units');
const lessons = require('./module/lessons');
//...



// Add mini-router
router.use(login);
router.use(account);
router.use(class_resurce);
router.use(invites);
router.use(courses);
router.use(subscribe);
router.use(units);
router.use(lessons);

// Export v1 router 
module.exports = router