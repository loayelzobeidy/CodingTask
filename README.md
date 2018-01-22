Coding Task

This a backend development task where the you use your geolocation to save a certain message.


This Task consists of three parts


  First the message insertion with a certain location the api for this 'api/messages/newmessage'
  To retrive these message the required api is 'api/messages/searchformessage/:longitude/:latitude'
  Second the messages within a raduis of 100 km retrieval the required api is
  'api/messages/inrange/:longitude/:latitude'
  Finaly to get the closest node  to a certain location, the required  api is
  'api/messages/closestnode/:longitude/:latitude'

You will need

  A Laptop with a bash shell (Unix bases OS  with ubuntu terminal)
  A modern browser e.g. latest google chrome
  Internet
  NodeJS
  Git
  MongoDB
  Text Editor such as Atom


Installation

  To install MongDB run in the ubuntu terminal 'sudo apt-get install mongodb'

  To install Nodejs run in the ubuntu terminal 'sudo apt-get install nodejs'

  To install npm(Node package manager) run in the ubuntu terminal 'sudo apt-get install npm'
  
  To install all the Prerequisites run in the folder project 'sudo npm install'

Booting the server

  To boot the server in the run the folder project 'npm start'.

Tests

  The tests are done using Mocha and chai for assertion and geolib to make sure the returned
  results from the database are correct.

Run Tests
To start the tests run the folder project 'npm test' after starting the server.
