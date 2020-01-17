var express = require("express"),
  router = express.Router(),
  User = require("../models/user");

// index
router.get("/:id/pairs", function(req, res) {
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
router.get("/:id/pairs/new", function(req, res) {
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
router.post("/:id/pairs", function(req, res) {
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
router.get("/:id/pairs/:pair_id", function(req, res) {
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
router.get("/:id/pairs/:pair_id/edit", function(req, res) {
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
router.put("/:id/pairs/:pair_id", function(req, res) {
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
router.delete("/:id/pairs/:pair_id", function(req, res) {
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

// middleware
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
}

module.exports = router;
