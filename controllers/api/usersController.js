const User = require("../../models/userModel");

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
