require("./config/config");
require("./models/db");
require("./config/passportConfig");
require("dotenv").config();

const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const passport = require("passport");
const routerIndex = require("./routes/index.router");
const app = express();
app.use("/uploads", express.static("uploads"));

// middlewares
app.use(bodyParser.json());
const corsOptions = {
  exposedHeaders: 'Authorization',
};

app.use(cors(corsOptions));

app.use(passport.initialize());
app.use("/api", routerIndex);

const port = process.env.PORT || 3001;
// Starting server
app.listen(port, function () {
  console.log("server starting at " + port);
});
