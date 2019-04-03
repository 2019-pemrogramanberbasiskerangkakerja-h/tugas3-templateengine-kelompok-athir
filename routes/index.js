var express = require('express');
var router = express.Router();
let myController = require('../controller/landing');//use data from controllers/landing
  
/* GET home page. */
// router.get('/', function(req, res, next) {//for pug
//   res.render('index', { title: 'Express' });
// });

// router.get('/', function(req, res, next) {//for ejs
//   res.render('halaman',{cabe1 : "haloo semuaa"});// pass data
// });

// router.get('/', function(req, res, next) {//for jade
//   res.render('new_student', {'title': 'Add New Student'}); 
// });

 
//new style 
router.get('/', myController.get );
router.post('/', myController.submit_data );
router.get('/resultsPage/:email/:password', myController.results_page );
// router.get('/resultsPage/:email/:password', myController.results_page );
// router.get('/resultsPage', myController.results_page );

module.exports = router;
