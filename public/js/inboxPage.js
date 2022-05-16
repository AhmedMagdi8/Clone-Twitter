$(document).ready(() => {
    $.get("/api/chat", (data, status, xhr) => {
        if(xhr.status == 400) {
            alert("Couldn't get chat list");
        } else {

        }

    })
});


function outputChatList(chatList,container) {
    log
}