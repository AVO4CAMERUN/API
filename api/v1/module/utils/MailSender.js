// Module for send email

const { google } = require('googleapis');
const nodemailer = require('nodemailer');

// Data
const service = process.env.MAIL_SERVICE
const user = process.env.MAIL_USER

const clientID = process.env.CLIENT_ID
const clientSecret = process.env.CLIENT_SECRET
const refreshToken = process.env.REFRESH_TOKEN
// const htmlstream = fs.createReadStream("content.html");

// da sistemare
// Create OAuth2 Client
// const OAuth2 = new google.auth.OAuth2(clientID, clientSecret, 'https://developers.google.com/oauthplayground')
// OAuth2.setCredentials({ refresh_token: refreshToken });
// const accessToken = OAuth2.getAccessToken()

//
/*const transporter = nodemailer.createTransport({
    service,
    auth: {
        type: 'OAuth2',
        user,
        clientID,
        clientSecret,
        refreshToken,
        accessToken 
    }
});*/

// Email sending Method
async function send(email, confirmCode) {
    //const mailOptions = {}
    // <b>http://${"127.0.0.1"}/api/v1/account/${confirmCode}</b>` //html email CAMBIARE LINK IN PAGINA CHE USA API

    console.log('-------------------------------------------------------');
    console.log(email, confirmCode);
    console.log('-------------------------------------------------------');

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"Fred Foo 👻" <foo@example.com>', // sender address
        to: "s5779870b@studenti.itisavogadro.it", // list of receivers
        subject: "Hello ✔", // Subject line
        text: "Hello world?", // plain text body
        html: "<b>Hello world?</b>", // html body
    });
    
    console.log("Message sent: %s", info.messageId);
}

// Export functions
module.exports = {
    send
};

// BIsogna usare per forza OAuth2 per motivi sia di sicurezza sia perche glia altri metodi scadono il 30 maggio
// https://stackoverflow.com/questions/13871982/unable-to-refresh-access-token-response-is-unauthorized-client
// https://console.cloud.google.com/getting-started?pli=1
// https://www.npmjs.com/package/googleapis
// https://developers.google.com/adwords/api/docs/guides/authentication