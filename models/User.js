const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    _id: { type: Number, required: true },
    token: { type: String, required: true },
    refresh_token : { type: String, required: true },
    name: { type: String, required: true },
    discriminator: { type: Number, required: true },
    dateSignUp: { type: Date, default: Date.now }
});

module.exports = User = mongoose.model('user', UserSchema);