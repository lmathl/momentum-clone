
const mongoose = require('mongoose');

const TodoSchema = mongoose.Schema({
    todo: String,
    completed: Boolean,
    createdDate: String,
    completedDate: String,
    owner: String,
});

module.exports = mongoose.model('Todo', TodoSchema);