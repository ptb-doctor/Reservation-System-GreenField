var express = require('express');
var mongoose = require('mongoose');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var app = express();
var session = require('express-session')
var cookieParser = require('cookie-parser')
// var path = require('path');
var db = require('../database/db');
var util = require('./utility');
var jwt = require('jwt-simple');
app.use(morgan('dev'));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(cookieParser());



app.use(session({secret : "asynco",
  resave: false,
  saveUninitialized: true}));
app.use(express.static(__dirname + '/../FrontEnd'));


app.get ('/index', (req, res) => {
	res.redirect ('/index.html')
})
app.get('/allall',function (req,res) {
	db.find({}, (err, data) => {
		res.send (data)
	})
})
app.post('/reservedappointments', function (req, res) {

	var patient = {
		patientName:req.body.patientName ,
		phoneNumber:req.body.phoneNumber,
	};
	var newpatient = new db(patient);
	newpatient.save()
	.then(item=>{
		res.send("item saved to database")
	})
	.catch(err => {
		res.status(400).send("unable to save to database")
	})


});

// *********************** THIS is the same as signup
// app.post('/AddUser' , function (req , res) {
// 	/* body... */
// 	console.log('AddUser 5aoa defined')
// 	var userAdd = {
// 		username:req.body.username,
// 		password:req.body.password,
//     phoneNumber: req.body.phoneNumber,
//     specialization: req.body.specialization
// 	};
// 	var user = new db(userAdd);
// 	user.save()
// 	.then(item=>{
// 		res.send("item saved to database")
// 	})
// 	.catch(err => {
// 		res.status(400).send("unable to save to database")
// 	})
// })

app.get('/login',function (req , res) {
	/* body... */
	res.redirect('/views/login.html')
})

app.get('/getAppointment', function (req, res) {
  res.send('GET request to the homepage')
  // get all appointment
  // put the data of appointment in table
  // table have patient name telephone number and the time of Appoin.

})

// TEST
app.get('/getDoctors', (req, res) => {
  db.find({}, (err, data) => {
    if (err) console.log(err);
    console.log('------------> all users', data);
    res.send (data);
  });
});
// End TEST


// // Logout endpoint
app.get('/logout', function (req, res) {
   req.session.destroy(function() {
    res.redirect('/login');
  });
});
var bcrypt = require('bcrypt');
//
 app.post('/login', function(req, res) {
     console.log('------------>login', req.body)
    var username = req.body.username;
    var password = req.body.password;
    // var salt = bcrypt.genSaltSync(10);
    // var hash = bcrypt.hashSync(password, salt);
    db.findOne({ username: username , password : password},function (err , user) {

        if(err){
            console.log(err)
            return res.status(404).send();
        }
        if(!user){
            return res.status(404).send();
        }
        if(user){
          res.redirect ('/index.html');
        }
    })

});

app.post('/signup',function (req , res) {
	/* body... */
	var adduser = {
		username:req.body.username ,
		password:req.body.password,
		phoneNumber : req.body.phoneNumber,
		specilization : req.body.specilization

	};
	var user = new db(adduser);
	user.save()
	.then(item=>{
		res.send("item saved to database")
	})
	.catch(err => {
		res.status(400).send("unable to save to database")
	})
})


app.get('/signup' , function (req , res) {
	/* body... */
	res.redirect('/views/signup.html');
});


// Manage database
app.put('/addAppointments',function (req , res) {
	  		console.log('-------- addappointments', req.body)
    		db.update(
    { username: req.body.username },
    {$push: { availableAppointments: req.body.newAppointment}},function (err , updateUser) {
    	/* body... */
    	if(err){
    		console.log('error')
    	}
    	else{
    		res.send(updateUser)
    	}
   }
)
});

app.put("/reservedappointments" , function (req , res) {
	console.log('req.body ------->', req.body)
  db.update(
      { username: req.body.username },
      {$pull: { availableAppointments: req.body.availableAppointments}},function (err , updateUser) {
        if(err){
          console.log(err)
        }else{
          console.log ('pull successfully')
          console.log(updateUser)
        }
     }
  );
 db.update(
   { username: req.body.username },
    {$push: { reservedAppointments: req.body}},function (err , updateUser) {
    	if(err){
    		console.log(err)
    	}
    	else{
        console.log('push to reservedAppointments')
    		console.log(updateUser)
    	}
   }
)
   res.send("updateUser")

})



 app.listen(2003, () => {
 	console.log ('Server listening on port ', 2003)
 });
