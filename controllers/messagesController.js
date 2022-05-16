const Post = require('../models/postModel');
const User = require('../models/userModel');


exports.getInbox = (req, res, next) => {
    res.status(200).render('inboxPage', {
        pageTitle: "Inbox",
        userLoggedIn: req.session.user,
        userLoggedInClient: JSON.stringify(req.session.user),
    });
}

exports.createNewMessage = (req, res, next) => {
    res.status(200).render('newMessage', {
        pageTitle: "New Message",
        userLoggedIn: req.session.user,
        userLoggedInClient: JSON.stringify(req.session.user),
    });
}