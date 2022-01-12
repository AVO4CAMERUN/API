// Login mini-router

// Util Module 
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const authJWT = require('./utils/auth'); 
const DBservices = require('./utils/mysqlConn');

const router = express.Router();   //Create router Object
router.use(bodyParser.json());     //Middleware for parse http req

// Util Object
const dbConnnect = new DBservices('localhost', 'root', '', 'avo4cum');

// Login
router.route('/login')

    //Login / Create session
    .post( (req, res) => {
        const { username, password } = req.body;
        
        // Query check account
        let p = dbConnnect.checkUsernamePassword(username, password);
        p.then( (result) => {

            // Result async query
            if(result[0]['COUNT(*)'] > 0){
                return dbConnnect.getUserInfo(username);
            } else {
                return Promise.resolve(null);
            }

        }).then( (userData) => {

            if (userData) {
                // generate an access token
                const userDataToken = {email: userData[0].email, username: userData[0].username, role: userData[0].role};
                const accessToken = jwt.sign(userDataToken, authJWT.accessTokenSecret, { expiresIn: '20m' });
                const refreshToken = jwt.sign(userDataToken, authJWT.refreshTokenSecret);
    
                // Insert in activity account
                authJWT.refreshTokens.push(refreshToken);
    
                // Send json with tokens
                res.json({accessToken, refreshToken});

            } else {
                res.send('Username or password incorrect'); // Send json responce --> da modificare
            }
        })  
    })

    //Update session 
    .put( (req, res) => {
        const { token } = req.body;

        if (!token) { return res.sendStatus(401); }
        if (!authJWT.refreshTokens.includes(token)) { return res.sendStatus(403);}
    
        jwt.verify(token, authJWT.refreshTokenSecret, (err) => {
            if (err) { return res.sendStatus(403); }

            let user = authJWT.parseJwt(token);  //Extract js obj
            const accessToken = jwt.sign({ username: user.username, role: user.role }, authJWT.accessTokenSecret, { expiresIn: '20m' });
            res.json({accessToken});
        });
    })

    //Logout / Delete session
    .delete( (req, res) => {
        const { token } = req.body;
        
        if(authJWT.refreshTokens.includes(token)){
            authJWT.refreshTokens = authJWT.refreshTokens.filter(value => value !== token); //Delete token for logout
            res.sendStatus(200);  //ok Logout successful"
        } else{
            res.sendStatus(403); //Fake tokens
        }
        //console.log(refreshTokens)
    })
    
module.exports = router;
