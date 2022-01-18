// Resurce mini-router

//
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const authJWT = require('../utils/auth');


const router = express.Router();    //Create router Object

//example request
router.route('/books')
    .get(authJWT.authenticateJWT, (req, res) => {
        res.json({book: "sss"});
    })

module.exports = router