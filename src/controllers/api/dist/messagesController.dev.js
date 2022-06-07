"use strict";

var User = require("../../models/userModel");

var Chat = require("../../models/chatModel");

var Message = require("../../models/messageModel");

var Notification = require("../../models/notificationModel");

exports.postMessage = function _callee(req, res, next) {
  var newMessage, result, chat;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if (!(!req.body.content || !req.body.chatId)) {
            _context.next = 3;
            break;
          }

          console.log("Invalid data was sent");
          return _context.abrupt("return", res.sendStatus(400));

        case 3:
          _context.prev = 3;
          newMessage = {
            sender: req.session.user._id,
            content: req.body.content,
            chat: req.body.chatId
          };
          _context.next = 7;
          return regeneratorRuntime.awrap(Message.create(newMessage));

        case 7:
          result = _context.sent;
          _context.next = 10;
          return regeneratorRuntime.awrap(result.populate("sender"));

        case 10:
          result = _context.sent;
          _context.next = 13;
          return regeneratorRuntime.awrap(result.populate("chat"));

        case 13:
          result = _context.sent;
          _context.next = 16;
          return regeneratorRuntime.awrap(User.populate(result, {
            path: "chat.users"
          }));

        case 16:
          result = _context.sent;
          _context.next = 19;
          return regeneratorRuntime.awrap(Chat.findByIdAndUpdate(req.body.chatId, {
            latestMessage: result
          }));

        case 19:
          chat = _context.sent;
          insertNotification(chat, result);
          res.status(201).send(result);
          _context.next = 28;
          break;

        case 24:
          _context.prev = 24;
          _context.t0 = _context["catch"](3);
          console.log(_context.t0);
          return _context.abrupt("return", res.sendStatus(400));

        case 28:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[3, 24]]);
};

function insertNotification(chat, message) {
  chat.users.forEach(function (userId) {
    if (userId == message.sender._id.toString()) {
      return;
    }

    Notification.insertNotification(userId, message.sender._id, "newMessage", message.chat._id);
  });
}