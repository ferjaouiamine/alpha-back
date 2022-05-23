const mongoose = require("mongoose");
const Student = mongoose.model("Student");
const Prof = mongoose.model("Prof");
const passport = require("passport");
const _ = require("lodash");
const createProf = require("../../controllers/Prof/Prof.controller");
//const mailer = require('../../misc/mailer');

const random = require("randomstring");
let date_ob = new Date();

module.exports.register = async (req, res, next) => {
  try {
    let {
      firstName,
      lastName,
      email,
      phone,
      highSchool,
      password,
      passwordCheck,
    } = req.body;

    if (
      !email ||
      !password ||
      !passwordCheck ||
      !firstName ||
      !lastName ||
      !phone

    )
      return res.status(400).json({ msg: "veuillez remplir le formulaire ." });

    if (
      /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/.test(
        email
      ) == false
    )
      return res.status(400).json({ msg: "Email n'est pas valide ." });

    if (password.length < 7)
      return res
        .status(400)
        .json({ msg: "Le mot de passe doit comporter au moins 8 caractères ." });

    /* if (/^[A-Za-z]+$/i.test(password) == false)
      return res.status(400).json({ msg: "The format incorrect" });*/

    if (password !== passwordCheck)
      return res
        .status(400)
        .json({ msg: "Entrez le même mot de passe deux fois pour vérification ." });

    var newStudent = new Student();
    newStudent.email = req.body.email;
    newStudent.password = req.body.password;
    newStudent.firstname = req.body.firstName;
    newStudent.lastname = req.body.lastName;
    newStudent.phone = req.body.phone;
    newStudent.role = "1";
    newStudent.birthday = req.body.birthdayDate;
    newStudent.sexe = req.body.sexe;
    // newStudent.section = classe.substr(1, classe.length);
    newStudent.active = false;
    newStudent.isConnected = false;
    newStudent.status = false;
    newStudent.avatar = req.body.avatar;
    newStudent.highSchool = req.body.highSchool;
    newStudent.created_at = ("0" + date_ob.getDate()).slice(-2);
    newStudent.temporarytoken = random.generate();


    const savedUser = await newStudent.save();
    res.status(200).json(savedUser);

  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};

module.exports.authenticate = (req, res, next) => {
  console.log("in authenticate");
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return res.status(400).json(err);
    } else if (user) {
      console.log("generating token");
      console.log(user.generateJwt());
      return res.status(200).json({ token: user.generateJwt() });
    } else {
      return res.status(400).json(info);
    }
  })(req, res);
};

module.exports.getStudentById = (req, res) => {
  Student.findById({ _id: req.params.id }, (err, doc) => {
    let response;
    if (err) {
      response = {
        msg: "failed",
        data: [],
        err: err,
      };
      return res.send(response);
    }
    response = {
      msg: "success",
      data: doc,
    };
    return res.send(response);
  });
};

module.exports.getAllStudents = (req, res) => {
  let response;
  Student.find({}, (err, doc) => {
    if (err) {
      response = {
        msg: "failed",
        data: [],
        err: err,
      };
      return res.send(response);
    }
    let respone = {
      msg: "success",
      data: doc,
      total: doc.length,
    };
    return res.send(respone);
  });
};

module.exports.updateStudent = (req, res, next) => {
  let response;
  Student.findByIdAndUpdate(req.params.id, { $set: req.body }, function (
    err,
    student
  ) {
    if (err) {
      response = {
        msg: "failed",
        data: [],
        err: err,
      };
    } else {
      let respone = {
        msg: "success",
        data: student,
      };
      res.send(respone);
    }
  });
};

module.exports.deleteStudent = (req, res, next) => {
  let response;
  Student.remove({ _id: req.params.id }, function (err, doc) {
    if (err) {
      response = {
        msg: "failed",
        data: [],
        err: err,
      };
      res.send(response);
    } else {
      response = {
        msg: "success",
        data: doc,
      };
      res.send(response);
    }
  });
};
