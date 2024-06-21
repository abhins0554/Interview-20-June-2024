const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ChatSchema = new Schema({
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    message: { type: String, required: true },
    time: { type: Number, required: true },
}, { timestamps: true });

ChatSchema.index({ email: 1 });

const chatModel = mongoose.model('chat', ChatSchema);

module.exports = chatModel;