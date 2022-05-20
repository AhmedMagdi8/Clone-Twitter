const express = require('express');
const router = express.Router();

const messagesController = require('../controllers/messagesController');
const middleware = require('../middleware');

router.get('/', middleware.authMiddleware, messagesController.getInbox);
router.get('/new' ,middleware.authMiddleware, messagesController.createNewMessage);
router.get('/:chatId' ,middleware.authMiddleware, messagesController.getChatPage);

module.exports = router;