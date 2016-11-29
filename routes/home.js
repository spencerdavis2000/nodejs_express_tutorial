var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');


// body parser stuff
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));



// GET home page
router.get('/', function(req, res, next){
	res.render('home', 
	{
		title : 'Home'
	});
});


// search students 

router.post('/search', function(req, res, next){
	var status = false;
	var searchTerm = req.body.nameSpencer;

	console.log("you are searching for: " + searchTerm);

	var student = require('../students_classes.json');
	var jsonLength = Object.keys(student.students).length;
	var jsonClassLength = 0;

	console.log("classes for first student: " + jsonClassLength);

	console.log(student.students[0].first);

	var first = "";
	var last = "";
	var email = "";
	var classList = {};
	var index = 0;
	var gpa = 0.0;

	console.log("gpa type: ");
	console.log(typeof gpa);
	console.log("gpa: " + gpa);

	for (var i = 0; i < jsonLength; i++){

		if (searchTerm == student.students[i].first){
			status = true;
			console.log("json: " + student.students[i].first);
			console.log("searchTerm: " + searchTerm);
			console.log("index at : " + i);


			first = student.students[i].first;
			last = student.students[i].last;
			email = student.students[i].email;


			jsonClassLength = Object.keys(student.students[i].studentClasses).length;


			for(var j = 0; j < jsonClassLength; j++){

				console.log("i is: " + i);
				console.log(student.classes[student.students[i].studentClasses[j].id] +"\n");
				var id = student.classes[student.students[i].studentClasses[j].id];
				var grade = student.students[i].studentClasses[j].grade;



				classList[id] = grade;
				console.log("BEFORE  grade: " + grade + " gpa: " + gpa);

				gpa += grade;

				console.log("AFTER  grade: " + grade + " gpa: " + gpa);
				
			}
			
		}
	}


	gpa /= jsonClassLength;
	gpa = parseFloat(gpa).toFixed(2);
	console.log(classList);

	res.render('home', 
		{	output: req.body.nameSpencer,
			student: student,
			first: first,
			last: last,
			email: email,
			classList: classList,
			index: index,
			gpa: gpa,
			status: status
		});
});

module.exports = router;





