"use strict";

// Global variables
var cropper;
var timer;
var selectedUsers = [];
$("#postTextarea, #replyTextarea").keyup(function (event) {
  var value = event.target.value.trim();
  var isModal = $(event.target).parents(".modal").length == 1;
  var submitButton = isModal ? $("#submitReplyButton") : $("#submitPostButton");

  if (value) {
    submitButton.prop("disabled", false);
    return;
  }

  submitButton.prop("disabled", true);
});
$("#submitPostButton, #submitReplyButton").click(function (event) {
  var button = $(event.target);
  var isModal = button.parents(".modal").length == 1;
  var textbox = isModal ? $("#replyTextarea") : $("#postTextarea");
  var data = {
    content: textbox.val()
  };

  if (isModal) {
    var id = button.data().id;

    if (!id) {
      alert("button id is null");
    }

    data.replyTo = id;
  }

  $.post("/api/posts", data, function (postData) {
    if (postData.replyTo) {
      location.reload();
    } else {
      var post = createPostHtml(postData);
      $(".postsContainer").prepend(post);
      textbox.val("");
      button.prop("disabled", true);
    }
  });
});
$("#replyModal").on("show.bs.modal", function (event) {
  var button = $(event.relatedTarget);
  var postId = getPostId(button);
  $("#submitReplyButton").data("id", postId);
  $.get("/api/posts/" + postId, function (post) {
    post = post.postData;
    var container = $("#originalPostContainer");
    container.html("");
    var html = createPostHtml(post);
    container.append(html);
  });
});
$("#replyModal").on("hidden.bs.modal", function (event) {
  $("#originalPostContainer").html("");
});
$("#deletePostModal").on("show.bs.modal", function (event) {
  var button = $(event.relatedTarget);
  var postId = getPostId(button);
  $("#deletePostButton").data("id", postId);
});
$("#pinPostModal").on("show.bs.modal", function (event) {
  var button = $(event.relatedTarget);
  var postId = getPostId(button);
  $("#pinPostButton").data("id", postId);
});
$("#unPinPostModal").on("show.bs.modal", function (event) {
  var button = $(event.relatedTarget);
  var postId = getPostId(button);
  $("#unPinPostButton").data("id", postId);
});
$("#filePhoto").change(function (event) {
  var input = $(event.target)[0];

  if (input.files && input.files[0]) {
    var reader = new FileReader();

    reader.onload = function (e) {
      var image = document.getElementById("imagePreview");
      image.src = e.target.result;

      if (cropper) {
        cropper.destroy();
      }

      cropper = new Cropper(image, {
        aspectRatio: 1 / 1,
        background: false
      });
    };

    reader.readAsDataURL(input.files[0]);
  }
});
$("#coverPhoto").change(function (event) {
  var input = $(event.target)[0];

  if (input.files && input.files[0]) {
    var reader = new FileReader();

    reader.onload = function (e) {
      var image = document.getElementById("coverPreview");
      image.src = e.target.result;

      if (cropper) {
        cropper.destroy();
      }

      cropper = new Cropper(image, {
        aspectRatio: 16 / 9,
        background: false
      });
    };

    reader.readAsDataURL(input.files[0]);
  }
});
$("#userSearchTextbox").keydown(function (event) {
  clearTimeout(timer);
  var textbox = $(event.target);
  var value = textbox.val(); // 8 is the key code for delete
  //event.which is jquery alternative of keyCode

  if (!value && (event.which == 8 || event.keyCode == 8)) {
    // remove user from seleciton
    selectedUsers.pop();
    updateSelectedUsersHtml();
    $(".resultsContainer").html("");

    if (selectedUsers.length == 0) {
      $("#createChatButton").prop("disabled", true);
    }

    return;
  }

  timer = setTimeout(function () {
    value = textbox.val().trim();

    if (value == "") {
      $(".resultsContainer").html("");
    } else {
      searchUsers(value);
    }
  }, 1000);
});
$("#ImageUploadButton").click(function (event) {
  var canvas = cropper.getCroppedCanvas();

  if (!canvas) {
    alert("make sure it's an image file");
    return;
  } // blob is a binary large object used to images and videos


  canvas.toBlob(function (blob) {
    var formData = new FormData();
    formData.append("croppedImage", blob); // process data forces jquery not to convert form data to string
    // contentType used for forms that submit files
    // it forces jq not to add content type header in this request 

    $.ajax({
      url: "/api/users/profilePicture",
      type: "POST",
      data: formData,
      processData: false,
      contentType: false,
      success: function success() {
        return location.reload();
      }
    });
  });
});
$("#coverPhotoButton").click(function (event) {
  var canvas = cropper.getCroppedCanvas();

  if (!canvas) {
    alert("make sure it's an image file");
    return;
  } // blob is a binary large object used to images and videos


  canvas.toBlob(function (blob) {
    var formData = new FormData();
    formData.append("croppedImage", blob); // process data forces jquery not to convert form data to string
    // contentType used for forms that submit files
    // it forces jq not to add content type header in this request 

    $.ajax({
      url: "/api/users/coverPhoto",
      type: "POST",
      data: formData,
      processData: false,
      contentType: false,
      success: function success() {
        return location.reload();
      }
    });
  });
});
$("#createChatButton").click(function (event) {
  // we have to convery array to string to be able to send it to the server
  var data = JSON.stringify(selectedUsers);
  $.post("/api/chats", {
    users: data
  }, function (chat) {
    if (!chat) {
      return alert("invalid response froms server");
    }

    window.location.href = "/messages/".concat(chat._id);
  });
});
$("#deletePostButton").click(function (event) {
  var postId = $(event.target).data("id");
  $.ajax({
    url: "/api/posts/".concat(postId),
    type: 'DELETE',
    success: function success(data, status, xhr) {
      console.log(data);
      console.log(status); // xhr means status code xml http requests if(xhr.status == 202) alert('deleted');

      console.log(xhr);
      location.reload();
    }
  });
});
$("#unPinPostButton").click(function (event) {
  var postId = $(event.target).data("id");
  $.ajax({
    url: "/api/posts/".concat(postId),
    type: 'PUT',
    data: {
      pinned: false
    },
    success: function success(data, status, xhr) {
      if (xhr.status != 204) {
        alert("could not unpin the post" + xhr.status);
      }

      location.reload();
    }
  });
});
$("#pinPostButton").click(function (event) {
  var postId = $(event.target).data("id");
  $.ajax({
    url: "/api/posts/".concat(postId),
    type: 'PUT',
    data: {
      pinned: true
    },
    success: function success(data, status, xhr) {
      if (xhr.status != 204) {
        alert("could not pin the post" + xhr.status);
      } // console.log(data);
      // console.log(status);
      // console.log(xhr);
      // xhr means status code xml http requests if(xhr.status == 202) alert('deleted');


      location.reload();
    }
  });
});
$(document).on("click", ".likedButton", function (event) {
  var button = $(event.target);
  var postId = getPostId(button);
  if (!postId) return;
  $.ajax({
    url: "/api/posts/".concat(postId, "/like"),
    type: 'PUT',
    success: function success(postData) {
      button.find('span').text(postData.likes.length || '');

      if (postData.likes.includes(userLoggedIn._id)) {
        button.addClass('liked');
      } else {
        button.removeClass('liked');
      }
    }
  });
});
$(document).on("click", ".retweetButton", function (event) {
  var button = $(event.target);
  var postId = getPostId(button);
  if (!postId) return;
  $.ajax({
    url: "/api/posts/".concat(postId, "/retweet"),
    type: 'POST',
    success: function success(postData) {
      button.find('span').text(postData.retweetUsers.length || '');

      if (postData.retweetUsers.includes(userLoggedIn._id)) {
        button.addClass('retweeted'); // let post = createPostHtml(postData);
        // $(".postsContainer").prepend(post);
      } else {
        button.removeClass('retweeted');
      }
    }
  });
});
$(document).on("click", ".post", function (event) {
  var element = $(event.target);
  var postId = getPostId(element);

  if (postId && !element.is("button")) {
    window.location.href = '/posts/' + postId;
  }
});
$(document).on("click", ".followButton", function (event) {
  var button = $(event.target);
  var userId = button.data().user;
  $.ajax({
    url: "/api/users/".concat(userId, "/follow"),
    type: 'PUT',
    success: function success(data, status, xhr) {
      if (xhr.status == 404) {
        alert("User not found!");
        return;
      }

      var difference;

      if (data.following && data.following.includes(userId)) {
        button.addClass('following');
        button.text("Following");
        difference = 1;
      } else {
        button.removeClass('following');
        button.text("Follow");
        difference = -1;
      }

      var followersLabel = $("#followersValue");
      var followersText = followersLabel.text();
      followersLabel.text(parseInt(followersText) + difference); // if(followersLabel.length != 0) {
      //     let followersText = followersLabel.text();
      //     followersLabel.text(parseInt(followersText)+1);
      // } else {
      //     let followersText = followersLabel.text();
      //     followersLabel.text(Number(followersText)-1);
      // }
    }
  });
});
$(document).on("click", ".notification.active", function (e) {
  console.log("kjiuuiohi");
  var container = $(e.target);
  var notificationId = container.data().id;
  var href = container.attr("href");
  e.preventDefault();

  var callback = function callback() {
    return window.location = href;
  };

  markNotificationAsOpened(notificationId, callback);
});

