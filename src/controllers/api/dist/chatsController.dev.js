"use strict";

var User = require("../../models/userModel");

var Chat = require("../../models/chatModel");

var Message = require("../../models/messageModel");

exports.createChat = function _callee(req, res, next) {
  var users, chatData, chat;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if (req.body.users) {
            _context.next = 3;
            break;
          }

          console.log("Users params not sent");
          return _context.abrupt("return", res.sendStatus(400));

        case 3:
          users = JSON.parse(req.body.users);

          if (!(users.length == 0)) {
            _context.next = 7;
            break;
          }

          console.log("Users array is empty");
          return _context.abrupt("return", res.sendStatus(400));

        case 7:
          users.push(req.session.user);
          chatData = {
            users: users
          };
          _context.prev = 9;
          chat = Chat.create(chatData);
          res.status(200).send(chat);
          _context.next = 18;
          break;

        case 14:
          _context.prev = 14;
          _context.t0 = _context["catch"](9);
          console.log(_context.t0);
          return _context.abrupt("return", res.sendStatus(400));

        case 18:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[9, 14]]);
};

exports.getChats = function _callee2(req, res, next) {
  var chats;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(Chat.find({
            users: {
              $elemMatch: {
                $eq: req.session.user._id
              }
            }
          }).populate("users").populate("latestMessage").sort({
            updatedAt: -1
          }));

        case 3:
          chats = _context2.sent;
          _context2.next = 6;
          return regeneratorRuntime.awrap(User.populate(chats, {
            path: "latestMessage.sender"
          }));

        case 6:
          chats = _context2.sent;

          if (req.query.unreadOnly && req.query.unreadOnly == "true") {
            chats = chats.filter(function (chat) {
              return chat.latestMessage && !chat.latestMessage.readBy.includes(req.session.user._id);
            });
          }

          res.status(200).send(chats);
          _context2.next = 15;
          break;

        case 11:
          _context2.prev = 11;
          _context2.t0 = _context2["catch"](0);
          console.log(_context2.t0);
          return _context2.abrupt("return", res.sendStatus(400));

        case 15:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 11]]);
};

exports.getChat = function _callee3(req, res, next) {
  var chat;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return regeneratorRuntime.awrap(Chat.findOne({
            _id: req.params.chatId,
            users: {
              $elemMatch: {
                $eq: req.session.user._id
              }
            }
          }).populate("users").populate("latestMessage"));

        case 3:
          chat = _context3.sent;
          // I added this
          // let readBy = chat.latestMessage.readBy;
          // readBy.push(req.session.user._id);
          // console.log(readBy);
          // await Message.findOneAndUpdate({ _id: chat.latestMessage._id }, { readBy: readBy});
          res.status(200).send(chat);
          _context3.next = 11;
          break;

        case 7:
          _context3.prev = 7;
          _context3.t0 = _context3["catch"](0);
          console.log(_context3.t0);
          return _context3.abrupt("return", res.sendStatus(400));

        case 11:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

exports.getFullChat = function _callee4(req, res, next) {
  var messages;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.next = 3;
          return regeneratorRuntime.awrap(Message.find({
            chat: req.params.chatId
          }).populate("sender"));

        case 3:
          messages = _context4.sent;
          res.status(200).send(messages);
          _context4.next = 12;
          break;

        case 7:
          _context4.prev = 7;
          _context4.t0 = _context4["catch"](0);
          console.log(_context4.t0);
          console.log("I am in the getFullChat");
          return _context4.abrupt("return", res.sendStatus(400));

        case 12:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

exports.markAsRead = function _callee5(req, res, next) {
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _context5.next = 3;
          return regeneratorRuntime.awrap(Message.updateMany({
            chat: req.params.chatId
          }, {
            $addToSet: {
              readBy: req.session.user._id
            }
          }));

        case 3:
          res.sendStatus(204);
          _context5.next = 11;
          break;

        case 6:
          _context5.prev = 6;
          _context5.t0 = _context5["catch"](0);
          console.log(_context5.t0);
          console.log("I am in the getFullChat");
          return _context5.abrupt("return", res.sendStatus(400));

        case 11:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 6]]);
};

exports.updateChatName = function _callee6(req, res, next) {
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          _context6.next = 3;
          return regeneratorRuntime.awrap(Chat.findByIdAndUpdate(req.params.chatId, req.body));

        case 3:
          return _context6.abrupt("return", res.sendStatus(204));

        case 6:
          _context6.prev = 6;
          _context6.t0 = _context6["catch"](0);
          console.log(_context6.t0);
          return _context6.abrupt("return", res.sendStatus(400));

        case 10:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 6]]);
};