const mongoose = require('mongoose');
const ChatSchema = require('../../model/chat.schema');

class ChatModel {
    getAllChats() {
        return ChatSchema.aggregate([
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
                    message: 1,
                    time: 1,
                    createdAt: 1,
                    "createdBy._id": 1,
                    "createdBy.fullname": 1,
                    "createdBy.email": 1,
                    "createdBy.username": 1,
                }
            }
        ]);
    }
}

module.exports = new ChatModel();