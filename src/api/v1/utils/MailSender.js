// Module for send email

import { google } from 'googleapis'
import nodemailer from 'nodemailer'

// Data
const SERVICE       = process.env.MAIL_SERVICE
const USER          = process.env.MAIL_USER
const CLIENT_ID     = process.env.CLIENT_ID
const CLEINT_SECRET = process.env.CLIENT_SECRET
const REDIRECT_URI  = process.env.REDIRECT_URI
const REFRESH_TOKEN = process.env.REFRESH_TOKEN

// Create OAuth2 Client
const OAuth2 = new google.auth.OAuth2(CLIENT_ID, CLEINT_SECRET, REDIRECT_URI)
OAuth2.setCredentials({ refresh_token: REFRESH_TOKEN });

// Email sending function
async function send(options) {
    try {
        // Set up auth email
        const accessToken = await OAuth2.getAccessToken() 
        const transporter = nodemailer.createTransport({
            service: SERVICE,
            auth: {
                type: 'OAuth2',
                user:  USER,
                clientId: CLIENT_ID,
                clientSecret: CLEINT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken
            }
        })

        // Sending email
        return await transporter.sendMail(options)
    } catch (error) {
        return error
    }
}

// Subscribe email sending function
async function subscribe(email, confirmCode) {
    // const htmlstream = fs.createReadStream("content.html");
    // html email CAMBIARE LINK IN PAGINA CHE USA API
    // console.log(email, confirmCode);

    // Send mail with defined transport object
    const options = {
        from: USER,
        to: email,
        subject: 'Subscribe 📖',
        text: `https://api.avo4camerun.kirinsecurity.com/api/v1/account/${confirmCode}`
        // html: "<b>Hello world?</b>",
        // fare email html carina 
    }
    const l = await send(options)
    console.log(l);
}

// Export functions
export default { send, subscribe }