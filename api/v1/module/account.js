// Account mini-router

const express = require('express');
const bodyParser = require('body-parser');
const DBS = require('./utils/DBServices');
const MailSender = require('./utils/MailSender');
const authJWT = require('./utils/Auth');
const BlobConvert = require('./utils/BlobConvert');

const router = express.Router();    // Create router Object
router.use(bodyParser.json());      // Middleware for parse http req

// Util Obj
const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';                // Set for confirm token
const mailSender = new MailSender('Gmail','avogadro4camerun@gmail.com','AmaraPriscoTommasi123');    // OBj for mails send

// List for suspendedUsers
// {code: value, usermane: vaule, password: value role: value} 
let suspendedUsers = [];               

// Register and get all account
router.route('/account')

    // Create new account
    .post((req, res) => {
        const {username, email, password, name, surname} = req.body;

        // Check that there is not already a request
        let isThere; suspendedUsers.forEach((u, i) => { email === u['email']? isThere = true : isThere = false })

        // Check if it has alredy taken request 
        if(isThere)
            return res.sendStatus(200); 

        // Check if it is alredy registered and if the choice username is free
        DBS.genericCycleQuery(
            {
                queryMethod: DBS.isRegistred,
                par: [email]
            },
            {
                queryMethod: DBS.isFreeUsername,
                par: [username]
            }
        )
        .then((result) => {
            
            // Result async query to check
            if(result[0]?.value[0]['COUNT(*)'] > 0 || result[1]?.value[0]['COUNT(*)'])
                return res.sendStatus(403); // Forbidden --> hai gia profilo
            
            // Generate confirm code
            let code = '', unique = true;
            do{
                // Code generator
                for (let i = 0; i < 30; i++)
                    code += characters[Math.floor(Math.random() * characters.length )];
                
                // Check that the code is unique 
                suspendedUsers.forEach(suspendUser => {
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
                        suspendedUsers.splice(index, 1);     // Delete suspendUser with expired codes
                })
            }, 300000);  // 5 min 
            
            // All response
            mailSender.send(email, code); // Send email to confirm account
            console.log(code);
            res.sendStatus(200); // OK
        })
        .catch(() => {
            res.sendStatus(500); // Server error
        })
    })
    
    // Update user data 
    .put(authJWT.authenticateJWT, (req, res) => {
        const user = authJWT.parseAuthorization(req.headers.authorization)
        const {email} = user;

        // Check evil request
        if(req.body?.role) 
            return res.sendStatus(403)
        
        if(req.body?.password) 
            req.body.password = `SHA2('${req.body.password}', 256)`
        
        if (req.body?.img_profile)
            req.body.img_profile = `x'${BlobConvert.base64ToHex(req.body.img_profile)}'`

        // Update user info by request body
        DBS.genericCycleQuery({
                queryMethod: DBS.updateUserInfo,
                par: [{email}, req.body]
        })
        .then(() => {
            res.sendStatus(200);
        })
        .catch(() => {
            res.sendStatus(500); // Server error
        })
    })

    // Get user data 
    .get((req, res) => { 

        // Cast data for query
        for (const key of Object.keys(req.query)) 
            req.query[key] = DBS.strToArray(req.query[key])
        
        // Get users data by filters
        DBS.genericCycleQuery({
            queryMethod: DBS.getUserDataByFilter,
            par: [req.query]
        })
        .then((result) => {
            // Take the DB answer 
            let usersData = result[0].value;
      
            // Convert img in base64
            for (const user of usersData) 
                user['img_profile'] = BlobConvert.blobToBase64(user['img_profile']);
            
            // Responce 
            res.send(usersData)
        })
        .catch(()=>{
            res.sendStatus(500); // Server error
        })
    })   

    // Delete account
    .delete(authJWT.authenticateJWT, (req, res) => {
        const user = authJWT.parseAuthorization(req.headers.authorization)
        let {email} = user;

        // Delete account and account relaction
        DBS.genericCycleQuery(   // non necessario controllo tanto ce auth
            {
                queryMethod:  DBS.delateAccount,
                par: [email]
            }
        )
        .then(() => {
            res.sendStatus(200);
        })
        .catch(() => {
            res.sendStatus(500); // Server error
        })
    })

// Route cofirm code
router.get('/account/:confirmCode', (req, res) => {
    
    // Check that suspendedUsers includes confirmCode
    let isThere, index; 
    suspendedUsers.forEach((u, i) =>{
        if(req.params.confirmCode === u['code']){
            isThere = true; index = i;
        } else {
            isThere = false
        }  
    })

    // Confirmed code
    if(!isThere)
        return res.sendStatus(401); // Unauthorized

    const {name, surname, username, email, password} = suspendedUsers[index];

    // Create account
    DBS.genericCycleQuery(
        {
            queryMethod: DBS.createAccount,
            par: [name, surname, username, password, email, '01'] // In first time all users are student = 01
        }
    )
    .then((result) => {
        suspendedUsers.filter(value => value !== suspendedUsers[index]);    // Remove in the suspendedUsers 
        res.sendStatus(200) // Ok 
    })
    .catch(() => {
        res.sendStatus(500); // Server error
    })
})

module.exports = router;