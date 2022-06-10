"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
          console.log(userId);
          console.log(chatId);
          console.log("");
          isValidId = mongoose.isValidObjectId(chatId);
          payload = {
            pageTitle: "Chat",
            userLoggedIn: req.session.user,
            userLoggedInClient: JSON.stringify(req.session.user)
          };

          if (isValidId) {
            _context.next = 10;
            break;
          }

          payload.errorMessage = "Chat doesn't exist or you are not in";
          return _context.abrupt("return", res.status(200).render("chatPage", payload));

        case 10:
          _context.next = 12;
          return regeneratorRuntime.awrap(Chat.findOne({
            _id: chatId,
            users: {
              $elemMatch: {
                $eq: userId
              }
            }
          }).populate("users"));

        case 12:
          chat = _context.sent;

          if (chat) {
            _context.next = 21;
            break;
          }

          _context.next = 16;
          return regeneratorRuntime.awrap(User.findById(chatId));

        case 16:
          userFound = _context.sent;

          if (!userFound) {
            _context.next = 21;
            break;
          }

          _context.next = 20;
          return regeneratorRuntime.awrap(getChatByUserId(userId, userFound._id));

        case 20:
          chat = _context.sent;

        case 21:
          if (!chat) {
            payload.errorMessage = "Chat doesn't exist or you are not in";
          } else {
            payload.chat = chat;
          } // console.log(payload);


          res.status(200).render('chatPage', payload);

        case 23:
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
      $all: [_defineProperty({
        $elemMatch: {
          $eq: mongoose.Types.ObjectId(userLoggedInId)
        }
      }, "$elemMatch", {
        $eq: mongoose.Types.ObjectId(otherUserId)
      })]
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