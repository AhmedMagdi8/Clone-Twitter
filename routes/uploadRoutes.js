const express = require('express');
const router = express.Router();

const uploadController = require('../controllers/uploadController');
const middleware = require('../middleware');

router.get('/images/:path' ,middleware.authMiddleware, uploadController.uploadImage);

module.exports = router;
