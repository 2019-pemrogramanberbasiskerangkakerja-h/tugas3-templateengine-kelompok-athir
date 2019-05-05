var bodyParser = require('body-parser');
var session = require('express-session')
var mysql = require('mysql'); 
var express = require('express'); 
var ses;
var admin;
var PublicId;
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
var methodOverride = require('method-override');
app.use(methodOverride('_method')); 
var dateFormat = require('dateformat');



// var current_min  = date.getMinutes();

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'pbkk5'
});

// Connect
db.connect((err) => {
  if (err) {
    throw err;
  }
  // var d = new Date(hour, minute, second);  
  console.log('MySql Connected...');
});



// exports.get = function(req, res, next) {  
// 	res.render('index', { title: 'Express' });   
// }

exports.get_login = function (req, res, next) { //for jade
  console.log("session di halaman awal " + ses);


  // show group exist
  let sql = `select * from grub,gate where grub.ga_id = gate.ga_id;`;
  let query = db.query(sql, (err, results) => {
    if (err) throw err;
    res.render('new_student', {
      title: "masuk ke form validasi",
      session: ses,
      authAdmin: admin,
      listHasil: results
    }); // pass data
  });

}

exports.submit_login = function (req, res, next) { //for jade 
  var date = dateFormat(new Date(), "H:MM:ss");
  let takeUname = req.body.RegUsername;
  let takeUpass = req.body.RegPassword;
  let takeGroup = req.body.group;
  let takeGate = req.body.gate;
  console.log("date format= " + date);
  // WHERE m_nrp = "${takeUname}"  
  // let sql = `select * from member,gate,grub where member.m_nrp = "${takeUname}" and member.m_pass="${takeUname}" and "${takeUname}"=grub.gu_name and "${takeUname}" = gate.ga_id`;
  let sql = `select * from member,gate,grub where member.m_nrp = "${takeUname}" and member.m_pass="${takeUpass}" and "${takeGroup}"=grub.gu_name and gate.ga_name = "${takeGate}" and ga_start <= "${date}" and ga_end >= "${date}" and member.m_grub=grub.gu_name and grub.ga_id=gate.ga_id`;

  let query = db.query(sql, (err, results) => {
    if (err) throw err;
    if (results[0]) {
      console.log("data bnar");
      id = results[0].m_nrp;
      ses = req.session.id;
      PublicId = id;
      if (takeUname == "05111640000000") {
        admin = 123412341234;
      }

      res.render('results', {
        title: "masuk ke form validasi",
        nrp: req.body.RegUsername,
        password: req.body.RegPassword,
        group: req.body.group,
        gate: req.body.gate,
        session: ses,
        authAdmin: admin,
      }); // pass data

    } else {
      console.log("data salah");
      res.render('error');
    }

  });



}

exports.sudahlogin = function (req, res, next) {
  console.log("ses di sudah login" + ses);
  takeid = req.params.id;
  takenrp = req.params.nrp;
  takePass = req.params.password;
  takeStart = req.params.start;
  takeEnd = req.params.end;
  if (ses) {
    res.render('results', {
      nrp: takenrp,
      password: takePass,
      start: takeStart,
      end: takeEnd,
      id: takeid
    }); // pass data

  } else {
    res.end('who are u?');
  }
}

exports.get_regis = function (req, res, next) { //for jade
  let sql = `select * from grub,gate where grub.ga_id = gate.ga_id;`;
  let query = db.query(sql, (err, results) => {
    if (err) throw err;
    res.render('regis', {
      title: "masuk ke form register",
      listHasil: results
    }); // pass data
  });



}

exports.submit_regis = function (req, res, next) {
  console.log("username : ", req.body.RegUsername);
  console.log("password : ", req.body.RegPassword);
  console.log("group : ", req.body.group);

  // nrp validation 
  // var REgUname= req.body.RegUsername;
  // var UnameValidator = /\d{14}/; 
  // var hasilUname = UnameValidator.test(REgUname)
  // console.log("ini hasilnya uname = "+hasilUname);


  let post = {
    m_nrp: req.body.RegUsername,
    m_pass: req.body.RegPassword,
    m_grub: req.body.group
  };
  let sql = 'INSERT INTO member SET ?';
  let query = db.query(sql, post, (err, result) => {
    if (err) throw err;
    console.log(result);
  });


  res.render('results', {
    nrp: req.body.RegUsername,
    password: req.body.RegPassword,
    group: req.body.group
  }); // pass data

}

exports.get_group = function (req, res, next) { //for jade
    // show group exist
    let sql = `SELECT * FROM grub,gate where grub.ga_id = gate.ga_id`;
    let query = db.query(sql, (err, results) => {
      if (err) throw err;
      res.render('groupform', { 
        listHasil: results
      }); // pass data
    });
 

}

exports.submit_group = function (req, res, next) {  
  let post = {
    gu_name: req.body.group,
    ga_id: req.body.gate, 
  };
  let sql = 'INSERT INTO grub SET ?';
  let query = db.query(sql, post, (err, result) => {
    if (err) throw err;
    console.log(result);
  });


  res.redirect('gates'); // pass data

}

exports.show_group = function (req, res, next) { //for jade   
  let sql = `SELECT * FROM grub,gate where grub.ga_id = gate.ga_id `;
  let query = db.query(sql, (err, results) => {
    if (err) throw err;
    res.render('group', {
      title: 'list group',
      listGroup: results
    });
  });
}
exports.detail_group = function (req, res, next) { //for jade   
  let takeId = req.params.groupid;
  let sql = `SELECT * FROM grub where gu_id = ${takeId}`;
  let query = db.query(sql, (err, results) => {
    if (err) throw err;
    res.render('group', {
      title: 'list group',
      listGate: results
    });
  });
}
exports.delete_group = function (req, res, next) { //for jade   
  let takeId = req.params.gateid;
  let sql = `DELETE FROM gate WHERE ga_id = ${takeId}`;
  let query = db.query(sql, (err, result) => {
    if (err) throw err;
  });
  res.redirect('/users/');
}




