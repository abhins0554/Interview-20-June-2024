const authValidation = require('./auth.validation');
const AuthModel = require('./auth.model');

const JWTTOKEN = require('../../utils/helper/jwtHelper');

const { successHandler } = require('../../utils/helper/successHandler');

class AuthController {
    async login(req, res, next) {
        try {
            let value = await authValidation.validateUserAuth(req.body);
            let { email, password } = value;
            let userData = await AuthModel.findUserByEmail(email);
            if(!userData) return successHandler(res, 404, null, 'User not found', "No user with given email");

            if(password !== userData.password) return successHandler(res, 400, null, 'Invalid password', "Invalid password");
            let { password : pass, ...temp } = userData._doc;
            userData = {
                token: JWTTOKEN.create(temp),
                ...temp,
            }
            return successHandler(res, 200, userData, 'Success', null);
        } catch (error) {
            return next(error);
        }
    }

    async signup(req, res, next) {
        try {
            let value = await authValidation.validateUserSignup(req.body);
            let { email, password, username } = value;
            let [vallidateEmail, validateUserName ] = await Promise.all([
                AuthModel.findUserByEmail(email),
                AuthModel.findUserByUserName(username)
            ]);

            if(vallidateEmail) return successHandler(res, 400, null, 'Email already exist', "Email already exist");
            if(validateUserName) return successHandler(res, 400, null, 'Username already exist', "Username already exist");

            let userData = await AuthModel.createUser(value);

            return successHandler(res, 200, userData, 'Success', null);
        } catch (error) {
            return next(error);
        }
    }
}

module.exports = new AuthController();
