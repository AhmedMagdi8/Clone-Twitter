const User = require("../../models/userModel");
const Notification = require("../../models/notificationModel");

const path = require('path');
const fs = require('fs');

exports.getUsersSearch = async(req, res, next) => {
    let searchObj = req.query;
    if(searchObj.search) {
        searchObj = {
            $or: [
                { firstName: { $regex: searchObj.search, $options: "i"} },
                { lastName:  { $regex: searchObj.search, $options: "i"} },
                { username:  { $regex: searchObj.search, $options: "i"} },
            ]
        }
    }   
    try {
        const users = await User.find(searchObj);
        res.status(200).send(users);

    } catch(e) {
        console.log(e);
        res.sendStatus(400);
    }
}

exports.followHandler = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("user not found");
    }

    const isFollowing =
      user.followers && user.followers.includes(req.session.user._id);

    const option = isFollowing ? "$pull" : "$addToSet";

    req.session.user = await User.findByIdAndUpdate(
      req.session.user._id,
      { [option]: { following: userId } },
      { new: true }
    );
    await User.findByIdAndUpdate(userId, {
      [option]: { followers: req.session.user._id },
    });

    if(!isFollowing) {
        await Notification.insertNotification(userId, req.session.user._id,"follow", req.session.user._id)
    }
    res.status(200).send(req.session.user);
  } catch (err) {
    res.sendStatus(404);
  }
};

exports.getFollowers = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId).populate("followers");
    if (!user) {
      throw new Error("user not found");
    }

    res.status(200).send(user);
  } catch (err) {
    res.sendStatus(404);
  }
};

exports.getFollowing = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId).populate("following");
    if (!user) {
      throw new Error("user not found");
    }

    res.status(200).send(user);
  } catch (err) {
    res.sendStatus(404);
  }
};

exports.handlePrfilePic = async(req, res, next) => {
    if(!req.file) {
        console.log("No file was uploaded with ajax request");
        return res.sendStatus(400);
    }
    let filePath = `/uploads/images/${req.file.filename}.png`;
    let tempPath = req.file.path;
    let targetPath = path.join(__dirname, `../../${filePath}`);

    fs.rename(tempPath,targetPath, async err => {
        if(err) {
            console.log(err);
            return res.sendStatus(400);
        }

        req.session.user = await User.findByIdAndUpdate(req.session.user._id, {profilePic: filePath}, {new : true});

        // 204 means no content
        return res.sendStatus(204);

    })


};

exports.handleCoverPhoto = async(req, res, next) => {
    if(!req.file) {
        console.log("No file was uploaded with ajax request");
        return res.sendStatus(400);
    }
    let filePath = `/uploads/images/${req.file.filename}.png`;
    let tempPath = req.file.path;
    let targetPath = path.join(__dirname, `../../${filePath}`);

    fs.rename(tempPath,targetPath, async err => {
        if(err) {
            console.log(err);
            return res.sendStatus(400);
        }

        req.session.user = await User.findByIdAndUpdate(req.session.user._id, {coverPhoto: filePath}, {new : true});

        // 204 means no content
        return res.sendStatus(204);

    })


};