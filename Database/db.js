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
		type: String,
		required: true
	},
 	password: {
 		type: String,
 		required: true
 	},
 	phonnumber:{
 		type:Number,
 		required:true
 	},
 	specilization:{
 		type:String,
 		require:true
 	},
 	availableappointments:{
 		type:Array
 	},
 	reservedappointments:{
 		type:Array
 	}
});

var admins = mongoose.model ('admins', adminsSchema);

module.exports = admins;
