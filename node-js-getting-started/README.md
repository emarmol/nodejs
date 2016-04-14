1.Identify what aspects of the work have been correctly implemented and what have not.
	   Correct aspects:
	   	   -POST /sendLocation works properly, and checks that all fields have been submitted before inserting the new field into the database.
		   -POST /sendLocation returns a JSON string with the people in the database, and the locations within 1 mile of the lat/lng
		   -GET /checkins.json returns all records for a given login in the query of the url. Checks to make sure the login has been provided
		   -GET / home page shows all the users who have checked in and when
		   -The above have been pushed onto Heroku online and are functional
		   -Assignment 2 master branch uses Assignment 3's server
	   To improve:
		   -Although security wasn't a requirement for this assignment, the solution to making sure login's weren't empty fields could be improved

2.Identify anyone with whom you have collaborated or discussed the assignment.
	   I worked with Jorge Anton and discussed with John Koh

3.Say approximately how many hours you have spent completing the assignment.
           I worked approximately 7  hours