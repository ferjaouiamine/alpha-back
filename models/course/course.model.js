const mongoose = require("mongoose");

var courseShema = mongoose.Schema({
  idCourse: { type: String },
  courseName: { type: String },
  chapterName: { type: String },
  classe: { type: String },
  section: { type: String },
  idChapter: { type: String },
  chapterNumber: { type: String },
  description: { type: String },
  authorId: { type: String },
  section: { type: String },
  svgUrl: { type: String },
  videoUrl: [],
  level: { type: Number },
  pdfUrl: [],
});

mongoose.model("Course", courseShema);
