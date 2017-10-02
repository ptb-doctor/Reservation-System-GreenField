var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/medical');

// check merge----Osama


var medicalSchema = mongoose.Schema({
  username: String,
  password: Number,
});

var Medical = mongoose.model('Medical', medicalSchema);

module.exports = Medical;
