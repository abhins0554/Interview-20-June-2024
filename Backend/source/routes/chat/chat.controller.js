const ChatModel = require('./chat.model');

const { successHandler } = require('../../utils/helper/successHandler');


class ChatController {

    async getChat(req, res, next) {
        try {
            let { _id } = req.decoded;
            let pollsData = await ChatModel.getAllChats({ _id });

            return successHandler(res, 200, pollsData, 'Success', null);
        } catch (error) {
            return next(error);
        }
    }
}

module.exports = new ChatController();
