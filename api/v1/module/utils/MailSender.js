const nodemailer = require('nodemailer');

// Class for send email
class MailSender {

    constructor(service, user, pass){
        this.transporter = nodemailer.createTransport({
            service,
            auth: {user,  pass}
        });   
    }

    // Email sending Method
    send(recipient, confirmCode){
        let u = this.transporter.user;
        
        this.mailOptions = {
            from: u,
            to: recipient,
            subject: 'Sending Email using Node.js', //title
            html: `<b>http://localhost/api/v1/account/${confirmCode}</b>` //html email CAMBIARE LINK IN PAGINA CHE USA API
        }

        this.transporter.sendMail(this.mailOptions, (err, info) => {
            //err ? console.log(err): console.log('Email sent: ' + info.response);
        });   
    }

    // Email sending Method
    sendConfirmEmail(recipient, confirmCode){
        send(recipient, )
    }
}

module.exports = MailSender;