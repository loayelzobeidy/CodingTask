var mongo = require('mongodb').MongoClient;
var DB = null;
var dbURL = 'mongodb://localhost:27017/';


exports.connect = function(cb) {
    mongo.connect(dbURL, function (err,db)
    {
    	if(err)
    		console.log(err);
    	else
    		console.log("Connected to db");
    	DB = db.db('sercretmessages');
        cb(err,db);
    });
}

exports.db = function() {
    if (DB === null)
    	throw Error('DB Object has not yet been initialized');
    return DB;
}


exports.clearDB = function(done) {
    DB.listCollections().toArray().then(function (collections) {
        collections.forEach(function (c) {
            DB.collection(c.name).removeMany();
        });
        done();
    }).catch(done);
}
