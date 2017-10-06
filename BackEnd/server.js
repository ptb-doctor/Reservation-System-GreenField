var express = require('express');
var bcrypt = require('bcrypt');
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
var multer = require('multer');
var upload = multer({
    dest: '../FrontEnd/uploads/'
});
app.use(morgan('dev'));

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use(cookieParser());

// var loggedIn = false;

app.use(session({
    secret: "asynco",
    resave: false,
    saveUninitialized: true
}));
app.use(express.static(__dirname + '/../FrontEnd'));


app.get('/checkIsLoggedIn', (req, res) => {
  var checker = (!!req.session.username) ? 'true' : 'false';
  console.log('checking isLoggedIn --------------->', !!req.session.username, checker);
  res.send(checker);
});

app.get('/index', (req, res) => {
  res.redirect('/index.html')
})

app.post('/reservedappointments', function(req, res) {

    var patient = {
        patientName: req.body.patientName,
        phoneNumber: req.body.phoneNumber,
    };
    var newpatient = new db(patient);
    newpatient.save()
        .then(item => {
            res.send("item saved to database")
        })
        .catch(err => {
            res.status(400).send("unable to save to database")
        })
});

app.get('/login', function(req, res) {
    res.redirect('./views/login.html')
})

// Get all doctors
app.get('/getDoctors', (req, res) => {
    db.find({}, (err, data) => {
        if (err) console.log(err);
        // console.log('------------> all users', data);
        res.send(data);
    });
});
// End TEST

// Get specific doctor
app.post('/getDoctorData', (req, res) => {
    // console.log('********************>', req.body.doctorName);
    db.findOne({
        username: req.body.doctorName
    }, (err, data) => {
        if (err) console.log(err);
        res.send(data);
    });
});

// Load reserved appointments
app.get('/getDoctorReservedAppointments', (req, res) => {
    // console.log('********************>', req.body.doctorName);
    db.findOne({
        username: req.session.username
    }, (err, data) => {
        if (err) console.log(err);
        res.send(data);
    });
});



// Login
app.post('/login', function(req, res) {
    console.log('--------$$$$---->login', req.session)
    var username = req.body.username;
    var password = req.body.password;
    // var salt = bcrypt.genSaltSync(10);
    // var hash = bcrypt.hashSync(password, salt);
    db.findOne({
        username: username
    }, function(err, user) {
        if (err) {
            console.log(err)
            return res.status(404).send();
        }
        if (!user) {
            return res.status(404).send();
        }
        if (user) {
            // Create session
            req.session.username = user.username;
            console.log('---------------------> ', req.session);
            res.redirect('/index')
        }
    })

});

// // Logout endpoint
app.get('/logout', function(req, res) {
  req.session.username = null;
  console.log('->>>>>>>>>>>>>', req.session);
  res.redirect('/login');
});

// Sign Up POST
app.post('/signup', upload.any(), function(req, res) {
    var adduser = {
        username: req.body.username,
        password: req.body.password,
        phoneNumber: req.body.phoneNumber,
        specilization: req.body.specilization,
        image: req.files[0].filename
    };
    console.log(adduser.image);
    var user = new db(adduser);
    user.save()
        .then(item => {
            res.redirect("/login")
        })
        .catch(err => {
            res.status(400).send("unable to save to database")
        })
});

// Sign Up GET
app.get('/signup', function(req, res) {
    /* body... */
    res.redirect('/views/signup.html');
});

// Add an appointment
app.put('/addAppointments', function(req, res) {
    console.log('-------- addappointments', req.body, '*******', req.session.username)
    db.update({
        username: req.session.username
    }, {
        $push: {
            availableAppointments: req.body.newAppointment
        }
    }, function(err, updateUser) {
        if (err) {
            console.log('error')
        } else {
            res.send(updateUser)
        }
    })
});

// Reserve an appointment
app.put("/reservedappointments", function(req, res) {
    console.log('req.body ------->', req.body)
    var fullAppointment = req.body.availableAppointments.split(' ');
    var theAppointment = {
      time: fullAppointment[0],
      date: fullAppointment[1]
    }
    req.body.availableAppointments = theAppointment;
    console.log('time ---------------->', req.body.availableAppointments);
    db.update({
        username: req.session.username
    }, {
        $pull: {
            availableAppointments: req.body.availableAppointments
        }
    }, function(err, updateUser) {
        if (err) {
            console.log(err)
        } else {

            console.log('pull successfully', updateUser)
            console.log(updateUser)
        }
    });
    db.update({
        username: req.session.username
    }, {
        $push: {
            reservedAppointments: req.body
        }
    }, function(err, updateUser) {
        if (err) {
            console.log(err)
        } else {
            console.log('push to reservedAppointments')
            console.log(updateUser)
        }
    })
    res.send("updateUser")
})
//************************************

var port = process.env.PORT || 2020
app.listen(port, () => {
    console.log('Server listening on port ', port)
});
