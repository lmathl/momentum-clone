const mongoose = require('mongoose');

const FocusSchema = mongoose.Schema({
    focus: String,
    completed: Boolean,
    date: String,
    owner: String,
}, {
    timestamps: true
});

module.exports = mongoose.model('Focus', FocusSchema);