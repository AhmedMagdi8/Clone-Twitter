// const Post = require('../models/postModel');
// const User = require('../models/userModel');
const Chat = require('../models/chatModel');
const User = require('../models/userModel');

const mongoose = require("mongoose");

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

exports.getChatPage = async (req, res, next) => {

    const userId = req.session.user._id;
    const chatId = req.params.chatId;

    const isValidId =  mongoose.isValidObjectId(chatId);


    const payload = {
        pageTitle: "Chat",
        userLoggedIn: req.session.user,
        userLoggedInClient: JSON.stringify(req.session.user)
    }

    if(!isValidId) {
        payload.errorMessage  = "Chat doesn't exist or you are not in"
        return res.status(200).render("chatPage", payload);
    }
    let chat = await Chat.findOne({_id: chatId, users: {$elemMatch: {$eq: userId}}})
    .populate("users");

    if(!chat) {
        // Check if chat id is really user id
        let userFound = await User.findById(chatId);

        if(userFound) {
            // get chat using user id
            chat = await getChatByUserId(userId, userFound._id);
        }
    }

    if(!chat) {
        payload.errorMessage  = "Chat doesn't exist or you are not in"
    } else {
        payload.chat = chat;
    }
    // console.log(payload);
    res.status(200).render('chatPage', payload );
}


function getChatByUserId(userLoggedInId, otherUserId) {
    // uperst: true if you didn't find it create it
    return Chat.findOneAndUpdate({
        isGroupChat:false,
        users: {
            $size: 2,
            $all: [
                {
                    $elemMatch: { $eq: mongoose.Types.ObjectId(userLoggedInId)}
                }, {
                    $elemMatch: { $eq: mongoose.Types.ObjectId(otherUserId)}
                }
            ]
        }
    }, {
        $setOnInsert: {
            users: [userLoggedInId, otherUserId]
        }
    }, {
        new : true,
        upsert: true
    })
    .populate("users");
}