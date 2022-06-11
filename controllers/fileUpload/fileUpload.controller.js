module.exports.uploadVideo = (req, res) => {
  const file = req.file;
  if (!file) {
    return res.send("Unable to upload a file: This file type is not supported");
  }
  res.send(file);
};

module.exports. uploadAvatar = (req, res) => {
  const file = req.file;
  if (!file) {
    return res.send("Unable to upload a file: This file type is not supported");
  }
  res.send(file);
};