function getPostId(element) {
  var isRoot = element.hasClass("post");
  var root = isRoot ? element : element.closest(".post");
  var postId = root.data().id;
  if (!postId) return;
  return postId;
}

function createPostHtml(postData) {
  var largeFont = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  if (!postData) return alert("post object is null");
  var isRetweet = postData.retweetData ? true : false;
  var retweetedBy = isRetweet ? postData.postedBy.username : null;
  postData = isRetweet ? postData.retweetData : postData;
  var postedBy = postData.postedBy;

  if (postedBy._id === undefined) {}

  var diplayName = postedBy.firstName + " " + postedBy.lastName;
  var timestamp = timeDifference(new Date(), new Date(postData.createdAt));
  var likedButtonClass = postData.likes.includes(userLoggedIn._id) ? "liked" : '';
  var retweetButtonClass = postData.retweetUsers.includes(userLoggedIn._id) ? "retweeted" : '';
  var largeFontClass = largeFont ? 'largeFont' : '';
  var retweetText = '';
  if (isRetweet) retweetText = "<span>Retweeted by <a href='/profile/".concat(retweetedBy, "'>").concat(retweetedBy, "</a></span>");
  var replyFlag = "";

  if (postData.replyTo && postData.replyTo._id) {
    if (!postData.replyTo._id) {
      return alert('reply to is not pupulated');
    } else if (!postData.replyTo.postedBy._id) {
      return alert("posted by is no populated");
    }

    var replyToUsername = postData.replyTo.postedBy.username;
    replyFlag = "<div class=\"replyFlag\"> \n                        Replying to <a href='/profile/".concat(replyToUsername, "'>@").concat(replyToUsername, " </a>\n                   </div>");
  }

  var buttons = "";
  var pinnedPostText = "";

  if (postData.postedBy._id == userLoggedIn._id) {
    var pinnedClass = "";
    var dataTarget = "#pinPostModal";

    if (postData.pinned === true) {
      pinnedClass = "active";
      dataTarget = "#unPinPostModal";
      pinnedPostText = "<i class='fas fa-thumbtack'></i> <span>Pinned post</span>";
    }

    buttons = "<button class=\"pinButton ".concat(pinnedClass, "\" data-id=\"").concat(postData._id, "\" data-bs-toggle=\"modal\" data-bs-target=\"").concat(dataTarget, "\"><i class=\"fa-solid fa-thumbtack\"></i></button>\n    <button data-id=\"").concat(postData._id, "\" data-bs-toggle=\"modal\" data-bs-target=\"#deletePostModal\"><i class=\"fas fa-times\" aria-hidden=\"true\"></i></button>");
  }

  return "<div class=\"post ".concat(largeFontClass, "\" data-id='").concat(postData._id, "'>\n                <div class='postActionContainer'>\n                    ").concat(retweetText, "\n                </div>\n                <div class=\"mainContentContainer\">\n                    <div class=\"userImageContainer\">\n                        <img src='").concat(postedBy.profilePic, "'/>\n                    </div>\n                    <div class='postContentContainer'>\n                        <div class='pinnedPostText'>").concat(pinnedPostText, "</div>\n\n                        <div class='header'>\n                            <a href='/profile/").concat(postedBy.username, "' class=\"displayName\">\n                                ").concat(diplayName, "\n                            </a>\n                            <span class=\"username\">\n                                @").concat(postedBy.username, "\n                            </span>\n                            <span class=\"date\">\n                                ").concat(timestamp, "\n                            </span>\n                            ").concat(buttons, "\n                        </div>\n                        ").concat(replyFlag, "\n                        <div class='postBody'>\n                            <span>").concat(postData.content, "</span>\n                        </div>\n                        <div class='postFooter'>\n\n                            <div class=\"postButtonContainer\">\n                                <button data-bs-toggle=\"modal\" data-bs-target=\"#replyModal\">\n                                    <i class=\"fa-regular fa-comment\"></i>                                \n                                </button>\n                            </div>\n\n                            <div class=\"postButtonContainer green\">\n                                <button class=\"retweetButton ").concat(retweetButtonClass, "\">\n                                    <i class=\"fa-solid fa-retweet\"></i>   \n                                    <span >").concat(postData.retweetUsers.length || '', "</span>\n                             \n                                </button>\n                            </div>\n\n                            <div class=\"postButtonContainer red\">\n                                <button class=\"likedButton ").concat(likedButtonClass, "\">\n                                    <i class=\"fa-regular fa-heart\"></i>\n                                    <span >").concat(postData.likes.length || '', "</span>\n                                </button>\n                            </div>\n\n                        </div>\n                    </div>\n                </div>\n            </div>");
}

