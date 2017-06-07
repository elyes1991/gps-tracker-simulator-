var express  = require('express'); // call express
var app = express();    // define our app using express
var bodyParser = require('body-parser'); // get body parser
var morgan = require('morgan'); // used to see requests
var mongoose = require('mongoose'); // for working with our database
var config = require('./config');
var path = require('path');
var Tracker = require('./app/models/tracker.js');

// Application Configuration
// use body parser so we can grab information from POST requests
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Configure our app to handle CORS requests
app.use(function(req,res,next){
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Methods','GET,POST');
    res.setHeader('Access-Control-Allow-Headers','X-Requested-With,content-type, \Authorization');
    next();
});

// log all requests to the console
app.use(morgan('dev'));

//connect to local database
mongoose.connect(config.database);

//set static files location
//used for requests that our frontend will make
app.use(express.static(__dirname + '/public'));

//Routes for our api ===============
// =================================

//Api Routes
var apiRoutes = require('./app/routes/api')(app,express);
// Tracker APIs
var trackerApiRoutes = require('./app/routes/trackers-api')(app,express);

app.use('/api',apiRoutes);
app.use('/trackers-api',trackerApiRoutes);

// Main catchCall Route------------
// Send users to frontend ---------
// has to be registred after API routes
app.get('*',function(req,res){
    // set the user information coming from the req 
    res.sendFile(path.join(__dirname + '/public/app/views/index.html' ));
});

        
// start the server
app.listen(config.port);
//console.log('Magic happens in port '+ config.port);






