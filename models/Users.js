const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {type : String, required: true, unique: true},
    password: {type: String, required: true},
    joined_at: {type: Date, default: Date.now}
})

module.exports = mongoose.model('Users', userSchema);