exports.get_gate = function (req, res, next) { //for jade
  res.render('gateform'); // pass data
}

exports.submit_gate = function (req, res, next) {  
  let post = {
    ga_name: req.body.gateName,
    ga_start: req.body.start,
    ga_end: req.body.end
  };
  let sql = 'INSERT INTO gate SET ?';
  let query = db.query(sql, post, (err, result) => {
    if (err) throw err;
    console.log(result);
  });


  res.redirect('gates'); // pass data

}

exports.show_gate = function (req, res, next) { //for jade   
  let sql = `SELECT * FROM gate`;
  let query = db.query(sql, (err, results) => {
    if (err) throw err;
    res.render('gate', {
      title: 'list gate',
      listGate: results
    });
  });
}
exports.detail_gate = function (req, res, next) { //for jade   
  let takeId = req.params.gateid;
  let sql = `SELECT * FROM gate where ga_id = ${takeId}`;
  let query = db.query(sql, (err, results) => {
    if (err) throw err;
    res.render('gate', {
      title: 'list gate',
      listGate: results
    });
  });
}
exports.delete_gate = function (req, res, next) { //for jade   
  let takeId = req.params.gateid;
  let sql = `DELETE FROM gate WHERE ga_id = ${takeId}`;
  let query = db.query(sql, (err, result) => {
    if (err) throw err;
  });
  res.redirect('/users/');
}

exports.get_logout = function (req, res, next) { //for jade 
  takenrp = req.params.nrp;
  ses = null
  PublicId = null
  admin = null
  req.session.destroy();


  // buat log nya
  let post = {
    log_nrp: takenrp,
    log_gate: "berhasil logout"
  };
  let sql = 'INSERT INTO log SET ?';
  let query = db.query(sql, post, (err, result) => {
    if (err) throw err;
  });

  res.redirect('/'); // pass data
  // res.redirect('/');// pass data

}

exports.results_page = function (req, res, next) { //for jade 
  console.log("session nya di result= " + ses);
  takenrp = req.params.nrp;
  takePass = req.params.password;
  console.log(takeEmail);
  console.log(takePass);
  // res.redirect('/'); 

  res.render('results', {
    nrp: takeEmail,
    password: takePass
  }); // pass data
}
 
 

exports.show_members = function (req, res, next) { //for jade   
  let sql = `SELECT * FROM member`;
  let query = db.query(sql, (err, results) => {
    if (err) throw err;
    res.render('members', {
      title: 'list Members',
      listMember: results
    });
  });
}
exports.detail_member = function (req, res, next) { //for jade  
  let takeId = req.params.userid; 
  let sql = `SELECT * FROM member where m_id = ${takeId}`;
  let query = db.query(sql, (err, results) => {
    if (err) throw err;
    res.render('members', {
      title: 'list Members',
      listMember: results
    });
  });
}

exports.show_logs = function (req, res, next) { //for jade   
  let sql = `SELECT * FROM log`;
  let query = db.query(sql, (err, results) => {
    if (err) throw err;
    res.render('logs', {
      title: 'list log',
      listLog: results
    });
  });
}
 
exports.show_gate = function (req, res, next) { //for jade   
  let sql = `SELECT * FROM gate`;
  let query = db.query(sql, (err, results) => {
    if (err) throw err;
    res.render('gate', {
      title: 'list gate',
      listGate: results
    });
  });
}
exports.detail_gate = function (req, res, next) { //for jade   
  let takeId = req.params.gateid;
  let sql = `SELECT * FROM gate where ga_id = ${takeId}`;
  let query = db.query(sql, (err, results) => {
    if (err) throw err;
    res.render('gate', {
      title: 'list gate',
      listGate: results
    });
  });
}
exports.delete_gate = function (req, res, next) { //for jade   
  let takeId = req.params.gateid;
  let sql = `DELETE FROM gate WHERE ga_id = ${takeId}`;
  let query = db.query(sql, (err, result) => {
    if (err) throw err;
  });
  res.redirect('/users/');
}

exports.delete_data = function (req, res, next) { //for jade   
  let takeId = req.params.userid;
  let sql = `DELETE FROM member WHERE m_id = ${takeId}`;
  let query = db.query(sql, (err, result) => {
    if (err) throw err;
  });
  res.redirect('/users/');
}

exports.edit_form = function (req, res, next) {
  takeId = req.params.id;
  let sql = `SELECT * FROM member WHERE id = ${takeId}`;
  let query = db.query(sql, (err, results) => {
    if (err) throw err;
    res.render('edit_form', {
      title: "edit form",
      dataMember: results[0]
    });
  });
}

exports.submit_edit = function (req, res, next) {
  let takeId = req.params.id;
  let post = {
    nrp: req.body.RegUsername,
    pass: req.body.RegPassword,
    timeaccessstart: req.body.RegTimeAllowedStart,
    timeaccessend: req.body.RegTimeAllowedEnd
  };
  let sql = 'UPDATE member SET ? WHERE id = ?';
  let query = db.query(sql, [post, takeId], (err, result) => {
    if (err) throw err;
  });
  takenrp = req.body.RegUsername;
  takePass = req.body.RegPassword;
  takeStart = req.body.RegTimeAllowedStart;
  takeEnd = req.body.RegTimeAllowedEnd;
  res.render('results', {
    nrp: takenrp,
    password: takePass,
    start: takeStart,
    end: takeEnd
  }); // pass data


}