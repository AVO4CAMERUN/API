// Login mini-router

// Dependences
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

// Utils servises
const AuthJWT = require('../utils/Auth'); 
const { errorManagment } = require('../utils/DBErrorManagment');

// Import DBservices and deconstruct function
const {  // Loginservices
    checkUsernamePassword,
    getUserInfoByUsername
} = require('../DBservises/login.services'); 

// Allocate obj
const router = express.Router();    // Create router Object
router.use(bodyParser.json());      // Middleware for parse http req

// Login
router.route('/login')

    //Login / Create session
    .post((req, res) => {
        const { username, password } = req.body;

        // Query check account
        Promise.allSettled([
            checkUsernamePassword(username, password),
            getUserInfoByUsername(username)
        ])
        .then((result) => {
	    console.log(result);
            if(result[0]?.value['_count'] != 1)
                return res.sendStatus(403); // Forbiden

            // Util Data
            const extendData = result[1].value;
            const {email, username, role} = extendData;
            
            // Generate an access token
            const userDataToken = {email, username, role}
            const accessToken = jwt.sign(userDataToken, AuthJWT.accessTokenSecret, { expiresIn: '20m' });
            const refreshToken = jwt.sign(userDataToken, AuthJWT.refreshTokenSecret);

            // Insert in activity account
            AuthJWT.refreshTokens.push(refreshToken);
            
            // Send json with tokens
            res.json({accessToken, refreshToken});
        })
        .catch((err) => errorManagment('POST login', res, err)) // Server error
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


/**
 * @swagger
 *  /login:
 *  post:
 *      tags: 
 *      - login
 *      summary:
 *      description:
 *      parameters:
 *       - in: body
 *         name: body
 *         required: true
 *         description: Body
 *         content:
 *          application/json:
 *             schema:
 *               type: 
 *               $ ref: '#/api/v1/Swagger/components/account.register.yaml'
 *      responses:
 *          200:
 *           description:
 *           content:
 *          403:
 *           description: 
 *           content:
 *          500:
 *           description: 
 *           content:
 *  put:
 *      tags: 
 *      - login
 *      summary: 
 *      description: 
 *  delete:
 *      tags: 
 *      - login
 *      summary: 
 *      description:
 * 
 * /account/{confirmCode}:
 *  get:
 *      tags: 
 *      - account
 */
