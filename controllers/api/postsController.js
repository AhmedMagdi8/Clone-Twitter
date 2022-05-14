const User = require("../../models/userModel");
const Post = require("../../models/postModel");

exports.getPosts = async (req, res, next) => {
  try {
    const searchObject = req.query ? req.query : {};
    if(searchObject.isReply) {
        const isReply = searchObject.isReply == "true";
        searchObject.replyTo = { $exists: isReply };
        delete searchObject.isReply;
    }
    if(searchObject.followingOnly !== undefined) {

        const followingOnly = searchObject.followingOnly == "true";


        if(followingOnly) {
            let objectIds = [];
            if(!req.session.user.following) {
                req.session.user.following = [];
            }
            req.session.user.following.forEach(element => {
                objectIds.push(element);
            });
            objectIds.push(req.session.user._id);
            searchObject.postedBy = { $in: objectIds };
        }

        delete searchObject.followingOnly;

    }
    let posts = await Post.find(searchObject)
      .populate("postedBy")
      .populate("retweetData")
      .populate("replyTo")
      .sort({ createdAt: -1 });
    
    posts = await User.populate(posts, { path : "retweetData.postedBy"});
    posts = await User.populate(posts, { path : "replyTo.postedBy"});

    res.status(200).send(posts);
  } catch (err) {
    res.sendStatus(400);
  }
};


exports.getPost = async (req, res, next) => {
    try {
      const postId = req.params.id;
      const post = await Post.findById(postId)
      .populate("postedBy")
      .populate("retweetData");

      const results = {
          postData : post
      }
      let mainTweet;
      if(results.postData.replyTo) {
           mainTweet = await Post.findOne({_id : results.postData.replyTo})
          .populate("postedBy")
          .populate("retweetData")
          results.replyTo = mainTweet;
          results.postData.replyTo = mainTweet;
      }

      results.replies = await Post.find({replyTo : postId})
      .populate("postedBy")
      .populate("retweetData")
      .populate("replyTo")
      .sort({ createdAt: -1 });

      results.replies = await User.populate(results.replies, { path : "retweetData.postedBy"});
      results.replies = await User.populate(results.replies, { path : "replyTo.postedBy"});
      
      res.status(200).send(results);
    } catch (err) {
        console.log(err);
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

exports.retweetPost = async (req, res, next) => {
    try {

      const postId = req.params.id;
      const userId = req.session.user._id;
        

      const deletedPost = await Post.findOneAndDelete({ postedBy: userId, retweetData: postId});

      const option = deletedPost ? "$pull" : "$addToSet";
  
      let repost = deletedPost;

      if(repost == null) {
          repost = await Post.create({postedBy : userId, retweetData : postId})
      }
      
      // return the newly updated user with the new likes array instead of the cashed one in session user
      req.session.user = await User.findByIdAndUpdate(
        userId,
        { [option]: { retweets : repost._id } },
        { new: true }
      );
      // Update post
      const post = await Post.findByIdAndUpdate(
          postId,
          { [option]: { retweetUsers: userId } },
          { new: true }
        );
  
      res.status(200).send(post);
  
    } catch (err) {
        console.log(err);
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

  if(req.body.replyTo) {
      postData.replyTo = req.body.replyTo;
  }

  try {
    let newPost = await Post.create(postData);
    newPost = await User.populate(newPost, { path: "postedBy" });
    res.status(201).send(newPost);
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  }
};


exports.deletePost = async (req, res, next) => {
    try {
        const postId = req.params.id;
        const deletedPost = await Post.deleteOne({_id: postId});
        if(deletedPost)
            res.sendStatus(202);

    } catch (err) {
        console.log(err);
        res.sendStatus(400);
    }
}

exports.pinPost = async (req, res, next) => {
    try {

        if(req.body.pinned) {
            await Post.updateMany({ postedBy: req.session.user }, { pinned: false })
        }
        const postId = req.params.id;
        console.log("hello");
        console.log(postId);
        await Post.findByIdAndUpdate(postId, req.body);
        console.log("hello");
        res.sendStatus(204);

    } catch (err) {
        console.log(err);
        res.sendStatus(400);
    }
}

