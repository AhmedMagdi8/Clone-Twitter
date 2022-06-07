const Post = require('../models/postModel');


exports.getPost = (req, res, next) => {

    const payload = {
        pageTitle:'View Post',
        userLoggedIn: req.session.user,
        userLoggedInClient: JSON.stringify(req.session.user),
        postId: req.params.id
    }

    res.status(200).render('postPage', payload);
}