function timeDifference(current, previous) {
  var msPerMinute = 60 * 1000;
  var msPerHour = msPerMinute * 60;
  var msPerDay = msPerHour * 24;
  var msPerMonth = msPerDay * 30;
  var msPerYear = msPerDay * 365;
  var elapsed = current - previous;

  if (elapsed < msPerMinute) {
    if (elapsed / 1000 < 30) return "Just now";
    return Math.round(elapsed / 1000) + " seconds ago";
  } else if (elapsed < msPerHour) {
    return Math.round(elapsed / msPerMinute) + " minutes ago";
  } else if (elapsed < msPerDay) {
    return Math.round(elapsed / msPerHour) + " hours ago";
  } else if (elapsed < msPerMonth) {
    return Math.round(elapsed / msPerDay) + " days ago";
  } else if (elapsed < msPerYear) {
    return Math.round(elapsed / msPerMonth) + " months ago";
  } else {
    return Math.round(elapsed / msPerYear) + " years ago";
  }
}

function outputPosts(results, container) {
  container.html("");

  if (!Array.isArray(results)) {
    results = [results];
  }

  results.forEach(function (result) {
    var html = createPostHtml(result);
    container.append(html);
  });

  if (results.length === 0) {
    container.append('<span class="noResults>Nothing to Show</span>');
  }
}

