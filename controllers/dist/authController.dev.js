"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var bcrypt = require("bcrypt");

var User = require("../models/userModel");

exports.getLogin = function (req, res, next) {
  res.status(200).render("login");
};

exports.getLogout = function (req, res, next) {
  req.session.user = null;
  res.redirect("/login");
};

exports.postLogin = function _callee(req, res, next) {
  var username, password, user, pepper, result;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          username = req.body.username;
          password = req.body.password;

          if (!(username && password)) {
            _context.next = 20;
            break;
          }

          _context.prev = 3;
          _context.next = 6;
          return regeneratorRuntime.awrap(User.findOne({
            $or: [{
              username: username
            }, {
              email: username
            }]
          }));

        case 6:
          user = _context.sent;
          _context.next = 12;
          break;

        case 9:
          _context.prev = 9;
          _context.t0 = _context["catch"](3);
          res.status(200).render("login", {
            errorMessage: "Something went wrong"
          });

        case 12:
          if (!user) {
            _context.next = 20;
            break;
          }

          pepper = process.env.PEPPER;
          _context.next = 16;
          return regeneratorRuntime.awrap(bcrypt.compare(password + pepper, user.password));

        case 16:
          result = _context.sent;

          if (!result) {
            _context.next = 20;
            break;
          }

          req.session.user = user;
          return _context.abrupt("return", res.status(200).redirect("/"));

        case 20:
          res.status(200).render("login", {
            errorMessage: "Invalid credentials"
          });

        case 21:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[3, 9]]);
};

exports.getRegister = function (req, res, next) {
  res.status(200).render("register");
};

exports.postRegister = function _callee2(req, res, next) {
  var firstName, lastName, username, email, password, saltRounds, pepper, payload, user;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          firstName = req.body.firstName.trim();
          lastName = req.body.lastName.trim();
          username = req.body.username.trim();
          email = req.body.email.trim();
          password = req.body.password;
          saltRounds = process.env.SALT_ROUNDS;
          pepper = process.env.PEPPER;
          payload = req.body;
          _context2.next = 10;
          return regeneratorRuntime.awrap(bcrypt.hash(password + pepper, Number(saltRounds)));

        case 10:
          payload.password = _context2.sent;

          if (!(firstName && lastName && email && password && username)) {
            _context2.next = 24;
            break;
          }

          _context2.prev = 12;
          _context2.next = 15;
          return regeneratorRuntime.awrap(User.findOne({
            $or: [{
              username: username
            }, {
              email: email
            }]
          }));

        case 15:
          user = _context2.sent;

          if (!user) {
            User.create(_objectSpread({}, payload)).then(function (user) {
              req.session.user = user;
              console.log("user Created successfully" + user);
              return res.redirect("/");
            })["catch"](function (e) {
              console.log(e);
            });
          } else {
            res.status(200).render("register", {
              errorMessage: "Username or email already exists"
            });
          }

          _context2.next = 22;
          break;

        case 19:
          _context2.prev = 19;
          _context2.t0 = _context2["catch"](12);
          console.log(_context2.t0);

        case 22:
          _context2.next = 26;
          break;

        case 24:
          payload.errorMessage = "Make sure each field has a valid value.";
          res.status(200).render("register", payload);

        case 26:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[12, 19]]);
};