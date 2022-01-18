// User mini-router

// Utils Module
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const authJWT = require('../utils/auth');
const DBservices = require('../utils/mysqlConn');

const router = express.Router();    //Create router Object

// Util Object
const dbConnnect = new DBservices('localhost', 'root', '', 'avo4cum');

// 
router.route('/users')
//authJWT.authenticateJWT,
    .get((req, res) => {
        
        dbConnnect.getAllDataUsers().then((value) => {
            console.log(value);
            res.json(value);

            // expected output: "Success!"
          }).catch();

    })

    /*
    .post( (req, res) => {
        res.send('post')
    })
    .put( (req, res) =>{
        res.send('put')
    })
    .delete( (req, res) => {
        res.send('get')
    })*/

//Scrivere risorse
module.exports = router

/* 

users (CRUD)
.../users/                      (R)
.../users/:email                (R)
.../users/:username             (CRU)
.../users/:firstname            (RU)
.../users/:lastname             (RU)
.../users/:registration_date    (R)
.../users/id_class              (RUD)

*/