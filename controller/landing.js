var bodyParser = require('body-parser');  
var session = require('express-session')
var mysql = require('mysql');

var express = require('express'); 
var ses;
var admin;
var PublicId;
var app = express();
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));

var dateFormat = require('dateformat'); 


 
// var current_min  = date.getMinutes();

const db = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'pbkk4'
});

// Connect
db.connect((err) => {
  if(err){
      throw err;
  } 
  // var d = new Date(hour, minute, second);  
  console.log('MySql Connected...');
}); 



// exports.get = function(req, res, next) {  
// 	res.render('index', { title: 'Express' });   
// }

exports.get_login = function(req, res, next) {//for jade
  console.log("session di halaman awal " + ses);
  res.render('new_student',{title : "masuk ke form validasi", session : ses,authAdmin:admin});// pass data
}

exports.submit_login = function(req, res, next) {//for jade  
  var date=dateFormat(new Date(), "H:MM:ss");
  let takeUname = req.body.RegUsername;     
	let takeUpass = req.body.RegPassword;   
  console.log("date format= " +date); 
    let sql = `SELECT * FROM member WHERE nrp = "${takeUname}" and pass ="${takeUpass}" and 
                timeaccessstart <= "${date}" and timeaccessend >= "${date}"`; 

    
    // let sql = `SELECT * FROM member WHERE nrp = "${takeUname}" and pass ="${takeUpass}"`; 
     
    let query = db.query(sql, (err, results) => {    
        if(err) throw err; 
        if(results[0]){
            id=results[0].id;
            start = results[0].timeaccessstart;
            end = results[0].timeaccessend;
            ses=req.session.id;   
            PublicId = id; 
            if(takeUname=="05111640000000"){
              admin=123412341234; 
            }
             // buat log nya
            let post1 = {nrp:takeUname,status:"berhasil login"};
              let sql1 = 'INSERT INTO log SET ?';
              let query1 = db.query(sql1, post1, (err, result1) => {
              if(err) throw err;
              console.log(result1); 
            }); 

            var redsubmit="/sudahlogin/" + takeUname + "/" + takeUpass + "/" + start + "/" +end + "/" + id; 
            res.redirect(redsubmit);  
        }else{
           // buat log nya
           let post1 = {nrp:takeUname,status:"gagal login"};
           let sql1 = 'INSERT INTO log SET ?';
           let query1 = db.query(sql1, post1, (err, result1) => {
           if(err) throw err;
           console.log(result1); 
         }); 


            console.log("gaada"); 
            console.log(results);  
            res.render('error'); 
        } 
    });    

 
  }
  exports.sudahlogin = function(req, res, next) {   
    console.log("ses di sudah login" + ses);    
    takeid=req.params.id;
    takenrp = req.params.nrp;  
    takePass = req.params.password;   
    takeStart = req.params.start;   
    takeEnd = req.params.end;   
    if(ses){      
      res.render('results',{nrp : takenrp, password: takePass, start: takeStart, end:takeEnd, id:takeid  });// pass data

    } else{
      res.end('who are u?');
    } 
  }

  exports.get_regis = function(req, res, next) {//for jade
    res.render('regis',{title : "masuk ke form register"});// pass data
  }

 

  exports.submit_regis = function(req, res, next) {   
    console.log("username : ",req.body.RegUsername); 
    console.log("password : ",req.body.RegPassword);
    console.log("time : ",req.body.RegTimeAllowedStart);

    // nrp validation 
    var REgUname= req.body.RegUsername;
    var UnameValidator = /\d{14}/; 
    var hasilUname = UnameValidator.test(REgUname)
    console.log("ini hasilnya uname = "+hasilUname);
    
    if(hasilUname){

      let post = {nrp:req.body.RegUsername, pass:req.body.RegPassword, timeaccessstart:req.body.RegTimeAllowedStart, timeaccessend:req.body.RegTimeAllowedEnd};
        let sql = 'INSERT INTO member SET ?';
        let query = db.query(sql, post, (err, result) => {
        if(err) throw err;
        console.log(result); 
      }); 
 
      // buat log nya
       let post1 = {nrp:REgUname,status:"berhasil register"};
       let sql1 = 'INSERT INTO log SET ?';
       let query1 = db.query(sql1, post1, (err, result1) => {
       if(err) throw err;
       console.log(result1); 
     }); 

      res.render('results',{nrp : req.body.RegUsername, password: req.body.RegPassword, start: req.body.RegTimeAllowedStart, end: req.body.RegTimeAllowedEnd});// pass data
    }else{

       
      // buat log nya
        let post2 = {nrp:REgUname,status:"gagal register"};
        let sql2 = 'INSERT INTO log SET ?';
        let query2 = db.query(sql2, post2, (err, result2) => {
        if(err) throw err; 
      }); 
      alert("bad RegPassword or email");
      res.redirect('/'); 
    }  
}

exports.get_logout = function(req, res, next) {//for jade 
  takenrp = req.params.nrp;  
  ses=null 
  PublicId=null 
  admin=null
  req.session.destroy();    

  
    // buat log nya
      let post = {nrp:takenrp,status:"berhasil logout"};
      let sql = 'INSERT INTO log SET ?';
      let query = db.query(sql, post, (err, result) => {
      if(err) throw err; 
    }); 

  res.redirect('/');// pass data
  // res.redirect('/');// pass data

}

  exports.results_page = function(req, res, next) {//for jade 
    console.log("session nya di result= "+ses);   
    takenrp = req.params.nrp;  
    takePass = req.params.password;  
    console.log(takeEmail);
    console.log(takePass);
    // res.redirect('/'); 

    res.render('results',{nrp : takeEmail, password: takePass});// pass data
  }

  exports.show_members = function(req, res, next) {//for jade   
    let sql = `SELECT * FROM member`;
    let query = db.query(sql, (err, results) => {
      if(err) throw err;  
      res.render('members', { title: 'list Members', listMember:results });  
    });   
  }
  exports.show_logs = function(req, res, next) {//for jade   
    let sql = `SELECT * FROM log`;
    let query = db.query(sql, (err, results) => {
      if(err) throw err;  
      res.render('logs', { title: 'list log', listLog:results });  
    });   
  }
  
  exports.delete_data = function(req, res, next) {//for jade   
    let takeId = req.params.id;         
    let sql = `DELETE FROM member WHERE id = ${takeId}`; 
    let query = db.query(sql, (err, result) => {
        if(err) throw err; 
    }); 
    res.redirect('/members/');  
  }

exports.edit_form = function(req, res, next) {   
    takeId = req.params.id;                 
    let sql = `SELECT * FROM member WHERE id = ${takeId}`;
    let query = db.query(sql, (err, results) => {
        if(err) throw err;  
        res.render('edit_form', {title:"edit form", dataMember:results[0]});  
    });  
}

exports.submit_edit = function(req, res, next) {  
    let takeId = req.params.id;       
    let post = {nrp:req.body.RegUsername, pass:req.body.RegPassword, timeaccessstart:req.body.RegTimeAllowedStart, timeaccessend:req.body.RegTimeAllowedEnd};
    let sql = 'UPDATE member SET ? WHERE id = ?';
    let query = db.query(sql,[post,takeId], (err, result) => {
        if(err) throw err; 
    });  
    takenrp = req.body.RegUsername;  
    takePass = req.body.RegPassword;   
    takeStart = req.body.RegTimeAllowedStart;   
    takeEnd = req.body.RegTimeAllowedEnd;    
      res.render('results',{nrp : takenrp, password: takePass, start: takeStart, end:takeEnd  });// pass data

     
}