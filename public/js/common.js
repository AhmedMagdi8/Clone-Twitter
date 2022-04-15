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

function createPostHtml(postData) {
  const postedBy = postData.postedBy;
  const diplayName = postedBy.firstName + " " + postedBy.lastName;
  const timestamp = postedBy.createdAt;

  return `<div class="post">
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

                            <div class="postButtonContainer">
                                <button>
                                    <i class="fa-solid fa-retweet"></i>                                
                                </button>
                            </div>

                            <div class="postButtonContainer">
                                <button>
                                    <i class="fa-regular fa-heart"></i>
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>`;
}
