const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const { json } = require("body-parser");

var Student = mongoose.model("Student");
var Prof = mongoose.model("Prof");
let Cuser = false;

passport.use(
  new localStrategy({ usernameField: "email" }, (email, password, done) => {
    Student.findOne({ email: email }, (err, user) => {
      //else if (!user.active) { return done(null,false,{msg: 'Veulliez confirmer votre Email S\'il vous plaît !'}) }
      if (!err && user && user.verifyPassword(password)) {
        Cuser = true;
        return done(null, user);
      } else {
        Prof.findOne({ email: email }, (err, user) => {
          if (!err && user && user.verifyPassword(password)) {
            Cuser = true;
            return done(null, user);
          }
          if (!Cuser) {
            return done(null, false, {
              msg: "email or password is incorrect",
            });
          }
        });
      }
    });
  })
);
