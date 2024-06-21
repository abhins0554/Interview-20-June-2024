if (process.env.IS_DEBUGGING) console.log(__filename);

const routers = require('express').Router();

const authMiddleware = require('../middleware/authMiddleware');
const AuthRoutes = require('./auth/auth.routes');
const PollRoutes = require('./poll/poll.routes');
const ChatRouter = require('./chat/chat.routes');

class Router {
    constructor() {
        this.myRoutes = routers;
        this.core();
    }

    core() {
        this.myRoutes.use('/auth', new AuthRoutes().getRouters());
        this.myRoutes.use(authMiddleware.authenticate);
        this.myRoutes.use('/poll', new PollRoutes().getRouters());
        this.myRoutes.use('/chat', new ChatRouter().getRouters());
    }

    getRouters() {
        return this.myRoutes;
    }
}

module.exports = Router;