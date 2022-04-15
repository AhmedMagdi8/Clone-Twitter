const User = require('../../models/userModel');
const Post = require('../../models/postModel');

exports.createPost = async (req, res, next) => {
    if(!req.body.content) {
        console.log("Content params wasn't sent with request");
        res.sendStatus(400);
    }

    var postData = {
        content: req.body.content,
        postedBy: req.session.user._id
    }

    try {
        let newPost = await Post.create(postData);
        newPost = await User.populate(newPost, {path: "postedBy"});
        res.status(201).send(newPost);

    } catch (err) {
        console.log(err);
        res.sendStatus(400);
    }
    console.log(postData);
}