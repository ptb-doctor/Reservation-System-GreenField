var express = require('express');
var bcrypt = require('bcrypt');
var mongoose = require('mongoose');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var app = express();
var session = require('express-session');
var cookieParser = require('cookie-parser');
// Add headers
app.use(function (req, res, next) {

   // Website you wish to allow to connect
   res.setHeader('Access-Control-Allow-Origin', '*');

   // Request methods you wish to allow
   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

   // Request headers you wish to allow
   res.setHeader('Access-Control-Allow-Headers', '*');

   // Set to true if you need the website to include cookies in the requests sent
   // to the API (e.g. in case you use sessions)
   res.setHeader('Access-Control-Allow-Credentials', true);

   // Pass to next layer of middleware
   next();
});

    // var path = require('path');
//schemas :
var doctors = require('./Database/db').doctors;
var patients = require('./Database/db').patients;
var appointments = require('./Database/db').appointments;

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
    secret: "ptb",
    resave: false,
    saveUninitialized: true
}));

// static files inside FrontEnd folder
app.use(express.static(__dirname ));

// check if doctor loggin
app.get('/checkIsLoggedIn', (req, res) => {
    // this one will start automaticlly with the navBar component - navBar.html line:1 -
    // to check if a doctor is logged in in order to show or hide some 
    // elements in the top bar
  var checker = !!req.session.username;
  if (checker) {
    doctors.find({name : req.session.username}, (err, data) => {
        if (data.length > 0) {
            return res.send('doctor');
        } else {
            patients.find({name : req.session.username}, (error , patient)=>{
                if (patient.length > 0) {
                    return res.send('patient');
                }
                return res.send('false');
            })
        }
    })
  } else {
    console.log('checking isLoggedIn ---------------> false ');
    res.send(checker);
  }
});


// client page 
app.get('/', (req, res) => {
    console.log('inside get////////');
      res.redirect('/FrontEnd/index.html');
})

// app.get('/index', (req, res) => {
//     console.log('inside get/')
//     if (!req.session.username) {
//         console.log('idon\'t  have a session');
//         //res.status(200);
//         return res.redirect('/FrontEnd/views/login.html');
//     } else {
//       console.log('i have a session');
//       //res.status(200);
//       res.redirect('/FrontEnd/index.html');
//     }
// })

// get login page 
// app.get('/login', function(req, res) {
//     res.redirect('/FrontEnd/views/login.html');
// })

// Get all doctors
app.get('/getDoctors', (req, res) => {
    // this one will start automaticlly when the - main.html - is loaded
    // it will display all the doctors wether they have an open reservation or not.
    doctors.find({}, (err, data) => {
        if (err) {
            console.log('err : ', err);
        }
        // console.log('------------> all users', data);
        data = data.map((doc)=> {
            doc.open = doc.open.map((ele) => {
                console.log(ele ," : to change from str to object")
                return changeDate(ele);
            })
            return doc;
        })
        console.log(data[0].open)
        console.log('inside get/getDoctors .............')
        res.send(data);
    });
});
// End TEST
// Get specific doctor
//this one for the main page 
app.post('/getDoctorData', (req, res) => {
     // this request will be triggered when the user click on the doctor picture
      // in the - main.html - and it will find the doctor and return his data
    // console.log('********************>', req.body.doctorName);
    doctors.find({
        name: req.body.doctorName
    }, (err, data) => {
        if (err) {
            return console.log(err);
        }
        if (data.length === 0) {
            return console.log("emty data post('/getDoctorData')")
        }
        data[0].open = data[0].open.map((app)=> {
            return changeDate(app);
        })
        res.send(data);
    });
});
// Get specific doctor
//this one for the doctor profile
app.get('/docInfo', (req, res) => {
     // this request will be triggered when the user click on the doctor picture
      // in the - main.html - and it will find the doctor and return his data
    // console.log('********************>', req.body.doctorName);
    doctors.find({
        name: req.session.username
    }, (err, data) => {
        if (err || data.length === 0) {
            console.log(err , data);
            return res.send({})
        }
        data[0].open = data[0].open.map((app)=> {
            return changeDate(app);
        })
        res.send(data);
    });
});

// Load reserved appointments from doctor side (admin.js)
app.get('/getDoctorReservedAppointments', (req, res) => {
    // this request is triggered automatically when the doctor logs in to get
    // his resrvaed dates 
    // console.log('********************>', req.body.doctorName);
    doctors.find({
        name: req.session.username
    }, (err, data) => {
        /*data is array of objects like => { id , name , password , phone , major , open , image }*/
        if (err || !data.length) {
            console.log(err);
        }
        else {
            appointments.find({
                doctor : data[0].id
            }, (error, info) => {
                if (err) return console.log(err);
                //info is array of objects , each object is an appointment
                //{id , doctor , patient , time , recomendations , case}
                consoloe.log(data.length ,' appointments for the doc : ', req.session.username)
                res.send(info);
            })
        }       
    });
});



