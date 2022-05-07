$(document).ready(() => {
    if(selectedTab === "followers") {
        loadFollowers();
    } else {
        loadFollowing();
    }
});


async function loadFollowers() {
    $.get(`/api/users/${profileUserId}/followers`, results => {
        outputUsers(results.followers, $(".resultsContainer"));
    })
}

async function loadFollowing() {
    $.get(`/api/users/${profileUserId}/following`, results => {
        outputUsers(results.following, $(".resultsContainer"));
    })
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
    console.log(followButton,showFollowButton,userLoggedIn._id,user._id);
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