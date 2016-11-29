
var express = require('express');
var bodyParser = require('body-parser');

// set router page for maps
var maps = require('./routes/maps');
var home = require('./routes/home');
var app = express();

// stops header from containing information about the server
// for security reasons
app.disable('x-powered-by');

// app locals
app.locals.myMessage = "hello my name is spencer";
app.locals.sd = require('./students_classes.json');


// use router pages
app.use('/', home);
app.use('/maps', maps);


// ======== HANDLEBARS CONFIG =====================
var handlebars = require('express-handlebars');

// defining handlebars
handlebars = handlebars({
				defaultLayout: 'main'
			});

// defining the engine
app.engine('handlebars', handlebars);  

// set the engine
app.set('view engine', 'handlebars');

// ======= END HANDLEBARS CONFIG ===================



// body parser stuff
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var formidable = require('formidable');
var credentials = require('./credentials.js');
app.use(require('cookie-parser')(credentials.cookieSecret));

app.set('port', process.env.PORT || 5000);

// allows you to access the static stuff in public folder
app.use(express.static(__dirname + '/public'));


// middleware functions
app.use(function(req, res, next){
	console.log("Looking for URL : " + req.url);
	next();
})
app.get('/junk', function(req, res, next){
	console.log('Tried to access /junk');
	throw new Error('/junk doesn\'t exit');
});

app.use(function(err, req, res, next){
	console.log('Error : ' + err.message);
	next();
});

app.get('/about', function(req, res){
	res.render('about');
});


// route for contact
app.get('/contact', function(req, res){
	res.render('contact', { csrf: 'CSRF token here'});
});

app.get('/thankyou', function(req, res){
	res.render('thankyou');
});



// process the form
// ---- NOTE:  This is the place you will get user input data
app.post('/process', function(req, res){
	// this is reqest stuff i.e. getting the info
	console.log('Form : ' + req.query.form);
	console.log('CSRF token: ' + req.body._csrf);
	console.log('Email: ' + req.body.email);
	console.log('Question: ' + req.body.ques);
	// this is the response stuff i.e.  giving back info


	res.redirect(303, '/thankyou');
});


// file upload
app.get('/file-upload', function(req, res){
	var now = new Date();
	res.render('file-upload', {
		year: now.getFullYear(),
		month: now.getMonth()
	});
});
// this form is posted from file-upload.handlebars
// so the form on the page ties into the app.post method here on this page
app.post('/file-upload/:year/:month', function(req, res){
	var form = new formidable.IncomingForm();
	form.parse(req, function(err, fields, file){
		if (err)
			return res.redirect(303, '/error');

		console.log('Received File');

		console.log(file);
		res.redirect(303, '/thankyou');
	});
});

// sets a cookies
app.get('/cookie', function(req, res){
	// key is username.  value is Spencer Davis.  expire is the date
	// here we are setting a cookie 
	res.cookie('username', 'Spencer Davis', 
		{expire: new Date()+ 9999}).send('username has '+
		'the value of : Spencer Davis');
});

// lists our cookies
app.get('/listcookies', function(req, res){
	console.log("Cookies : ", req.cookies);
	res.send("Look in the console for cookies");
});
// delete cookies
app.get('/deletecookies', function(req, res){
	res.clearCookie('username');
	res.send('username Cookie Deleted');
});

// Sesions
var session = require('express-session');

var parseurl = require('parseurl');

app.use(session({
	resave: false,
	saveUninitialized: true,
	secret: credentials.cookieSecret
}));

// keep track of how many times a user goes to a page
app.use(function(req, res, next){
	var views = req.session.views;
	if(!views){
		views = req.session.views = {};
	}
	var pathname = parseurl(req).pathname;
	views[pathname] = (views[pathname] || 0) + 1; // zero to start increment by 1
	next();
});	
// if we want to display the user count information
app.get('/viewcount', function(req, res, next){
	res.send('You viewed this page ' + 
		req.session.views['/viewcount'] + ' times');
});

// read a file
var fs = require('fs');

app.get('/readfile', function(req, res, next){
	fs.readFile('./public/randomfile.txt', 
		function(err, data){
		if (err){
			return console.error(err);
		}
		res.send("the File : " + data.toString());
	});
});

// write a file
app.get('/writefile', function(req, res, next){
	fs.writeFile('./public/randomfile2.txt', 'More random text', 
		function(err){
			if (err){
				return console.error(err);
			}
		});
	// read from what we just wrote to
	fs.readFile('./public/randomfile2.txt', 
		function(err, data){
			if (err){
				return console.error(err);
			}
			res.send("The File2: " + data.toString());
		});
});

// ====== HANDLING ERRORS =======================
// page not found
app.use(function(req, res){
	res.type('text/html');
	res.status(404);
	res.render('404');
});
// server error
app.use(function(err, req, res, next){
	console.error(err.stack);
	res.status(500);
	res.render('500');
});




app.listen(app.get('port'), function(){
	console.log('Express started on http://localhost:'+app.get('port') +
		' press Ctrl-C to terminate');
});

