const User = require("../../models/userModel");
const Chat = require("../../models/chatModel");
const Message = require("../../models/messageModel");


exports.createChat = async(req, res, next) => {
    if(!req.body.users) {
        console.log("Users params not sent");
        return res.sendStatus(400);
    }

    let users = JSON.parse(req.body.users);
    
    if(users.length == 0) {
        console.log("Users array is empty");
        return res.sendStatus(400);
    }

    users.push(req.session.user);

    let chatData = {
        users: users
    }

    try {
        let chat = Chat.create(chatData);
        res.status(200).send(chat);

    } catch(err) {
        console.log(err);
        return res.sendStatus(400);
    }
}

exports.getChats = async(req, res, next) => {
    
    try {

        let chats = await Chat.find({ users: { $elemMatch: { $eq: req.session.user._id} }})
        .populate("users")
        .populate("latestMessage")
        .sort({ updatedAt: -1}); // -1 is ascending

        chats = await User.populate(chats, { path: "latestMessage.sender"});
        res.status(200).send(chats);

} catch(err) {
        console.log(err);
        return res.sendStatus(400);
    }
}

exports.getChat = async(req, res, next) => {
    
    try {

        let chat = await Chat.findOne({ _id: req.params.chatId, users: { $elemMatch: { $eq: req.session.user._id} }})
        .populate("users");

        res.status(200).send(chat);

} catch(err) {
        console.log(err);
        return res.sendStatus(400);
    }
}


exports.getFullChat = async(req, res, next) => {
    
    try {
        let messages = await Message.find({ chat:  req.params.chatId })
        .populate("sender");
        res.status(200).send(messages);

} catch(err) {
        console.log(err);
        console.log("I am in the getFullChat");
        return res.sendStatus(400);
    }
}

exports.updateChatName = async(req, res, next) => {
    
    try {

        await Chat.findByIdAndUpdate(req.params.chatId, req.body);
        return res.sendStatus(204)

} catch(err) {
        console.log(err);
        return res.sendStatus(400);
    }
}