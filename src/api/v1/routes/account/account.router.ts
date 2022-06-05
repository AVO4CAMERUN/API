// Account mini-router
import "dotenv/config"
import * as express from "express"
import * as bodyParser from "body-parser"
import AuthJWT from "../../utils/Auth"
import MailSender from "../../utils/MailSender"
import BlobConvert from "../../utils/BlobConvert"
import { errorManagment } from "../../utils/DBErrorManagment"
import user from "./user.interface"

// Routes Services
import { createCOUNT } from "../../base/index.services"
/*import { getOwnClassesIDS } from "../classes/classes.services.js"*/
import { updateUserInfo, getUser, delateAccount, createAccount } from "./account.services"

// Middleware for parse http req
const router = express.Router()
    .use(bodyParser.json());

// Set for confirm token
const CHARATERS = process.env.CODE_SET_CHARATERS
let suspended = [];
// List for suspended: model => {code: value, usermane: vaule, password: value role: value} 

router.route("/account")

    .post(async (req, res) => {
        try {
            const input = { ...req.body, role: "STUDENT" };

            // Check that there is not already a request
            let isThere: boolean;
            suspended.forEach((u) => { input.email === u.email ? isThere = true : isThere = false })

            // Check if it has alredy token request 
            if (isThere) return res.sendStatus(401);

            // Fetch user info if she/he was register
            const { email, username } = input
            const [isReg, isFree] = await Promise.allSettled([
                createCOUNT("user", { email }),     // isRegistred?
                createCOUNT("user", { username })   // isFreeUsername?
            ])

            // Check users isn't registred | Check username is free
            if (isReg["value"]._count || isFree["value"]._count) return res.sendStatus(403)

            // Generate confirm code
            let unique = true; input.code = '';
            do {
                // Code generator
                for (let i = 0; i < 30; i++)
                    input.code += CHARATERS[Math.floor(Math.random() * CHARATERS.length)];

                // Check that the code is unique 
                suspended.forEach(suspendUser => {
                    input.code !== suspendUser["code"] ? unique = true : unique = false
                })
            } while (!unique)

            // Save code and user info
            suspended.push(input)

            // Set expiration code (5 min)
            setTimeout(() => {
                suspended.forEach((suspendUser, index) => {
                    // Delete suspendUser with expired codes
                    if (input.code === suspendUser.code)
                        suspended.splice(index, 1)
                })
            }, 300000);

            // Send email to confirm account
            console.log(input.code);
            MailSender.subscribe(input.email, input.code)
            res.sendStatus(200)
        } catch (err) {
            errorManagment("POST account", res, err)
        }
    })

    // Update user data 
    // (tramite quesat API non si potra cambiare mai email dividere endpoint)
    // ora il prof puo cambiare tutto, comportamento da discutere
    .put(AuthJWT.authenticateJWT, async (req, res) => {
        /*const role = AuthJWT.parseAuthorization(req.headers.authorization).role;
        const emailA = AuthJWT.parseAuthorization(req.headers.authorization).email;
        const { email } = req.body;

        // Check evil request
        if (req.body?.role) return res.sendStatus(403)

        // Check property account
        if (emailA !== email && role !== "TEACHER") return res.sendStatus(403)
        if (emailA !== email && role === "TEACHER") {
            const results = await Promise.allSettled([
                getOwnClassesIDS(emailA, role),
                getUser({ email })
            ])

            // Extract data
            const classList = results[0].value
            const id_class = results[1].value[0].id_class

            // Check your prof
            if (!classList.includes(id_class)) return res.sendStatus(403)
            delete req.body.email   // Clear update data
        }

        // Update code
        // Cast img
        if (req.body?.img_profile !== undefined)
            req.body.img_profile = BlobConvert.base64ToBlob(req.body.img_profile)

        // Update user info by request body
        updateUserInfo(email, req.body)
            .then((newData) => {
                delete newData.password // Remove and covert data
                newData.img_profile = BlobConvert.blobToBase64(newData.img_profile)
                // res.statusCode = 200
                res.send(newData) // Ok
            })
            .catch((err) => errorManagment("PUT account", res, err)) // Server error*/
    })

    // Get user data
    .get(AuthJWT.authenticateJWT, async (req, res) => {
        try {
            // Get users data by filters
            const { email } = AuthJWT.parseAuthorization(req.headers.authorization)
            const users = await getUser({ email })

            // Convert img in base64
            for (const user of users)
                user.img_profile = BlobConvert.blobToBase64(user.img_profile);

            // Response 
            res.send(users[0])
        } catch (err) {
            errorManagment("GET account", res, err)
        }
    })

    // Delete account
    .delete(AuthJWT.authenticateJWT, async (req, res) => {
        try {
            // Delete account and account relaction
            const { email } = AuthJWT.parseAuthorization(req.headers.authorization)
            const ack = await delateAccount({ email })
            res.sendStatus(200)
        } catch (err) {
            errorManagment("DELETE account", res, err)
        }
    })

// Route cofirm code
router.route("/account/:confirmCode")

    .get(async (req, res) => {
        try {
            const code:string = req.params.confirmCode

            // Check id suspended user is | Remove util code
            const index = suspended.findIndex((u) => code === u.code)
            if (!suspended[index]) return res.sendStatus(401); 
            delete suspended[index].code;

            // Remove suspended user | Create account
            // const ack = await createAccount(suspended[index])
            suspended = suspended.filter(value => value !== suspended[index]);
            
            res.sendStatus(200)
        } catch (err) {
            errorManagment("GET account/confirmCode", res, err)
        }
    })

export default router