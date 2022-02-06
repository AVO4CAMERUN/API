// Util Class for comuntication with DB
const mysql = require('mysql');

class DBservices {
    static host = "localhost";
    static user = "root";
    static password = "";
    static database = "avo4cum";

    // --------------------------- Utils methods  -------------------------

    // Get string date yyyy-mm-gg 
    static getDateString(){
        let today = new Date();
        return `${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()}`;
    }
    
    // Get array from string 
    static strToArray(str){
        str = str.substring(1, str.length-1)
        return str.split(',')
    }

    // --------------------------- Query methods ----------------------------

    // --------------------------- Utils query methods ----------------------

    // Generic Query -->  gestire gli errori da then e catch
    static genericQuery(query){
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
    static async genericCycleQuery(...queryObjs){
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
    static createUpdateQuery(tableName, whereObj, putDataObj){
        let query = `UPDATE ${tableName} SET`;
        let putDatakeys = Object.keys(putDataObj)
        let whereKey = Object.keys(whereObj)
        const regex = new RegExp('img_*');

        // 
        for (const key of putDatakeys) {
            if (regex.test(key)) 
                query += ` ${key} = ${putDataObj[key]},`
            else
                query += ` ${key} = '${putDataObj[key]}',`
        }
        query = query.substring(0, query.length -1)

        query += ` WHERE ${whereKey} = '${whereObj[whereKey]}'`
        //console.log(whereKey);
        return query;
    }

    // Generic methods generate GET request
    static createGetQuery(tableName, fieldsDataRequest, filterObj, opLogic = ''){

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
                    query += ` ${fKey} = '${value}' ${opLogic}`
                }
            }
            query = query.substring(0, query.length - opLogic.length)
        }
        //console.log(filterObj[fKey]);
        //console.log(value);
        return query;  
    }

    // Generic methods generate one insert of n record (use in relaction tab)
    static createMultiInsertQuery(tableName, identifier, fieldsData, fieldsValue){ //------------------------------------------------ Creare una query di n insert
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

    // FARE SELECT COUNT DIMANICA 
    // e delete dimanica
     
    // --------------------------- Login --------------------------------

    // Check username and password (Auth) 
    static async checkUsernamePassword(contex, username, password){
            return contex.genericQuery(`SELECT COUNT(*) FROM users WHERE username = '${username}' and password = SHA2('${password}', 256)`)
    }

    // Get info for tokens --// omologare a filtro by username
    static async getUserInfoByUsername(contex, username){
        return contex.genericQuery(`SELECT * FROM users WHERE username = '${username}'`)
    }

    // Check registerd method  
    static async isRegistred(contex, email){
        return contex.genericQuery(`SELECT COUNT(*) FROM users WHERE email = '${email}'`)
    }
    
    // Check free user  
    static async isFreeUsername(contex, username){
        return contex.genericQuery(`SELECT COUNT(*) FROM users WHERE username = '${username}'`)   
    }

    // --------------------------- Account ---------------------------

    // Query for create user
    static async createAccount(contex, name, surname, username, password, email, role){
        let date = contex.getDateString();
        /*console.log(`INSERT INTO users (email, role, username, first_name, last_name, password, registration_date, img_profile, id_class) 
        VALUES ('${email}', '${role}', '${username}', NULL, NULL, SHA2('${password}', 256), '${date}', NULL, NULL);`);*/

        return contex.genericQuery(`INSERT INTO users (email, role, username, firstname, lastname, password, registration_date, img_profile, id_class) 
        VALUES ('${email}', '${role}', '${username}', '${name}', '${surname}', SHA2('${password}', 256), '${date}', NULL, NULL);`)
    }

    // Query for get all data user for email
    static async getUserInfoByEmail(contex, email){
        return contex.genericQuery(`SELECT role, username, firstname, lastname, registration_date, img_profile, id_class FROM users WHERE email = '${email}'`)
    }

    // Check if the user is a prof
    static async isParameterRole(contex, email, role){
        return contex.genericQuery(`SELECT COUNT(*) FROM users WHERE email = '${email}' AND role = '${role}'`)
    }

    // Query for get user data by filter
    static async getUserDataByFilter(contex, filterObj){
        return contex.genericQuery(contex.createGetQuery('users', ["email", "role", "username", "lastname", "img_profile", "id_class"], filterObj, 'OR'))
    }

    // Query for update user by filter and option
    static async updateUserInfo(contex, whereObj, putDataObj){
        return contex.genericQuery(contex.createUpdateQuery('users', whereObj, putDataObj))
    }

    // Query for delete user and all relaction
    static async delateAccount(contex, email){
        return contex.genericQuery(`DELETE FROM users WHERE email='${email}';`)   
    }

    // --------------------------- Classes ------------------------------
    
    // Query for create class
    static async createClass(contex, name, img){
        return contex.genericQuery(`INSERT INTO classes (name, img_cover, archived) VALUES ('${name}','${img}', '0');`)
    }

    // Query for add relaction prof and class
    static async addProfsClass(contex, email, id_class, role){
        return contex.genericQuery(`INSERT INTO prof_classes (email, id_class, role) VALUES ('${email}','${id_class}', '${role}');`)
    }

    // Query for get data class for id
    static async getClassDataByID(contex, id){
        return contex.genericQuery(`SELECT id, name, img_cover, archived FROM classes WHERE id = '${id}'`)
    }

    // Query for get user data by filter
    static async getClassDataByFilter(contex, filterObj){ // modificare createGetQuery con joinObj
        return contex.genericQuery(contex.createGetQuery('classes', ["id", "name", "img_cover", "archived"], filterObj, "OR"))
    }

    // Check if the class is exist
    static async isExistClassByid(contex, class_id){
        return contex.genericQuery(`SELECT COUNT(*) FROM classes WHERE id = '${class_id}'`) 
    }

    // Check if the prof is tutor in the class 
    static async isParameterRoleInClass(contex, email, id_class, role){
        return contex.genericQuery(`SELECT COUNT(*) FROM prof_classes WHERE email = '${email}' AND id_class = '${id_class}' AND role = '${role}'`)   
    }

    // Query for update class by filter and option
    static async updateClass(contex, whereObj, putDataObj){
        return contex.genericQuery(contex.createUpdateQuery('classes', whereObj, putDataObj))
    }

    // Query for delete class
    static async delateClass(contex, id){
        return contex.genericQuery(`DELETE FROM classes WHERE id = '${id}';`)   
    }

    // --------------------------- Invitatios -------------------------

    // Query for add invite for join class 
    static async addClassInvite(contex, email, id_class){
        return contex.genericQuery(`INSERT INTO invitations (email, id_class) VALUES ('${email}','${id_class}');`)    
    }
    
    // Query for get invite data by filter
    static async getInvitedDataByFilter(contex, filterObj){
        return contex.genericQuery(contex.createGetQuery("invitations", ["*"], filterObj, "AND"))
    }

    // Accept invitations
    static async acceptInvitation(contex, id, email){
        return contex.genericQuery(`UPDATE users SET id_class = '${id}' WHERE email = '${email}'`)
    }

    // Delete invitations by id
    static async deleteInvitation(contex, id){
        return contex.genericQuery(`DELETE FROM invitations WHERE id = '${id}'`)
    }

    // --------------------------- Courses ---------------------------

    // Query for create course
    static async createCourse(contex, name, email, description, img_cover, subject){
        return contex.genericQuery(`INSERT INTO courses (name, description, img_cover, subject) 
        VALUES ('${name}','${email}','${description}', '${img_cover}', '${subject}');`)
    }

    // Query for get courses data by filter
    static async getCoursesDataByFilter(contex, filterObj){
        return contex.genericQuery(contex.createGetQuery("courses", ["*"], filterObj, "OR"))
    }

    // Query for update course by id and option
    static async updateCourses(contex, whereObj, putDataObj){
        return contex.genericQuery(contex.createUpdateQuery('courses', whereObj, putDataObj))
    }

    // Check if the prof is a creator
    static async isCourseCreator(contex, email, id_course){
        return contex.genericQuery(`SELECT COUNT(*) FROM courses WHERE email_creator = '${email}' AND id_course = '${id_course}'`)   
    }

    // Query for delete course
    static async delateCourse(contex, id){
        return contex.genericQuery(`DELETE FROM courses WHERE id_course = '${id}';`)   
    }

    // --------------------------- Units ---------------------------

    // Query for create unit
    static async createUnit(contex, name, description, id_course){
        return contex.genericQuery(`INSERT INTO units (id_course, name, description) 
        VALUES ('${id_course}','${name}','${description}');`)
    }
    
    // 
}

module.exports = DBservices;