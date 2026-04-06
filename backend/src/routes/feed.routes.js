// src/routes/feed.routes.js
const express         = require('express');
const router          = express.Router();
const FeedController  = require('../controllers/FeedController');

router.get('/', FeedController.getFeed.bind(FeedController));

module.exports = router;
