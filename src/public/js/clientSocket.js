let connected = false;

const socket = io("http://127.0.0.1:3000");
socket.emit("setup", userLoggedIn);

socket.on("connected", () => connected = true );

socket.on("message received", (newMessage) => messageReceived(newMessage));

socket.on("notification received", () => {
    $.get("/api/notifications/latest", (notData) => {
        showNotificationPopup(notData);
        refreshNotificationsBadge();
    })

});


function emitNotification(userId) {
    if(userId == userLoggedIn._id) return;

    socket.emit("notification received", userId);
}

