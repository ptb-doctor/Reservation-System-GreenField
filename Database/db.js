var mongoose=require('mongoose');

var Schema=mongoose.Schema;

//database name is "admins".

mongoose.connect('mongodb://localhost/reservationSystemDB',function(err,data){
	if(err){
		console.log(err)
	}
	console.log('connect with db');
});

var adminsSchema= new Schema({
	username: {
		type: String
	},
 	password: {
<<<<<<< HEAD
 		type: String
 	},
 	phonnumer: {
 		type: Number
 		
 	},
 	job:{
 		type: String
 	},
 	availableAppointments: {
 		type: Array
 		
 	},
 	reservedAppointments: Array
=======
 		type: String,
 		required: true
 	}
>>>>>>> origin
});

var admins = mongoose.model ('admins', adminsSchema);

module.exports = admins;
