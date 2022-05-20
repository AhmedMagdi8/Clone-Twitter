
$(document).ready(() => {
    $.get(`/api/chat/${chatId}`, data => {
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
            console.log("IIIIIIIIIIIIIIIIIIIIIIIIIIIIII");
            if(xhr.status != 204) {
                alert("couldn't update")
            } else {
                location.reload();
            }
        }
    });


})


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
