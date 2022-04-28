const express = require('express');
const router = express.Router();

const postController = require('../controllers/postController');
const middleware = require('../middleware');

router.get('/:id' ,middleware.authMiddleware, postController.getPost);


module.exports = router;
