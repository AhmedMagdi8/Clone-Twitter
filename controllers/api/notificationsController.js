const User = require("../../models/userModel");
const Chat = require("../../models/chatModel");
const Message = require("../../models/messageModel");
const Notification = require("../../models/notificationModel");


exports.getNotifications = async(req, res, next) => {
    try {
     
        const searchObj = { userTo: req.session.user._id, notificationType:  { $ne: "newMessage" } };

        if(req.query.unreadOnly && req.query.unreadOnly == "true") {
            searchObj.opened = false;
        }
        const notificatins = await Notification.find(searchObj)
        .populate("userTo")
        .populate("userFrom")
        .sort({ createdAt: -1 }) // most recently ordered
        
        res.status(200).send(notificatins);
        
    }
    catch(e) {
        console.log(e);
    }
}


exports.latestNotification = async(req, res, next) => {
    try {
        const notifications = await Notification.findOne({ userTo: req.session.user._id})
        .populate("userTo")
        .populate("userFrom")
        .sort({ createdAt: -1 }) // most recently ordered
        
        res.status(200).send(notifications);
        
    }
    catch(e) {
        console.log(e);
    }
}

exports.markAsOpened = async(req, res, next) => {
    try {
        await Notification.findByIdAndUpdate(req.params.id, {opened: true});
        res.sendStatus(204);
    }
    catch(e) {
        console.log(e);
    }
}

exports.markAllAsOpened = async(req, res, next) => {
    try {
        await Notification.updateMany({ userTo: req.session.user._id},{opened: true});
        res.sendStatus(204);
    }
    catch(e) {
        console.log(e);
    }
}