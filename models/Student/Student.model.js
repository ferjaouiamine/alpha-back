const mongoose = require("mongoose");
const bycrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

var StudentShema = mongoose.Schema({
  email: { type: String, unique: true },
  password: { type: String, },
  firstname: { type: String, },
  lastname: { type: String, },
  phone: { type: String, },
  isConnected: { type: Boolean, default: false },
  temporarytoken: { type: String },
  avatar: { type: String },
  highSchool: { type: String, },
  sexe: { type: String, },
  birthday: { type: Date },
  class: { type: String },
  created_at: { type: String, },
  status: { type: Boolean, default: true },
  role: { type: String, },
  classe: { type: String, },
  section: { type: String, },
  resetToken: { type: String},
  profs: [
    {
      profid: String,
      subject: String,
    },
  ],
  saltSecret: String,
});

StudentShema.pre("save", function (next) {
  bycrypt.genSalt(10, (err, salt) => {
    bycrypt.hash(this.password, salt, (err, hash) => {
      this.password = hash;
      this.saltSecret = salt;
      next();
    });
  });
});

StudentShema.methods.verifyPassword = function (password) {
  return bycrypt.compareSync(password, this.password);
};

StudentShema.methods.generateJwt = function () {
  return jwt.sign({ _id: this._id, admin: this.admin }, process.env.SECRET, {
    expiresIn: process.env.JWT_EXP,
  });
  
};



const Student = mongoose.model('Student', StudentShema);

module.exports = Student;

// mongoose.model("Student", StudentShema);
