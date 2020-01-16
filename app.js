var express = require("express"),
  mongoose = require("mongoose"),
  bodyParser = require("body-parser"),
  methodOverride = require("method-override"),
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

/*
user and auth routes below 
*/

// index
app.get("/", function(req, res) {
  User.find({}, function(e, users) {
    if (e) {
      console.log(e);
    } else {
      res.render("home", { users: users });
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

        return res.render("register");
      } else {
        passport.authenticate("local")(req, res, function() {
          res.redirect("/");
        });
      }
    }
  );
});

app.get("/login/:id", function(req, res) {
  var userID = req.params.id;

  res.render("login", { id: userID });
});

app.post(
  "/login/:id",
  passport.authenticate("local", {
    failureRedirect: "/"
  }),
  function(req, res) {
    var userID = req.params.id;

    res.redirect("/" + userID + "/pairs");

    console.log("Logged in");
  }
);

app.delete("/users/:id", function(req, res) {
  var userID = req.params.id;

  User.findByIdAndRemove(userID, function(e) {
    res.redirect("/");
  });
});

app.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/");
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
}

/*
pair routes below
*/

// index
app.get("/:id/pairs", function(req, res) {
  var userID = req.params.id;

  User.findById(userID, function(e, foundUser) {
    if (e) {
      console.log(e);

      res.redirect("/");
    } else {
      console.log(foundUser);

      res.render("pairs", { user: foundUser });
    }
  });
});

// new
app.get("/:id/pairs/new", function(req, res) {
  var userID = req.params.id;

  User.findById(userID, function(e, foundUser) {
    if (e) {
      console.log(e);
    } else {
      res.render("new", { user: foundUser });
    }
  });
});

// create
app.post("/:id/pairs", function(req, res) {
  // maybe use express-sanitizer
  var userID = req.params.id;

  User.findById(userID, function(e, foundUser) {
    if (e) {
      res.render("new");

      console.log(e);
    } else {
      foundUser.pairs.push({
        website: req.body.pair.website,
        password: req.body.pair.password
      });
      foundUser.save(function(e, user) {
        if (e) {
          console.log(e);
        } else {
          console.log(user);
        }
      });

      console.log(foundUser);

      res.redirect("/" + userID + "/pairs");
    }
  });
});

// show
app.get("/:id/pairs/:pair_id", function(req, res) {
  var userID = req.params.id;
  var pairID = req.params.pair_id;

  User.findById(userID, function(e, foundUser) {
    if (e) {
      console.log(e);
    } else {
      foundUser.pairs.forEach(function(pair) {
        if (pair._id == pairID) {
          res.render("show", {
            website: pair.website,
            password: pair.password,
            username: foundUser.username,
            userID: userID,
            pairID: pairID
          });
        }
      });
    }
  });
});

// edit
app.get("/:id/pairs/:pair_id/edit", function(req, res) {
  var userID = req.params.id;
  var pairID = req.params.pair_id;

  User.findById(userID, function(e, foundUser) {
    if (e) {
      console.log(e);

      res.redirect("/" + userID + "/pairs");
    } else {
      foundUser.pairs.forEach(function(pair) {
        if (pair._id == pairID) {
          res.render("edit", {
            userID: userID,
            pairID: pairID,
            website: pair.website
          });
        }
      });
    }
  });
});

// update
app.put("/:id/pairs/:pair_id", function(req, res) {
  var userID = req.params.id;
  var pairID = req.params.pair_id;
  var pairs = [];

  User.findById(userID, function(e, foundUser) {
    if (e) {
      console.log(e);

      res.redirect("/" + userID + "/pairs");
    } else {
      foundUser.pairs.forEach(function(pair) {
        if (pair._id == pairID) {
          pairs.push(req.body.pair);
        } else {
          pairs.push(pair);
        }
      });

      User.findOneAndUpdate({ _id: userID }, { pairs: pairs }, function(
        e,
        updatedUser
      ) {
        if (e) {
          console.log(e);

          res.redirect("/" + userID + "/pairs");
        } else {
          console.log(pairs);

          res.redirect("/" + userID + "/pairs");
        }
      });
    }
  });
});

// delete
app.delete("/:id/pairs/:pair_id", function(req, res) {
  var userID = req.params.id;
  var pairID = req.params.pair_id;

  User.findById(userID, function(e, foundUser) {
    if (e) {
      console.log(e);
    } else {
      var pairs = [];

      foundUser.pairs.forEach(function(pair) {
        if (pair._id == pairID) {
          return; // similar to continue;
        } else {
          pairs.push(pair);
        }
      });

      User.findOneAndUpdate({ _id: userID }, { pairs: pairs }, function(
        e,
        foundUser
      ) {
        if (e) {
          console.log(e);

          res.redirect("/" + userID + "/pairs");
        } else {
          console.log(foundUser.pairs);

          res.redirect("/" + userID + "/pairs");
        }
      });
    }
  });
});

app.listen(port, function() {
  console.log("The application has started!");
});
