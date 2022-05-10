const mongoose = require("mongoose");
const bycrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

var ProfShema = mongoose.Schema({
  email: { type: String,  unique: true },
  password: { type: String, },
  firstname: { type: String, },
  lastname: { type: String, },
  phone: { type: String, },
  isConnected: { type: Boolean, default: false },
  temporarytoken: { type: String },
  avatar: { type: String },
  HighSchool: { type: String,  },
  sexe: { type: String, required: false },
  created_at: { type: String, required: false },
  matiere: { type: String, },
  role: { type: String, },
  admin: { type: Boolean, default: false },
  status: { type: Boolean, default: true },
  saltSecret: String,
});

ProfShema.pre("save", function (next) {
  bycrypt.genSalt(10, (err, salt) => {
    bycrypt.hash(this.password, salt, (err, hash) => {
      this.password = hash;
      this.saltSecret = salt;
      next();
    });
  });
});

ProfShema.methods.verifyPassword = function (password) {
  return bycrypt.compareSync(password, this.password);
};

ProfShema.methods.generateJwt = function () {
  return jwt.sign({ _id: this._id, admin: this.admin }, process.env.SECRET, {
    expiresIn: process.env.JWT_EXP,
  });
};

mongoose.model("Prof", ProfShema);
