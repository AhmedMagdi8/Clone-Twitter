const User = require("../../models/userModel");
const Chat = require("../../models/chatModel");
const Message = require("../../models/messageModel");


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

        const result = await Message.create(newMessage);
        res.status(201).send(result);
    } catch(err) {
        console.log(err);
        return res.sendStatus(400);
    }
}