var mongoose=require('mongoose');

var Schema=mongoose.Schema;

//database name is "admins".
//mongodb://asynco:1234@ds113445.mlab.com:13445/asynco

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
	doctor: {
		type: String,
		required: true
	},
 	patient: {
		type: String,
		required: true
	},
 	time:{
 		type: String,
 		required:true
 	},
 	recomendations:{
		type: String
	},
 	case:{
		type: String
	}
});


exports.doctors = mongoose.model ('doctors', doctors);
exports.patients = mongoose.model ('patients', patients);
exports.appointments = mongoose.model ('appointments', appointments);

// mongoose.connect('mongodb://localhost/ptb',function(err,data){
// 	if(err){
// 		console.log(err)
// 	}
// 	console.log('connect with db');
// });
mongoose.connect('mongodb://localhost/ptb', { useMongoClient: true })
    .then(() => console.log('connect with db'))
    .catch(err => console.error(err));