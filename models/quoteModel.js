const mongoose = require('mongoose');

const QuoteSchema = mongoose.Schema({
    quote: String,
    author: String,
    favorite: Boolean,
    myQuote: Boolean,
    date: String,
    owner: String,
},{
    timestamps: true
});

module.exports = mongoose.model('Quote', QuoteSchema);