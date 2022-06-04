// Login mini-router
import * as express from "express"
import * as bodyParser from "body-parser"
import * as jwt from "jsonwebtoken"
import AuthJWT from "../../utils/Auth"
import { errorManagment } from "../../utils/DBErrorManagment"
import { checkUsernamePassword, getUserInfoByUsername } from "./login.services"

const router = express.Router()
    .use(bodyParser.json())   

// Login
router.route('/login')

    // Login | Create session
    .post(async (req, res) => {
        try {
            // Check is registered
            const isRegistered = await checkUsernamePassword(req.body)
            if (!isRegistered) return res.sendStatus(403); // Forbiden

            // Fetch user data
            const user = await getUserInfoByUsername(req.body)
            const {email, username, role} = user;

            // Generate an access token
            const userDataToken = {email, username, role}
            const accessToken = jwt.sign(userDataToken, AuthJWT.accessTokenSecret, { expiresIn: '20m' });
            const refreshToken = jwt.sign(userDataToken, AuthJWT.refreshTokenSecret);

            // Insert in activity account
            AuthJWT.refreshTokens.push(refreshToken);
            
            // Send json with tokens
            res.json({accessToken, refreshToken});
        } catch (error) {
            errorManagment('POST login', res, error)
        }
    })

    // Update session 
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

    // Logout | Delete session
    .delete((req, res) => {
        const { token } = req.body;

        if(!AuthJWT.refreshTokens.includes(token))
            return res.sendStatus(403); // Fake tokens

        AuthJWT.refreshTokens = AuthJWT.refreshTokens.filter(value => value !== token); //Delete token for logout
        res.sendStatus(200);  // Ok Logout successful"
    })
    
export default router
