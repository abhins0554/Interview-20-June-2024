if (process.env.IS_DEBUGGING) console.log(__filename);
const routers = require('express').Router();

const PollController = require("./poll.controller")

class AuthRouter {
    constructor() {
        this.myRoutes = routers;
        this.core();
    }

    core() {
        this.myRoutes.use('/create-poll', PollController.createPoll);
        this.myRoutes.use('/get-poll', PollController.getPoll);
        this.myRoutes.use('/vote-poll', PollController.votePoll);
    }

    getRouters() {
        return this.myRoutes;
    }
}

module.exports = AuthRouter;