var fs = require('fs');
var rn = require('random-number');
var messages = []
var conste = 0;
var optionslong={min:-180,max:180};
var optionslati={min:-90,max:90};
  for(var i = 0;i<=1000;i++){
    message = "This is a random message"+" "+i;
   var object ={
    'loc': [ rn(optionslong),rn(optionslati)],
    'message':message
  };
messages.push(object);

}

fs.writeFile('messages.json',JSON.stringify(messages), 'utf8',function(){

  console.log(messages);
});
