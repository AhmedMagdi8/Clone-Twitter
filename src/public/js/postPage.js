$(document).ready(async () => {
        $.get("/api/posts/" + postId , result => {
            outputPostsWithReplies(result,$(".postsContainer"))
        });
        
});
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
