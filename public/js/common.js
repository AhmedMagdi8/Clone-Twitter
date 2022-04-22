$("#postTextarea").keyup((event) => {
  const value = event.target.value.trim();
  if (value) {
    $("#submitPostButton").prop("disabled", false);
    return;
  }
  $("#submitPostButton").prop("disabled", true);
});

$("#submitPostButton").click((event) => {
  const button = $(event.target);
  const textbox = $("#postTextarea");

  const data = {
    content: textbox.val(),
  };

  $.post("/api/posts", data, (postData) => {
    let post = createPostHtml(postData);
    $(".postsContainer").prepend(post);
    textbox.val("");
    button.prop("disabled", true);
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

function getPostId(element) {
    const isRoot = element.hasClass("post");
    const root = isRoot ? element : element.closest(".post");
    const postId = root.data().id;
    if(!postId)
        return;
    return postId;
}
function createPostHtml(postData) {

  if(!postData) return alert("post object is null");

  let isRetweet = postData.retweetData ? true : false;

  let retweetedBy = isRetweet ? postData.postedBy.username : null;
  postData = isRetweet ? postData.retweetData : postData;

  console.log(isRetweet);
  const postedBy = postData.postedBy;

  if (postedBy._id === undefined) {
  }
  const diplayName = postedBy.firstName + " " + postedBy.lastName;
  const timestamp = timeDifference(new Date(), new Date(postData.createdAt));

  const likedButtonClass = postData.likes.includes(userLoggedIn._id) ? "liked":'';
  const retweetButtonClass = postData.retweetUsers.includes(userLoggedIn._id) ? "retweeted":'';
  let retweetText = '';
  if(isRetweet) 
    retweetText = `<span>Retweeted by <a href='/profile/${retweetedBy}'>${retweetedBy}</a></span>`;

  return `<div class="post" data-id='${postData._id}'>
                <div class='postActionContainer'>
                    ${retweetText}
                </div>
                <div class="mainContentContainer">
                    <div class="userImageContainer">
                        <img src='${postedBy.profilePic}'/>
                    </div>
                    <div class='postContentContainer'>
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
                            
                        </div>
                        <div class='postBody'>
                            <span>${postData.content}</span>
                        </div>
                        <div class='postFooter'>

                            <div class="postButtonContainer">
                                <button>
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
