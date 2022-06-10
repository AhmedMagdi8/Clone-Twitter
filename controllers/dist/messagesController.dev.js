"use strict";

// const Post = require('../models/postModel');
// const User = require('../models/userModel');
var Chat = require('../models/chatModel');

var User = require('../models/userModel');

var mongoose = require("mongoose");

exports.getInbox = function (req, res, next) {
  res.status(200).render('inboxPage', {
    pageTitle: "Inbox",
    userLoggedIn: req.session.user,
    userLoggedInClient: JSON.stringify(req.session.user)
  });
};

exports.createNewMessage = function (req, res, next) {
  res.status(200).render('newMessage', {
    pageTitle: "New Message",
    userLoggedIn: req.session.user,
    userLoggedInClient: JSON.stringify(req.session.user)
  });
};

exports.getChatPage = function _callee(req, res, next) {
  var userId, chatId, isValidId, payload, chat, userFound;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          userId = req.session.user._id;
          chatId = req.params.chatId;
          isValidId = mongoose.isValidObjectId(chatId);
          payload = {
            pageTitle: "Chat",
            userLoggedIn: req.session.user,
            userLoggedInClient: JSON.stringify(req.session.user)
          };

          if (isValidId) {
            _context.next = 7;
            break;
          }

          payload.errorMessage = "Chat doesn't exist or you are not in";
          return _context.abrupt("return", res.status(200).render("chatPage", payload));

        case 7:
          _context.next = 9;
          return regeneratorRuntime.awrap(Chat.findOne({
            _id: chatId,
            users: {
              $elemMatch: {
                $eq: userId
              }
            }
          }).populate("users"));

        case 9:
          chat = _context.sent;

          if (chat) {
            _context.next = 18;
            break;
          }

          _context.next = 13;
          return regeneratorRuntime.awrap(User.findById(chatId));

        case 13:
          userFound = _context.sent;

          if (!userFound) {
            _context.next = 18;
            break;
          }

          _context.next = 17;
          return regeneratorRuntime.awrap(getChatByUserId(userId, userFound._id));

        case 17:
          chat = _context.sent;

        case 18:
          if (!chat) {
            payload.errorMessage = "Chat doesn't exist or you are not in";
          } else {
            payload.chat = chat;
          } // console.log(payload);


          res.status(200).render('chatPage', payload);

        case 20:
        case "end":
          return _context.stop();
      }
    }
  });
};

function getChatByUserId(userLoggedInId, otherUserId) {
  // uperst: true if you didn't find it create it
  return Chat.findOneAndUpdate({
    isGroupChat: false,
    users: {
      $size: 2,
      $all: [{
        $elemMatch: {
          $eq: mongoose.Types.ObjectId(userLoggedInId)
        }
      }, {
        $elemMatch: {
          $eq: mongoose.Types.ObjectId(otherUserId)
        }
      }]
    }
  }, {
    $setOnInsert: {
      users: [userLoggedInId, otherUserId]
    }
  }, {
    "new": true,
    upsert: true
  }).populate("users");
}