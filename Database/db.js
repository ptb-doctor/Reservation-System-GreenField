var mongoose=require('mongoose');

var Schema=mongoose.Schema;

//database name is "admins".

mongoose.connect('mongodb://asynco:1234@ds113445.mlab.com:13445/asynco',function(err,data){
	if(err){
		console.log(err)
	}
	console.log('connect with db');
});

var doctors = new Schema({
	id : Number ,
	name: {
		type: String,
		required: true
	},
 	password: {
 		type: String,
 		required: true
 	},
 	phone:{
 		type:Number,
 		required:true
 	},
 	major:{
 		type:String,
 		require:true
 	},
 	open:{
 		type: Array
 	},
	image:{
		type: String
	}
});

var patients = new Schema({
	id : Number ,
	name: {
		type: String,
		required: true
	},
 	password: {
 		type: String,
 		required: true
 	},
 	phone:{
 		type:Number,
 		required:true
 	},
 	image:{
		type: String
	}
});


var appointments = new Schema({
	id : Number ,
	id_doctor: {
		type: Number,
		required: true
	},
 	patient: {
		type: Number,
		required: true
	},
 	time:{
 		type: Date,
 		required:true
 	},
 	recomendations:{
		type: String
	},
 	case:{
		type: String
	},
});


exports.doctors = mongoose.model ('doctors', doctors);
exports.patients = mongoose.model ('patients', patients);
exports.appointments = mongoose.model ('appointments', appointments);

