const Focus = require('../models/focusModel.js');

exports.create = (req, res) => {
    if(!req.body.focus) {
        return res.status(400).send({
            message: "focus cannot be empty"
        });
    }

    function getDate(){
        var d = new Date();
        d.setDate(d.getDate()); 
        return d.getFullYear() + "-" + ("0"+(d.getMonth()+1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2);
    }

    const focus = new Focus({
        focus: req.body.focus, 
        completed: false,
        date: getDate(),
        owner: req.session.userId,
    });

    focus.save()
    .then(data => {
         res.send(data);
        })
    .catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the focus."
        });
    });
};

exports.findAll = (req, res) => {
    Focus.find({ owner: req.session.userId }).sort('-createdAt')
    .then(focus => res.send(focus))
    .catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving focuss."
        });
    });
};

exports.findOne = (req, res) => {
    Focus.findById(req.params.focusId)
    .then(focus => {
        if(!focus) {
            return res.status(404).send({
                message: "focus not found with id " + req.params.focusId
            });            
        }
        res.send(focus);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "focus not found with id " + req.params.focusId
            });                
        }
        return res.status(500).send({
            message: "Error retrieving focus with id " + req.params.focusId
        });
    });
};

exports.update = (req, res) => {
    Focus.findByIdAndUpdate(req.params.focusId, {
        completed: req.body.completed,
    }, {new: true})
    .then(focus => {
        if(!focus) {
            return res.status(404).send({
                message: "focus not found with id " + req.params.focusId
            });
        }
        res.send(focus);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "focus not found with id " + req.params.focusId
            });                
        }
        return console.log(err);
    });
};

exports.delete = (req, res) => {
    Focus.findByIdAndRemove(req.params.focusId)
    .then(focus => {
        if(!focus) {
            return res.status(404).send({
                message: "focus not found with id " + req.params.focusId
            });
        }
        res.send({message: "focus deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "focus not found with id " + req.params.focusId
            });                
        }
        return res.status(500).send({
            message: "Could not delete focus with id " + req.params.focusId
        });
    });
};