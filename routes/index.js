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
router.get('/', myController.get_login );
router.post('/', myController.submit_login );
router.get('/regis', myController.get_regis );
router.post('/regis', myController.submit_regis );
router.get('/sudahlogin/:nrp/:password/:start/:end/:id', myController.sudahlogin );
router.get('/logout/:nrp', myController.get_logout );
router.get('/resultsPage/:nrp/:password', myController.results_page );
router.get('/logs', myController.show_logs ); 
router.get('/members', myController.show_members );
router.get('/members/delete/:id', myController.delete_data );
router.get('/members/edit/:id', myController.edit_form ); 
router.post('/members/edit/:id', myController.submit_edit ); 
 
// router.get('/resultsPage/:email/:password', myController.results_page );
// router.get('/resultsPage', myController.results_page );

module.exports = router;
