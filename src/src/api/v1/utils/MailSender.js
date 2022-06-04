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
        // html: "<div class='flex flex-col justify-center items-center h-screen'><section class='font-mono min-w-[400px] max-w-[800px] bg-white flex flex-col shadow-md rounded-lg border border-gray-300 mx-auto'><header><img src='https://www.avo4camerun.kirinsecurity.com/logo_esteso3.png' alt='logo' class='p-8' draggable='false'><hr class='border-gray-300'><hr class='border-gray-300 mt-[1px]'></header><p class='p-8 h-full'>Testo per la conferma dell'account</p><footer class='flex flex-wrap justify-between items-center px-5 py-5'><a href='https://app.avo4camerun.kirinsecurity.com/login' class='break-all text-blue-800 decoration-1 hover:underline'>https://app.avo4camerun.kirinsecurity.com/login</a><button type='button' class='text-white bg-green-700 font-medium rounded-lg text-sm px-5 py-2.5 hover:bg-green-800'>Confirm Account</button></footer></section></div>",
        // aggiungere il testo di conferma account 
    }
    const l = await send(options)
    console.log(l);
}

// Export functions
export default { send, subscribe }