function outputPostsWithReplies(results, container) {
  container.html("");

  if (results.replyTo && results.replyTo._id) {
    var html = createPostHtml(results.replyTo);
    container.append(html);
  }

  var mainPostHtml = createPostHtml(results.postData, true);
  container.append(mainPostHtml);
  results.replies.forEach(function (result) {
    var html = createPostHtml(result);
    container.append(html);
  });
}

function outputUsers(results, container) {
  container.html("");
  results.forEach(function (result) {
    var ele = createUser(result, true);
    container.append(ele);
  });

  if (!results.length) {
    container.append("<span class='noResults'>No resutls Found!</span>");
  }
}

function createUser(user, showFollowButton) {
  var name = user.firstName + " " + user.lastName;
  var isFollowing = userLoggedIn.following && userLoggedIn.following.includes(user._id);
  var text = isFollowing ? "Following" : "Follow";
  var buttonClass = isFollowing ? "followButton following" : "followButton";
  var followButton = "";

  if (showFollowButton && userLoggedIn._id != user._id) {
    followButton = "<div class='followButtonContainer'>\n            <button class='".concat(buttonClass, "' data-user='").concat(user._id, "'>").concat(text, "</button>\n        </div>");
  }

  return "<div class='user'>\n                <div class='userImageContainer'>\n                    <img src='".concat(user.profilePic, "'>\n                </div>\n                <div class='userDetailsContainer'>\n                    <div class='header'>\n                        <a href='/profile/").concat(user.username, "'>").concat(name, "</a>\n                        <span class=\"username\">@").concat(user.username, "</span>\n                    </div>\n                </div>\n                ").concat(followButton, "\n    </div>");
}

function searchUsers(searchTerm) {
  $.get("/api/users", {
    search: searchTerm
  }, function (results) {
    outputSelectableUsers(results, $(".resultsContainer"));
  });
}

function outputSelectableUsers(results, container) {
  container.html("");
  results.forEach(function (result) {
    if (result._id == userLoggedIn._id || selectedUsers.some(function (u) {
      return u._id == result._id;
    })) {
      return;
    }

    var ele = createUser(result, false);
    var element = $(ele);
    element.click(function () {
      return userSelected(result);
    });
    container.append(element);
  });

  if (!results.length) {
    container.append("<span class='noResults'>No resutls Found!</span>");
  }
}

function userSelected(user) {
  selectedUsers.push(user);
  updateSelectedUsersHtml();
  $("#userSearchTextbox").val("").focus();
  $(".resultsContainer").html("");
  $("#createChatButton").prop("disabled", false);
}

function updateSelectedUsersHtml() {
  var elements = [];
  selectedUsers.forEach(function (user) {
    var name = user.firstName + " " + user.lastName;
    var userElement = $("<span class='selectedUser'>".concat(name, "</span>"));
    elements.push(userElement);
  });
  $(".selectedUser").remove();
  $("#selectedUsers").prepend(elements);
}

function messageReceived(newMessage) {
  if ($(".chatContainer").length == 0) {// show notification
  } else {
    addChatMessageHtml(newMessage);
  }
}

function markNotificationAsOpened() {
  var notification = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

  if (!callback) {
    callback = function callback() {
      return location.reload();
    };
  }

  var url = notification != null ? "/api/notifications/".concat(notification, "/markAsOpened") : "/api/notifications/markAsOpened";
  $.ajax({
    url: url,
    type: "PUT",
    success: function success() {
      callback();
    }
  });
}