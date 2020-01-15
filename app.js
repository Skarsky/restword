var express = require("express"),
  mongoose = require("mongoose"),
  bodyParser = require("body-parser"),
  passport = require("passport"),
  localStrategy = require("passport-local"),
  User = require("./models/user"),
  port = process.env.PORT || 3000,
  app = express();

mongoose.connect("mongodb://localhost:27017/restword", {
  useNewUrlParser: true
});

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
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

app.get("/", function(req, res) {
  res.render("home");
});

app.get("/secret", function(req, res) {
  User.find({}, function(e, users) {
    if (e) {
      console.log(e);
    } else {
      res.render("secret", { users: users });
    }
  });
});

app.get("/register", function(req, res) {
  res.render("register");
});

app.post("/register", function(req, res) {
  User.register(
    new User({ username: req.body.username }),
    req.body.password,
    function(e, user) {
      if (e) {
        console.log(e);

        res.render("register");
      } else {
        passport.authenticate("local")(req, res, function() {
          res.redirect("/secret");
        });
      }
    }
  );
});

app.get("/login", function(req, res) {
  res.render("login");
});

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/secret",
    failureRedirect: "/login"
  }),
  function(req, res) {
    console.log("Logged in");
  }
);

app.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/");
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect("/login");
}

app.listen(port, function() {
  console.log("The application has started!");
});
