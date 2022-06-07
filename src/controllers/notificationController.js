// const Post = require('../models/postModel');
// const User = require('../models/userModel');
const Chat = require('../models/chatModel');
const User = require('../models/userModel');

const mongoose = require("mongoose");

exports.getNotifications = (req, res, next) => {
    res.status(200).render('notificationPage', {
        pageTitle: "Notifications",
        userLoggedIn: req.session.user,
        userLoggedInClient: JSON.stringify(req.session.user),
    });
}
