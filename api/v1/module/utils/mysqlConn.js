// Util Class for comuntication with DB

const mysql = require('mysql');

class DBservices {
    constructor(host, user, password, database) {
        this.connect = mysql.createConnection({
            host,
            user,
            password, 
            database
        })  
    }

    // Utils methods ----------------------------------------------------------------------

    // Get string date yyyy-mm-gg 
    getDateString(){
        let today = new Date();
        return `${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()}`;
    }

    //query methods ------------------------------------------------------------------------

    // Check username and password 
    checkUsernamePassword(username, password){
        let c = this.connect;
        
        return new Promise(function (res, rej) {
            c.query(`SELECT COUNT(*) FROM users WHERE username = '${username}' and password = '${password}'`, (err, result) =>{
                    if (err) rej(err);
                    else res(result);
            });
        });
          
    }

    // Get info for tokens
    getUserInfo(username){
        let c = this.connect;

        return new Promise( (res, rej) => {
            c.query(`SELECT * FROM users WHERE username = '${username}'`, (err, result) =>{
                    if (err) rej(err);
                    else res(result);
            });
        });
   
    }

    // Check registerd method  
    isRegistred(email){
        let c = this.connect;
        
        return new Promise(function (res, rej) {
            c.query(`SELECT COUNT(*) FROM users WHERE email = '${email}'`, (err, result) =>{
                    if (err) rej(err);
                    else res(result);
            });
        });   
    }
    
    // Check free user  
    isFreeUsername(username){
        let c = this.connect;
        
        return new Promise(function (res, rej) {
            c.query(`SELECT COUNT(*) FROM users WHERE username = '${username}'`, (err, result) =>{
                    if (err) rej(err);
                    else res(result);
            });
        });   
    }

    // Query for create user
    createAccount(username, password, email, role){
        let c = this.connect;
        let date = this.getDateString();

        return new Promise( (res, rej) => {
            //email, role, usename, first_name, last_name, password, registration_date, img_profile, id_class
            c.query(`INSERT INTO users VALUES ('${email}', '${role}','${username}', NULL, NULL, SHA2('${password}', 256), '${date}', NULL, NULL);`, (err, result) =>{
                    if (err) rej(err);
                    else res(result);
            });
        });
    }

    // Query for delete user and all relaction
    delateAccount(email){
        let c = this.connect;

        // Delete massivo garantito da delaet on cascate
        return new Promise( (res, rej) => {
            c.query(`DELETE FROM users WHERE email='${email}';`, (err, result) =>{
                    if (err) rej(err);
                    else res(result);
            });
        });    
    }

    // End comunication
    end(){
        this.connect.end();
    }
}

module.exports = DBservices;