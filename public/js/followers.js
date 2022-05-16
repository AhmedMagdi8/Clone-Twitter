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

