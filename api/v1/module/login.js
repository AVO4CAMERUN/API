// Login mini-router

// Util Module 
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const authJWT = require('./utils/Auth'); 
const DBS = require('./utils/DBservices');

const router = express.Router();   //Create router Object
router.use(bodyParser.json());     //Middleware for parse http req


// Login
router.route('/login')

    //Login / Create session
    .post((req, res) => {
        const { username, password } = req.body;
        
        // Query check account
        DBS.genericCycleQuery(
            {
                queryMethod: DBS.checkUsernamePassword,
                par: [username, password]
            },
            {
                queryMethod: DBS.getUserInfoByUsername,
                par: [username]
            }
        )
        .then((result) => {
            
            if(result[0].value[0]['COUNT(*)'] < 0)
                return res.sendStatus(403); // Forbiden

            // Util Data
            let extendData = result[1].value[0];
            let {email, username, role} = extendData;
            
            // generate an access token
            const userDataToken = {email, username, role}
            const accessToken = jwt.sign(userDataToken, authJWT.accessTokenSecret, { expiresIn: '20m' });
            const refreshToken = jwt.sign(userDataToken, authJWT.refreshTokenSecret);

            // Insert in activity account
            authJWT.refreshTokens.push(refreshToken);
            
            // Send json with tokens
            res.json({accessToken, refreshToken});
        })  
        .catch(() => {
            res.sendStatus(500); // Send Status server error
        })
    })

    //Update session 
    .put((req, res) => {
        const { token } = req.body;

        if (!token) return res.sendStatus(401); 
        if (!authJWT.refreshTokens.includes(token)) return res.sendStatus(403);
    
        jwt.verify(token, authJWT.refreshTokenSecret, (err) => {
            if (err) return res.sendStatus(403); 

            let user = authJWT.jwtToObj(token);  //Extract js obj
            const accessToken = jwt.sign({ username: user.username, role: user.role }, authJWT.accessTokenSecret, { expiresIn: '20m' });
            res.json({accessToken});
        });
    })

    //Logout / Delete session
    .delete((req, res) => {
        const { token } = req.body;

        if(!authJWT.refreshTokens.includes(token))
            return res.sendStatus(403); // Fake tokens

        authJWT.refreshTokens = authJWT.refreshTokens.filter(value => value !== token); //Delete token for logout
        res.sendStatus(200);  // Ok Logout successful"
       
    })
    
module.exports = router;
