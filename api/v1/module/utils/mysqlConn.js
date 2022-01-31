// Util Class for comuntication with DB
const mysql = require('mysql');

class DBservices {

    constructor(host, user, password, database) {
        this.host = host;
        this.user = user;
        this.password = password;
        this.database = database;
    }

    // --------------------------- Utils methods  -------------------------

    // Get string date yyyy-mm-gg 
    getDateString(){
        let today = new Date();
        return `${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()}`;
    }
    
    // Get array from string 
    strToArray(str){
        str = str.substring(1, str.length-1)
        return str.split(',')
    }

    // --------------------------- Query methods ----------------------------

    // --------------------------- Utils query methods ----------------------

    // Generic Query -->  gestire gli errori da then e catch
    genericQuery(query){
        let c = this.connect;
        // console.log(query);
        return new Promise( (res, rej) => {
            c.query(query, (err, result) => {
                    if(err) rej(err)  
                    else res(result) 
            });
        });  

    }

    // Cycle Generic request
    async genericCycleQuery(...queryObjs){
        const contex = this;
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
        for (let i = 0; i < queryObjs.length; i++) {
            
            //console.log(queryObjs[i])
            let qm = queryObjs[i]?.queryMethod;
            let par = queryObjs[i]?.par;
            
            //console.log(...par);

            // Promise  //Spread array par
            promises.push(await qm(contex, ...par))
            // console.log(await qm(contex, par))
        }

        this.connect.end()                    // Close connect
        return Promise.allSettled(promises)   // Return results wrapped in promises array
    }

    // Generic methods generate PUT request
    createUpdateQuery(tableName, whereObj, putDataObj){
        let query = `UPDATE ${tableName} SET`;
        let putDatakeys = Object.keys(putDataObj)
        let whereKey = Object.keys(whereObj)
        
        // 
        for (const key of putDatakeys) {
            query += ` ${key} = '${putDataObj[key]}',`
        }
        query = query.substring(0, query.length -1)

        query += ` WHERE ${whereKey} = '${whereObj[whereKey]}'`
        //console.log(whereKey);
        return query;
    }

    // Generic methods generate GET request
    createGetQuery(tableName, fieldsDataRequest, filterObj){

        // Generete selected fields
        let query = `SELECT` 
        for (const key of fieldsDataRequest) {
            query += ` ${key},`
        }
        query = query.substring(0, query.length -1) // Troncate last comma
        query += ` FROM ${tableName}`               // Add table target

        // Checks if the filter obj exists
        if(typeof filterObj === 'object' && Object.keys(filterObj).length > 0){ 
            let fKeys = Object.keys(filterObj)  //

            // Build Cycle of WHERE condition 
            query +=` WHERE ` 
            for (const fKey of fKeys) {
                for (const value of filterObj[fKey]) {
                    query += ` ${fKey} = '${value}' OR`
                }
            }
            query = query.substring(0, query.length -2)
        }
        //console.log(filterObj[fKey]);
        //console.log(value);
        return query;  
    }

    // Generic methods generate one insert of n record (use in relaction tab)
    createMultiInsertQuery(tableName, identifier, fieldsData, fieldsValue){ //------------------------------------------------ Creare una query di n insert
        // INSERT INTO classes (name, img_cover, archived) VALUES ('${name}','${img}', '0');
        // Generete selected fields
        let query = `INSERT INTO ${tableName} (` 
        for (const key of fieldsData) {
            query += ` ${key},`
        }
        //query = query.substring(0, query.length -1) // Troncate last comma
        query += `) VALUES`                       // 

        // (value_list_1),
        // (value_list_2)

        // Build Cycle of n insert 
        for (const field of fieldsValue) { 
            query += `(${identifier}, '${value}'),`
        }
        query = query.substring(0, query.length -2)
        query += ';';
        return query;  
    }

    // Cerare delete generic 
    // fare generic post
    // --------------------------- Login --------------------------------

    // Check username and password (Auth) 
    async checkUsernamePassword(contex, username, password){
            return contex.genericQuery(`SELECT COUNT(*) FROM users WHERE username = '${username}' and password = SHA2('${password}', 256)`)
    }

    // Get info for tokens --// omologare a filtro by username
    async getUserInfoByUsername(contex, username){
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

    // --------------------------- Account ---------------------------

    // Query for create user
    async createAccount(contex, name, surname, username, password, email, role){
        let date = contex.getDateString();
        /*console.log(`INSERT INTO users (email, role, username, first_name, last_name, password, registration_date, img_profile, id_class) 
        VALUES ('${email}', '${role}', '${username}', NULL, NULL, SHA2('${password}', 256), '${date}', NULL, NULL);`);*/

        return contex.genericQuery(`INSERT INTO users (email, role, username, firstname, lastname, password, registration_date, img_profile, id_class) 
        VALUES ('${email}', '${role}', '${username}', '${name}', '${surname}', SHA2('${password}', 256), '${date}', NULL, NULL);`)
    }

    // Query for delete user and all relaction
    async delateAccount(contex, email){
        return contex.genericQuery(`DELETE FROM users WHERE email='${email}';`)   
    }

    // Query for get all data user for email
    async getUserInfoByEmail(contex, email){
        return contex.genericQuery(`SELECT role, username, firstname, lastname, registration_date, img_profile, id_class FROM users WHERE email = '${email}'`)
    }

    // Query for get user data by filter
    async getUserDataByFilter(contex, filterObj){
        return contex.genericQuery(contex.createGetQuery('users', ["email", "role", "username", "lastname", "img_profile", "id_class"], filterObj))
    }

    // Query for update user by filter and option
    async updateUserInfo(contex, whereObj, putDataObj){
        return contex.genericQuery(contex.createUpdateQuery('users', whereObj, putDataObj))
    }

    // --------------------------- Classes ------------------------------
    
    // Query for create class
    async createClass(contex, name, img){
        return contex.genericQuery(`INSERT INTO classes (name, img_cover, archived) VALUES ('${name}','${img}', '0');`)
    }

    //
    async addProfsClass(contex, ){ //fare un sacco di update ai studenti e add prof in tab di relazione
        return contex.genericQuery(`INSERT INTO classes (name, img_cover, archived) VALUES ('${name}','${img}', '0');`)
    }

    // Query for get data class for id
    async getClassDataByID(contex, id){
        return contex.genericQuery(`SELECT id, name, img_cover, archived FROM classes WHERE id = '${id}'`)
    }

    // Query for get user data by filter
    async getClassDataByFilter(contex, filterObj){ // modificare createGetQuery con joinObj
        return contex.genericQuery(contex.createGetQuery('classes', ["id", "name", "img_cover", "archived"], filterObj))
    }
    
    // Check if the prof is tutor in the class 
    async isTutor(contex, email, id_class){
        return contex.genericQuery(`SELECT COUNT(*) FROM prof_classes WHERE email = '${email}' AND id_class = '${id_class}' AND role = 'tutor'`)   
    }

    // Query for update class by filter and option
    async updateClass(contex, whereObj, putDataObj){
        return contex.genericQuery(contex.createUpdateQuery('classes', whereObj, putDataObj))
    }

    // Query for delete class
    async delateClass(contex, id){
        return contex.genericQuery(`DELETE FROM classes WHERE id = '${id}';`)   
    }

    // --------------------------- Resource ---------------------------
}

module.exports = DBservices;