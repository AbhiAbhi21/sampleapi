var mongoose = require("mongoose");

var Schema = new mongoose.Schema({
  email: {type: String, required: [true, "can't be blank"], match: [/\S+@\S+\.\S+/, 'is invalid']},
  wallet: Number,
  referred_by: String,
});

module.exports = mongoose.model("User", Schema);
