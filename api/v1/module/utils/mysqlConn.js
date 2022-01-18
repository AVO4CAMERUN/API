// Util Class for comuntication with DB
const mysql = require('mysql');

class DBservices {

    constructor(host, user, password, database) {
        this.host = host;
        this.user = user;
        this.password = password;
        this.database = database;
    }

    // --------------------------- Utils methods  ---------------------------

    // Get string date yyyy-mm-gg 
    getDateString(){
        let today = new Date();
        return `${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()}`;
    }
    
    // --------------------------- Query methods ---------------------------

    // Generic Query -->  gestire gli errori da then e catch
    genericQuery(query){
        let c = this.connect;
    
        return new Promise( (res, rej) => {
            c.query(query, (err, result) => {
                    if(err) rej(err)  
                    else res(result) 
            });
        });  

    }

    // Cycle Generic request
    async genericCycleQuery(...queryObjs){
        const contex = this;                            //fare for of di query o poi fare close
        const {host, user, password, database} = this;

        // Start connect
        this.connect = mysql.createConnection({
            host,
            user,
            password, 
            database
        })
    
        // Query execute
        let promises = []
        for (let i = 0; i < queryObjs.length; i++) {    // non funziaona for of forse per async 
            
            //console.log(queryObjs[i])
            let qm = queryObjs[i]?.queryMethod;
            let par = queryObjs[i]?.par;
            
            //console.log(...par);

            // Promise  //Spread array par
            promises.push(await qm(contex, ...par))
            //console.log(await qm(contex, par))
        }

        this.connect.end()                    // Close connect
        return Promise.allSettled(promises)   // Return results wrapped in promises array
    }

    // Check username and password (Auth) 
    async checkUsernamePassword(contex, username, password){
        return contex.genericQuery(`SELECT COUNT(*) FROM users WHERE username = '${username}' and password = SHA2('${password}', 256)`)
    }   //

    // Get info for tokens -------------------------------// omologare a filtro by username
    async getUserInfo(contex, username){
        return contex.genericQuery(`SELECT * FROM users WHERE username = '${username}'`)
    }

    // Check registerd method  
    async isRegistred(contex, email){
        return contex.genericQuery(`SELECT COUNT(*) FROM users WHERE email = '${email}'`)
    }
    
    // Check free user  
    async isFreeUsername(contex, username){
        return contex.genericQuery(`SELECT COUNT(*) FROM users WHERE username = '${username}'`)   
    }

    // Query for create user
    async createAccount(contex, username, password, email, role){
        let date = contex.getDateString();
        /*console.log(`INSERT INTO users (email, role, username, first_name, last_name, password, registration_date, img_profile, id_class) 
        VALUES ('${email}', '${role}', '${username}', NULL, NULL, SHA2('${password}', 256), '${date}', NULL, NULL);`);*/

        return contex.genericQuery(`INSERT INTO users (email, role, username, first_name, last_name, password, registration_date, img_profile, id_class) 
        VALUES ('${email}', '${role}', '${username}', NULL, NULL, SHA2('${password}', 256), '${date}', NULL, NULL);`)
    }

    // Query for delete user and all relaction
    async delateAccount(contex, email){
        return contex.genericQuery(`DELETE FROM users WHERE email='${email}';`)   
    }

    // --------------------------- Resource ---------------------------
    
    //da veder in base anche a quelle comun sopra
    
    // User
    async getAllDataUsers(contex){
        return contex.genericQuery(`SELECT *  FROM users;`)
    }
    // fare le risorse per tabella 
}

module.exports = DBservices;