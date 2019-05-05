var express = require('express');
var router = express.Router();
let myController = require('../controller/landing');//use data from controllers/landing
var methodOverride = require('method-override'); 
var app = express();
app.use(methodOverride('_method'));
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
router.get('/user', myController.get_regis );//add users
router.post('/user', myController.submit_regis );
router.get('/sudahlogin/:nrp/:password/:start/:end/:id', myController.sudahlogin );
router.get('/logout/:nrp', myController.get_logout );
router.get('/resultsPage/:nrp/:password', myController.results_page );
router.get('/logs', myController.show_logs );  



router.get('/gatesForm', myController.get_gate );
router.post('/gates', myController.submit_gate );
router.get('/gates', myController.show_gate );
router.get('/gates/:gateid', myController.detail_gate );
router.delete('/gates/:gateid', myController.delete_gate );  


router.get('/groupform', myController.get_group );
router.post('/group', myController.submit_group );
router.get('/group', myController.show_group );
router.get('/group/:groupid', myController.detail_group );
router.delete('/group/:groupid', myController.delete_group );  

router.get('/users', myController.show_members );
router.get('/users/:userid', myController.detail_member );
router.delete('/users/:userid', myController.delete_data );  

// router.get('/members/delete/:id', myController.delete_data );
router.get('/members/edit/:id', myController.edit_form ); 
router.post('/members/edit/:id', myController.submit_edit ); 
 


//route tambahan tugas

// router.post('/adduser/:Username/:Password/:Grup', myController.add_user_api );
// router.get('/resultsPage/:email/:password', myController.results_page );
// router.get('/resultsPage', myController.results_page );

module.exports = router;
