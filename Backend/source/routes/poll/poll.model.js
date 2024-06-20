const PollSchema = require('../../model/polls.schema');

class AuthModel {
    findPollBySameQuestion(question) {
        return PollSchema.findOne({ question: question });
    }

    findUserByUserName(username) {
        return PollSchema.findOne({ username: username });
    }

    createPoll(data) {
        return new PollSchema(data).save();
    }
}

module.exports = new AuthModel();