const express = require('express');
const router = express.Router();

const usersController = require('../../controllers/api/usersController');
const middleware = require('../../middleware');

router.put('/:userId/follow' , middleware.authMiddleware, usersController.followHandler);
router.get('/:userId/followers' , middleware.authMiddleware, usersController.getFollowers);
router.get('/:userId/following' , middleware.authMiddleware, usersController.getFollowing);


module.exports = router;
