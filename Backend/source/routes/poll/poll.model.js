const mongoose = require('mongoose');
const PollSchema = require('../../model/polls.schema');

class PollModel {
    findPollBySameQuestion(question) {
        return PollSchema.findOne({ question: question });
    }

    findUserByUserName(username) {
        return PollSchema.findOne({ username: username });
    }

    createPoll(data) {
        return new PollSchema(data).save();
    }

    getPollsData({ _id }) {
        return PollSchema.aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: 'createdBy',
                    foreignField: '_id',
                    as: 'createdBy'
                }
            },
            {
                $unwind: "$createdBy"
            },
            {
                $project: {
                    _id: 1,
                    question: 1,
                    options: {
                        $map: {
                            input: "$options",
                            as: "option",
                            in: {
                                answer: "$$option.answer",
                                votes: "$$option.votes",
                                _id: "$$option._id",
                                votedByUser: {
                                    $cond: {
                                        if: { $in: [new mongoose.Types.ObjectId(_id), { $ifNull: ["$$option.voted", []] }] },
                                        then: true,
                                        else: false
                                    }
                                }
                            }
                        }
                    },
                    createdBy: 1,
                    createdBy: {
                        _id: "$createdBy._id",
                        username: "$createdBy.username",
                        email: "$createdBy.email"
                    },
                    answered: 1,
                }
            },
            {
                $addFields: {
                    answeredCount: { $size: "$answered" },
                    answered: {
                        $cond: { if: { $in: [new mongoose.Types.ObjectId(_id), "$answered"] }, then: true, else: false }
                    }
                }
            }
        ]);
    }

    findPollById(_id) {
        return PollSchema.findOne({ _id: new mongoose.Types.ObjectId(_id) });
    }
}

module.exports = new PollModel();