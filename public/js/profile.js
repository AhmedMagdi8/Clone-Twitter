$(document).ready(() => {
    if(selectedTab === "replies") {
        loadReplies();
    } else {
        loadPosts();
    }
});


async function loadPosts() {
    $.get("/api/posts",{ postedBy: profileUserId, isReply: false } ,results => {
        outputPosts(results, $(".postsContainer"));
    })
}

async function loadReplies() {
    $.get("/api/posts",{ postedBy: profileUserId, isReply: true } ,results => {
        outputPosts(results, $(".postsContainer"));
    })
}