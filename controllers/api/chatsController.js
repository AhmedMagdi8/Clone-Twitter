const User = require("../../models/userModel");
const Chat = require("../../models/chatModel");


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
        .populate("users");
        res.status(200).send(chats);

} catch(err) {
        console.log(err);
        return res.sendStatus(400);
    }
}