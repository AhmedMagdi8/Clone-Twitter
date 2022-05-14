$(document).ready(() => {
    if(selectedTab === "replies") {
        loadReplies();
    } else {
        loadPosts();
    }
});


async function loadPosts() {
    $.get("/api/posts",{ postedBy: profileUserId, pinned: true } ,results => {
        outputPinnedPost(results, $(".pinnedPostContainer"));
    });

    $.get("/api/posts",{ postedBy: profileUserId, isReply: false } ,results => {
        outputPosts(results, $(".postsContainer"));
    });
}

async function loadReplies() {
    $.get("/api/posts",{ postedBy: profileUserId, isReply: true } ,results => {
        outputPosts(results, $(".postsContainer"));
    })
}


function outputPinnedPost(results, container) {
    if(results.length == 0) {
        container.hide();
        return;
    }
    container.html("");


    results.forEach(result => {
        let html = createPostHtml(result);
        container.append(html);
    });
}
