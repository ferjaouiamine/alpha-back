const mongoose = require("mongoose");
const Student = mongoose.model("Student");
const Prof = mongoose.model("Prof");

const random = require("randomstring");

module.exports.changeProfStatus = (req, res, next) => {
  Prof.findById(req.params.id, function (err, prof) {
    prof.status = !prof.status;
    let respone;
    prof.save(function (err, doc) {
      if (err) {
        respone = {
          msg: "failed",
          data: [],
          err: err,
        };
        return res.send(response);
      } else {
        respone = {
          msg: "success",
          data: doc,
        };
        res.send(respone);
      }
    });
  });
};

module.exports.changeStudentStatus = (req, res, next) => {
  Student.findById(req.params.id, function (err, student) {
    student.status = !student.status;
    let respnse;
    student.save(function (err, doc) {
      if (err) {
        respone = {
          msg: "failed",
          data: [],
          err: err,
        };
        return res.send(response);
      } else {
        respone = {
          msg: "success",
          data: doc,
        };
        res.send(respone);
      }
    });
  });
};
module.exports.getAllProfs = (req, res) => {
  let respnse;
  Prof.find({}, (err, doc) => {
    if (err) {
      respnse = {
        msg: "failed",
        data: [],
        err: err,
      };
      return res.send(respnse);
    }
    respnse = {
      msg: "success",
      data: doc,
      total: doc.length,
    };
    return res.send(respnse);
  });
};
