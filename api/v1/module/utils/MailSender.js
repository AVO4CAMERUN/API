// Module for send email

const nodemailer = require('nodemailer');

// Data
const services = process.env.MAIL_SERVICE
const user = process.env.MAIL_USER
const pass = process.env.MAIL_PASS
// const htmlstream = fs.createReadStream("content.html");

// console.log(services, user, pass);

const transporter = nodemailer.createTransport({
    services,
    port: 587,
    secure: true, // use SSL
    auth: { user, pass }
});

// Email sending Method
function send(recipient, confirmCode) {

    const mailOptions = {
        from: transporter.user,
        to: recipient,
        subject: 'Sending Email using Node.js', //title
        html: `<b>http://${"127.0.0.1"}/api/v1/account/${confirmCode}</b>` //html email CAMBIARE LINK IN PAGINA CHE USA API
    }

    transporter.sendMail(mailOptions, (err, info) => {
        err ? console.log(err): console.log('Email sent: ' + info.response);
    })
}

// Export functions
module.exports = {
    send,
    services
};