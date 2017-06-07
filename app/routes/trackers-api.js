var Tracker = require('../models/tracker.js');
var jwt = require('jsonwebtoken');
var config = require('../../config');


// super secret for creating tokens
var superSecret = config.secret;


module.exports =  function(app,express){
// instantiate the express router
var apiRouter = express.Router();

// API Rest création et récupération des données traceur
apiRouter
    .route('/trackers')
    .post(function(req,res){
        var tracker = new Tracker();
        tracker.name =  req.body.name;
        tracker.type =  req.body.type;
        tracker.port =  req.body.port;
        tracker.weft =  req.body.weft;
        tracker.parsed_data =  JSON.stringify(req.body.parsed_data);
        tracker.frequency= req.body.frequency;
           
        tracker.save(function(err){
            if(err){
                console.log(err);
            };
            console.log({message:'Tracker Created!'});
        });
    })
    .get(function(req,res){
        Tracker.find(function(err,trackers){
            if(err) res.send(err);
            res.json(trackers);
        });
    });
// API Rest création et récupération des données traceur
apiRouter.route('/trackers/:trackerId')
    .get(function(req,res){
        Tracker.findById(req.params.trackerId,function(err,tracker){
            if(err) res.send(err);
            res.json(tracker);
        });
    })
    .put(function(req,res){
        Tracker.findById(req.params.trackerId,function(err,tracker){
            if(err) res.send(err);

            if(req.body.name) tracker.name =  req.body.name;
            if(req.body.type) tracker.type =  req.body.type;
            if(req.body.port) tracker.port =  req.body.port;
            if(req.body.weft) tracker.weft =  req.body.weft;
            if(req.body.parsed_data) tracker.parsed_data =  JSON.stringify(req.body.parsed_data);
            if(req.body.frequency) tracker.frequency= req.body.frequency;

            tracker.save(function(err){
                if(err) res.send(err);
                res.json({message:'Tracker Modified!'});
            });
        });
    })
    .delete(function(req,res){
        Tracker.remove({
            _id:req.params.trackerId
        },function(err,tracker){
            if(err) return res.send(err);

            res.json({message:'successfully deleted'});
        });
    });

return apiRouter;

}