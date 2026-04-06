// src/routes/community.routes.js
const express             = require('express');
const router              = express.Router();
const CommunityController = require('../controllers/CommunityController');
const authenticate        = require('../middleware/authenticate');
const authorize           = require('../middleware/authorize');

router.get('/',                 CommunityController.getAll.bind(CommunityController));
router.get('/:id',              CommunityController.getById.bind(CommunityController));
router.get('/:id/posts',        CommunityController.getPosts.bind(CommunityController));
router.post('/',                authenticate, CommunityController.create.bind(CommunityController));
router.post('/:id/join',        authenticate, CommunityController.join.bind(CommunityController));
router.delete('/:id/leave',     authenticate, CommunityController.leave.bind(CommunityController));
router.delete('/:id',           authenticate, authorize('ADMIN'), CommunityController.delete.bind(CommunityController));

module.exports = router;
