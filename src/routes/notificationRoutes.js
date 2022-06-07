const express = require('express');
const router = express.Router();

const notificationController = require('../controllers/notificationController');
const middleware = require('../middleware');

router.get('/', middleware.authMiddleware, notificationController.getNotifications);

module.exports = router;