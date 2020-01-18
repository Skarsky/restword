// requiring packages
var express = require("express"),
  mongoose = require("mongoose"),
  bodyParser = require("body-parser"),
  methodOverride = require("method-override"),
  passport = require("passport"),
  localStrategy = require("passport-local"),
  User = require("./models/user"),
  port = process.env.PORT || 3000,
  app = express();

// requiring routes
var pairRoutes = require("./routes/pairs"),
  indexRoutes = require("./routes/index");

// connect to database (local)
// mongoose.connect("mongodb://localhost:27017/restword", {
//   useNewUrlParser: true
// });

// connect to database (mongodb atlas)
mongoose
  .connect(
    "mongodb+srv:dbUser:dbUserPassword@cluster0-0fzgy.mongodb.net/test?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      userCreateIndex: true
    }
  )
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch(err => {
    console.log("Error - ", err.message);
  });

// config
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(passport.initialize());
app.use(passport.session());
app.use(
  require("express-session")({
    secret: "RESTful password manager",
    resave: false,
    saveUninitialized: false
  })
);
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// use routes
app.use(indexRoutes);
app.use(pairRoutes);

// server listen
app.listen(port, function() {
  console.log("The application has started!");
});
