"use strict";

$(document).ready(function () {
  $.get("/api/notifications", function (data) {
    outputNotificationList(data, $(".resultsContainer"));
  });
});
$("#markNotificationsAsRead").click(function () {
  return markNotificationAsOpened();
});

function outputNotificationList(notificatins, container) {
  notificatins.forEach(function (element) {
    var html = createNotificationHtml(element);
    container.append(html);
  });

  if (notificatins.length == 0) {
    container.append("<span class='noResults'> Nothing to show.</span>");
  }
}

function createNotificationHtml(notification) {
  var userFrom = notification.userFrom;
  var text = getNotificationText(notification);
  var url = getNotificationUrl(notification);
  var className = notification.opened ? "" : "active";
  return "<a class=\"resultsListItem notification ".concat(className, "\" href=\"").concat(url, "\" data-id=\"").concat(notification._id, "\">\n                <div class=\"resultsImageContainer\">\n                    <img src='").concat(userFrom.profilePic, "'>\n                </div>\n                <div class=\"resultsDetailsContainer ellipsis\">\n                    ").concat(text, "\n                </div>\n            </a>");
}

function getNotificationText(notification) {
  var userFrom = notification.userFrom;

  if (!userFrom.firstName || !userFrom.lastName) {
    return alert("User from data not populated");
  }

  var userFromName = userFrom.firstName + " " + userFrom.lastName;
  var text;

  if (notification.notificationType == "retweet") {
    text = userFromName + " retweeted one of your posts";
  } else if (notification.notificationType == "postLike") {
    text = userFromName + " liked one of your posts";
  } else if (notification.notificationType == "reply") {
    text = userFromName + " replyed to one of your posts";
  } else if (notification.notificationType == "follow") {
    text = userFromName + " followed you";
  }

  return "<span class=\"ellipsis\">".concat(text, "</span>");
}

function getNotificationUrl(notification) {
  var url = '#';

  if (notification.notificationType == "retweet" || notification.notificationType == "postLike" || notification.notificationType == "reply") {
    url = '/posts/' + notification.entityId;
  } else if (notification.notificationType == "follow") {
    url = '/profile/' + notification.entityId;
  }

  return url;
}