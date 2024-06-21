if (process.env.IS_DEBUGGING) console.log(__filename);
const routers = require('express').Router();

const ChatController = require("./chat.controller")

class ChatRouter {
    constructor() {
        this.myRoutes = routers;
        this.core();
    }

    core() {
        this.myRoutes.get('/get-chat', ChatController.getChat);
    }

    getRouters() {
        return this.myRoutes;
    }
}

module.exports = ChatRouter;