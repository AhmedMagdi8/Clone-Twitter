"use strict";

var path = require('path');

require('dotenv').config();

var express = require('express');

var session = require('express-session');

var connectDB = require('./database');

var compression = require('compression');

var middleware = require('./middleware');

var loginRoutes = require('./routes/loginRoutes');

var registerRoutes = require('./routes/registerRoutes');

var logoutRoutes = require('./routes/logoutRoutes');

var postRoutes = require('./routes/postRoutes');

var profileRoutes = require('./routes/profileRoutes');

var uploadRoutes = require('./routes/uploadRoutes');

var searchRoutes = require('./routes/searchRoutes');

var messagesRoutes = require('./routes/messagesRoutes');

var notificationRoutes = require('./routes/notificationRoutes'); // Api Routes for posts


var postsApiRoutes = require('./routes/api/posts');

var usersApiRoutes = require('./routes/api/users');

var chatsRoutes = require('./routes/api/chats');

var apiMessagesRoutes = require('./routes/api/messages');

var apiNotificationsRoutes = require('./routes/api/notifications');

var _require = require('path'),
    join = _require.join;

var app = express();
var port = process.env.PORT;
app.set('view engine', 'pug');
app.set("views", path.join(__dirname, "views")); // extended means it can accept only key-value pairs of strings or arrays
// if it set to true it means that it accept any data type

app.use(express.urlencoded({
  extended: false
}));
app.use(express["static"](path.join(__dirname, "public")));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  // forces the session to be saved back to the storage even it's modified
  saveUninitialized: false // forces the session to not be saved as initialized when it don't set we don't want to save anything

}));
app.use(compression()); // Routes

app.use("/login", loginRoutes);
app.use("/register", registerRoutes);
app.use("/logout", logoutRoutes);
app.use("/api/posts/", postsApiRoutes);
app.use("/api/users/", usersApiRoutes);
app.use("/api/chats/", chatsRoutes);
app.use("/api/messages/", apiMessagesRoutes);
app.use("/api/notifications/", apiNotificationsRoutes);
app.use("/posts", postRoutes);
app.use("/profile", profileRoutes);
app.use("/uploads", uploadRoutes);
app.use("/search", searchRoutes);
app.use("/messages", messagesRoutes);
app.use("/notifications", notificationRoutes);
app.get('/', middleware.authMiddleware, function (req, res, next) {
  var payload = {
    pageTitle: 'Home',
    userLoggedIn: req.session.user,
    userLoggedInClient: JSON.stringify(req.session.user)
  };
  res.status(200).render("home", payload);
});

var io = require("./socket").getIo();

connectDB().then(function () {
  var server = app.listen(port, function () {
    console.log('Server is Up and running');
    io = require("./socket").createSocket(server);
    io.on("connection", function (socket) {
      socket.on("setup", function (userData) {
        socket.join(userData._id);
        socket.emit("connected");
      });
      socket.on("join room", function (room) {
        socket.join(room);
      });
      socket.on("typing", function (room) {
        // any one in this room will get the typing notification
        socket["in"](room).emit("typing");
      });
      socket.on("stop typing", function (room) {
        socket["in"](room).emit("stop typing");
      });
      socket.on("notification received", function (room) {
        socket["in"](room).emit("notification received");
      });
      socket.on("new message", function (newMessage) {
        var chat = newMessage.chat;
        if (!chat.users) return console.log("chat.ussers not found");
        chat.users.forEach(function (user) {
          if (user._id == newMessage.sender._id) return;
          socket["in"](user._id).emit("message received", newMessage);
        });
      });
    });
  });
})["catch"](function (e) {
  console.log("error connecting to the db");
});