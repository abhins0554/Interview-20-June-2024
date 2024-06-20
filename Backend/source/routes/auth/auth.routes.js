if (process.env.IS_DEBUGGING) console.log(__filename);
const routers = require('express').Router();

const AuthController = require("./auth.controller")

class AuthRouter {
    constructor() {
        this.myRoutes = routers;
        this.core();
    }

    core() {
        this.myRoutes.post('/login', AuthController.login);
        this.myRoutes.post('/signup', AuthController.signup);
    }

    getRouters() {
        return this.myRoutes;
    }
}

module.exports = AuthRouter;