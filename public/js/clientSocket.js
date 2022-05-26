let connected = false;

const socket = io("http://127.0.0.1:3000");
socket.emit("setup", userLoggedIn);

socket.on("connected", () => connected = true );

socket.on("message received", (newMessage) => messageReceived(newMessage));

