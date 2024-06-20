const jwt = require('jsonwebtoken');

class JWTTOKEN {
    create(data) {
        return jwt.sign(data, process.env.SECRET_KEY);
    }
    
    verify(token) {
        return jwt.verify(token, process.env.SECRET_KEY)
    }
}

module.exports = new JWTTOKEN();