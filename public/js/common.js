// Global variables
let cropper;
let timer;
let selectedUsers = [];


$("#postTextarea, #replyTextarea").keyup((event) => {
  const value = event.target.value.trim();

  let isModal = $(event.target).parents(".modal").length == 1;

  let submitButton = isModal ? $("#submitReplyButton") : $("#submitPostButton");
  if (value) {
    submitButton.prop("disabled", false);
    return;
  }
  submitButton.prop("disabled", true);
});

$("#submitPostButton, #submitReplyButton").click((event) => {
  const button = $(event.target);
  let isModal = button.parents(".modal").length == 1;


  const textbox = isModal ? $("#replyTextarea"): $("#postTextarea");

  const data = {
    content: textbox.val(),
  };

  if(isModal) {
    const id = button.data().id;
    if(!id) {
        alert("button id is null");
    }
    data.replyTo = id;
  }
  $.post("/api/posts", data, (postData) => {
    if(postData.replyTo) {
        location.reload();
    } else {
        let post = createPostHtml(postData);
        $(".postsContainer").prepend(post);
        textbox.val("");
        button.prop("disabled", true);
    }

  });
});

$("#replyModal").on("show.bs.modal", (event) => {
    let button = $(event.relatedTarget);
    let postId = getPostId(button);

    $("#submitReplyButton").data("id", postId);

    $.get("/api/posts/"+ postId, post => {
        post = post.postData;
        let container = $("#originalPostContainer")
        container.html("");
        let html = createPostHtml(post);
        container.append(html);
    });

});

$("#replyModal").on("hidden.bs.modal", (event) => {
    $("#originalPostContainer").html("");
});

$("#deletePostModal").on("show.bs.modal", (event) => {
    let button = $(event.relatedTarget);
    let postId = getPostId(button);
    $("#deletePostButton").data("id", postId);
});

$("#pinPostModal").on("show.bs.modal", (event) => {
    let button = $(event.relatedTarget);
    let postId = getPostId(button);
    $("#pinPostButton").data("id", postId);
});

$("#unPinPostModal").on("show.bs.modal", (event) => {
    let button = $(event.relatedTarget);
    let postId = getPostId(button);
    $("#unPinPostButton").data("id", postId);
});


$("#filePhoto").change(event => {
    let input = $(event.target)[0];
    if(input.files && input.files[0]) {
        let reader = new FileReader();
        reader.onload = (e) => {
            let image = document.getElementById("imagePreview");
            image.src = e.target.result;

            if(cropper) {
                cropper.destroy();
            }
            cropper = new Cropper(image, {
                aspectRatio: 1 / 1,
                background: false
            });

        }
        reader.readAsDataURL(input.files[0])
    }
});


$("#coverPhoto").change(event => {
    let input = $(event.target)[0];
    if(input.files && input.files[0]) {
        let reader = new FileReader();
        reader.onload = (e) => {
            let image = document.getElementById("coverPreview");
            image.src = e.target.result;

            if(cropper) {
                cropper.destroy();
            }
            cropper = new Cropper(image, {
                aspectRatio: 16 / 9,
                background: false
            });

        }
        reader.readAsDataURL(input.files[0])
    }
});

$("#userSearchTextbox").keydown(event => {
    clearTimeout(timer);
    let textbox = $(event.target);
    let value = textbox.val();

    // 8 is the key code for delete
    //event.which is jquery alternative of keyCode
    if(!value && (event.which == 8 || event.keyCode == 8)) {
        // remove user from seleciton
        selectedUsers.pop();
        updateSelectedUsersHtml();
        $(".resultsContainer").html("");

        if(selectedUsers.length == 0) {
            $("#createChatButton").prop("disabled", true);

        }
        return;
    }

    timer = setTimeout(() => {
        value = textbox.val().trim();

        if(value == "") {
            $(".resultsContainer").html("");
        } else {
            searchUsers(value);
        }
    },1000)
});


