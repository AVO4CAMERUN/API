// Courses mini-router

// Utils Module
const express = require('express');

const DBS = require('./utils/DBservices');
const BlobConvert = require('./utils/BlobConvert');
const authJWT = require('./utils/Auth');

const router = express.Router();    //Create router Object

router.route('/courses')

    // Create new courses 
    .post(authJWT.authenticateJWT, (req, res) => {
        const user = authJWT.parseAuthorization(req.headers.authorization)
        const {email, role} = user;
        let {name, description, img_cover, subject} = req.body;

        // 
        if (img_cover)
            img_cover = BlobConvert.base64ToHex(img_cover)
          
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
    .get((req, res) => {
        const id = req.params.id;

        // Indirect call 
        DBS.genericCycleQuery(
            {
                queryMethod: DBS.getCoursesDataByFilter,
                par: [{id_course: [id]}]
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
    
    // Update courses data by id
    .put(authJWT.authenticateJWT, (req, res) => {
        const user = authJWT.parseAuthorization(req.headers.authorization)
        const {email, role} = user;
        const id_course = req.params.id;
        
        if (role !== "02") 
            return res.sendStatus(403);    // You aren't a prof

        if (req.body?.email_creator) 
            return res.sendStatus(403);  

        if (req.body?.img_cover)
            req.body.img_cover = `x'${ BlobConvert.base64ToHex(req.body.img_cover)}'`
          
        DBS.genericCycleQuery(
            {
                queryMethod: DBS.isCourseCreator,
                par: [email, id_course]
            }
        )
        .then((result) => {

            // Check if you are the creator of course
            if(result[0]?.value[0]['COUNT(*)'] == 0)
                res.sendStatus(403);    // You aren't the creator

            // if you are a creator commit query for change course data
            return DBS.genericCycleQuery({
                queryMethod: DBS.updateCourses,
                par: [{id_course}, req.body]
            })
            
        })
        .then(() => {
            res.sendStatus(200);    // You changed a class data
        })
        .catch((err) => {
            console.log(err);
            res.sendStatus(500); // Server error
        })
    })

    // Delete courses by id
    .delete(authJWT.authenticateJWT, (req, res) => {
        const user = authJWT.parseAuthorization(req.headers.authorization)
        const {email, role} = user;
        const id_course = req.params.id;
        
        if (role !== "02") 
            return res.sendStatus(403);    // You aren't a prof   
            
        DBS.genericCycleQuery(
            {
                queryMethod: DBS.isCourseCreator,
                par: [email, id_course]
            }
        )
        .then((result) => {

            // Check if you are the creator of course
            if(result[0]?.value[0]['COUNT(*)'] == 0)
                return res.sendStatus(403);    // You aren't the creator

            // if you are a creator commit query for delete course
            return DBS.genericCycleQuery({
                queryMethod: DBS.delateCourse,
                par: [id_course]
            })
        })
        .then(() => {
            res.sendStatus(200);    // You delete a class data
        })
        .catch((err) => {
            console.log(err);
            res.sendStatus(500); // Server error
        })  
    })

module.exports = router