const express = require('express');
const router = express.Router();


const notificationsController = require('../../controllers/api/notificationsController');
const middleware = require('../../middleware');


router.get('/' , middleware.authMiddleware, notificationsController.getNotifications);
router.get('/latest' , middleware.authMiddleware, notificationsController.latestNotification);

router.put('/:id/markAsOpened' , middleware.authMiddleware, notificationsController.markAsOpened);
router.put('/markAsOpened' , middleware.authMiddleware, notificationsController.markAllAsOpened);


module.exports = router;
