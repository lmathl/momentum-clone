module.exports = function(app) {
    const focus = require('../controllers/focusController.js');
    const todo = require('../controllers/todoController.js');
    const notes = require('../controllers/noteController.js');
    const quotes = require('../controllers/quoteController.js');
    
    app.post('/focus', focus.create);
    app.get('/focus', focus.findAll);
    app.get('/focus/:focusId', focus.findOne);
    app.put('/focus/:focusId', focus.update);
    app.delete('/focus/:focusId', focus.delete);

    app.post('/todos', todo.create);
    app.get('/todos', todo.findAll);
    app.get('/todos/:todoId', todo.findOne);
    app.put('/todos/:todoId', todo.update);
    app.delete('/todos/:todoId', todo.delete);

    app.post('/notes', notes.create);
    app.get('/notes', notes.findAll);
    app.get('/notes/:noteId', notes.findOne);
    app.put('/notes/:noteId', notes.update);
    app.delete('/notes/:noteId', notes.delete);

    app.post('/quotes', quotes.create);
    app.get('/quotes', quotes.findAll);
    app.get('/quotes/:quoteId', quotes.findOne);
    app.put('/quotes/:quoteId', quotes.update);
    app.delete('/quotes/:quoteId', quotes.delete);
}