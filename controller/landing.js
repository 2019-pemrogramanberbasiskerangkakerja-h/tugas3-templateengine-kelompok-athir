// exports.get = function(req, res, next) {  
// 	res.render('index', { title: 'Express' });   
// }

exports.get = function(req, res, next) {//for jade
  res.render('new_student',{title : "masuk ke form validasi"});// pass data
}

exports.submit_data = function(req, res, next) {//for jade
    console.log("username : ",req.body.RegUsername); 
    console.log("password : ",req.body.RegPassword); 

    // email validation
    var REgUname= req.body.RegUsername;
    var UnameValidator = /\w+@\w+\.(net|com|org)/;
    var hasilUname = UnameValidator.test(REgUname)
    console.log("ini hasilnya uname = "+hasilUname);


    // password validation
    var RegPassword= req.body.RegPassword;
    if (RegPassword.length < 8) {
      alert("bad RegPassword");
    } 

    var hasUpperCase = /[A-Z]/.test(RegPassword);
    var hasLowerCase = /[a-z]/.test(RegPassword);
    var hasNumbers = /\d/.test(RegPassword);
    var hasNonalphas = /\W/.test(RegPassword); 


    if(hasilUname && hasUpperCase && hasLowerCase && hasNumbers && hasNonalphas){
      var red="/resultsPage/" + req.body.RegUsername + "/" + req.body.RegPassword;
      console.log(red);
      res.redirect(red); 
   } else{
      alert("bad RegPassword or email");
      res.redirect('/'); 
    } 
  }

  exports.results_page = function(req, res, next) {//for jade 
    takeEmail = req.params.email;  
    takePass = req.params.password;  
    console.log(takeEmail);
    console.log(takePass);
    // res.redirect('/'); 

    res.render('results',{email : takeEmail, password: takePass});// pass data
  }