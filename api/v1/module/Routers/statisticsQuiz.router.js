// Units mini-router

// Dependences
const express = require('express');

// Utils servises
const AuthJWT = require('../utils/Auth');
const { errorManagment } = require('../Utils/DBErrorManagment');

// Import DBservices and deconstruct function
const { } = require('../DBservises/courses.services'); // Courseservices
const router = express.Router();                       // Create router Object

router.route('/')

    // Create 
    .post(AuthJWT.authenticateJWT, (req, res) => {})

    // Get
    .get(AuthJWT.authenticateJWT, (req, res) => {})

router.route('/')

    // Update
    .put(AuthJWT.authenticateJWT, (req, res) => {})

    // Delete
    .delete(AuthJWT.authenticateJWT, (req, res) => {})

module.exports = router