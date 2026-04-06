// src/routes/comment.routes.js
const express           = require('express');
const router            = express.Router();
const CommentController = require('../controllers/CommentController');
const authenticate      = require('../middleware/authenticate');

router.delete('/:id',       authenticate, CommentController.deleteComment.bind(CommentController));
router.post('/:id/vote',    authenticate, CommentController.voteOnComment.bind(CommentController));

module.exports = router;