$("#ImageUploadButton").click(event => {
    let canvas = cropper.getCroppedCanvas();
    if(!canvas) {
        alert("make sure it's an image file");
        return;
    }
    // blob is a binary large object used to images and videos
    canvas.toBlob((blob) => {
        let formData = new FormData();
        formData.append("croppedImage", blob);
        // process data forces jquery not to convert form data to string
        // contentType used for forms that submit files
        // it forces jq not to add content type header in this request 
        $.ajax({
            url: "/api/users/profilePicture",
            type: "POST",
            data: formData,
            processData:false,
            contentType: false,
            success: () => location.reload() 
        });
    })

})


$("#coverPhotoButton").click(event => {
    let canvas = cropper.getCroppedCanvas();
    if(!canvas) {
        alert("make sure it's an image file");
        return;
    }
    // blob is a binary large object used to images and videos
    canvas.toBlob((blob) => {
        let formData = new FormData();
        formData.append("croppedImage", blob);
        // process data forces jquery not to convert form data to string
        // contentType used for forms that submit files
        // it forces jq not to add content type header in this request 
        $.ajax({
            url: "/api/users/coverPhoto",
            type: "POST",
            data: formData,
            processData:false,
            contentType: false,
            success: () => location.reload() 
        });
    })

})


$("#createChatButton").click(event => {
    // we have to convery array to string to be able to send it to the server
    let data = JSON.stringify(selectedUsers);
    $.post("/api/chats", { users: data }, chat => {

        if(!chat) {
            return alert("invalid response froms server");
        }

        window.location.href = `/messages/${chat._id}`
    })

})

$("#deletePostButton").click((event) => {
    const postId = $(event.target).data("id");
    $.ajax({
        url: `/api/posts/${postId}`,
        type: 'DELETE',
        success: (data, status, xhr) => {
            console.log(data);
            console.log(status);
            // xhr means status code xml http requests if(xhr.status == 202) alert('deleted');
            
            console.log(xhr);

            location.reload();
        }
    });
});

$("#unPinPostButton").click((event) => {
    const postId = $(event.target).data("id");
    $.ajax({
        url: `/api/posts/${postId}`,
        type: 'PUT',
        data: {pinned: false},
        success: (data, status, xhr) => {

            if(xhr.status != 204) {
                alert("could not unpin the post"+xhr.status)
            }
            location.reload();
        }
    });
});

$("#pinPostButton").click((event) => {
    const postId = $(event.target).data("id");
    $.ajax({
        url: `/api/posts/${postId}`,
        type: 'PUT',
        data: {pinned: true},
        success: (data, status, xhr) => {

            if(xhr.status != 204) {
                alert("could not pin the post"+xhr.status)
            }
            // console.log(data);
            // console.log(status);
            // console.log(xhr);
            // xhr means status code xml http requests if(xhr.status == 202) alert('deleted');
            location.reload();
        }
    });
});

$(document).on("click", ".likedButton", (event) => {
    let button = $(event.target);
    let postId = getPostId(button);
    if(!postId) return;

    $.ajax({
        url: `/api/posts/${postId}/like`,
        type: 'PUT',
        success: (postData) => {
            button.find('span').text(postData.likes.length || '');
            if(postData.likes.includes(userLoggedIn._id)) {
                button.addClass('liked');
            } else {
                button.removeClass('liked');
            }
        }
    });

});

$(document).on("click", ".retweetButton", (event) => {
    let button = $(event.target);
    let postId = getPostId(button);
    if(!postId) return;

    $.ajax({
        url: `/api/posts/${postId}/retweet`,
        type: 'POST',
        success: (postData) => {
            button.find('span').text(postData.retweetUsers.length || '');
            if(postData.retweetUsers.includes(userLoggedIn._id)) {
                button.addClass('retweeted');
                // let post = createPostHtml(postData);
                // $(".postsContainer").prepend(post);
            } else {
                button.removeClass('retweeted');
            }
        }
    });

});

$(document).on("click", ".post", (event) => {
    let element = $(event.target);
    let postId = getPostId(element);

    if(postId && !element.is("button")) {
        window.location.href = '/posts/' + postId;
    }


});

