var mongoose = require("mongoose"),
  passportLocalMongoose = require("passport-local-mongoose");

var pairSchema = new mongoose.Schema({
  website: String,
  password: String
});
var Pair = mongoose.model("Pair", pairSchema);

var userSchema = new mongoose.Schema({
  username: String,
  password: String,
  pairs: [pairSchema]
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
