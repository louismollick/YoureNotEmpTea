const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    id: { type: Number, unique : true, required: true},
    token: { type: String, required: true },
    refresh_token: { type: String, required: true },
    username: { type: String, required: true },
    discriminator: { type: Number, required: true },
    avatar: { type: String, required: true }
}, { timestamps: true });

module.exports = User = mongoose.model('user', UserSchema);