const assert = require('chai').assert;
const querystring = require('querystring');
const geolib = require('geolib');
const messages= require('../messages.json');
var http = require('http');





describe('testing messages APIs', function () {
  it('should return 200', function (done) {
    http.get('http://localhost:3000/', function (res) {
      assert.equal(200, res.statusCode);
      done();
    });
  });
//this function should first insert an object with a post request and then the get request check for this object at this specific longitude and latitude and check if it is exist in the database With the get request
  it('the get request should return the same inserted object', function (done) {
var post_data = querystring.stringify({     //the body is in json format
       'longitude' : 20,
     'latitude': 30,
    'message':'test message'
 });

var post_options = {    // the post request header
      host: 'localhost',
      port: '3000',
      path: '/api/messages/newmessage/',
      method: 'POST',
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(post_data)
      }
  };

  var post_req = http.request(post_options, function(res) {
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            console.log('Response: ' + chunk);

        } );


        });
        post_req.write(post_data);
        post_req.end();
          done();
    });


    // post the data

    http.get({hostname:'127.0.0.1',port:'3000',path:'/api/messages/searchformessage/40/50',agent:false},function (res){
         var data = '';

         res.on('data', function (chunk) {
           data += String(chunk);
         });

         res.on('end',function (){
           jsonobject  = JSON.parse(data);
           assert.equal(jsonobject[0].message,"test message");  //the database returns a list if there exist duplicates, we choose the one with index 0
         });

       });
it('all the messages are within 100km', function (done) {
       http.get({hostname:'127.0.0.1',port:'3000',path:'/api/messages/inrange/-172/90/',agent:false},function (res){
            var data = '';
            res.on('data', function (chunk) {
              data += String(chunk);
            });
            res.on('end',function (){
              jsonobject  = JSON.parse(data);
              for(var i = 0;i<jsonobject.length;i++){  //loop over the returned distance
              var distance =  geolib.getDistanceSimple(
                {latitude: 20, longitude:30},
                {latitude: jsonobject[i].loc[1],longitude:jsonobject[i].loc[0]} //the loc at index 1 is the latitude and the index 0 is the longitude
              );
              assert.isAtMost(distance,100000,"the whole distances are less than 100000 meters");
            }
            });
          });
});
          //the function takes the
it('the location of the nearest node returned from the query, is the same as the one returned from the json file', function (done) {
          data = '';
          http.get({hostname:'127.0.0.1',port:'3000',path:'/api/messages/closestnode/-172/90/',agent:false},function (res){
               res.on('data', function (chunk) {
                 data += String(chunk);
               });
               res.on('end',function (){
                 bodyjson  = JSON.parse(data);
                 messagesarray = [];
                 for(var i = 0;i<messages.length;i++){
                   object ={latitude:messages[i].loc[1],longitude:messages[i].loc[0]};
                   messagesarray.push(object);
                 }
                 var distance=  geolib.orderByDistance({latitude: 20, longitude:30},messagesarray);
                 var index = distance[0].key; // the first object is the distance and the key is the index
                 assert.equal(messages[index].message,jsonobject.message,"distance is equal");
               });
             });

});

});
