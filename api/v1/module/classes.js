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

router.route('/classes')

    // Create new class
    .post(authJWT.authenticateJWT, (req, res) => {
        const user = authJWT.parseAuthorization(req.headers.authorization)
        const {email, role} = user;
        
        /*{
            "name": "....",
            "img_cover": "....",
            "students": [...], (email)
            "profs": [...]	(email forse da cambiare in id, piu performante)
        }*/
        if (role === "02") {
            dbc.genericCycleQuery( 
                {
                    queryMethod: dbc.createClass,
                    par: [email, id]
                }
            )
            .then((result) => {
                // console.log(result[0]?.value);
                res.sendStatus(200);    // You create a your class data
            })
            .catch((err) => {
                console.log(err);
                res.sendStatus(500); // Server error
            })
        }
        res.sendStatus(403);    // You aren't a prof (conviene cosi non si fanno richieste al db)
 
    })

    // Get class data by filter // => da fare join per filtro modificare 
    .get((req, res) => {
     
        // Cast data for query
        for (const key of Object.keys(req.query)) 
            req.query[key] = dbc.strToArray(req.query[key])
            
        // console.log(req.query[key])      

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
            res.send(classesData);
        })
        .catch((err)=>{
            console.log(err);
            res.sendStatus(500); // Server error
        })
    })

router.route('/classes/:id')

    // Get class data by id
    .get((req, res) => {
        const id = req.params.id;

        // Indirect call 
        dbc.genericCycleQuery(
            {
                queryMethod: dbc.getClassDataByID,
                par: [id]
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
    
    // Update class data by id
    .put(authJWT.authenticateJWT, (req, res) =>{
        const user = authJWT.parseAuthorization(req.headers.authorization)
        const {email, role} = user;
        const id = req.params.id;
        
        if (role === "02") {
            dbc.genericCycleQuery(
                {
                    queryMethod: dbc.isTutor,
                    par: [email, id]
                }
            )
            .then((result) => {
                // Check if you are the tutur of class
                if(result[0]?.value[0]['COUNT(*)'] == 0){
                    res.sendStatus(403);    // You aren't the tutor
                } else {
                    // if you are a tutor commit query for change class data
                    return dbc.genericCycleQuery({
                        queryMethod: dbc.updateClass,
                        par: [{id}, req.body]
                    })
                } 
            })
            .then((result) => {
                // console.log(result[0]?.value);
                res.sendStatus(200);    // You changed a class data
            })
            .catch((err) => {
                console.log(err);
                res.sendStatus(500); // Server error
            })
        }
        res.sendStatus(403);    // You aren't a prof (conviene cosi non si fanno richieste al db)
    })

    // Delete class by id
    .delete(authJWT.authenticateJWT, (req, res) => {
        const user = authJWT.parseAuthorization(req.headers.authorization)
        const {email, role} = user;
        const id = req.params.id;
        
        //if (role === "02") {
            dbc.genericCycleQuery(
                {
                    queryMethod: dbc.isTutor,
                    par: [email, id]
                }
            )
            .then((result) => {
                // Check if you are the tutur of class
                if(result[0]?.value[0]['COUNT(*)'] === 0){
                    res.sendStatus(403);    // You aren't the tutor
                } else {
                    // if you are a tutor commit query for delete class
                    return dbc.genericCycleQuery({
                        queryMethod: dbc.delateClass,
                        par: [id]
                    })
                } 
            })
            .then((result) => {
                // console.log(result[0]?.value);
                res.sendStatus(200);    // You changed a class data
            })
            .catch((err) => {
                console.log(err);
                res.sendStatus(500); // Server error
            })
        //}
        //res.sendStatus(403);    // You aren't a prof (conviene cosi non si fanno richieste al db)
    })

//Scrivere risorse
module.exports = router