var cool = require('cool-ascii-faces');
var express = require('express');
var app = express();

var mongoUri = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://127.0.0.1:27017/hw3';
var MongoClient = require('mongodb').MongoClient, format = require('util').format;
var db = MongoClient.connect(mongoUri, function(error, databaseConnection) {
	db = databaseConnection;
    });

app.set('port', (process.env.PORT || 5000));

//app.use("/", express.static(__dirname + '/lab8.html'));
app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});


/*Post data*/
app.post('/sendLocation', function(request, response){
	var login,lat,lng;
	//var login = request.body.login;
	//var lat = request.body.lat;
	//var lng = request.body.lng;
	var created_at = new Date;
	var toInsert = {
	    "login": login,
	    "lat": lat,
	    "lng": lng,
	    "created_at": created_at
	};
	db.collection('checkins', function(error, coll) {
		var id = coll.insert(toInsert, function(error, saved) {
			if (error) {
			    response.send(500);
			    response.send({"error":"Whoops, something is wrong with your data!"});
			}
			else {
			    response.send(200);
			}
		    });
	    });
});

app.get('/cool', function(request, response) {
	response.send(cool());
});

app.get('/lab8', function(request, response) {
	response.sendFile(__dirname + '/public/lab8.html');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});