// Account mini-router

const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const DBservices = require('./utils/mysqlConn');
const MailSender = require('./utils/MailSender');
const authJWT = require('./utils/auth');
const BlobConvert = require('./utils/blobConvert');

const router = express.Router();    //Create router Object
router.use(bodyParser.json());      //Middleware for parse http req

// Util Obj
const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';                // Set for confirm token
const dbc = new DBservices('localhost', 'root', '', 'avo4cum');                                     // Obj for db connect
const mailSender = new MailSender('Gmail','avogadro4camerun@gmail.com','AmaraPriscoTommasi123');    // OBj for mails send


// List for suspendedUsers
let suspendedUsers = []; //{code: value, usermane: vaule, password:value role: value}                

// Register and get all account
router.route('/account')

    // Create new account
    .post((req, res) => {
        const {username, email, password, name, surname} = req.body;

        // Check that there is not already a request
        let isThere;
        suspendedUsers.forEach( (u, i) =>{ email === u['email']? isThere = true : isThere = false })

        if(!isThere){
            dbc.genericCycleQuery(
                {
                    queryMethod: dbc.isRegistred,
                    par: [email]
                },
                {
                    queryMethod: dbc.isFreeUsername,
                    par: [username]
                }
            )
            .then((result) => {
                
                // Result async query
                if(result[0]?.value[0]['COUNT(*)'] > 0 || result[1]?.value[0]['COUNT(*)']){
                    res.sendStatus(403); // Forbidden --> hai gia profilo
                } else {

                    // Generate confirm code
                    let code = '', unique = true;
                    do{
                        // Code generator
                        for (let i = 0; i < 30; i++) {
                            code += characters[Math.floor(Math.random() * characters.length )];
                        }
                    
                        // Check that the code is unique 
                        suspendedUsers.forEach(suspendUser =>{
                            code !== suspendUser['code'] ?  unique = true : unique = false
                        })
                    } while(!unique)
                
                    // Save code and user info
                    suspendedUsers.push({
                        code, 
                        name,
                        surname,
                        email, 
                        username, 
                        password
                    }) 

                    // Set expiration code
                    setTimeout(() => {
                        suspendedUsers.forEach( (suspendUser, index) => {
                            if(code === suspendUser['code']) 
                                suspendedUsers.splice(index, 1);     //delete suspendUser with expired codes
                        })
                    }, 300000);  // 5 min 
                    
                    // All response
                    mailSender.send(email, code); // Send email to confirm account
                    res.sendStatus(200); //ok 

                    console.log(code);
                }

            })
            .catch((err)=>{
                console.log(err);
                res.sendStatus(500); // Server error
            })

        } else {
            res.sendStatus(200); //alredy requet code getsirsela con i json 
        }
  
    })
    
    // Update user data 
    .put(authJWT.authenticateJWT, (req, res) =>{
        const user = authJWT.parseAuthorization(req.headers.authorization)
        let {email} = user;

        console.log(user);
        //console.log(req.body);

        // Da controllare se si vouole cambiare il role e negare, aggistare cambiare update password con sha2 ...
        if(user.role){ res.sendStatus(403); }
        //if(user.password){ user.password = "SHA2('user.password', 256)"}    //se si riesce sistemare qua e non da generic cosa
        //rifattorizzare codice
        
        // Indirect call 
        dbc.genericCycleQuery(
            {
                queryMethod: dbc.updateUserInfo,
                par: [{email}, req.body]
            }
        )
        .then((result) => {
            //console.log(result);
            res.sendStatus(200);
        })
        .catch((err)=>{
            console.log(err);
            res.sendStatus(500); // Server error
        })
    })

    // Get user data 
    .get((req, res) =>{ 

        // Cast data for query
        for (const key of Object.keys(req.query)) 
            req.query[key] = dbc.strToArray(req.query[key])
        
        // Indirect call 
        dbc.genericCycleQuery(
            {
                queryMethod: dbc.getUserDataByFilter,
                par: [req.query]
            }
        )
        .then((result) => {
            // Take the DB answer 
            let usersData = result[0].value;
      
            // Convert img in base64
            for (const user of usersData) {
                user['img_profile'] = BlobConvert.blobToBase64(user['img_profile']);
            }

            // Responce 
            res.send(usersData)
        })
        .catch((err)=>{
            console.log(err);
            res.sendStatus(500); // Server error
        })
    })  

    // Delete account
    .delete(authJWT.authenticateJWT, (req, res) => {
        const user = authJWT.parseAuthorization(req.headers.authorization)
        let {email} = user;

        // Delete account and account relaction
        dbc.genericCycleQuery(   //non necessario controllo tanto ce auth
            {
                queryMethod:  dbc.delateAccount,
                par: [email]
            }
        )
        .then((result) => {
            console.log(result);
            res.sendStatus(200);
        })
        .catch((err)=>{
            console.log(err);
            res.sendStatus(500); // Server error
        })
    })

// Route cofirm code
router.get('/account/:confirmCode', (req, res) => {
    
    // Check that suspendedUsers includes confirmCode
    let isThere, index; 
    suspendedUsers.forEach( (u, i) =>{
        if(req.params.confirmCode === u['code']){
            isThere = true
            index = i;
        } else{
            isThere = false
        }  
    })

    // Confirmed code
    if(isThere){
        const {name, surname, username, email, password} = suspendedUsers[index];  // add role

        dbc.genericCycleQuery(
            {
                queryMethod: dbc.createAccount,
                par: [name, surname, username, password, email, '01'] // In first time all users are student = 01
            } //
        )
        .then((result) => {
            suspendedUsers.filter(value => value !== suspendedUsers[index]);    //Remove in the suspendedUsers 
            res.sendStatus(200) //ok  --> grazie per aver completato la registrazione ora poi toranre all app 
        })
        .catch((err)=>{
            console.log(err);
            res.sendStatus(500); // Server error
        })

        //console.log(suspendedUsers[index]);
    } else {
        res.sendStatus(401); // Unauthorized -->codice sbaglaito gestirsela con i json
    } 
})

module.exports = router;