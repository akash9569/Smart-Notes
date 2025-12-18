const express = require('express');
const router = express.Router();
const { summarizeNote, extractTasks } = require('../controllers/ai.controller');
const auth = require('../middleware/auth');

// @route   POST /api/ai/summarize
// @desc    Generate AI summary for note content
// @access  Private
router.post('/summarize', auth, summarizeNote);

// @route   POST /api/ai/extract-tasks
// @desc    Extract tasks from note content using AI
// @access  Private
router.post('/extract-tasks', auth, extractTasks);

module.exports = router;
