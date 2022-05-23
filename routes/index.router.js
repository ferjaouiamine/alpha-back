const express = require("express");
const router = express.Router();
var multer = require("multer");
path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  
  filename: (req, file, cb) => {
    console.log(file);
    cb(null, file.originalname.toLowerCase().split(" ").join("-"));
  },
});

const fileFilter = (req, file, cb) => {
  /*if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|pdf|PDF)$/)) {
    req.fileValidationError = "Only image files are allowed!";
    return cb(new Error("Only image files are allowed!"), false);
  }
  cb(null, true);
*/
  if (file.mimetype == "video/mp4" || file.mimetype == "application/pdf") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const avatarFilter = (req, file, cb) => {
  if (file.mimetype == "image/jpeg" || file.mimetype == "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

const avatarUpload = multer({
  storage: storage,
  fileFilter: avatarFilter,
});

const ctrlStudent = require("../controllers/Student/Student.controller");
const ctrlProf = require("../controllers/Prof/Prof.controller");
const ctrlAuth = require("../controllers/auth/auth.controller");
const ctrlAdmin = require("../controllers/Admin/Admin.controller");
const ctrlCourse = require("../controllers/course/course.controller");
const ctrlUpload = require("../controllers/fileUpload/fileUpload.controller");
const userbyid = require("../controllers/auth/getUserById");
const checkToken = require("../config/jwtHelper");
const jwtHelper = require("../config/jwtHelper");
const { sendMail } = require("../controllers/mailer/indexMailer");
//uploadFiles
// const upload = require ("../controllers/utils/multer");
// router.get("/uploads/",upload);

//auth
router.post("/login", ctrlAuth.authenticate);
router.post("/checkToken", checkToken.checktoken);
//getuserbyid
router.get("/userById", jwtHelper.verifyJwtToken, userbyid.getuserbyid);

// Student
router.post("/student/register", ctrlStudent.register);
router.get("/student/:id", ctrlStudent.getStudentById);
router.get("/students", ctrlStudent.getAllStudents);
router.put("/student/:id", ctrlStudent.updateStudent);
router.delete("/student/:id", ctrlStudent.deleteStudent);

// Prof
router.post("/prof/createProf", ctrlProf.createProf);
router.get("/profs", ctrlProf.getAllProfs);
router.put("/prof/:id", ctrlProf.updateProf);
router.delete("/prof/:id", ctrlProf.deleteProf);

router.get("/prof/:id", ctrlProf.getProfById);
router.put("/prof/addStudent/:id", ctrlProf.addStudent);
router.put("/prof/removeStudent/:id", ctrlProf.removeStudent);
router.get("/prof/courses/:id", ctrlProf.getProfCourses);

//admin
router.put("/admin/changeProfStatus/:id", ctrlAdmin.changeProfStatus);
router.put("/admin/changeStudentStatus/:id", ctrlAdmin.changeStudentStatus);
router.get("/admin/profs", ctrlAdmin.getAllProfs);

//course
router.post("/course", ctrlCourse.addCourse);
router.get("/courses", ctrlCourse.getAllCourses);
router.get("/course/:id", ctrlCourse.getCourseById);
router.put("/course/:id", ctrlCourse.updateCourse);
router.delete("/course/:id", ctrlCourse.deleteCourse);

//upload
router.post(
  "/upload/uploadFile",
  upload.single("file"),
  ctrlUpload.uploadVideo
);

router.post(
  "/upload/uploadAvatar",
  avatarUpload.single("file"),
  ctrlUpload.uploadAvatar
);

router.post('/send-mail', sendMail);

module.exports = router;
