// Class mini-router

// Utils Module
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const authJWT = require('../utils/auth');

const router = express.Router();    //Create router Object

// 
router.route('/class')
    .get(authJWT.authenticateJWT, (req, res) => {
        res.json({book: "sss"});
    })
    .post( (req, res) => {
        res.send('post')
    })
    .put( (req, res) =>{
        res.send('put')
    })
    .delete( (req, res) => {
        res.send('get')
    })


//Scrivere risorse
module.exports = router