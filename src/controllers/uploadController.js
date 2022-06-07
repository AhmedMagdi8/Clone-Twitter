const path = require("path");

exports.uploadImage = (req, res, next) => {
    res.sendFile(path.join(__dirname, "../uploads/images/" + req.params.path));
}
