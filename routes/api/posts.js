const express = require('express');
const router = express.Router();

const postsController = require('../../controllers/api/postsController');

// router.get('/' ,authController.getLogin);

router.post('/' ,postsController.createPost);
 
module.exports = router;
