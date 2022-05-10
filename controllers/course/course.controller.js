const mongoose = require("mongoose");
const Course = mongoose.model("Course");
const cloudinary = require("../utils/cloudinary");
const upload = require("../utils/multer");
const fs = require('fs');

const cloudinaryImageUploadMethod = async file => {
  return new Promise(resolve => {
      cloudinary.uploader.upload( file , (err, res) => {
        if (err) return console.log(err)
          console.log( res.secure_url )
          resolve({
            res: res.secure_url
          }) 
        }
      ) 
  })
}

module.exports.addCourse = async(req, res, next) => {
  let response;
  //const uploader = await cloudinary.uploader.upload(req.file.path);
  //const uploader = async (path) => await cloudinary.uploader.uploads(path, 'Images');
//  /*
//   const uploader = async (path) => await cloudinary.uploader.upload (path, 'file');
  
//     const urls = []
//     const files = req.files;
//     for (const file of files) {
//       const { path } = file;
//       const newPath = await uploader(path)
//       urls.push(newPath)
//       fs.unlinkSync(path)
//     }

//     res.status(200).json({
//       message: 'images uploaded successfully',
//       data: urls
//     })
// */
 
  var newCourse = new Course();
  newCourse.idCourse = req.body.idCourse ;
  newCourse.classe = req.body.classe;
  newCourse.courseName = req.body.courseName;
  newCourse.chapterName = req.body.chapterName;
  newCourse.chapterNumber = req.body.chapterNumber;
  newCourse.description = req.body.description;
  newCourse.idChapter = req.body.idChapter;
  newCourse.svgUrl = req.body.svgUrl;
  newCourse.videoUrl = req.body.videoUrl;
  newCourse.pdfUrl = req.body.pdfUrl;
  
  newCourse.save((err, doc) => {
    console.log(newCourse);
    if (err) {
      response = {
        msg: "failed",
        data: [],
        err: err,
      };
      return res.status(400).send(response);
    } else {
      res.status(200).json({
        msg: "success",
        data: doc,
      });
    }
  });
};

module.exports.getAllCourses = (req, res) => {
  let response;
  var totalPages = 0;
  var page = parseInt(req.query.page);
  var size = parseInt(req.query.size);
  var query = {};
  if (page < 0 || page === 0) {
    response = {
      error: true,
      message: "invalid page number, should start with 1",
    };
    return res.json(response);
  }
  query.skip = size * (page - 1);
  query.limit = size;
  Course.countDocuments({}, function (err, totalCount) {
    if (err) {
      response = { error: true, message: "Error fetching data" };
    } else {
      totalPages = Math.ceil(totalCount / size);
    }
  });

  Course.find({}, {}, query, (err, doc) => {
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
      totalPages: totalPages,
    };
    return res.send(respone);
  });
};

module.exports.getCourseById = (req, res) => {
  let response;
  Course.findById({ _id: req.params.id }, (err, doc) => {
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
    };
    return res.send(respone);
  });
};

module.exports.updateCourse = (req, res, next) => {
  Course.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    function (err, course) {
      if (err) {
        response = {
          msg: "failed",
          data: [],
          err: err,
        };
      } else {
        let respone = {
          msg: "success",
          data: course,
        };
        res.send(respone);
      }
    }
  );
};
module.exports.deleteCourse = (req, res, next) => {
  let response;
  Course.remove({ _id: req.params.id }, function (err, doc) {
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
