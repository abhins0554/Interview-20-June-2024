const pollValidation = require('./poll.validation');
const PollModel = require('./poll.model');

const JWTTOKEN = require('../../utils/helper/jwtHelper');

const { successHandler } = require('../../utils/helper/successHandler');

class AuthController {
    async createPoll(req, res, next) {
        try {
            let { _id } = req.decoded;
            let value = await pollValidation.validateCreatePoll(req.body);
            let { question, option } = value;

            let pollData = await PollModel.findPollBySameQuestion(question);
            if (pollData) return successHandler(res, 404, null, 'Poll with same question exist', "Poll with same question exist");

            let data = await PollModel.createPoll({ ...value, createdBy: _id });

            return successHandler(res, 200, data, 'Success', null);
        } catch (error) {
            return next(error);
        }
    }

    async getPoll(req, res, next) {
        try {
            let value = await pollValidation.validateUserSignup(req.body);
            let { email, password, username } = value;


            return successHandler(res, 200, userData, 'Success', null);
        } catch (error) {
            return next(error);
        }
    }

    async votePoll(req, res, next) {
        try {
            let value = await pollValidation.validateUserSignup(req.body);
            let { email, password, username } = value;


            return successHandler(res, 200, userData, 'Success', null);
        } catch (error) {
            return next(error);
        }
    }
}

module.exports = new AuthController();
