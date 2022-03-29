// Module for send email

const nodemailer = require('nodemailer');

// Data
const services = process.env.MAIL_SERVICE
const user = process.env.MAIL_USER
const pass = process.env.MAIL_PASS
// const htmlstream = fs.createReadStream("content.html");

let poolConfig = `smtps://${user}:${pass}@smtp.gmail.com/?pool=true`;

const transporter = nodemailer.createTransport(poolConfig)
/*
const transporter = nodemailer.createTransport({
    services,
    port: 587,
    secure: false, // use SSL
    auth: { user, pass }
});
*/
// console.log(services, user, pass);
// console.log(transporter)

// Email sending Method
function send(email, confirmCode) {
    
    const mailOptions = {
        from: transporter.options.auth.user,
        to: email,
        subject: 'Sending Email using Node.js', //title
        html: `<b>http://${"127.0.0.1"}/api/v1/account/${confirmCode}</b>` //html email CAMBIARE LINK IN PAGINA CHE USA API
    }

    transporter.sendMail(mailOptions, (err, info) => {
        err ? console.log(err): console.log('Email sent: ' + info.response);
    })
}

// Export functions
module.exports = {
    send
};