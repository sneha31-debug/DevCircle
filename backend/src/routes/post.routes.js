// src/routes/post.routes.js
const express        = require('express');
const router         = express.Router();
const PostController = require('../controllers/PostController');
const authenticate   = require('../middleware/authenticate');

// Public
router.get('/search',                     PostController.search.bind(PostController));
router.get('/',                            PostController.getAll.bind(PostController));
router.get('/:id',                         PostController.getById.bind(PostController));
router.get('/:id/comments',               PostController.getComments.bind(PostController));

// Protected
router.post('/',                           authenticate, PostController.create.bind(PostController));
router.put('/:id',                         authenticate, PostController.update.bind(PostController));
router.delete('/:id',                      authenticate, PostController.delete.bind(PostController));
router.post('/:id/comments',              authenticate, PostController.addComment.bind(PostController));
router.post('/:id/vote',                  authenticate, PostController.voteOnPost.bind(PostController));
router.patch('/:id/accept/:commentId',    authenticate, PostController.acceptAnswer.bind(PostController));

module.exports = router;
