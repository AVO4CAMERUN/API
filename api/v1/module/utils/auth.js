const fs = require('fs');
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

    // Methods for decode token Base64
    static parseJwt(token) {
        let payload = token.split('.')[1];
        let buff = Buffer.from(payload, 'base64'); 
        let obj = JSON.parse(buff.toString());
        
        return obj;
    }
}

module.exports = Auth;