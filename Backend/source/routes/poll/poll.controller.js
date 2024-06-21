const pollValidation = require('./poll.validation');
const PollModel = require('./poll.model');

const JWTTOKEN = require('../../utils/helper/jwtHelper');

const { successHandler } = require('../../utils/helper/successHandler');
const { default: mongoose } = require('mongoose');

const { getIoInstance } = require('../../socket/socket.main');

class PollController {
    async createPoll(req, res, next) {
        try {
            let { _id } = req.decoded;
            let value = await pollValidation.validateCreatePoll(req.body);
            let { question, option } = value;

            let pollData = await PollModel.findPollBySameQuestion(question);
            if (pollData) return successHandler(res, 404, null, 'Poll with same question exist', "Poll with same question exist");

            let data = await PollModel.createPoll({ ...value, createdBy: _id });

            const io = getIoInstance();
            if (io) io.emit('poll_added', data);

            return successHandler(res, 200, data, 'Success', null);
        } catch (error) {
            return next(error);
        }
    }

    async getPoll(req, res, next) {
        try {
            let { _id } = req.decoded;
            let pollsData = await PollModel.getPollsData({ _id });

            return successHandler(res, 200, pollsData, 'Success', null);
        } catch (error) {
            return next(error);
        }
    }

    async votePoll(req, res, next) {
        try {
            let { _id: user_id } = req.decoded;
            let value = await pollValidation.validateVotePoll(req.body);
            let { _id, poll_id } = value;

            let pollData = await PollModel.findPollById(_id);
            if (!pollData) return successHandler(res, 404, null, 'Poll not found', 'Poll not found');

            pollData.options = pollData.options.map(i => {
                if (i._id.toString() == poll_id.toString()) {
                    i.votes++;
                    i.voted.push(new mongoose.Types.ObjectId(user_id));
                }
                return i;
            })

            pollData.answered.push(new mongoose.Types.ObjectId(user_id));
            await pollData.save();

            const io = getIoInstance();
            if (io) io.emit('poll_added', pollData);

            return successHandler(res, 200, pollData, 'Success', null);
        } catch (error) {
            return next(error);
        }
    }
}

module.exports = new PollController();
