const express = require('express');
const router = express.Router();

const profileController = require('../controllers/profileController');
const middleware = require('../middleware');

router.get('/' ,middleware.authMiddleware, profileController.getProfile);
router.get('/:username' ,middleware.authMiddleware, profileController.getProfileUsername);
router.get('/:username/replies' ,middleware.authMiddleware, profileController.getProfileReplies);
router.get('/:username/followers' ,middleware.authMiddleware, profileController.getFollowers);
router.get('/:username/following' ,middleware.authMiddleware, profileController.getFollowing);


module.exports = router;
