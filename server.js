var express = require('express');
var bcrypt = require('bcrypt');
var mongoose = require('mongoose');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var app = express();
var session = require('express-session')
var cookieParser = require('cookie-parser')
    // var path = require('path');
var db = require('./Database/db');
var jwt = require('jwt-simple');
var multer = require('multer');
var upload = multer({
    dest: './FrontEnd/uploads/'
});
app.use(morgan('dev'));

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use(cookieParser());

// var loggedIn = false;
//make session
app.use(session({
    secret: "asynco",
    resave: false,
    saveUninitialized: true
}));

// static files inside FrontEnd folder
app.use(express.static(__dirname + '/./FrontEnd'));

// check if doctor loggin
app.get('/checkIsLoggedIn', (req, res) => {
    // this one will start automaticlly with the navBar component - navBar.html line:1 -
    // to check if a doctor is logged in in order to show or hide some 
    // elements in the top bar
  var checker = (!!req.session.username) ? 'true' : 'false';
  console.log('checking isLoggedIn --------------->', !!req.session.username, checker);
  res.send(checker);
});


// client page 
app.get('/index', (req, res) => {
  res.redirect('/index.html')
})

// ========================
// this one is ignored     ||
// check the "PUT" request ||
// ========================
//add reservedAppoinment 
app.post('/reservedappointments', function(req, res) {
   
    console.log("========================")
    console.log(req.body)
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

// get login page 
app.get('/login', function(req, res) {
    res.redirect('./views/login.html')
})

// Get all doctors
app.get('/getDoctors', (req, res) => {
    // this one will start automaticlly when the - main.html - is loaded
    // it will display all the doctors wether they have an open reservation or not.
    db.find({}, (err, data) => {
        if (err) console.log(err);
        // console.log('------------> all users', data);
        res.send(data);
    });
});
// End TEST
// Get specific doctor
app.post('/getDoctorData', (req, res) => {
     // this request will be triggered when the user click on the doctor picture
      // in the - main.html - and it will find the doctor and return his data
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
    // this request is triggered automatically when the doctor logs in to get
    // his resrvaed dates 
    // console.log('********************>', req.body.doctorName);
    db.findOne({
        username: req.session.username
    }, (err, data) => {
        if (err) console.log(err);
        res.send(data);
    });
});



// Login page form
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
    // it will be triggered by the log out button 
  req.session.username = null;
  console.log('->>>>>>>>>>>>>', req.session);
  res.redirect('/login');
});

// Sign Up  form POST 
// multer model for download image 
app.post('/signup', upload.any()/*?????*/, function(req, res) {
// this will be triggered by the form from the - signup.html -
// it will use multar to upload the photo 
// but it will be stored locally so if opened in another device it 
// won't appeare, so I recommend another method
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

// Add an appointment to doctor 
app.put('/addAppointments', function(req, res) {
    // this request will be triggered by - admin.html - 
    // and will store the new appointment in the db.
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

// Reserve an appointment from client 
app.put("/reservedappointments", function(req, res) {
    // this request is triggered by the submit button by when the user 
    // chooses an appointment to reserve, 
    console.log('req.body ------->', req.body)
    var fullAppointment = req.body.reservedAppointment.availableAppointments.split(' ');
    var theAppointment = {
      time: fullAppointment[0],
      date: fullAppointment[1]
    }
    req.body.reservedAppointment.availableAppointments = theAppointment;
    db.update({
        username: req.body.username
    }, {

        // removing the appointment from the available
        $pull: {
            availableAppointments: req.body.reservedAppointment.availableAppointments
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
        username: req.body.username
    }, {
        $push: {
            // putting the appointment in the reserved
            reservedAppointments: req.body.reservedAppointment
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
 

 // delete reserved appoinment 
app.delete('/deleteAppointment' , function (req , res) {
	/* body... */

    // this one doesn't work 
    console.log('***********>>', req.body, req.session.username)
    var theAppointment = {
        availableAppointments: req.body.reservedAppointment.availableAppointments,
        patientName: req.body.reservedAppointment.patientName,
        patientPhone: req.body.reservedAppointment.patientPhone
    }
    req.body.reservedAppointment = theAppointment;
    console.log('xxxxxxxxxxxxx>', req.body.reservedAppointment)
	 db.update({
        username: req.session.username
    }, {
        $pull: {
            reservedAppointments: req.body.reservedAppointment
        }
    }, function(err, updateUser) {
        if (err) {
            console.log(err)
        } else {

            console.log('pull successfully', updateUser)
            console.log(updateUser)
        }
    });
})




//************************************
// listen to port 2036 
var port = process.env.PORT || 2036
app.listen(port, () => {
    console.log('Server listening on port ', port)
});
