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

        if (role === "02") {
            DBS.genericCycleQuery( 
                {
                    queryMethod: DBS.createCourse,  // Create courses and save id
                    par: [name, email, description, img_cover, subject]
                }
            )
            .then(() => {
                res.sendStatus(200);    // You create a your new courses
            })
            .catch((err) => {
                res.sendStatus(500); // Server error
            })
        } else {
            res.sendStatus(403);    // You aren't a prof
        }
    })

    // Get courses data by filter
    .get((req, res) => {
        
        // Cast data for query
        for (const key of Object.keys(req.query)) 
            req.query[key] = DBS.strToArray(req.query[key])
        
        DBS.genericCycleQuery( 
            {
                queryMethod: DBS.getCoursesDataByFilter,
                par: [req.query]
            }
        )
        .then((response) => {
            let courseData = response[0].value;

            // Code img in base64 for send
            for (const course of courseData) 
                course['img_cover'] = BlobConvert.blobToBase64(course['img_cover']);
            
            // Send courses data
            res.send(courseData);    
        })
        .catch((err) => {
            res.sendStatus(500); // Server error
        })
    })

router.route('/courses/:id')

    // Get courses data by id
    .get((req, res) => {})
    
    // Update courses data by id
    .put(authJWT.authenticateJWT, (req, res) =>{})

    // Delete courses by id
    .delete(authJWT.authenticateJWT, (req, res) => {})


module.exports = router