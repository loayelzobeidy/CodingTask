var app     = require('./app/app');
var db      = require('./app/db.js');
var messages = require('./app/models/messages.js');

db.connect(function(){

    messages.seedDB(function(err)
    {
    	app.listen('3000', function(){
           console.log('[OK] => HTTP Server listening on http://localhost:3000');
        });
    });

});
