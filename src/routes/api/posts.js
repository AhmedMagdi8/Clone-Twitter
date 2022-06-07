const express = require('express');
const router = express.Router();

const postsController = require('../../controllers/api/postsController');
const middleware = require('../../middleware');


router.get('/', middleware.authMiddleware, postsController.getPosts);

router.get('/:id',  middleware.authMiddleware, postsController.getPost);

router.post('/' , middleware.authMiddleware, postsController.createPost);
 
router.put('/:id/like' , middleware.authMiddleware, postsController.likePost);
 
router.post('/:id/retweet' , middleware.authMiddleware, postsController.retweetPost);

router.delete('/:id', middleware.authMiddleware, postsController.deletePost);

router.put('/:id', middleware.authMiddleware, postsController.pinPost);


module.exports = router;
