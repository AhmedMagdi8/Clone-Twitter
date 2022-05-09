const express = require('express');
const router = express.Router();
const multer = require("multer");
const upload = multer({dest : "uploads/"});

const usersController = require('../../controllers/api/usersController');
const middleware = require('../../middleware');

router.put('/:userId/follow' , middleware.authMiddleware, usersController.followHandler);
router.get('/:userId/followers' , middleware.authMiddleware, usersController.getFollowers);
router.get('/:userId/following' , middleware.authMiddleware, usersController.getFollowing);
router.post('/profilePicture' , middleware.authMiddleware,upload.single('croppedImage') ,usersController.handlePrfilePic);
router.post('/coverPhoto' , middleware.authMiddleware,upload.single('croppedImage') ,usersController.handleCoverPhoto);


module.exports = router;
