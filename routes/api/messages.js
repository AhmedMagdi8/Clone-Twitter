const express = require('express');
const router = express.Router();
const multer = require("multer");
const upload = multer({dest : "uploads/"});

const messagesController = require('../../controllers/api/messagesController');
const middleware = require('../../middleware');


router.post('/' , middleware.authMiddleware, messagesController.postMessage);


module.exports = router;
