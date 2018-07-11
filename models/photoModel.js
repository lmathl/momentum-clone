const mongoose = require('mongoose');

const PhotoSchema = mongoose.Schema({
    url: String,
    fileName: String,
    favorite: Boolean,
    myPhoto: Boolean,
    owner: String,
}, {
    timestamps: true
});

module.exports = mongoose.model('Photo', PhotoSchema);