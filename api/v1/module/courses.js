// Courses mini-router

// Utils Module
const express = require('express');
const bodyParser = require('body-parser');

const DBS = require('./utils/DBservices');
const BlobConvert = require('./utils/BlobConvert');
const authJWT = require('./utils/Auth');

const router = express.Router();    //Create router Object
    
/*{
	"name": "....",
	"description": "....",
	"subject": [...],
	"img_cover": [...]	
}*/
router.route('/courses')

    // Create new courses 
    .post(authJWT.authenticateJWT, (req, res) => {
        const user = authJWT.parseAuthorization(req.headers.authorization)
        const {email, role} = user;
        const {name, description, img_cover, subject} = req.body;   // fare cosa che converte base64 in byte

        console.log(role);
        if (role === "02") {
            DBS.genericCycleQuery( 
                {
                    queryMethod: DBS.createClass,  // Create class and save id
                    par: [name, img_cover]
                }
            )
            .then((result) => {
                const id = result[0].value.insertId; // id class
                console.log(result[0].value.insertId);

                // adre la posiibilita di fare insert di unota forse da vedere
                res.sendStatus(200);    // You create a your new class
            })
            .catch((err) => {
                console.log(err);
                res.sendStatus(500); // Server error
            })
        } else {
            res.sendStatus(403);    // You aren't a prof (conviene cosi non si fanno richieste al db)
        }  


    })

    // Get courses data by filter
    .get((req, res) => {})

router.route('/courses/:id')

    // Get courses data by id
    .get((req, res) => {})
    
    // Update courses data by id
    .put(authJWT.authenticateJWT, (req, res) =>{})

    // Delete courses by id
    .delete(authJWT.authenticateJWT, (req, res) => {})


module.exports = router