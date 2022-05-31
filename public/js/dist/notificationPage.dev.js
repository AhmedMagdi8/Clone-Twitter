"use strict";

$(document).ready(function () {
  $.get("/api/notifications", function (data) {
    outputNotificationList(data, $(".resultsContainer"));
  });
});
$("#markNotificationsAsRead").click(function () {
  return markNotificationAsOpened();
});