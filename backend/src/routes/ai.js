import express from 'express';
import OpenAI from 'openai';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || '',
});

// Check if AI is enabled
const isAIEnabled = () => {
    return process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.length > 0;
};

// Fallback pattern-based summarization
const fallbackSummarize = (content) => {
    if (!content || content.trim().length < 50) {
        return "Note is too short to generate a meaningful summary. Add more content to get AI insights.";
    }

    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 20);
    const wordCount = content.split(/\s+/).length;

    if (sentences.length >= 3) {
        const firstSentence = sentences[0].trim();
        const lastSentence = sentences[sentences.length - 1].trim();

        return `This note contains ${wordCount} words across ${sentences.length} key points. It begins with: "${firstSentence.substring(0, 80)}..." Key takeaway: "${lastSentence.substring(0, 80)}..."`;
    } else {
        return `Brief note with ${wordCount} words. Main content: "${content.substring(0, 150)}..."`;
    }
};

// Fallback pattern-based task extraction
const fallbackExtractTasks = (content) => {
    const extractedTasks = [];

    const taskPatterns = [
        /(?:^|\n)[-*•]\s*(.+?)(?:\n|$)/g,
        /(?:^|\n)\d+\.\s*(.+?)(?:\n|$)/g,
        /(?:TODO|To-do|Task):\s*(.+?)(?:\n|$)/gi,
        /(?:Need to|Must|Should|Have to)\s+(.+?)(?:\.|$)/gi,
        /\[\s*\]\s*(.+?)(?:\n|$)/g,
    ];

    taskPatterns.forEach(pattern => {
        let match;
        while ((match = pattern.exec(content)) !== null) {
            const task = match[1].trim();
            if (task.length > 5 && task.length < 100 && !extractedTasks.includes(task)) {
                extractedTasks.push(task);
            }
        }
    });

    if (extractedTasks.length === 0) {
        return [
            "Review and organize the main points",
            "Add more details or examples",
            "Create action items based on this content"
        ];
    }

    return extractedTasks.slice(0, 5);
};

// @route   POST /api/ai/summarize
// @desc    Generate AI summary for note content
// @access  Private
router.post('/summarize', protect, async (req, res) => {
    try {
        const { content } = req.body;

        if (!content || content.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Content is required'
            });
        }

        // Use fallback if AI is not enabled
        if (!isAIEnabled()) {
            const summary = fallbackSummarize(content);
            return res.json({
                success: true,
                summary,
                source: 'pattern-matching'
            });
        }

        // Call OpenAI API
        const completion = await openai.chat.completions.create({
            model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'system',
                    content: 'You are a helpful assistant that summarizes notes concisely. Provide a brief, informative summary in 2-3 sentences.'
                },
                {
                    role: 'user',
                    content: `Summarize this note:\n\n${content}`
                }
            ],
            max_tokens: 150,
            temperature: 0.7,
        });

        const summary = completion.choices[0].message.content.trim();

        res.json({
            success: true,
            summary,
            source: 'openai',
            model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo'
        });

    } catch (error) {
        console.error('AI Summarization Error:', error);

        // Fallback to pattern matching on error
        const summary = fallbackSummarize(req.body.content);

        res.json({
            success: true,
            summary,
            source: 'pattern-matching',
            error: 'AI service unavailable, using fallback'
        });
    }
});

// @route   POST /api/ai/extract-tasks
// @desc    Extract tasks from note content using AI
// @access  Private
router.post('/extract-tasks', protect, async (req, res) => {
    try {
        const { content } = req.body;

        if (!content || content.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Content is required'
            });
        }

        // Use fallback if AI is not enabled
        if (!isAIEnabled()) {
            const tasks = fallbackExtractTasks(content);
            return res.json({
                success: true,
                tasks,
                source: 'pattern-matching'
            });
        }

        // Call OpenAI API
        const completion = await openai.chat.completions.create({
            model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'system',
                    content: 'You are a helpful assistant that extracts actionable tasks from notes. Return a JSON array of tasks (strings). Extract only clear, actionable items. Maximum 5 tasks.'
                },
                {
                    role: 'user',
                    content: `Extract actionable tasks from this note:\n\n${content}`
                }
            ],
            max_tokens: 200,
            temperature: 0.5,
        });

        let tasks = [];
        try {
            const responseText = completion.choices[0].message.content.trim();
            // Try to parse as JSON array
            tasks = JSON.parse(responseText);

            // Ensure it's an array
            if (!Array.isArray(tasks)) {
                tasks = [responseText];
            }
        } catch (parseError) {
            // If not valid JSON, split by newlines
            const responseText = completion.choices[0].message.content.trim();
            tasks = responseText
                .split('\n')
                .map(t => t.replace(/^[-*•\d.]\s*/, '').trim())
                .filter(t => t.length > 0)
                .slice(0, 5);
        }

        res.json({
            success: true,
            tasks: tasks.slice(0, 5),
            source: 'openai',
            model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo'
        });

    } catch (error) {
        console.error('AI Task Extraction Error:', error);

        // Fallback to pattern matching on error
        const tasks = fallbackExtractTasks(req.body.content);

        res.json({
            success: true,
            tasks,
            source: 'pattern-matching',
            error: 'AI service unavailable, using fallback'
        });
    }
});

export default router;
