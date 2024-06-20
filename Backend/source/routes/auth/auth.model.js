const userSchema = require('../../model/users.schema');

class AuthModel {
    findUserByEmail(email) {
        return userSchema.findOne({ email: email });
    }

    findUserByUserName(username) {
        return userSchema.findOne({ username: username });
    }

    createUser(data) {
        return new userSchema(data).save();
    }
}

module.exports = new AuthModel();