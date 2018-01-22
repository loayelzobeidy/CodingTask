module.exports = function(app,mongo) {
    var path    = require('path');
    var messages =require('./messages.js');
    var db=require('./db.js');
    var http = require('http');
    app.all('*', function(req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
        next();
    });


    app.get('/', function (req, res) {
      res.sendFile(__dirname + '/public/index.html');
    });

    app.get('/api/data/messages', function(rep, res){
    	var flights = require('../messages.json');
    	res.json(flights);
    });

      /* SEED DB */
    app.get('/db/seed', function(req, res) {


        messages.seedDB(function(){
             db.db().collection('messages').count(function(err,count){     //testing seed
                console.log(count);

             });
        });

    });

    /* DELETE DB */
    app.get('/db/delete', function(req, res) {

        db.clearDB(function(){

            db.db().collection('messages').count(function(err,count){     //testing delete

                console.log(count);                                      //  (new) make sure if it should be dropped instead

             });

        });

    });
    app.post('/api/messages/newmessage/', function(req, res){
     console.log('Post request body',req.body);
      messages.setMessage(req.body.longitude,req.body.latitude,req.body.message,function(result){
            res.send(result);

        });

    });


    app.get('/api/messages/searchformessage/:longitude/:latitude', function(req, res){

      messages.getOnemessage(req.params.longitude,req.params.latitude,function(err,result){
            res.send(result);

        });

    });

    app.get('/api/messages/inrange/:longitude/:latitude', function(req, res){

      messages.getMessagesWithinRaduis(req.params.longitude,req.params.latitude,function(err,result){
        if(err)
        res.send(err);
            else{
            res.send(result);
          }

        });

    });
    app.get('/api/messages/closestnode/:longitude/:latitude', function(req, res){

      messages.getNearestMessage(req.params.longitude,req.params.latitude,function(err,result){
        if(err)
        res.send(err);
            else{
            res.send(result);
          }

        });

    });

    app.get('/api/messages/getallmessages', function(req, res){

        messages.getAllmessages(function(err,result){
            res.send(result);

        });

    });

    app.get('/test', function(req, res){
      res.json({message:"success"});

    });

};