$(document).on("click", ".followButton", (event) => {
    let button = $(event.target);
    let userId = button.data().user;
    $.ajax({
        url: `/api/users/${userId}/follow`,
        type: 'PUT',
        success: (data, status, xhr) => {
            if(xhr.status == 404) {
                alert("User not found!");
                return;
            }
            let difference;
            if(data.following && data.following.includes(userId)) {
                button.addClass('following');
                button.text("Following");
                difference = 1;
        
            } else {
                button.removeClass('following');
                button.text("Follow");
                difference = -1;

            }
            let followersLabel = $("#followersValue");
            let followersText = followersLabel.text();
            followersLabel.text(parseInt(followersText)+difference);

            // if(followersLabel.length != 0) {
            //     let followersText = followersLabel.text();
            //     followersLabel.text(parseInt(followersText)+1);
            // } else {
            //     let followersText = followersLabel.text();
            //     followersLabel.text(Number(followersText)-1);

            // }
        }
    });
});

$(document).on("click", ".notification.active", (e) => {
    console.log("kjiuuiohi");
    const container = $(e.target);
    const notificationId = container.data().id;

    const href = container.attr("href");
    e.preventDefault();

    const callback = () => window.location = href;

    markNotificationAsOpened(notificationId, callback);
})
function getPostId(element) {
    const isRoot = element.hasClass("post");
    const root = isRoot ? element : element.closest(".post");
    const postId = root.data().id;
    if(!postId)
        return;
    return postId;
}

function createPostHtml(postData, largeFont = false) {


  if(!postData) return alert("post object is null");

  let isRetweet = postData.retweetData ? true : false;

  let retweetedBy = isRetweet ? postData.postedBy.username : null;
  postData = isRetweet ? postData.retweetData : postData;

  const postedBy = postData.postedBy;

  if (postedBy._id === undefined) {
  }
  const diplayName = postedBy.firstName + " " + postedBy.lastName;
  const timestamp = timeDifference(new Date(), new Date(postData.createdAt));

  const likedButtonClass = postData.likes.includes(userLoggedIn._id) ? "liked":'';
  const retweetButtonClass = postData.retweetUsers.includes(userLoggedIn._id) ? "retweeted":'';
  const largeFontClass = largeFont ? 'largeFont': '';
  
  let retweetText = '';
  if(isRetweet) 
    retweetText = `<span>Retweeted by <a href='/profile/${retweetedBy}'>${retweetedBy}</a></span>`;

    
  let replyFlag = "";
  if(postData.replyTo && postData.replyTo._id) {


      if(!postData.replyTo._id) {
          return alert('reply to is not pupulated');
      } else if(!postData.replyTo.postedBy._id) {
          return alert("posted by is no populated");
      }
      const replyToUsername = postData.replyTo.postedBy.username;
      replyFlag = `<div class="replyFlag"> 
                        Replying to <a href='/profile/${replyToUsername}'>@${replyToUsername} </a>
                   </div>`
  }

  let buttons = "";
  let pinnedPostText= "";
  if(postData.postedBy._id == userLoggedIn._id) {
      let pinnedClass= "";
      let dataTarget = "#pinPostModal";
      if(postData.pinned === true) {
        pinnedClass= "active";
        dataTarget = "#unPinPostModal"
        pinnedPostText = "<i class='fas fa-thumbtack'></i> <span>Pinned post</span>"
      }
    buttons = 
    `<button class="pinButton ${pinnedClass}" data-id="${postData._id}" data-bs-toggle="modal" data-bs-target="${dataTarget}"><i class="fa-solid fa-thumbtack"></i></button>
    <button data-id="${postData._id}" data-bs-toggle="modal" data-bs-target="#deletePostModal"><i class="fas fa-times" aria-hidden="true"></i></button>`;

  }

  return `<div class="post ${largeFontClass}" data-id='${postData._id}'>
                <div class='postActionContainer'>
                    ${retweetText}
                </div>
                <div class="mainContentContainer">
                    <div class="userImageContainer">
                        <img src='${postedBy.profilePic}'/>
                    </div>
                    <div class='postContentContainer'>
                        <div class='pinnedPostText'>${pinnedPostText}</div>

                        <div class='header'>
                            <a href='/profile/${postedBy.username}' class="displayName">
                                ${diplayName}
                            </a>
                            <span class="username">
                                @${postedBy.username}
                            </span>
                            <span class="date">
                                ${timestamp}
                            </span>
                            ${buttons}
                        </div>
                        ${replyFlag}
                        <div class='postBody'>
                            <span>${postData.content}</span>
                        </div>
                        <div class='postFooter'>

                            <div class="postButtonContainer">
                                <button data-bs-toggle="modal" data-bs-target="#replyModal">
                                    <i class="fa-regular fa-comment"></i>                                
                                </button>
                            </div>

                            <div class="postButtonContainer green">
                                <button class="retweetButton ${retweetButtonClass}">
                                    <i class="fa-solid fa-retweet"></i>   
                                    <span >${postData.retweetUsers.length || ''}</span>
                             
                                </button>
                            </div>

                            <div class="postButtonContainer red">
                                <button class="likedButton ${likedButtonClass}">
                                    <i class="fa-regular fa-heart"></i>
                                    <span >${postData.likes.length || ''}</span>
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>`;
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

    if(!Array.isArray(results)) {
        results = [results];
    }

    results.forEach(result => {
        let html = createPostHtml(result);
        container.append(html);
    });

    if(results.length === 0) {
        container.append('<span class="noResults>Nothing to Show</span>')
    }
}

