const mongoose = require("mongoose");

mongoose.connect(process.env.URI, (err) => {
  if (!err) {
    console.log("Connection Succeeded ...");
  } else {
    console.log("An error occured : " + err + "\n Connection failed ...");
  }
});
/*
mongoose.connect(
  process.env.URI,
  {
    keepAlive: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  },
  () => console.log("CONNECTED TO DB")
);*/

mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);

require("./Student/Student.model");
require("./Prof/Prof.model");
require("./course/course.model");
//amine 