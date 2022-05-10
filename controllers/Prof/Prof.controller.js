const mongoose = require("mongoose");
const Prof = mongoose.model("Prof");
const Student = mongoose.model("Student");
const Course = mongoose.model("Course");

const passport = require("passport");
const _ = require("lodash");

const random = require("randomstring");
let date_ob = new Date();

module.exports.createProf = async (req, res, next) => {
  try {
    let {
      firstName,
      lastName,
      email,
      phone,
      highSchool,
      matiere,
      password,
      passwordCheck,
    } = req.body;

    if (
      !email ||
      !password ||
      !passwordCheck ||
      !firstName ||
      !lastName ||
      !phone ||
      !matiere
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
/*
     if (/^[A-Za-z]+$/i.test(password) == false)
      return res.status(400).json({ msg: "The format incorrect" });*/

    if (password !== passwordCheck)
      return res
        .status(400)
        .json({ msg: "Entrez le même mot de passe deux fois pour vérification ." });
 
    var newProf = new Prof();
    newProf.email = req.body.email;
    newProf.password = req.body.password;
    newProf.firstname = req.body.firstName;
    newProf.lastname = req.body.lastName;
    newProf.phone = req.body.phone;
    newProf.active = false;
    newProf.isConnected = false;
    newProf.avatar = req.body.avatar;
    newProf.admin = false;
    newProf.status = true;
    newProf.HighSchool = req.body.HighSchool;
    newProf.role = "0";
    newProf.sexe = req.body.sexe;
    newProf.matiere = req.body.matiere;
    newProf.created_at = date_ob.getDate();
    newProf.temporarytoken = random.generate();

    const savedUser = await newProf.save();
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
      return res.status(404).json(info);
    }
  })(req, res);
};
module.exports.addStudent = (req, res, next) => {
  profId = { profid: req.body.user_id, subject: req.body.subject };
  Student.findByIdAndUpdate(
    { _id: req.params.id },
    { $push: { profs: profId } },
    (err, result) => {
      if (err) {
        res.send(err);
      }
      let response = {
        msg: "success",
        data: result,
      };
      res.send(response);
    }
  );
};
module.exports.removeStudent = (req, res, next) => {
  profId = { profid: req.body.user_id, subject: req.body.subject };
  let response;
  Student.findByIdAndUpdate(
    { _id: req.params.id },
    { $pull: { profs: profId } },
    (err, doc) => {
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
    }
  );
};
module.exports.getProfById = (req, res) => {
  let response;
  Prof.findById({ _id: req.params.id }, (err, doc) => {
    if (err) {
      response = {
        msg: "failed",
        data: [],
        err: err,
      };
      return res.send(response);
    }
    let response = {
      msg: "success",
      data: doc,
    };
    return res.send(response);
  });
};
module.exports.getProfCourses = (req, res) => {
  Course.find({ authorId: req.params.id }, (err, doc) => {
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
      total: doc.length,
    };
    return res.send(response);
  });
};

module.exports.getAllProfs = (req, res) => {
  let response;
  Prof.find({}, (err, doc) => {
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

module.exports.updateProf = (req, res, next) => {
  let response;
  Prof.findByIdAndUpdate(req.params.id, { $set: req.body }, function (
    err,
    prof
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
        data: prof,
      };
      res.send(respone);
    }
  });
};

module.exports.deleteProf = (req, res, next) => {
  let response;
  Prof.remove({ _id: req.params.id }, function (err, doc) {
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