// Login page form
app.post('/login', function (req, res) {
    var username = req.body.username;
    var password = ''+req.body.password;
    console.log('--------$$$$---->login', req.session,' user & pass : ', username , ' / ' , password)
    // var salt = bcrypt.genSaltSync(10);
    // var hash = bcrypt.hashSync(password, salt);
    doctors.find({
        name: username
    }, function (err, doctor) {
        if (err) {
            return res.status(404).send();
        }
        if (doctor.length) {
            console.log (username , ' is a doctor !!');
            if (doctor[0].password !== password) {
                console.log('incorrect password  ', doctor[0]);
                return res.redirect('/FrontEnd/views/login.html');
            }
            // Create session
            req.session.username = doctor[0].name;
            req.session.password = doctor[0].password;
            console.log('--------doctor-------',doctor[0])
            console.log('--------req.session-------',req.session)
            return res.redirect('/FrontEnd/index.html');
        }
        patients.find({
            name: username
        }, (error , patient) => {
            if (err) return res.status(404).send();
            if (!patient.length) {
                console.log('not found in db !!');
                return res.redirect('/FrontEnd/views/login.html');
            }
            console.log (username , ' is a patient !!');
            if (patient[0].password !== password) {
                console.log('incorrect password');
                return res.redirect('/FrontEnd/views/login.html');
            }
            req.session.username = patient[0].name;
            req.session.password = patient[0].password;

            console.log('patient is signed in ......');
            return res.redirect('/FrontEnd/index.html');
        })
    })
});

//Logout endpoint
app.get('/logout', function(req, res) {
    // it will be triggered by the log out button 
    req.session.username = null;
    req.session.password = null;
    console.log('get logout>>>>>>>>>>>>>', req.session);
    // res.redirect('/login');
    res.send();
});

// Sign Up  form POST 
// multer model for download image 
app.post('/signup', upload.any(), function(req, res) {
// this will be triggered by the form from the - signup.html -
// it will use multar to upload the photo 
// but it will be stored locally so if opened in another device it 
// won't appeare, so I recommend another method

//check if the username is already used  :

    //console.log(req.body)
    patients.find({name : req.body.username}, (error, patient)=> {
        if (error) {
            return res.send("error with finding patients names") ;
        }
        doctors.find({name : req.body.username}, (err, doctor)=> {
            if (err) {
                return res.send("error with finding doctors names") ;
            }
            if (doctor.length || patient.length) {
                console.log('doctor : ', doctor , 'patient : ', patient)
                return res.send("user name is already taken") ;
            }

            var addDoc = {
                name: req.body.username,
                password: req.body.password,
                phone: req.body.phoneNumber,
                major: req.body.specilization,
                image: req.files[0].filename
            };
            console.log('req.body : ', req.body)
            console.log('req.body : ', req.files)
            var user = new doctors(addDoc);
            user.save()
                .then(item => {
                    // res.redirect('/FrontEnd/views/login.html');
                    res.send();
                })
                .catch(err => {
                    res.status(400).send("unable to save to database")
                })
            
        })
    })
});

//sign up a patient :
app.post('/patient', (req, res) => {
    patients.find({name : req.body.username}, (error, patient)=> {
        if (error) {
            return res.send("error with finding patients names") ;
        }
        doctors.find({name : req.body.username}, (err, doctor)=> {

            if (err) {
                return res.send("error with finding doctors names") ;
            }
            if (doctor.length || patient.length) {
                console.log('doctor : ', doctor , 'patient : ', patient)
                return res.send("user name is already taken") ;
            }
            console.log('req.body : ', req.body)
            console.log('req.body : ', req.files)

            var addPatient = {
                name: req.body.username,
                password: req.body.password,
                phone: req.body.phoneNumber,
                image: req.body.myImage
            };
            var user = new patients(addPatient);
            user.save()
                .then(item => {
                    //res.redirect('/FrontEnd/views/login.html');
                    res.send();
                })
                .catch(err => {
                    res.status(400).send("unable to save to database")
                })
        })
    })
});

// Sign Up GET
// app.get('/signup', function(req, res) {
//     res.redirect('/FrontEnd/views/signup.html')
// });

