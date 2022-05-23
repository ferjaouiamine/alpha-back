const mongoose = require("mongoose");
const passport = require("passport");

const random = require("randomstring");
let date_ob = new Date();

module.exports.authenticate = (req, res, next) => {
  console.log("in authenticate ...");
  if (!req.body.email || !req.body.password)
    return res.status(400).json({ msg: "Not all fields have been entered." });
  passport.authenticate("local", (err, user, info) => {
    console.log("user ->>> " + user);


    if (!user.status) return res.status(400).json({ msg: 'student account desactivated' });
    if (err) {
      return res.status(400).json(err);
    } else if (user && user.status) {
      console.log("generating token");
      console.log(user.generateJwt());
      return res.status(200).json({
        token: user.generateJwt(),
        user: user,
      });
    } else {
      return res.status(400).json({msg : info});
    }
  })(req, res);
};
