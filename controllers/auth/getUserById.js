const mongoose = require("mongoose");
const Student = mongoose.model("Student");
const Prof = mongoose.model("Prof");

module.exports.getuserbyid = async (req, res) => {
  const user = await Student.findById(req.user, (err, user) => {
    if (user && !err) {
      res.status(200).json({
        auth: true,
        role: user.role,
        user: {
          admin: user.admin,
          id: user._id,
          email: user.email,
          status: user.status,
        },
      });
    } else {
      const user = Prof.findById(req.user, (err, user) => {
        if (user && !err) {
          res.json({
            auth: true,
            role: user.role,
            user: {
              admin: user.admin,
              id: user._id,
              email: user.email,
              status: user.status,
            },
          });
        } else {
          res.status(400).json({ msg: "can not find user" });
        }
      });
    }
  });
};