function outputPostsWithReplies(results, container) {
    container.html("");

    if(results.replyTo && results.replyTo._id ) {
        let html = createPostHtml(results.replyTo);
        container.append(html);
    }

    let mainPostHtml = createPostHtml(results.postData, true);
    container.append(mainPostHtml);


    results.replies.forEach(result => {
        let html = createPostHtml(result);
        container.append(html);
    });
}


function outputUsers(results, container) {
    container.html("");

    results.forEach(result => {
        let ele = createUser(result,true);
        container.append(ele);
    });

    if(!results.length) {
        container.append(
            "<span class='noResults'>No resutls Found!</span>"
        )
    }
}

function createUser(user, showFollowButton) {

    let name = user.firstName + " "+ user.lastName;
    let isFollowing = userLoggedIn.following && userLoggedIn.following.includes(user._id);
    let text = isFollowing ? "Following" : "Follow"
    let buttonClass = isFollowing ? "followButton following" : "followButton";

    let followButton = "";
    if(showFollowButton && userLoggedIn._id != user._id) {
        followButton = `<div class='followButtonContainer'>
            <button class='${buttonClass}' data-user='${user._id}'>${text}</button>
        </div>`
    }
    return `<div class='user'>
                <div class='userImageContainer'>
                    <img src='${user.profilePic}'>
                </div>
                <div class='userDetailsContainer'>
                    <div class='header'>
                        <a href='/profile/${user.username}'>${name}</a>
                        <span class="username">@${user.username}</span>
                    </div>
                </div>
                ${followButton}
    </div>`
}

function searchUsers(searchTerm) {
    $.get("/api/users", {search: searchTerm}, results => {
        outputSelectableUsers(results, $(".resultsContainer"))
    })
}

function outputSelectableUsers(results, container) {
    container.html("");

    results.forEach(result => {

        if(result._id == userLoggedIn._id || selectedUsers.some(u => u._id == result._id)) {
            return;
        }

        let ele = createUser(result,false);
        let element = $(ele);
        element.click(() => {
            return userSelected(result);
        })
        container.append(element);
    });

    if(!results.length) {
        container.append(
            "<span class='noResults'>No resutls Found!</span>"
        )
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
    let elements = [];

    selectedUsers.forEach(user => {
        let name = user.firstName + " " + user.lastName;
        let userElement = $(`<span class='selectedUser'>${name}</span>`);
        elements.push(userElement);

    });

    $(".selectedUser").remove();
    $("#selectedUsers").prepend(elements);

}

function messageReceived(newMessage) {
    if($(".chatContainer").length == 0) {
        // show notification
    } else {
        addChatMessageHtml(newMessage);
    }
}

function markNotificationAsOpened(notification=null, callback=null) {
    if(!callback) {
        callback = () => location.reload();
    }
        const url = notification != null ? `/api/notifications/${notification}/markAsOpened`: `/api/notifications/markAsOpened`;
        $.ajax({
            url: url,
            type:"PUT",
            success: () => {
                callback();
            }
        })
    

}