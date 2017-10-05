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

var user = '';

function createSession(req, res, newUser) {
    return req.session.regenerate(() => {
        user = newUser;
        req.session.user = newUser;
        res.redirect('/index');
    });
}


app.get('/index', (req, res) => {
    console.log('+++++++++++', req.session.user);
    if (req.session.username) {
        console.log('*-*-*-*-*-*-*NANANANANANANAN');
        res.redirect('/index.html')
    } else {
        console.log('OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO');
        res.redirect('/login')
    }
})
app.get('/allall', function(req, res) {
    db.find({}, (err, data) => {
        res.send(data)
    })
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

app.get('/login', function(req, res) {
    /* body... */
    res.redirect('/views/login.html')
})

// app.get('/getAppointment', function(req, res) {
//     res.send('GET request to the homepage')
//         // get all appointment
//         // put the data of appointment in table
//         // table have patient name telephone number and the time of Appoin.
//
// })

// TEST
app.get('/getDoctors', (req, res) => {
    db.find({}, (err, data) => {
        if (err) console.log(err);
        console.log('------------> all users', data);
        res.send(data);
    });
});
// End TEST

// Get specific doctor
app.post('/getDoctorData', (req, res) => {
    console.log('********************>', req.session.username);
    db.findOne({
        username: req.session.username
    }, (err, data) => {
        if (err) console.log(err);
        res.send(data);
    });
});


// // Logout endpoint
app.get('/logout', function(req, res) {
    req.session.user = null;
    console.log('->>>>>>>>>>>>>', req.session);
    res.redirect('/login');
});
//
//  app.post('/login', function(req, res) {
//      console.log('------------>login', req.body)
//     var username = req.body.username;
//     var password = req.body.password;
//     // var salt = bcrypt.genSaltSync(10);
//     // var hash = bcrypt.hashSync(password, salt);
//     db.findOne({ username: username , password : password},function (err , user) {
//
//         if(err){
//             console.log(err)
//             return res.status(404).send();
//         }
//         if(!user){
//             return res.status(404).send();
//         }
//         if(user){
//           res.redirect ('/index.html');
//         }
//     })
//
// });
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
})

app.get('/signup', function(req, res) {
    /* body... */
    res.redirect('/views/signup.html');
});

// Manage database
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

var port = process.env.PORT || 2017
app.listen(port, () => {
    console.log('Server listening on port ', port)
});
