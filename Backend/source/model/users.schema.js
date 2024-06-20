const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UsersSchema = new Schema({
    fullname: { type: String, required: true },
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    is_active: { type: Boolean, default: true },
}, { timestamps: true });

UsersSchema.index({ email: 1 });

const userModel = mongoose.model('user', UsersSchema);

module.exports = userModel;