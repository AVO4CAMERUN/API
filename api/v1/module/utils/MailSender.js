// Module for send email

const nodemailer = require('nodemailer');

// Data
const services = process.env.MAIL_SERVICE
const user = process.env.MAIL_USER
const pass = process.env.MAIL_PASS

console.log(services, user, pass);

const transporter = nodemailer.createTransport({
    services,
    secure: true, // use SSL
    auth: {user,  pass}
});

// Email sending Method

function send (recipient, confirmCode) {

    console.log(transporter)

    this.mailOptions = {
        from: transporter.user,
        to: recipient,
        subject: 'Sending Email using Node.js', //title
        html: `<b>http://localhost/api/v1/account/${confirmCode}</b>` //html email CAMBIARE LINK IN PAGINA CHE USA API
    }
    transporter.sendMail(this.mailOptions, (err, info) => {
        err ? console.log(err): console.log('Email sent: ' + info.response);
    })
}

// Export functions
module.exports = {
    send
};