const jwtHelper = require('../utils/helper/jwtHelper');

class AuthMiddleware {
    authenticate(req, res, next) {
        try {
            let token = req.headers['authorization'];
            if (!token) return next(new Error('Invalid Token'));

            const bearerToken = token.split(' ');
            if (!bearerToken.length) return next(new Error('Invalid Token'));
            const accessToken = bearerToken[1];
            if (!accessToken) return next(new Error('Invalid Token'));

            let data = jwtHelper.verify(accessToken);
            if (!data) return next(new Error('Invalid Token'));
            req.decoded = data;
            return next();
        } catch (error) {
            return next(error);
        }
    }

    authenticateSocket(accessToken) {
        try {
            return jwtHelper.verify(accessToken);
        } catch (error) {
            return null
        }
    }
}


module.exports = new AuthMiddleware();