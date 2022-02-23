// Login mini-router

// Dependences
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

// Utils servises
const AuthJWT = require('../utils/Auth'); 

// Import DBservices and deconstruct function
const {genericCycleQuery} = require('../DBservises/generic.service');   // GenericService
const {  // LoginService
    checkUsernamePassword,
    getUserInfoByUsername
} = require('../DBservises/login.service'); 

// Allocate obj
const router = express.Router();    // Create router Object
router.use(bodyParser.json());      // Middleware for parse http req


// Login
router.route('/login')

    //Login / Create session
    .post((req, res) => {
        const { username, password } = req.body;
        
        // Query check account
        genericCycleQuery(
            {
                queryMethod: checkUsernamePassword,
                par: [username, password]
            },
            {
                queryMethod: getUserInfoByUsername,
                par: [username]
            }
        )
        .then((result) => {
            if(result[0]?.value[0]['COUNT(*)'] != 1)
                return res.sendStatus(403); // Forbiden

            // Util Data
            let extendData = result[1].value[0];
            let {email, username, role} = extendData;
            
            // generate an access token
            const userDataToken = {email, username, role}
            const accessToken = jwt.sign(userDataToken, AuthJWT.accessTokenSecret, { expiresIn: '20m' });
            const refreshToken = jwt.sign(userDataToken, AuthJWT.refreshTokenSecret);

            // Insert in activity account
            AuthJWT.refreshTokens.push(refreshToken);
            
            // Send json with tokens
            res.json({accessToken, refreshToken});
        })
        .catch(() => res.sendStatus(500))  // Server error
    })

    //Update session 
    .put((req, res) => {
        const { token } = req.body;

        if (!token) return res.sendStatus(401); 
        if (!AuthJWT.refreshTokens.includes(token)) return res.sendStatus(403);
    
        jwt.verify(token, AuthJWT.refreshTokenSecret, (err) => {
            if (err) return res.sendStatus(403); 

            let user = AuthJWT.jwtToObj(token);  //Extract js obj
            const accessToken = jwt.sign({ username: user.username, role: user.role }, AuthJWT.accessTokenSecret, { expiresIn: '20m' });
            res.json({accessToken});
        });
    })

    //Logout / Delete session
    .delete((req, res) => {
        const { token } = req.body;

        if(!AuthJWT.refreshTokens.includes(token))
            return res.sendStatus(403); // Fake tokens

        AuthJWT.refreshTokens = AuthJWT.refreshTokens.filter(value => value !== token); //Delete token for logout
        res.sendStatus(200);  // Ok Logout successful"
       
    })
    
module.exports = router;