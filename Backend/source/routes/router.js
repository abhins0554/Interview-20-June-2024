if (process.env.IS_DEBUGGING) console.log(__filename);

const routers = require('express').Router();

const AuthRoutes = require('./auth/auth.routes');

class Router {
    constructor() {
        this.myRoutes = routers;
        this.core();
    }

    core() {
        this.myRoutes.use('/auth', new AuthRoutes().getRouters());
    }

    getRouters() {
        return this.myRoutes;
    }
}

module.exports = Router;