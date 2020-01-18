var express = require("express"),
  router = express.Router(),
  passport = require("passport"),
  User = require("../models/user");

// index
router.get("/", function(req, res) {
  User.find({}, function(e, users) {
    if (e) {
      console.log(e);
    } else {
      res.render("home", { users: users });
    }
  });
});

// register form
router.get("/register", function(req, res) {
  res.render("register");
});

// register post
router.post("/register", function(req, res) {
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

// sign in form
router.get("/login/:id", function(req, res) {
  var userID = req.params.id;

  res.render("login", { id: userID });
});

// sign in post
router.post(
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

// delete
router.delete("/users/:id", function(req, res) {
  var userID = req.params.id;

  User.findByIdAndRemove(userID, function(e) {
    if (e) {
      console.log(e);
    } else {
      res.redirect("/");
    }
  });
});

// logout
router.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/");
});

// middleware
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
}

module.exports = router;
