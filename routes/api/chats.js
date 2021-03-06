const express = require('express');
const router = express.Router();
const multer = require("multer");
const upload = multer({dest : "uploads/"});

const chatsController = require('../../controllers/api/chatsController');
const middleware = require('../../middleware');


router.post('/' , middleware.authMiddleware, chatsController.createChat);
router.get('/' , middleware.authMiddleware, chatsController.getChats);
router.get('/:chatId' , middleware.authMiddleware, chatsController.getChat);
router.get('/:chatId/messages' , middleware.authMiddleware, chatsController.getFullChat);
router.put('/:chatId/messages/markAsRead' , middleware.authMiddleware, chatsController.markAsRead);

router.put('/:chatId' , middleware.authMiddleware, chatsController.updateChatName);


module.exports = router;
