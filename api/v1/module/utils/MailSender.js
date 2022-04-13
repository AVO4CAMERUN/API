// Module for send email

const { google } = require('googleapis');
const nodemailer = require('nodemailer');

// Data
const SERVICE       = process.env.MAIL_SERVICE
const USER          = process.env.MAIL_USER
const CLIENT_ID     = process.env.CLIENT_ID
const CLEINT_SECRET = process.env.CLIENT_SECRET
const REDIRECT_URI  = process.env.REDIRECT_URI
const REFRESH_TOKEN = process.env.REFRESH_TOKEN
// const htmlstream = fs.createReadStream("content.html");

// Create OAuth2 Client
const OAuth2 = new google.auth.OAuth2(CLIENT_ID, CLEINT_SECRET, REDIRECT_URI)
OAuth2.setCredentials({ refresh_token: REFRESH_TOKEN });

// Email sending Method
async function send(email, confirmCode) {
    // html email CAMBIARE LINK IN PAGINA CHE USA API
    // console.log(email, confirmCode);

    //
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

        // Send mail with defined transport object
        const mailOptions = {
            from: '"s Foo 👻" <foo@example.com>', // sender address
            to: "s5779870b@studenti.itisavogadro.it", // list of receivers
            subject: "Hello ✔", // Subject line
            text: "Hello world?", // plain text body
            html: "<b>Hello world?</b>", // html body
        }

        const info = await transporter.sendMail(mailOptions) // Sending email
        // console.log(info)
    } catch (error) {
        console.log(error);
        return error
    }
}

// Export functions
module.exports = {
    send
};

// Bisogna usare per forza OAuth2 per motivi sia di sicurezza sia perche glia altri metodi scadono il 30 maggio
// https://stackoverflow.com/questions/13871982/unable-to-refresh-access-token-response-is-unauthorized-client
// https://console.cloud.google.com/getting-started?pli=1
// https://www.npmjs.com/package/googleapis
// https://developers.google.com/adwords/api/docs/guides/authentication
// https://github.com/trulymittal/gmail-api/blob/master/app.js