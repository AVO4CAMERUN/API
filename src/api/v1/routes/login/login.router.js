// Login mini-router
import express from "express";
import bodyParser from "body-parser"
import jwt from "jsonwebtoken"
import AuthJWT from "../../utils/Auth.js"
import { errorManagment } from "../../utils/DBErrorManagment.js"
import { checkUsernamePassword, getUserInfoByUsername } from "./login.services.js"

const router = express.Router()
    .use(bodyParser.json())   

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
    
export default router
