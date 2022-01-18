// Account mini-router

const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const DBservices = require('./utils/mysqlConn');
const MailSender = require('./utils/MailSender');
const authJWT = require('./utils/auth');

const router = express.Router();    //Create router Object
router.use(bodyParser.json());      //Middleware for parse http req

// Util Obj
const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';                // Set for confirm token
const dbConnnect = new DBservices('localhost', 'root', '', 'avo4cum');                              // Obj for db connect
const mailSender = new MailSender('Gmail','avogadro4camerun@gmail.com','AmaraPriscoTommasi123');    // OBj for mails send
let suspendedUsers = []; //{code: value, usermane: vaule, password:value role: value}               // List for suspendedUsers 


// Register
router.route('/account')

    // Create new account
    .post((req, res) => {
        const {username, email, password} = req.body;

        // Check that there is not already a request
        let isThere;
        suspendedUsers.forEach( (u, i) =>{ email === u['email']? isThere = true : isThere = false })

        if(!isThere){
            dbConnnect.genericCycleQuery(
                {
                    queryMethod: dbConnnect.isRegistred,
                    par: [email]
                },
                {
                    queryMethod: dbConnnect.isFreeUsername,
                    par: [username]
                }
            )
            .then((result) => {
                
                //console.log(result[0]?.value[0]['COUNT(*)']);
           
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
                        email: email, 
                        username: username, 
                        password: password
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
            // Sei gia sospeso coglione
            res.sendStatus(200); //alredy requet code getsirsela con i json 
        }
  
    })
   
    // Delete account
    .delete(authJWT.authenticateJWT, (req, res) => {
        const token = req.headers.authorization.split(' ')[1];  // Extract token 
        const data = authJWT.parseJwt(token);     //Extract js obj
        const email = data.email;

        // Delete account and account relaction
        dbConnnect.genericCycleQuery(   //non necessario controllo tanto ce auth
            {
                queryMethod:  dbConnnect.delateAccount,
                par: [email]
            }
        )
        .then((result) => {
            console.log(result);
            res.sendStatus(200);
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
        const {username, email, password} = suspendedUsers[index];  // add role

        dbConnnect.genericCycleQuery(
            {
                queryMethod: dbConnnect.createAccount,
                par: [username, password, email, '01']  //da modificare in base al ruolo 01 02 ecc codice in registrazione compo in piu
            }
        )
        .then((result) => {
            suspendedUsers.filter(value => value !== suspendedUsers[index]);    //Remove in the suspendedUsers 
            res.sendStatus(200) //ok  --> grazie per aver completato la registrazione ora poi toranre all app 
        })
        .catch((err) =>{
            console.log(err);
        })

        //console.log(suspendedUsers[index]);
    } else {
        res.sendStatus(401); // Unauthorized -->codice sbaglaito gestirsela con i json
    } 
})

module.exports = router;