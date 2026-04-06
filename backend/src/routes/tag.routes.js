// src/routes/tag.routes.js
const express  = require('express');
const router   = express.Router();
const prisma   = require('../config/db');

// GET /api/tags — list all tags with usage count
router.get('/', async (req, res, next) => {
  try {
    const tags = await prisma.tag.findMany({ orderBy: { usageCount: 'desc' }, take: 50 });
    res.json(tags);
  } catch (err) { next(err); }
});

module.exports = router;
