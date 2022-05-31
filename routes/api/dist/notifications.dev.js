"use strict";

var express = require('express');

var router = express.Router();

var notificationsController = require('../../controllers/api/notificationsController');

var middleware = require('../../middleware');

router.get('/', middleware.authMiddleware, notificationsController.getNotifications);
router.get('/latest', middleware.authMiddleware, notificationsController.latestNotification);
router.put('/:id/markAsOpened', middleware.authMiddleware, notificationsController.markAsOpened);
router.put('/markAsOpened', middleware.authMiddleware, notificationsController.markAllAsOpened);
module.exports = router;