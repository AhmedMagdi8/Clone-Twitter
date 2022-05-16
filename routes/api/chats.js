const express = require('express');
const router = express.Router();
const multer = require("multer");
const upload = multer({dest : "uploads/"});

const chatsController = require('../../controllers/api/chatsController');
const middleware = require('../../middleware');


router.post('/' , middleware.authMiddleware, chatsController.createChat);
router.get('/' , middleware.authMiddleware, chatsController.getChats);


module.exports = router;
