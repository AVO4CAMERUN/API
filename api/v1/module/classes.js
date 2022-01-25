// Class mini-router

// Utils Module
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const DBservices = require('./utils/mysqlConn');
const BlobConvert = require('./utils/blobConvert');
const authJWT = require('./utils/auth');

const router = express.Router();    //Create router Object
const dbc = new DBservices('localhost', 'root', '', 'avo4cum');      

// 
router.route('/classes')

    // Get class data by filter
    .get((req, res) => {
     
        // Cast data for query
        for (const key of Object.keys(req.query)) 
            req.query[key] = dbc.strToArray(req.query[key])

        // Indirect call 
        dbc.genericCycleQuery(
            {
                queryMethod: dbc.getClassDataByFilter,
                par: [req.query]
            }
        )
        .then((result) => {
            // Take the DB answer 
            let classesData = result[0].value;

            // Convert img in base64
            for (const classData of classesData) {
                classData['img_cover'] = BlobConvert.blobToBase64(classData['img_cover']);
            }

            // Responce 
            res.send(classesData)
        })
        .catch((err)=>{
            console.log(err);
            res.sendStatus(500); // Server error
        })
    })

    .post(/*authJWT.authenticateJWT,*/ (req, res) => {
        //if(req.headers.authorization)
        let user = authJWT.parseJwt(req.headers.authorization);
        let {email} = user;

        console.log(user);
        //console.log(req.body);
        
        //controlli cose come non poter cambiare role e altre cose
        //if(user.role){ res.sendStatus(403); }
        // if(user.password){ user.password = "SHA2('user.password', 256)"}    //se si riesce sistemare qua e non da generic cosa
        // rifattorizzare codice
        
        /*if() {

        } else{}*/
        /*dbc.genericCycleQuery(
            {
                queryMethod: dbc.createClass,
                par: [req.body]
            },
        )
        .then((result) => {
            //console.log(result);
            res.sendStatus(200);
        })
        .catch((err)=>{
            console.log(err);
            res.sendStatus(500); // Server error
        })*/
    })




router.route('/classes/:id')

    // Get class data   //da sistemare
    .get((req, res) => {
        
        // Indirect call 
        dbc.genericCycleQuery(
            {
                queryMethod: dbc.getClassDataByID,
                par: [req.params.id]
            }
        )
        .then((result) => {
            // Take the DB answer 
            let classData = result[0].value[0];
            
            // Convert img in base64
            if(result[0].value[0]){
                classData['img_cover'] = BlobConvert.blobToBase64(classData['img_cover']);
                res.send(classData)
            } else {
                res.sendStatus(404) // Not found
            }

        })
        .catch((err)=>{
            console.log(err);
            res.sendStatus(500); // Server error
        })

    })
    
    .put(authJWT.authenticateJWT, (req, res) =>{
        res.send('put')
    })

    .delete(authJWT.authenticateJWT, (req, res) => {
        res.send('get')
    })

//Scrivere risorse
module.exports = router