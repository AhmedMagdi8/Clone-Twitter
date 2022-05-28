const User = require("../../models/userModel");
const Chat = require("../../models/chatModel");
const Message = require("../../models/messageModel");
const Notification = require("../../models/notificationModel");


exports.postMessage = async(req, res, next) => {
    if(!req.body.content || !req.body.chatId) {
        console.log("Invalid data was sent");
        return res.sendStatus(400);
    }

    try {
        let newMessage = {
            sender: req.session.user._id,
            content: req.body.content,
            chat: req.body.chatId
        }

        let result = await Message.create(newMessage);
        result = await result.populate("sender");
        result = await result.populate("chat");
        result = await User.populate(result, { path: "chat.users"});

        let chat = await Chat.findByIdAndUpdate(req.body.chatId, {latestMessage: result});

        insertNotification(chat, result)
    
        res.status(201).send(result);
    } catch(err) {
        console.log(err);
        return res.sendStatus(400);
    }
}


function insertNotification(chat, message) {
    chat.users.forEach(userId => {
        if(userId == message.sender._id.toString()) {
            return
        }

        Notification.insertNotification(userId, message.sender._id, "newMessage", message.chat._id);
    });
}