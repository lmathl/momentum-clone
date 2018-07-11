const Quote = require('../models/quoteModel.js');

exports.create = (req, res) => {
    if(!req.body.quote) {
        return res.status(400).send({
            message: "Quote cannot be empty"
        });
    }

    function getDate(){
        var d = new Date();
        d.setDate(d.getDate()); 
        return d.getFullYear() + "-" + ("0"+(d.getMonth()+1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2);
    }

    Quote.find({quote: req.body.quote, owner: req.session.userId}, (err, prevQuotes) => {
        if (err) {
          return res.send({
            success: false,
            message: 'Server error'
          });
        } else if (prevQuotes.length > 0) {
          return res.status(400).send({
            success: false,
            message: 'Duplicate quote'
          })
        } else {
            const quote = new Quote({
                quote: req.body.quote, 
                author: req.body.author || 'Unknown',
                favorite: false,
                myQuote: req.body.myQuote,
                date: getDate(),
                owner: req.session.userId,
            });
        
            quote.save()
            .then(data => res.send(data))
            .catch(err => {
                res.status(500).send({
                    message: err.message || "Some error occurred while creating the Quote."
                });
            });
        }
    });
};

exports.findAll = (req, res) => {
    Quote.find({ $or: [ { owner: "default" }, { owner: req.session.userId } ] }).sort('-createdAt')
    .then(quotes => res.send(quotes))
    .catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving quotes."
        });
    });
};

exports.findOne = (req, res) => {
    Quote.findById(req.params.quoteId)
    .then(quote => {
        if(!quote) {
            return res.status(404).send({
                message: "Quote not found with id " + req.params.quoteId
            });            
        }
        res.send(quote);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Quote not found with id " + req.params.quoteId
            });                
        }
        return res.status(500).send({
            message: "Error retrieving quote with id " + req.params.quoteId
        });
    });
};

exports.update = (req, res) => {
    Quote.findByIdAndUpdate(req.params.quoteId, {
        favorite: req.body.favorite,
    }, {new: true})
    .then(quote => {
        if(!quote) {
            return res.status(404).send({
                message: "Quote not found with id " + req.params.quoteId
            });
        }
        res.send(quote);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Quote not found with id " + req.params.quoteId
            });                
        }
        return console.log(err);
    });
};

exports.delete = (req, res) => {
    Quote.findByIdAndRemove(req.params.quoteId)
    .then(quote => {
        if(!quote) {
            return res.status(404).send({
                message: "Quote not found with id " + req.params.quoteId
            });
        }
        res.send({message: "Quote deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "Quote not found with id " + req.params.quoteId
            });                
        }
        return res.status(500).send({
            message: "Could not delete quote with id " + req.params.quoteId
        });
    });
};