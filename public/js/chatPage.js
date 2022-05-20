
$(document).ready(() => {
    $.get(`/api/chats/${chatId}`, data => {
        $("#chatName").text(getChatName(data));
    })
});



$("#chatNameButton").click(e => {
    const name = $("#chatNameTextbox").val();
    console.log(name);
    
    $.ajax({
        url:"/api/chats/"+ chatId,
        type: "PUT",
        data: {
            chatName : name
        },
        success: (data, status, xhr) => {
            if(xhr.status != 204) {
                alert("couldn't update")
            } else {
                location.reload();
            }
        }
    });
})

$(".inputTextbox").keydown(e => {
    if(e.which === 13 && !e.shiftKey) { // new line if shift is pressed
        messageSubmitted();
        return false; // prevent default behaviour
    }
});

$(".sendMessageButton").click(e => {
    messageSubmitted();
});


function messageSubmitted() {
    const content = $(".inputTextbox").val().trim();

    if(content) {
        sendMessage(content);
        $(".inputTextbox").val("");
    }

}

function sendMessage(content) {
    $.post("/api/messages", { content: content, chatId: chatId}, (data,status,xhr) => {
        console.log(data);
    })
}


function getChatName(chatData) {

    let chatName = chatData.chatName;

    if(!chatName) {
        let otherChatUsers = getOtherChatUsers(chatData.users);
        let namesArray = otherChatUsers.map(user => user.firstName+ " "+ user.lastName);
        chatName = namesArray.join(",")
    }

    return chatName;
}

function getOtherChatUsers(users) {
    if(users.length == 1) {
        return users;
    }
    return users.filter(u => u._id !== userLoggedIn._id);
}


