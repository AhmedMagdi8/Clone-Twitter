"use strict";

var express = require('express');

var router = express.Router();

var multer = require("multer");

var upload = multer({
  dest: "uploads/"
});

var chatsController = require('../../controllers/api/chatsController');

var middleware = require('../../middleware');

router.post('/', middleware.authMiddleware, chatsController.createChat);
router.get('/', middleware.authMiddleware, chatsController.getChats);
router.get('/:chatId', middleware.authMiddleware, chatsController.getChat);
router.get('/:chatId/messages', middleware.authMiddleware, chatsController.getFullChat);
router.put('/:chatId/messages/markAsRead', middleware.authMiddleware, chatsController.markAsRead);
router.put('/:chatId', middleware.authMiddleware, chatsController.updateChatName);
module.exports = router;