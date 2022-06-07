let typing = false;
let lastTypingTime;
$(document).ready(() => {

    socket.emit("join room", chatId);
    socket.on("typing", () => $(".typingPic").show())
    socket.on("stop typing", () => $(".typingPic").hide())



    $.get(`/api/chats/${chatId}`, data => {
        $("#chatName").text(getChatName(data));
    });

    $.get(`/api/chats/${chatId}/messages`, data => {

        let messages = [];
        let lastSenderId = "";
        
        data.forEach( (message, index) => {
            let html =  createMessageHtml(message, data[index+1], lastSenderId);
            messages.push(html);
            lastSenderId = message.sender._id;
        });

        let msgs = messages.join("");
        addMessagesHtmlToPage(msgs);
        scrollToButtom(false);
        markAllMessagesAsRead();
        
        $(".loadingSpinnerContainer").remove();
        $(".chatContainer").css("visibility","visible")
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

    updateTyping();
    if(e.which === 13 && !e.shiftKey) { // new line if shift is pressed
        messageSubmitted();
        return false; // prevent default behaviour
    }
});

function addMessagesHtmlToPage(html) {
    $(".chatMessages").append(html);
}

$(".sendMessageButton").click(e => {
    messageSubmitted();
});

function updateTyping() {

    if(!connected) {
        return;
    }
    if(!typing) {
        typing = true;
        socket.emit("typing", chatId);
    }


    lastTypingTime = new Date().getTime();

    let timeLength = 3000;

    setTimeout(() => {
        let timenow = new Date().getTime();
        let timeDiff = timenow - lastTypingTime;
        if(timeDiff >= timeLength && typing) {
            socket.emit("stop typing", chatId);
            typing = false;
        }
    }, timeLength)

}

function messageSubmitted() {
    const content = $(".inputTextbox").val().trim();

    if(content) {
        sendMessage(content);
        $(".inputTextbox").val("");
        socket.emit("stop typing", chatId);
        typing = false;
    }

}

function sendMessage(content) {
    $.post("/api/messages", { content: content, chatId: chatId}, (data,status,xhr) => {
        if(xhr.status != 201) {
            alert("couldn't send message!");
            $(".inputTextbox").val(content);
            return;
        }
        
        addChatMessageHtml(data);
        markAllMessagesAsRead();
        if(connected) {
            socket.emit("new message", data);
        }
    })
}

function addChatMessageHtml(message) {
    if(!message|| !message._id) {
        alert("message is not valid")
        return;
    }

    const messageDiv = createMessageHtml(message, null, "");
    addMessagesHtmlToPage(messageDiv);    
    scrollToButtom(true);
}   

function createMessageHtml(message, nextMessage, lastSenderId) {

    const sender =  message.sender;
    const senderName = sender.firstName + " " + sender.lastName;

    const currentSenderId = sender._id;
    const nextSenderId = nextMessage ? nextMessage.sender._id : "";

    const isFirst = lastSenderId != currentSenderId;
    const isLast = nextSenderId != currentSenderId;

    const isMine = message.sender._id == userLoggedIn._id;
    let liClassName = isMine ? "mine" : "theirs"

    let nameElement = "";

    if(isFirst) {
        liClassName += " first";
        if(!isMine) {
            nameElement  = `<span class="senderName">${senderName}</span>`
        }
    }

    let profileImage = "";
    if(isLast) {
        liClassName += " last"
        profileImage = `<img src='${sender.profilePic}'>`;
    }

    let imageContainer = "";
    if(!isMine) {
    imageContainer =`<div class="imageContainer">
                        ${profileImage}
                    </div>`
    }

    return `<li class='message ${liClassName}'>
                ${imageContainer}
                <div class='messageContainer'>
                    ${nameElement}
                    <span class='messageBody'>
                        ${message.content}
                    </span>
                </div>
            </li>`
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


function scrollToButtom(animated) {
    const container = $(".chatMessages");
    const scrollHeight =  container[0].scrollHeight;

    if(animated) {
        container.animate({ scrollTop: scrollHeight}, "slow")
    } else {
        container.scrollTop(scrollHeight);
    }
}

function markAllMessagesAsRead() {
    $.ajax({
        url: `/api/chats/${chatId}/messages/markAsRead`,
        type: "PUT",
        success: () => refreshMessageBadge()
    })
}