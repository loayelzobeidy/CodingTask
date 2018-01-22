var messages = require('../messages.json');
var myDB = require('./db.js');


exports.getFlightsFromJSON = function(){
	return flights;
};

exports.seedDB = function(cb){

	//checking airports collection
	// console.log(myDB.db);
	myDB.db().collection("messages").count(function(err,messagesCount)
	{
		if(err||messagesCount>0)//messages have been seeded
{myDB.db().collection("messages").createIndex( { "loc" : "2dsphere" } ,function(){
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
exports.getOnemessage = function(longitude,latitude,cb){
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
exports.getAllmessages = function(cb){
	myDB.db().collection("messages").find({}).toArray(function(err,messagesArray)
	    {
	    	if (err || messagesArray.length<1)
	    	{
cb(err,messagesArray);
	    	}
				else{
cb(null,messagesArray);
				}
			});
};
exports.setMessage = function(longitude,latitude,message,cb){
	var location = [parseFloat(longitude),parseFloat(latitude)];
	myDB.db().collection("messages").insertOne({"loc":location,"message":message},function(err){
		if(err==null){
			console.log("inserted one message");
		}
		cb(err,true);
	});


};

exports.getNearestMessage = function(longitude,latitude,cb){
	var raduisinRadian = 100/6371;
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
	console.log(query);
	myDB.db().collection("messages").findOne(query,function(err,messagesArray)
	    {
				console.log('hereee',messagesArray);
	    	if (err || messagesArray.length<1)
	    	{
					cb(err,messagesArray);
	    	}
				else{

					cb(null,messagesArray);
				}
			});
};
exports.getMessagesWithinRaduis = function(longitude,latitude,cb){
	var coordinates = [longitude,latitude];
	console.log('location',coordinates);

	var query =
		{

   "loc": {
      $geoWithin: { $centerSphere: [[ parseFloat(longitude), parseFloat(latitude) ],100/6371] }
   }



	};
	myDB.db().collection("messages").find(query).toArray(function(err,messagesArray)
	    {
				console.log('hereee',messagesArray);
	    	if (err || messagesArray.length<1)
	    	{
					cb(err,messagesArray);
	    	}
				else{

					cb(null,messagesArray);
				}
			});
};
