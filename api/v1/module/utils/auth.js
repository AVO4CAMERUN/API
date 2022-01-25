const jwt = require('jsonwebtoken');

// Static class for auth
class Auth {

    // Da mettere in auth.js
    static accessTokenSecret = 'youraccesstokensecret';
    static refreshTokenSecret = 'yourrefreshtokensecrethere';
    static refreshTokens = [];

    // Middleware authenticateJWT
    static authenticateJWT(req, res, next) {
        const authHeader = req.headers.authorization;

        if (authHeader) {
            const token = authHeader.split(' ')[1];

            jwt.verify(token, Auth.accessTokenSecret, (err, user) => {
                if (err) return res.sendStatus(403);
                
                req.user = user;
                next();
            });
        } else {
            res.sendStatus(401);    // Unauthorized 
        }
    }  

    // Methods for take token from authorization 
    static parseAuthorization(authorization){
        //fare try e catch per undefinded value
        const token = req.headers.authorization.split(' ')[1];  // Extract token
        return jwtToObj(token)
    }
    
    // Methods for decode token Base64
    static jwtToObj(token) {
        let payload = token.split('.')[1];
        let buff = Buffer.from(payload, 'base64'); 
        let obj = JSON.parse(buff.toString());
        
        return obj;
    }
}

module.exports = Auth;
//semplificare con un solo token