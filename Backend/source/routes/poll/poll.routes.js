if (process.env.IS_DEBUGGING) console.log(__filename);
const routers = require('express').Router();

const PollController = require("./poll.controller")

class PollRouter {
    constructor() {
        this.myRoutes = routers;
        this.core();
    }

    core() {
        this.myRoutes.post('/create-poll', PollController.createPoll);
        this.myRoutes.get('/get-poll', PollController.getPoll);
        this.myRoutes.post('/vote-poll', PollController.votePoll);
    }

    getRouters() {
        return this.myRoutes;
    }
}

module.exports = PollRouter;