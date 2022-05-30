const express = require('express');
const router = express.Router();


const notificationsController = require('../../controllers/api/notificationsController');
const middleware = require('../../middleware');


router.get('/' , middleware.authMiddleware, notificationsController.getNotifications);
router.put('/:id/markAsOpened' , middleware.authMiddleware, notificationsController.markAsOpened);
router.put('/markAsOpened' , middleware.authMiddleware, notificationsController.markAllAsOpened);


module.exports = router;
