
let socket;
const createSocket = (server) => {
    socket =  require("socket.io")(server, { pingTimeout: 60000});
    return socket;
}

const getIo = () => {
    if(socket) 
        return socket;
    return "socket is not initialized";
}

module.exports = { createSocket, getIo };