// Add an appointment to doctor 
app.put('/addAppointments', function(req, res) {
    // this request will be triggered by - admin.html - 
    // and will store the new appointment in the db.
    console.log('-------- addappointments', req.body, '***for the doctor****', req.session.username);

    doctors.update({
        name: req.session.username
    }, {
        $push: {
            open: req.body.newAppointment.time +' '+req.body.newAppointment.date
        }
    }, function(err, updateUser) {
        if (err) {
            console.log('error');
        } else {
            console.log('doctor new opens : ' , updateUser);
            res.send(updateUser);
        }
    })
});

//get patient profile : 
app.get('/patientprofile', (req , res) => {
    // if (!req.session.username) {
    //     console.log('patient profile redirecting to login');
    //     return res.redirect('/FrontEnd/views/login.html');
    // } else {   
        console.log('patient profile for : ' , req.session.username);
        //get paient data from db : 
        patients.find({name : req.session.username}, (err, data) => {
            if (err) {
                console.log('errror')
                return res.send({})
            };
            appointments.find({patient : data.id}, (error , appointments)=> {

                if (error || data.length === 0) {
                    console.log('error || data.length === 0', appointments)
                    return res.send({a:'whaaaat??'})
                }
                console.log(data)
                data[0].appointments = appointments
                return res.send(data[0]);
            })
        })
    // }
})


// Reserve an appointment from client 
/*{ doctor: 
   { _id: '59dc80482ed39f108c53abc7',
     name: 'aa',
     password: 'aa',
     phone: '11',
     major: 'aa',
     image: 'c5970426f31149f21ff871551a696f4e',
     __v: '0',
     open: [ [Object] ] },
  time: '12:00 2017-10-04',
  Case: 'asas' }

*/
app.put("/reservedappointments", function(req, res) {
    // this request is triggered by the submit button by when the user 
    // chooses an appointment to reserve, 
    console.log('req.body at reservedappointments------->', req.session);
    // var str = req.body.time.split(' ');
    // var time = {time : str[0] , date : str[1]}
    deleter (req.body.doctor.id , req.body.time , ()=> {
        patients.find({name: req.session.username}, (err, patient) => {
            console.log('patient:', patient[0]._id , req.body.doctor._id)
            var obj = new appointments({
                            doctor: req.body.doctor._id ,
                            patient: patient[0]._id,
                            time: req.body.time ,
                            recomendations: '' ,
                            case: req.body.Case
                        })
            obj.save()
                .then(()=>{
                    console.log(obj , ' saved to db');
                })
                .catch((err)=> {
                    console.log('error saving : ', obj);
                    console.log('error saving : ', err);
                })

        })

    })
})
 

 // delete reserved appoinment 
app.delete('/deleteAppointment' , function (req , res) {
    //i will recieve appointment object like the schema 
    console.log('deleteAppointment ======================>>', req.body, req.session.username)
    appointments.remove({id : req.body.reservedAppointment.id}, function(err, data) {
        if (err) {return console.log('error removing reserved appoinment')}
        console.log('data removed : ' ,data )
    })
})

 // delete open appoinment 
app.delete('/deleteOpenAppointment' , function (req , res) {
    //i will recieve appointment object like the schema 
    console.log('deleteAppointment ======================>>', req.body , 'for the doctor', req.session.username)
    console.log('req.body should be str ...')
    deleter (req.body.reservedAppointment.id, req.body , ()=>{
        res.send();
    })
    
})

function deleter (id , timeToDelete , cb) {

    doctors.update({
        id : id
    }, {
        $pull : {
            open : timeToDelete
        }
    }, (err, updated) => {
        if (err) console.log('err deleteing open appointment', req.body);
        else {
            console.log('deleted : ' , updated)
            cb();
        }
    })
}

function changeDate (str) {
    console.log(str , ' : this is str at changeDate ')
    var arr = str.split(' ');
    return {
        time : arr[0],
        date : arr[1]
    }
}

app.post('/recomendation', (req,res)=>{
    console.log('recomendation : ', req.body.recomendation , ' from the doctor : ' , req.session.username );
    console.log('the appointment : ', req.body.appointment);
    // doctors.find({ doctor : req.session.username },(err,data)=>{
    //     if(err)return console.log('err');
    //     if(data.length === 0)return console.log('the array is empty');

        appointments.update({ id : req.body.appointment.id }, { $set: { recomendations: req.body.recomendation }},{ multi: false },(error,result)=> {
            res.send();
        })
    // })
    
})

//************************************
// listen to port 2036 
var port = process.env.PORT || 2036
app.listen(port, () => {
    console.log('Server listening on port ', port)
});
