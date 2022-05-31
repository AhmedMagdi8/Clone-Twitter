"use strict";

var User = require("../../models/userModel");

var Chat = require("../../models/chatModel");

var Message = require("../../models/messageModel");

var Notification = require("../../models/notificationModel");

exports.getNotifications = function _callee(req, res, next) {
  var searchObj, notificatins;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          searchObj = {
            userTo: req.session.user._id,
            notificationType: {
              $ne: "newMessage"
            }
          };

          if (req.query.unreadOnly && req.query.unreadOnly == "true") {
            searchObj.opened = false;
          }

          _context.next = 5;
          return regeneratorRuntime.awrap(Notification.find(searchObj).populate("userTo").populate("userFrom").sort({
            createdAt: -1
          }));

        case 5:
          notificatins = _context.sent;
          // most recently ordered
          res.status(200).send(notificatins);
          _context.next = 12;
          break;

        case 9:
          _context.prev = 9;
          _context.t0 = _context["catch"](0);
          console.log(_context.t0);

        case 12:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 9]]);
};

exports.latestNotification = function _callee2(req, res, next) {
  var notifications;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(Notification.findOne({
            userTo: req.session.user._id
          }).populate("userTo").populate("userFrom").sort({
            createdAt: -1
          }));

        case 3:
          notifications = _context2.sent;
          // most recently ordered
          res.status(200).send(notifications);
          _context2.next = 10;
          break;

        case 7:
          _context2.prev = 7;
          _context2.t0 = _context2["catch"](0);
          console.log(_context2.t0);

        case 10:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

exports.markAsOpened = function _callee3(req, res, next) {
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return regeneratorRuntime.awrap(Notification.findByIdAndUpdate(req.params.id, {
            opened: true
          }));

        case 3:
          res.sendStatus(204);
          _context3.next = 9;
          break;

        case 6:
          _context3.prev = 6;
          _context3.t0 = _context3["catch"](0);
          console.log(_context3.t0);

        case 9:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 6]]);
};

exports.markAllAsOpened = function _callee4(req, res, next) {
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.next = 3;
          return regeneratorRuntime.awrap(Notification.updateMany({
            userTo: req.session.user._id
          }, {
            opened: true
          }));

        case 3:
          res.sendStatus(204);
          _context4.next = 9;
          break;

        case 6:
          _context4.prev = 6;
          _context4.t0 = _context4["catch"](0);
          console.log(_context4.t0);

        case 9:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 6]]);
};