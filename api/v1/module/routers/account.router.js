// Account mini-router

// Dependences
const express = require('express');
const bodyParser = require('body-parser');

// Utils servises
const BlobConvert = require('../utils/BlobConvert');
const MailSender = require('../utils/MailSender');
const AuthJWT = require('../utils/Auth');
const Utils = require('../utils/Utils');

// Import DBservices and deconstruct function
const {isRegistred, isFreeUsername} = require('../DBservises/login.services');   //Loginservices;                          
const { // Accountservices  
    updateUserInfo, 
    getUserDataByFilter, 
    delateAccount, 
    createAccount
} = require('../DBservises/account.services');       

// Allocate obj
const router = express.Router();    // Create router Object
router.use(bodyParser.json());      // Middleware for parse http req

// Util Obj
const CHARATERS = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'; // Set for confirm token

// List for suspendedUsers --- model => {code: value, usermane: vaule, password: value role: value} 
let suspendedUsers = [];               

router.route('/account')

    // Create new account
    .post((req, res) => {
        const {username, email, password, name, surname} = req.body;

        // Check that there is not already a request
        let isThere; suspendedUsers.forEach((u, i) => { email === u['email']? isThere = true : isThere = false })

        // Check if it has alredy token request 
        if(isThere) return res.sendStatus(200); 

        // Check if it is alredy registered and if the choice username is free
        Promise.allSettled([
            isRegistred(email),
            isFreeUsername(username)
        ])
        .then((result) => {
            // Result async query to check
            if(result[0]?.value['_count'] > 0 || result[1]?.value['_count'])
                return res.sendStatus(403); // Forbidden --> hai gia profilo
            
            // Generate confirm code
            let code = '', unique = true;
            do{
                // Code generator
                for (let i = 0; i < 30; i++)
                    code += CHARATERS[Math.floor(Math.random() * CHARATERS.length )];
                
                // Check that the code is unique 
                suspendedUsers.forEach(suspendUser => {
                    code !== suspendUser['code'] ?  unique = true : unique = false
                })
            } while(!unique)
        
            // Save code and user info
            suspendedUsers.push({code, name, surname, email, username, password}) 

            // Set expiration code
            setTimeout(() => {
                suspendedUsers.forEach( (suspendUser, index) => {
                    if(code === suspendUser['code']) 
                        suspendedUsers.splice(index, 1);     // Delete suspendUser with expired codes
                })
            }, 300000);  // 5 min 
            
            // All response
            MailSender.send(email, code); // Send email to confirm account
            console.log(code);
            res.sendStatus(200)
        })
        // .then(() =>  res.sendStatus(200))  // Ok
        .catch((err) => {
            console.log(err);
            res.sendStatus(500)
        })  // Server error
    })
    
    // Update user data 
    .put(AuthJWT.authenticateJWT, (req, res) => {
        const user = AuthJWT.parseAuthorization(req.headers.authorization)
        const {email} = user;

        // Check evil request
        if(req.body?.role) 
            return res.sendStatus(403)
        
        if (req.body?.img_profile)
            req.body.img_profile = `x'${BlobConvert.base64ToHex(req.body.img_profile)}'`

        // Update user info by request body
        updateUserInfo(email, req.body)
            .then(() =>  res.sendStatus(200))  // Ok
            .catch(() => res.sendStatus(500))  // Server error)
    })

    // Get user data  (da vedere perchè forse icapsuliamo il egt proprie info dentro in login)
    .get(AuthJWT.authenticateJWT, (req, res) => { 
        // console.log(req.query)
        // Cast data for query
        for (const key of Object.keys(req.query)) 
            req.query[key] = Utils.strToArray(req.query[key])
        
        // console.log(req.query)

        // Get users data by filters
        Promise.allSettled([
            getUserDataByFilter(req.query)
        ])
        .then((result) => {
            // console.log(result)

            // Take the DB answer 
            const usersData = result[0].value;
    
            // Convert img in base64
            for (const user of usersData) 
                user['img_profile'] = BlobConvert.blobToBase64(user['img_profile']);
            
            // Responce 
            res.send(usersData)
        })
        .catch(() => res.sendStatus(500))  // Server error
    })

    // Delete account
    .delete(AuthJWT.authenticateJWT, (req, res) => {
        const user = AuthJWT.parseAuthorization(req.headers.authorization)
        let {email} = user;

        // Delete account and account relaction
        delateAccount(email) // non necessario controllo tanto ce auth
            .then(() =>  res.sendStatus(200))  // Ok
            .catch(() => res.sendStatus(500))  // Server error
    })

// Route cofirm code
router.get('/account/:confirmCode', (req, res) => {
    
    // Check that suspendedUsers includes confirmCode
    let isThere, index; 
    suspendedUsers.forEach((u, i) => {
        if(req.params.confirmCode === u['code']) { 
            isThere = true; index = i;
        } else { 
            isThere = false 
        }  
    })

    // Confirmed code
    if(!isThere) return res.sendStatus(401); // Unauthorized

    // Create account
    const {name, surname, username, email, password} = suspendedUsers[index];
    createAccount(name, surname, username, password, email, 'STUDENT')  // In first time all users are student = 01
        .then(() => {
            suspendedUsers.filter(value => value !== suspendedUsers[index]);    // Remove in the suspendedUsers 
            res.sendStatus(200) // Ok 
        })
        .catch((err) => {
            console.log(err);
            res.sendStatus(500)
        })  // Server error
})

module.exports = router;