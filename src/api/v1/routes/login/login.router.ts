// Login mini-router
import * as express from "express"
import * as bodyParser from "body-parser"
import * as jwt from "jsonwebtoken"
import AuthJWT from "../../utils/Auth"
import { sha256 } from "js-sha256"
import { errorManagment } from "../../utils/DBErrorManagment"
import { createGET, createCOUNT } from "../../base/services/base.services"

const router = express.Router()
    .use(bodyParser.json())

router.route('/login')

    // Login | Create session
    .post(async (req, res) => {
        try {
            // Extract input
            const usernameIN:string = req.body.username
            const passwordIN:string =  req.body.password

            // Check is registered
            const isRegistered = await createCOUNT("user", {
                username: usernameIN,
                password: sha256(passwordIN)
            })
            if (!isRegistered._count) return res.sendStatus(403); // Forbiden

            // Fetch user data
            const [{ email, username, role }] = await createGET("user", "*", { username: usernameIN }, null)
            
            // Generate an access token
            const userDataToken:object = { email, username, role }
            const accessToken  :string = jwt.sign(userDataToken, AuthJWT.accessTokenSecret, { expiresIn: '20m' })
            const refreshToken :string = jwt.sign(userDataToken, AuthJWT.refreshTokenSecret)

            // Insert in activity account
            AuthJWT.refreshTokens.push(refreshToken)

            // Send json with tokens
            res.json({ accessToken, refreshToken })
        } catch (error) {
            errorManagment('POST login', res, error)
        }
    })

    // Update session 
    .put((req, res) => {
        try {
            // Check token is, Check autenticate token
            const { token } = req.body;
            if (!token) return res.sendStatus(401);
            if (!AuthJWT.refreshTokens.includes(token)) return res.sendStatus(403);

            jwt.verify(token, AuthJWT.refreshTokenSecret, (err) => {
                if (err) return res.sendStatus(403);

                // Send token
                const { username, role } = AuthJWT.jwtToObj(token)
                const accessToken = jwt.sign({ username, role }, AuthJWT.accessTokenSecret, { expiresIn: '20m' })
                res.json({ accessToken });
            })
        } catch (error) {
            errorManagment('PUT login', res, error)
        }
    })

    // Logout | Delete session
    .delete((req, res) => {
        try {
            // Check autenticate token
            const { token } = req.body
            if (!AuthJWT.refreshTokens.includes(token)) return res.sendStatus(403)

            // Delete token for logout ( // Ok Logout successful)
            AuthJWT.refreshTokens = AuthJWT.refreshTokens.filter(value => value !== token)
            res.sendStatus(200)
        } catch (error) {
            errorManagment('DELETE login', res, error)
        }
    })

export default router
