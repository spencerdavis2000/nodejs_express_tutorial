var express = require('express');
var router = express.Router();

// GET maps page
router.get('/', function(req, res, next){
	res.render('maps', 
	{
		title: 'Maps'
	});
});

module.exports = router;