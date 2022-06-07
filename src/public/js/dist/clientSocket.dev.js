"use strict";

var connected = false;
var socket = io("http://127.0.0.1:3000");
socket.emit("setup", userLoggedIn);
socket.on("connected", function () {
  return connected = true;
});
socket.on("message received", function (newMessage) {
  return messageReceived(newMessage);
});
socket.on("notification received", function () {
  $.get("/api/notifications/latest", function (notData) {
    showNotificationPopup(notData);
    refreshNotificationsBadge();
  });
});

function emitNotification(userId) {
  if (userId == userLoggedIn._id) return;
  socket.emit("notification received", userId);
}