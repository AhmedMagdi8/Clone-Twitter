const User = require("../../models/userModel");
const Post = require("../../models/postModel");

exports.getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find()
      .populate("postedBy")
      .sort({ createdAt: -1 });
    res.status(200).send(posts);
  } catch (err) {
    res.sendStatus(400);
  }
};

exports.likePost = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const userId = req.session.user._id;

    const likes = req.session.user.likes;
    const isLiked = likes && likes.includes(postId);

    const option = isLiked ? "$pull" : "$addToSet";

    // return the newly updated user with the new likes array instead of the cashed one in session user
    req.session.user = await User.findByIdAndUpdate(
      userId,
      { [option]: { likes: postId } },
      { new: true }
    );
    // Update post
    const post = await Post.findByIdAndUpdate(
        postId,
        { [option]: { likes: userId } },
        { new: true }
      );

    res.status(200).send(post);

  } catch (err) {
    res.sendStatus(400);
  }
};

exports.createPost = async (req, res, next) => {
  if (!req.body.content) {
    console.log("Content params wasn't sent with request");
    res.sendStatus(400);
  }

  var postData = {
    content: req.body.content,
    postedBy: req.session.user._id,
  };

  try {
    let newPost = await Post.create(postData);
    newPost = await User.populate(newPost, { path: "postedBy" });
    res.status(201).send(newPost);
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  }
  console.log(postData);
};
