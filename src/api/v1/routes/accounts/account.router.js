// Account mini-router
import express from "express"
import bodyParser from "body-parser"

// Utils servises
import BlobConvert from "../../utils/BlobConvert.js"
import MailSender from "../../utils/MailSender.js"
import { errorManagment } from "../../Utils/DBErrorManagment.js"
import AuthJWT from "../../utils/Auth.js"

// Routes Services
import { isRegistred, isFreeUsername } from "../login/login.services.js"
import { getOwnClassesIDS } from "../classes/classes.services.js"
import {
    updateUserInfo,
    getUserDataByFilter,
    delateAccount,
    createAccount
} from "./account.services.js"

// Middleware for parse http req
const router = express.Router()
    .use(bodyParser.json());

// Util Obj
const CHARATERS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"; // Set for confirm token
let suspendedUsers = [];  // List for suspendedUsers: model => {code: value, usermane: vaule, password: value role: value} 

router.route("/account")

    .post((req, res) => {
        const { username, email, password, firstname, lastname } = req.body;

        // Check that there is not already a request
        let isThere; suspendedUsers.forEach((u, i) => { email === u["email"] ? isThere = true : isThere = false })

        // Check if it has alredy token request 
        if (isThere) return res.sendStatus(401);

        // Check if it is alredy registered and if the choice username is free
        Promise.allSettled([
            isRegistred(email),
            isFreeUsername(username)
        ])
            .then((result) => {
                // Result async query to check
                if (result[0]?.value["_count"] === 1 || result[1]?.value["_count"] === 1)
                    return Promise.resolve(403) // Forbidden --> hai gia profilo

                // Generate confirm code
                let code = '', unique = true;
                do {
                    // Code generator
                    for (let i = 0; i < 30; i++)
                        code += CHARATERS[Math.floor(Math.random() * CHARATERS.length)];

                    // Check that the code is unique 
                    suspendedUsers.forEach(suspendUser => {
                        code !== suspendUser["code"] ? unique = true : unique = false
                    })
                } while (!unique)

                // Save code and user info
                suspendedUsers.push({ code, firstname, lastname, email, username, password })

                // Set expiration code
                setTimeout(() => {
                    suspendedUsers.forEach((suspendUser, index) => {
                        if (code === suspendUser["code"])
                            suspendedUsers.splice(index, 1);     // Delete suspendUser with expired codes
                    })
                }, 300000);  // 5 min 

                // All response
                // No funziona email
                MailSender.subscribe(email, code); // Send email to confirm account
                console.log(code);
            })
            .then(() => res.sendStatus(200))  // Ok
            .catch((err) => errorManagment("POST account", res, err)) // Server error
    })

    // Update user data 
    // (tramite quesat API non si potra cambiare mai email dividere endpoint)
    // ora il prof puo cambiare tutto, comportamento da discutere
    .put(AuthJWT.authenticateJWT, async (req, res) => {
        const role = AuthJWT.parseAuthorization(req.headers.authorization).role;
        const emailA = AuthJWT.parseAuthorization(req.headers.authorization).email;
        const { email } = req.body;

        // Check evil request
        if (req.body?.role) return res.sendStatus(403)

        // Check property account
        if (emailA !== email && role !== "TEACHER") return res.sendStatus(403)
        if (emailA !== email && role === "TEACHER") {
            const results = await Promise.allSettled([
                getOwnClassesIDS(emailA, role),
                getUserDataByFilter({ email })
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
            .catch((err) => errorManagment("PUT account", res, err)) // Server error
    })

    // Get user data
    .get(AuthJWT.authenticateJWT, (req, res) => {
        const user = AuthJWT.parseAuthorization(req.headers.authorization)
        const { email } = user;

        // Get users data by filters
        getUserDataByFilter({ email })
            .then((usersData) => {
                // Take the DB answer 
                // Convert img in base64
                for (const user of usersData)
                    user["img_profile"] = BlobConvert.blobToBase64(user["img_profile"]);

                res.send(usersData) // Response 
            })
            .catch((err) => errorManagment("GET account", res, err))  // Server error
    })

    // Delete account
    .delete(AuthJWT.authenticateJWT, (req, res) => {
        const { email } = AuthJWT.parseAuthorization(req.headers.authorization)

        // Delete account and account relaction
        delateAccount(email)
            .then(() => res.sendStatus(200))
            .catch((err) => errorManagment("DELETE account", res, err))
    })

// Route cofirm code
router.get("/account/:confirmCode", (req, res) => {

    // Check that suspendedUsers includes confirmCode
    let isThere, index;
    suspendedUsers.forEach((u, i) => {
        if (req.params.confirmCode === u["code"]) {
            isThere = true; index = i;
        } else {
            isThere = false
        }
    })

    // Confirmed code
    if (!isThere) return res.sendStatus(401); // Unauthorized

    console.log(suspendedUsers[index]);
    // Create account
    const { firstname, lastname, username, email, password } = suspendedUsers[index];
    createAccount(firstname, lastname, username, password, email, "STUDENT")          // In first time all users are student = 01
        .then(() => {
            suspendedUsers.filter(value => value !== suspendedUsers[index]);    // Remove in the suspendedUsers 
            res.sendStatus(200) // Ok 
        })
        .catch((err) => errorManagment("GET account/confirmCode", res, err)) // Server error
})

export default router