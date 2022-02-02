// Class mini-router

// Utils Module
const express = require('express');
const DBS = require('./utils/DBservices');
const BlobConvert = require('./utils/BlobConvert');
const authJWT = require('./utils/Auth');

const router = express.Router();    //Create router Object    

router.route('/classes')

    // Create new class                             // da vedere ancora
    .post(authJWT.authenticateJWT, (req, res) => {
        const user = authJWT.parseAuthorization(req.headers.authorization)
        const {email, role} = user;
        const {name, img_cover, students, profs} = req.body;

        // fare controlli corettezza iinputs
        // fare controlli che i prof siano davvero prof (fecth di n role)

        // console.log(dbc.createMultiInsertQuery('prof_classes', '1', ['campo1'], ['sss', 'eee']));
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

                // Query array for add profs
                const queryArray = [];
                
                // Push tutor
                queryArray.push({
                    queryMethod: DBS.addProfsClass,
                    par: [email, id, 'tutor']
                })

                // Push others
                for (const prof of profs) {
                    queryArray.push({       // controllare se sono prof
                        queryMethod: DBS.addProfsClass,
                        par: [prof, id, 'normal']
                    })
                }
                
                // .. studente ecc
                if (students.length) {} // aggiungere tabella di notifiche 

                // Add relation in the class (start up student and profs) if there are    | students.length || 
                DBS.genericCycleQuery(...queryArray) // Send dynamic querys 

                res.sendStatus(200);    // You create a your new class
            })
            .catch((err) => {
                console.log(err);
                res.sendStatus(500); // Server error
            })
        } else {
            console.log("sss");
            res.sendStatus(403);    // You aren't a prof (conviene cosi non si fanno richieste al db)
        }  
    })

    // Get class data by filter                    // => da fare join per filtro modificare 
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
        DBS.genericCycleQuery(
            {
                queryMethod: DBS.getClassDataByID,
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
            DBS.genericCycleQuery(
                {
                    queryMethod: DBS.isTutor,
                    par: [email, id]
                }
            )
            .then((result) => {
                // Check if you are the tutur of class
                if(result[0]?.value[0]['COUNT(*)'] == 0){
                    res.sendStatus(403);    // You aren't the tutor
                } else {
                    // if you are a tutor commit query for change class data
                    return DBS.genericCycleQuery({
                        queryMethod: DBS.updateClass,
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
        
        if (role === "02") {
            DBS.genericCycleQuery(
                {
                    queryMethod: DBS.isTutor,
                    par: [email, id]
                }
            )
            .then((result) => {
                // Check if you are the tutur of class
                if(result[0]?.value[0]['COUNT(*)'] === 0){
                    res.sendStatus(403);    // You aren't the tutor
                } else {
                    // if you are a tutor commit query for delete class
                    return DBS.genericCycleQuery({
                        queryMethod: DBS.delateClass,
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
        } else {
            res.sendStatus(403);    // You aren't a prof (conviene cosi non si fanno richieste al db)
        }
    })

module.exports = router