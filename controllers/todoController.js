const Todo = require('../models/todoModel.js');

exports.create = (req, res) => {
    if(!req.body.todo) {
        return res.status(400).send({
            message: "todo cannot be empty"
        });
    }
    
    const todo = new Todo({
        todo: req.body.todo, 
        completed: false,
        createdDate: new Date().toLocaleDateString("en-us", {month:"short"}) + ' ' + new Date().getDate(),
        owner: req.session.userId,
    });

    todo.save()
    .then(data => {
         res.send(data);
        })
    .catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the todo."
        });
    });
};

exports.findAll = (req, res) => {
    Todo.find({ owner: req.session.userId }).sort('createdDate')
    .then(todo => res.send(todo))
    .catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving todos."
        });
    });
};

exports.findOne = (req, res) => {
    Todo.findById(req.params.todoId)
    .then(todo => {
        if(!todo) {
            return res.status(404).send({
                message: "todo not found with id " + req.params.todoId
            });            
        }
        res.send(todo);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "todo not found with id " + req.params.todoId
            });                
        }
        return res.status(500).send({
            message: "Error retrieving todo with id " + req.params.todoId
        });
    });
};

exports.update = (req, res) => {
    Todo.findByIdAndUpdate(req.params.todoId, {
        todo: req.body.todo,
        completed: req.body.completed,
        completedDate: req.body.completedDate
    }, {new: true})
    .then(todo => {
        if(!todo) {
            return res.status(404).send({
                message: "todo not found with id " + req.params.todoId
            });
        }
        res.send(todo);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "todo not found with id " + req.params.todoId
            });                
        }
        return console.log(err);
    });
};

exports.delete = (req, res) => {
    Todo.findByIdAndRemove(req.params.todoId)
    .then(todo => {
        if(!todo) {
            return res.status(404).send({
                message: "todo not found with id " + req.params.todoId
            });
        }
        res.send({message: "todo deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "todo not found with id " + req.params.todoId
            });                
        }
        return res.status(500).send({
            message: "Could not delete todo with id " + req.params.todoId
        });
    });
};