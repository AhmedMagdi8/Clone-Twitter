$(document).ready(async () => {

/*
    fetch request won't work here because 
    1-
    The Promise returned from fetch() won’t reject on HTTP 
    error status even if the response is an HTTP 404 or 500. 
    Instead, it will resolve normally (with ok status set to false), 
    and it will only reject on network failure or if 
    anything prevented the request from completing.

    2 - By default, 
    fetch won't send or receive any cookies from the server, 
    resulting in unauthenticated requests if the site relies 
    on maintaining a user session
     (to send cookies, the credentials init option must be set


    FOR THAT REASON WE WILL USE JQUERY AJAX REQUEST
*/ 

    $.get("/api/posts", result => {
        result.forEach(element => {
            $(".postsContainer").append(createPostHtml(element));
        });
    });
    
});




















// let response = await fetch(url
//     // , {
//     // method: 'POST', // *GET, POST, PUT, DELETE, etc.
//     // mode: 'cors', // no-cors, *cors, same-origin
//     // cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
//     // credentials: 'same-origin', // include, *same-origin, omit
//     // headers: {
//     //   'Content-Type': 'application/json'
//     //   // 'Content-Type': 'application/x-www-form-urlencoded',
//     // },
//     // redirect: 'follow', // manual, *follow, error
//     // referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
//     // body: JSON.stringify(data) // body data type must match "Content-Type" header
//     // }
//   )
