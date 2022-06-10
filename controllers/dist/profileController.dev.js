"use strict";

var Post = require('../models/postModel');

var User = require('../models/userModel');

exports.getProfile = function (req, res, next) {
  var payload = {
    pageTitle: req.session.user.username,
    userLoggedIn: req.session.user,
    userLoggedInClient: JSON.stringify(req.session.user),
    profileUser: req.session.user
  };
  res.status(200).render('profilePage', payload);
};

exports.getProfileUsername = function _callee(req, res, next) {
  var payload;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(getPayload(req.params.username, req.session.user));

        case 2:
          payload = _context.sent;
          res.status(200).render("profilePage", payload);

        case 4:
        case "end":
          return _context.stop();
      }
    }
  });
};

exports.getProfileReplies = function _callee2(req, res, next) {
  var payload;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(getPayload(req.params.username, req.session.user));

        case 2:
          payload = _context2.sent;
          payload.selectedTab = "replies";
          res.status(200).render("profilePage", payload);

        case 5:
        case "end":
          return _context2.stop();
      }
    }
  });
};

exports.getFollowers = function _callee3(req, res, next) {
  var payload;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return regeneratorRuntime.awrap(getPayload(req.params.username, req.session.user));

        case 2:
          payload = _context3.sent;
          payload.selectedTab = "followers";
          res.status(200).render("followers", payload);

        case 5:
        case "end":
          return _context3.stop();
      }
    }
  });
};

exports.getFollowing = function _callee4(req, res, next) {
  var payload;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return regeneratorRuntime.awrap(getPayload(req.params.username, req.session.user));

        case 2:
          payload = _context4.sent;
          payload.selectedTab = "following";
          res.status(200).render("followers", payload);

        case 5:
        case "end":
          return _context4.stop();
      }
    }
  });
};

function getPayload(username, userLoggedIn) {
  var user;
  return regeneratorRuntime.async(function getPayload$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.next = 2;
          return regeneratorRuntime.awrap(User.findOne({
            username: username
          }));

        case 2:
          user = _context5.sent;

          if (user) {
            _context5.next = 9;
            break;
          }

          _context5.next = 6;
          return regeneratorRuntime.awrap(User.findById({
            username: username
          }));

        case 6:
          user = _context5.sent;

          if (user) {
            _context5.next = 9;
            break;
          }

          return _context5.abrupt("return", {
            pageTitle: "User not found!",
            userLoggedIn: userLoggedIn,
            userLoggedInClient: JSON.stringify(userLoggedIn)
          });

        case 9:
          return _context5.abrupt("return", {
            pageTitle: user.username,
            userLoggedIn: userLoggedIn,
            userLoggedInClient: JSON.stringify(userLoggedIn),
            profileUser: user
          });

        case 10:
        case "end":
          return _context5.stop();
      }
    }
  });
}