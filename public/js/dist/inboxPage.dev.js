"use strict";

$(document).ready(function () {
  $.get("/api/chats", function (data, status, xhr) {
    if (xhr.status == 400) {
      alert("Couldn't get chat list");
    } else {
      outputChatList(data, $(".resultsContainer"));
    }
  });
});

function outputChatList(chatList, container) {
  chatList.forEach(function (chat) {
    var html = createChatHtml(chat);
    container.append(html);
  });

  if (chatList.length == 0) {
    container.append("<span class='noResults'>Nothing to show</span>");
  }
}