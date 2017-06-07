// grab the packages that we need for the user model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
var config = require('../../config');


//connect to local database
db = mongoose.createConnection(config.database);

//tracker schema
var TrackerSchema = new Schema({
    name: String,
    type: String,
    port: String,
    weft: String,
    parsed_data: String, 
    frequency: Number,
});

TrackerSchema.pre('save',function(next){
    var tracker = this;
    return next();

});

//return the model
module.exports = db.model('Tracker',TrackerSchema);

