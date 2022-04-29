const express = require('express');
const router = express.Router();

const profileController = require('../controllers/profileController');
const middleware = require('../middleware');

router.get('/' ,middleware.authMiddleware, profileController.getProfile);
router.get('/:username' ,middleware.authMiddleware, profileController.getProfileUsername);
router.get('/:username/replies' ,middleware.authMiddleware, profileController.getProfileReplies);


module.exports = router;
