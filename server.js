const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const compression = require('compression');
const morgan = require('morgan');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var mongoose = require('mongoose');
var cloudinary = require('cloudinary');
const port = process.env.PORT || 8000;
const dev = app.get('env') !== 'production';

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(`${__dirname}/client/build`));
}

mongoose.connect('mongodb://admin:admin0@ds253840.mlab.com:53840/momentum', {
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 1000
})
.then(() => {
  console.log("Successfully connected to the database");    
}).catch(err => {
  console.log('Could not connect to the database. Exiting now...');
  process.exit();
});
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({
    secret: 'work hard',
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
      mongooseConnection: db
    })
  }));

app.use((req, res, next)=>{
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS, PATCH, DELETE, origin, content-type, accept, authorization');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.locals.session =  req.session;
  if (req.method === "OPTIONS") 
        res.sendStatus(200);
  else 
        next();
});

require('./routes/userRoutes')(app);
require('./routes/utilityRoutes')(app);

cloudinary.config({ 
    cloud_name: 'momentumclone', 
    api_key: '926273352413646', 
    api_secret: 'TIa4CY9Wslb47bqnFMdiFW_ZorI' 
});

const Photo = require('./models/photoModel.js');

app.use(fileUpload());
app.use('/public', express.static(__dirname + '/public'));

app.post('/photos', (req, res, next) => {
    let imageFile = req.files.file;
    Photo.find({
        fileName: req.body.filename
      }, (err, prevPhotos) => {
        if (err) {
          return res.send({
            success: false,
            message: 'Server error'
          });
        } else if (prevPhotos.length > 0) {
          return res.status(400).send({
            success: false,
            message: 'Duplicate upload'
          })
        } else {
            imageFile.mv(`${__dirname}/public/${req.body.filename}`, err => {
                if (err) {
                    console.log(err);
                    res.send(err);
                }
            });
            cloudinary.uploader.upload(`${__dirname}/public/${req.body.filename}`, result => { 
                const photo = new Photo({
                    url: `${result.url.replace("http", "https")}`,
                    fileName: req.body.filename,
                    favorite: false,
                    myPhoto: true,
                    owner: req.session.userId,
                }); 
                photo.save()
                .then(data => res.send(data))
                .catch(err => {
                    res.status(500).send({
                        message: err.message || "Some error occurred while uploading the photo."
                    });
                });
            });
        }
    });
});

app.get('/photos', (req, res) => {
    Photo.find(
        { $or: [ { owner: "default" }, { owner: req.session.userId } ] }).sort('-createdAt')
    .then(photos => res.send(photos))
    .catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving photos."
        });
    });
});

app.get('/photos/:photoId', (req, res) => {
    Photo.findById(req.params.photoId)
    .then(photo => {
        if(!photo) {
            return res.status(404).send({
                message: "photo not found with id " + req.params.photoId
            });            
        }
        res.send(photo);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "photo not found with id " + req.params.photoId
            });                
        }
        return res.status(500).send({
            message: "Error retrieving photo with id " + req.params.photoId
        });
    });
});

app.put('/photos/:photoId', (req, res) => {
    Photo.findByIdAndUpdate(req.params.photoId, {
        favorite: req.body.favorite,
    }, {new: true})
    .then(photo => {
        if(!photo) {
            return res.status(404).send({
                message: "photo not found with id " + req.params.photoId
            });
        }
        res.send(photo);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "photo not found with id " + req.params.photoId
            });                
        }
        return console.log(err);
    });
});

app.delete('/photos/:photoId', (req, res) => {
    Photo.findByIdAndRemove(req.params.photoId)
    .then(photo => {
        if(!photo) {
            return res.status(404).send({
                message: "photo not found with id " + req.params.photoId
            });
        }
        res.send({message: "photo deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "photo not found with id " + req.params.photoId
            });                
        }
        return res.status(500).send({
            message: "Could not delete photo with id " + req.params.photoId
        });
    });
});

app.listen(port, () => {
  console.log('Express app listening on port 8000');
});