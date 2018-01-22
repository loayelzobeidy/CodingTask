const assert = require('chai').assert;
const querystring = require('querystring');
const geolib = require('geolib');
const messages= require('../messages.json');
var http = require('http');
var rn = require('random-number');




describe('testing messages APIs', function () {
  var optionsLong={min:-180,max:180};
  var optionsLati={min:-90,max:90};
  var tempLongi = rn(optionsLong);
  var tempLati = rn(optionsLati);

//this function should first insert an object with a post request and then the get request check for this object at this specific longitude and latitude and check if it is exist in the database With the get request
  it('the get request should return the same inserted object', function (done) {
var post_data = querystring.stringify({     //the body is in json format
     'longitude' :tempLongi,
     'latitude': tempLati,
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

    http.get({hostname:'127.0.0.1',port:'3000',path:'/api/messages/searchformessage/'+tempLongi+'/'+tempLati+'/',agent:false},function (res){
         var data = '';

         res.on('data', function (chunk) {
           data += String(chunk);
         });

         res.on('end',function (){
           bodyJson  = JSON.parse(data);
           assert.equal(bodyJson[0].message,"test message");  //the database returns a list if there exist duplicates, we choose the one with index 0
         });

       });
it('all the messages should be within 100km', function (done) {
       var optionsLong={min:-180,max:180};
       var optionsLati={min:-90,max:90};
       var tempLongi = rn(optionsLong);
       var tempLati = rn(optionsLati);
       http.get({hostname:'127.0.0.1',port:'3000',path:'/api/messages/inrange/'+tempLongi+'/'+tempLati+'/',agent:false},function (res){
            var data = '';
            res.on('data', function (chunk) {
              data += String(chunk);
            });
            res.on('end',function (){
              bodyJson  = JSON.parse(data);
              for(var i = 0;i<bodyJson.length;i++){  //loop over the returned distance
              var distance =  geolib.getDistanceSimple(
                {latitude:tempLati, longitude:tempLongi},
                {latitude: bodyJson[i].loc[1],longitude:bodyJson[i].loc[0]} //the loc at index 1 is the latitude and the index 0 is the longitude
              );
              assert.isAtMost(distance,100000,"the whole distances are less than 100000 meters");
            }
            done();
            });
          });
});
          //the function takes the
it('the location of the nearest node returned from the query, is the same as the one returned from the json file', function (done) {
          data = '';
          var optionsLong={min:-180,max:180};
          var optionsLati={min:-90,max:90};
          var tempLongi = rn(optionsLong);
          var tempLati = rn(optionsLati);
          http.get({hostname:'127.0.0.1',port:'3000',path:'/api/messages/closestnode/'+tempLongi+'/'+tempLati+'/',agent:false},function (res){
               res.on('data', function (chunk) {
                 data += String(chunk);
               });
               res.on('end',function (){
                 bodyJson  = JSON.parse(data);
                 messagesArray = [];
                 for(var i = 0;i<messages.length;i++){
                   object ={latitude:messages[i].loc[1],longitude:messages[i].loc[0]};
                   messagesArray.push(object);
                 }
                 var sortedMessages=  geolib.orderByDistance({latitude: tempLati, longitude:tempLongi},messagesArray);
                 var temped_message = "This is a random message"+" "+sortedMessages[0].key; // the first object is the distance and the key is the index
                 assert.equal(temped_message,bodyJson.message,"distance is equal");
                 done();
               });
             });

});

});
