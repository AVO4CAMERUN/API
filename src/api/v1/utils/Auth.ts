// Auth static class
import "dotenv/config"
import * as jwt from "jsonwebtoken"

class Auth {
    static accessTokenSecret:string = process.env.JWT_SECRET || ''
    static refreshTokenSecret:string = process.env.JWT_SECRET_REFRESH || ''
    static refreshTokens: string[] = [];

    // Middleware authenticateJWT
    static authenticateJWT(req, res, next) {
        const authHeader = req.headers.authorization;

        if (authHeader) {
            const token = authHeader.split(' ')[1];

            jwt.verify(token, Auth.accessTokenSecret, (err, user) => {
                if (err?.message === 'jwt expired')    return res.sendStatus(401);
                if (err?.message === 'invalid token')  return res.sendStatus(403);

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
        const token = authorization.split(' ')[1];  // Extract token
        return this.jwtToObj(token)
    }
    
    // Methods for decode token Base64
    static jwtToObj(token) {
        let payload = token.split('.')[1];
        let buff = Buffer.from(payload, 'base64'); 
        let obj = JSON.parse(buff.toString());
        return obj;
    }
}

export default Auth
