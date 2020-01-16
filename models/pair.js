var mongoose = require("mongoose");

var pairSchema = new mongoose.Schema({
  website: String,
  password: String
});

module.exports = mongoose.model("Pair", pairSchema);
