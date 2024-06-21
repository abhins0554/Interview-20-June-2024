const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PollSchema = new Schema({
    question: { type: String, required: true },
    options: [{
        answer: { type: String, required: true },
        votes: { type: Number, default: 0 },
        voted: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true }]
    }],
    answered: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    is_active: { type: Boolean, default: true },
}, { timestamps: true });

PollSchema.index({ email: 1 });

const PollModel = mongoose.model('poll', PollSchema);

module.exports = PollModel;