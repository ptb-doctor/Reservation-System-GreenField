var express = require('express');
var mongoose = require('mongoose');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var app = express();
var session = require('express-session')
var cookieParser = require('cookie-parser')
// var path = require('path');
var db = require('../database/db');
var util = require('/utility');
var jwt = require('jwt-simple');
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());



app.use(session({secret : "asynco",
  resave: false,
  saveUninitialized: true}));
app.use(express.static(__dirname + '/../FrontEnd'));

app.get('/allall',function (req,res) {
	db.find({}, (err, data) => {
		res.send (data)
	})  
})

app.post('/addAppointments', function (req, res) {

	var patient = {
		patientName:req.body.patientName ,
		phoneNumber:req.body.phoneNumber,
		avialableAppointments : req.body.avialableAppointments
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
app.post('/AddUser' , function (req , res) {
	/* body... */
	var userAdd = {
		username:req.body.username ,
		password:req.body.password,
	};
	var user = new db(AddUser);
	user.save()
	.then(item=>{
		res.send("item saved to database")
	})
	.catch(err => {
		res.status(400).send("unable to save to database")
	})
})

app.get('/login',function (req , res) {
	/* body... */
	res.render('login')
})

app.get('/getAppointment', function (req, res) {
  res.send('GET request to the homepage')
  // get all appointment 
  // put the data of appointment in table 
  // table have patient name telephone number and the time of Appoin.

})
app.get('/user' , function (req , res) {
	/* body... */
	//give the home page of administrator 

} )

app.delete('/deletTime' , function (req , res) {
	/* body... */
	// delete this time from avialable appoinment
	
})




 
// // Logout endpoint
app.get('/logout', function (req, res) {
   req.session.destroy(function() {
    res.redirect('/login');
  });
});
var bcrypt = require('bcrypt');
// 
 app.post('/login', function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

   db.findOne({ username: username , password : password},function (err , user) {
//     	 body... 
    	if(err){
    		console.log(err)
    		return response.status(404).send();
    	}
    	if(!user){
    		return response.status(404).send();
    	}
    	if(user){ 
        user.comparePassword(password, function(match) {
          if (match) {
            util.createSession(req, res, user);
          } else {
            res.redirect('/login');
          }
        });
      }
    });
});

app.post('/signup',function (req , res) {
	/* body... */
	var adduser = {
		username:req.body.username ,
		password:req.body.password,
		phonnumer : req.body.phonnumer,
		job : req.body.job,
		availableAppointments : req.body.availableAppointments
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
	res.render('signup');
});

app.post('/addappointments',function (req , res) {
	/* body... */
	db.findOne({ username: username},function (err , user){
		if(err){
    		console.log(err)
    		return response.status(404).send();
    	}
    	if(!user){
    		return response.status(404).send();
    	}
    	if(user){ 
    		db.update(
   { username: req.body.username },
   { $push: { availableAppointments: request.body.availableAppointments } }
)
    	}
	})
})

 app.listen(8000, () => {
 	console.log ('lesl;jse;lfse')
 });