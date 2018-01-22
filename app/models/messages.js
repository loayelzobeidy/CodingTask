var messages = require('../../messages.json');
var myDB = require('../db.js');


exports.seedDB = function(cb){

		//checking messages collection
		myDB.db().collection("messages").count(function(err,messagesCount){

				if(err||messagesCount>0)//messages have been seeded
				{
					myDB.db().collection("messages").createIndex( { "loc" : "2dsphere" } ,function(){
						console.log("index creation is done");
						cb(err,false);
					});
				}
				else
				{
					myDB.db().collection('messages').insertMany(messages,function(err){
						console.log("insertion is done");
						cb(err,true);
					});
				}
			});
		};


exports.getOneMessage = function(longitude,latitude,cb){
	Query ={"loc":{$all:[parseFloat(longitude),parseFloat(latitude)]}};
	myDB.db().collection("messages").find(Query).toArray(function(err,messagesArray){
		if (err)
		{
			cb(err,messagesArray);
		}
		else{
			cb(null,messagesArray);
		}
	});
};

exports.getAllMessages = function(cb){

	myDB.db().collection("messages").find({}).toArray(function(err,messagesArray)
	{
		if (err || messagesArray.length<1)
	    	{
					cb(err,messagesArray);
				}else{
					cb(null,messagesArray);
				}
			});
		};


exports.insertMessage = function(longitude,latitude,message,cb){
	var location = [parseFloat(longitude),parseFloat(latitude)];
	myDB.db().collection("messages").insertOne({"loc":location,"message":message},function(err){
		if(err==null){
			console.log("inserted one message");
		}
		cb(err,true);
	});
};



exports.getNearestMessage = function(longitude,latitude,cb){
	var coordinates = [longitude,latitude];
	var query =
	{
		"loc":
		{ $near:
			{
				$geometry: { type: "Point",  coordinates: [ parseFloat(longitude), parseFloat(latitude) ] },
			}
		}
	};
	myDB.db().collection("messages").findOne(query,function(err,messagesArray) //find one query to get the nearest point
	{
		if (err || messagesArray.length<1)
		{
			cb(err,messagesArray);
		}else{
			cb(null,messagesArray);
		}
	});
};


exports.getMessagesWithinRaduis = function(longitude,latitude,cb){
	var coordinates = [longitude,latitude];
	var query =
		{

   "loc": {
      $geoWithin: { $centerSphere: [[ parseFloat(longitude), parseFloat(latitude) ],100/6378.1] } // the earth raduis is 6478.1km
   }



	};
	myDB.db().collection("messages").find(query).toArray(function(err,messagesArray)
	    {
				if (err || messagesArray.length<1)
				{
					cb(err,messagesArray);
	    	}else{
					cb(null,messagesArray);
				}
			});
		};
