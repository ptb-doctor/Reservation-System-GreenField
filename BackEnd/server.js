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
app.get('/',function (req,res) {
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
app.post('/AddUser' , function (req , res) {
	/* body... */
	console.log('AddUser 5aoa defined')
	var userAdd = {
		username:req.body.username,
		password:req.body.password
	};
	var user = new db(userAdd);
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
	res.redirect('/views/login.html')
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
})

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
     console.log('------------>login', req.body.username)
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
		phonnumber : req.body.phonnumber,
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
	res.render('signup');
});

app.put('/addappointments',function (req , res) {
	/* body... */
	  		console.log('-------- yes', req.body.availableappointments)
    		db.update(
   { username: req.body.username },
    {$push: { availableappointments: req.body.availableappointments}},function (err , updateUser) {
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
	/* body... patientName{ $pull: { votes: { $gte: 6 } }*/
	// console.log(req.body.availableappointments)
	db.update(
   { username: req.body.username },
    {$pull: { availableappointments: req.body.availableappointments}},function (err , updateUser) {
    	/* body... */
    	if(err){
    		console.log('error')
    	}
    	else{
    		res.send(updateUser)
    	}
   }
   {$push: {reservedappointments: req.body}},function (err , updateUser) {
    	/* body... */
    	if(err){
    		console.log('error')
    	}
    	else{
    		res.send(updateUser)
    	}
   } 

)

})



 app.listen(2000, () => {
 	console.log ('Server listening on port ', 2000)
 });