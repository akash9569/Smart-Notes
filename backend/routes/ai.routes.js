const express = require('express');
const router = express.Router();
const { summarizeNote, extractTasks, processChat } = require('../controllers/ai.controller');
const auth = require('../middleware/auth');

// @route   POST /api/ai/summarize
// @desc    Generate AI summary for note content
// @access  Private
router.post('/summarize', auth, summarizeNote);

// @route   POST /api/ai/extract-tasks
// @desc    Extract tasks from note content using AI
// @access  Private
router.post('/extract-tasks', auth, extractTasks);

// @route   POST /api/ai/process
// @desc    Process general chat from the AI assistant
// @access  Private
router.post('/process', auth, processChat);

module.exports = router;
