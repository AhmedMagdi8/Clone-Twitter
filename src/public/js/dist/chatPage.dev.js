"use strict";

var typing = false;
var lastTypingTime;
$(document).ready(function () {
  socket.emit("join room", chatId);
  socket.on("typing", function () {
    return $(".typingPic").show();
  });
  socket.on("stop typing", function () {
    return $(".typingPic").hide();
  });
  $.get("/api/chats/".concat(chatId), function (data) {
    $("#chatName").text(getChatName(data));
  });
  $.get("/api/chats/".concat(chatId, "/messages"), function (data) {
    var messages = [];
    var lastSenderId = "";
    data.forEach(function (message, index) {
      var html = createMessageHtml(message, data[index + 1], lastSenderId);
      messages.push(html);
      lastSenderId = message.sender._id;
    });
    var msgs = messages.join("");
    addMessagesHtmlToPage(msgs);
    scrollToButtom(false);
    markAllMessagesAsRead();
    $(".loadingSpinnerContainer").remove();
    $(".chatContainer").css("visibility", "visible");
  });
});
$("#chatNameButton").click(function (e) {
  var name = $("#chatNameTextbox").val();
  console.log(name);
  $.ajax({
    url: "/api/chats/" + chatId,
    type: "PUT",
    data: {
      chatName: name
    },
    success: function success(data, status, xhr) {
      if (xhr.status != 204) {
        alert("couldn't update");
      } else {
        location.reload();
      }
    }
  });
});
$(".inputTextbox").keydown(function (e) {
  updateTyping();

  if (e.which === 13 && !e.shiftKey) {
    // new line if shift is pressed
    messageSubmitted();
    return false; // prevent default behaviour
  }
});

function addMessagesHtmlToPage(html) {
  $(".chatMessages").append(html);
}

$(".sendMessageButton").click(function (e) {
  messageSubmitted();
});

function updateTyping() {
  if (!connected) {
    return;
  }

  if (!typing) {
    typing = true;
    socket.emit("typing", chatId);
  }

  lastTypingTime = new Date().getTime();
  var timeLength = 3000;
  setTimeout(function () {
    var timenow = new Date().getTime();
    var timeDiff = timenow - lastTypingTime;

    if (timeDiff >= timeLength && typing) {
      socket.emit("stop typing", chatId);
      typing = false;
    }
  }, timeLength);
}

function messageSubmitted() {
  var content = $(".inputTextbox").val().trim();

  if (content) {
    sendMessage(content);
    $(".inputTextbox").val("");
    socket.emit("stop typing", chatId);
    typing = false;
  }
}

function sendMessage(content) {
  $.post("/api/messages", {
    content: content,
    chatId: chatId
  }, function (data, status, xhr) {
    if (xhr.status != 201) {
      alert("couldn't send message!");
      $(".inputTextbox").val(content);
      return;
    }

    addChatMessageHtml(data);
    markAllMessagesAsRead();

    if (connected) {
      socket.emit("new message", data);
    }
  });
}

function addChatMessageHtml(message) {
  if (!message || !message._id) {
    alert("message is not valid");
    return;
  }

  var messageDiv = createMessageHtml(message, null, "");
  addMessagesHtmlToPage(messageDiv);
  scrollToButtom(true);
}

function createMessageHtml(message, nextMessage, lastSenderId) {
  var sender = message.sender;
  var senderName = sender.firstName + " " + sender.lastName;
  var currentSenderId = sender._id;
  var nextSenderId = nextMessage ? nextMessage.sender._id : "";
  var isFirst = lastSenderId != currentSenderId;
  var isLast = nextSenderId != currentSenderId;
  var isMine = message.sender._id == userLoggedIn._id;
  var liClassName = isMine ? "mine" : "theirs";
  var nameElement = "";

  if (isFirst) {
    liClassName += " first";

    if (!isMine) {
      nameElement = "<span class=\"senderName\">".concat(senderName, "</span>");
    }
  }

  var profileImage = "";

  if (isLast) {
    liClassName += " last";
    profileImage = "<img src='".concat(sender.profilePic, "'>");
  }

  var imageContainer = "";

  if (!isMine) {
    imageContainer = "<div class=\"imageContainer\">\n                        ".concat(profileImage, "\n                    </div>");
  }

  return "<li class='message ".concat(liClassName, "'>\n                ").concat(imageContainer, "\n                <div class='messageContainer'>\n                    ").concat(nameElement, "\n                    <span class='messageBody'>\n                        ").concat(message.content, "\n                    </span>\n                </div>\n            </li>");
}

function getChatName(chatData) {
  var chatName = chatData.chatName;

  if (!chatName) {
    var otherChatUsers = getOtherChatUsers(chatData.users);
    var namesArray = otherChatUsers.map(function (user) {
      return user.firstName + " " + user.lastName;
    });
    chatName = namesArray.join(",");
  }

  return chatName;
}

function getOtherChatUsers(users) {
  if (users.length == 1) {
    return users;
  }

  return users.filter(function (u) {
    return u._id !== userLoggedIn._id;
  });
}

function scrollToButtom(animated) {
  var container = $(".chatMessages");
  var scrollHeight = container[0].scrollHeight;

  if (animated) {
    container.animate({
      scrollTop: scrollHeight
    }, "slow");
  } else {
    container.scrollTop(scrollHeight);
  }
}

function markAllMessagesAsRead() {
  $.ajax({
    url: "/api/chats/".concat(chatId, "/messages/markAsRead"),
    type: "PUT",
    success: function success() {
      return refreshMessageBadge();
    }
  });
}