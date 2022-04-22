const express = require('express');
const router = express.Router();

const postsController = require('../../controllers/api/postsController');

router.get('/', postsController.getPosts);

router.post('/' ,postsController.createPost);
 
router.put('/:id/like' ,postsController.likePost);
 
module.exports = router;
