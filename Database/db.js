var mongoose=require('mongoose');

var Schema=mongoose.Schema;

//database name is "admins".

mongoose.connect('mongodb://localhost/admins',function(err,data){
	if(err){
		console.log(err)
	}
	console.log('connect with db');
});

//for suring connecting

// mongoose.connection.once('open',function(){
// 	console.log('connected to database');
// }).on('error',function(error){
// 	console.log('Connection error:',error);
// });

//Doctor Schema for sign up and register his phon,job,
//available,reserved Appointments.

var adminsSchema= new Schema({
	username: {
		type: String,
		required: true
	},
 	password: {
 		type: String,
 		required: true
 	},
 	phonnumer: {
 		type: Number,
 		required: true
 	},
 	job:{
 		type: String,
 		required: true
 	},
 	availableAppointments: {
 		type: Array,
 		required: true
 	},
 	reservedAppointments: Array
});

// reservedAppointments form from body by post:
// {
// 	time: ,
// 	patientName: ,
// 	patientPhone: 
// }

var admins = mongoose.model ('admins', adminsSchema);

module.exports = admins;
