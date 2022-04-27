$(document).ready(async () => {
        $.get("/api/posts/" + postId , result => {
            console.log(result);
            outputPostsWithReplies(result,$(".postsContainer"))
                // $(".postsContainer").append(createPostHtml(result));
        });
        
});
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
