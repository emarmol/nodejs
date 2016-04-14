var cool = require('cool-ascii-faces');
var express = require('express');
var app = express();
var assert = require('assert');

var bodyParser = require('body-parser');
var mongoUri = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://heroku_vxtd0ktz:c86fr5jl0j5tet3ag03jrnfckk@ds037234.mlab.com:37234/heroku_vxtd0ktz';
var MongoClient = require('mongodb').MongoClient, format = require('util').format;
var db = MongoClient.connect(mongoUri, function(error, databaseConnection) {
	db = databaseConnection;
        db.collection('landmarks').createIndex({'geometry':"2dsphere"});
    });

app.set('port', (process.env.PORT || 5000));

app.use(bodyParser.json());
// See https://stackoverflow.com/questions/25471856/express-throws-error-as-body-parser-deprecated-undefined-extended
app.use(bodyParser.urlencoded({ extended: true })); // Required if we need to use HTTP query or post parameters
app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

/*Post data*/
app.post('/sendLocation', function(request, response){
	response.set('Content-Type','text/json');
	var login = request.body.login;
	var lat = parseFloat(request.body.lat);
	var lng = parseFloat(request.body.lng);
	var created_at = new Date;
	var return_obj = {people: null , landmarks: null};
       	var toInsert = {
	    "login": login,
	    "lat": lat,
	    "lng": lng,
	    "created_at": created_at
	};
	db.collection('checkins', function(error, coll) {
		if(toInsert.login != '' && toInsert.login != 'undefined' && toInsert.login != null && toInsert.lat != '' && toInsert.lng != '') {
		var id = coll.insert(toInsert, function(error, saved) {
			if (error) {
			    response.send(500);
			}
			else {
			    coll.find().toArray(function(err, cursor) {		
				    return_obj.people = cursor;
       				    db.collection('landmarks', function(error, lncoll) {
					    lncoll.find({geometry:{$near:{$geometry:{type:"Point",coordinates:[lng,lat]},$minDistance: 0,$maxDistance: 1609}}}).toArray(function(err, cursor2) {
						     return_obj.landmarks = cursor2;
						     console.log('inside landmarks find');
				     	             response.send(return_obj);
					    });
					}); 
      			    });
			}
	       });
		} else {
		    response.send({"error":"Whoops, something is wrong with your data!"});
		}
      });
});

/*USED FOR TESTING POST SUBMISSIONS*/
app.get('/lab8', function(request, response) {
	response.sendFile(__dirname + '/public/lab8.html');
});

app.get('/checkins.json', function(request, response) {
        var checkin_login = request.query.login;
	var return_obj = {login_info: null};
	db.collection('checkins', function(er, collection) {
		if(checkin_login != '') {
		    collection.find({'login':checkin_login}).toArray(function(err, cursor) {
			console.log('made it into find');
			if (!err) {;
			    response.send(cursor);
	                }
	            });
		} else {
		    response.send(JSON.stringify([]));
		}
        });
});

app.get('/', function(request, response) {
	response.set('Content-Type', 'text/html');
	var indexPage = '';
	db.collection('checkins', function(er, collection) {
		collection.find().toArray(function(err, cursor) {
			if (!err) {
			    indexPage += "<!DOCTYPE HTML><html><head><title>Checkins</title></head><body><h1>Checkins</h1>";
			    for (var count = 0; count < cursor.length; count++) {
				indexPage += "<p>" + cursor[count].login + " checked in on " + cursor[count].created_at + "</p>";
			    }
			    indexPage += "</body></html>"
			response.send(indexPage);
			} else {
			    response.send('<!DOCTYPE HTML><html><head><title>Checkins</title></head><body><h1>Whoops, something went terribly wrong!</h1></body></html>');
			}
	        });
        });
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
