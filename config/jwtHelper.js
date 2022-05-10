const jwt = require("jsonwebtoken");

module.exports.verifyJwtToken = async (req, res, next) => {
  var token;
  //console.log(req.headers["token"]);
  token = req.headers["token"];
  try {
    if (!token) {
      return res.send({ auth: false, message: "No token provided." });
    } else {
      jwt.verify(token, process.env.SECRET, (err, decoded) => {
        if (err)
          return res.send({
            auth: false,
            message: "Token authentication failed.",
          });
        else {
          req.user = decoded._id;

          next();
        }
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports.checktoken = async (req, res, next) => {
  var token;
  console.log(req.headers["token"]);
  token = req.headers["token"];
  try {
    if (!token) {
      return res.send({ auth: false, message: "No token provided." });
    } else {
      jwt.verify(token, process.env.SECRET, (err, decoded) => {
        if (err)
          return res.send({
            auth: false,
            message: "Token authentication failed.",
          });
        else {
          //  req.user = decoded._id;
          res.status(200).json({
            auth: true,
            message: "token is valid.",
          });
          //next();
        }
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
