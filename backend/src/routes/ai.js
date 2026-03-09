import express from 'express';
import Groq from 'groq-sdk';
import { protect } from '../middleware/auth.js';
import Note from '../models/Note.js';
import Task from '../models/Task.js';
import Expense from '../models/Expense.js';
import Habit from '../models/Habit.js';

const router = express.Router();

// Check if AI is enabled
const isAIEnabled = () => {
    return process.env.GROQ_API_KEY && process.env.GROQ_API_KEY.length > 0;
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

// Fallback pattern-based chat
const fallbackChat = (content, context) => {
    const lowerContent = content.toLowerCase();

    // Greetings
    if (lowerContent.includes('hello') || lowerContent.includes('hi') || lowerContent.includes('hey')) {
        return "👋 Hello there! I'm your friendly Smart Notes AI Assistant. How can I help you organize your thoughts today? (Note: I'm running in offline fallback mode right now, but I still love to chat!)";
    }

    // Help / capabilities
    if (lowerContent.includes('help') || lowerContent.includes('what can you do')) {
        return "I'm here to help you be as productive as possible! 🚀 Try asking me to:\n- Summarize your notes\n- Extract action items\n- Format your writing\n\n*(Connect a valid OpenAI API Key in your backend .env file to unlock my full brain power!)*";
    }

    // Identity
    if (lowerContent.includes('who are you') || lowerContent.includes('name')) {
        return "I am the Smart Notes Assistant! 🤖 Think of me as your personal productivity companion. I'm always happy to help you manage your workspace.";
    }

    // Default fallback
    return "That's super interesting! 😊 I'm currently running in 'Offline Fallback Mode' because there is an issue with the Groq API connection or credentials. My AI skills are temporarily limited until the connection is restored, but I'll do my absolute best to help point you in the right direction! 📝";
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

        // Initialize Groq model
        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

        // Call Groq API
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: "You are a helpful assistant that summarizes notes concisely. Provide a brief, informative summary in 2-3 sentences." },
                { role: "user", content: `Summarize this note:\n\n${content}` }
            ],
            model: "llama-3.1-8b-instant",
        });

        const summary = chatCompletion.choices[0]?.message?.content?.trim() || "Summary not generated.";

        res.json({
            success: true,
            summary,
            source: 'groq',
            model: 'llama-3.1-8b-instant'
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

        // Initialize Groq model
        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

        // Call Groq API
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: "You are a helpful assistant that extracts actionable tasks from notes. Return a JSON array of tasks (strings). Extract only clear, actionable items. Maximum 5 tasks. Do not wrap the JSON in Markdown formatting ticks, just output raw JSON." },
                { role: "user", content: `Extract actionable tasks from this note. Please format purely as a JSON array of strings:\n\n${content}` }
            ],
            model: "llama-3.1-8b-instant",
        });

        const responseText = chatCompletion.choices[0]?.message?.content?.trim() || "[]";

        let tasks = [];
        try {
            // Try to parse as JSON array (strip markdown blocks if Groq added them)
            const cleanedText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
            tasks = JSON.parse(cleanedText);

            // Ensure it's an array
            if (!Array.isArray(tasks)) {
                tasks = [cleanedText];
            }
        } catch (parseError) {
            // If not valid JSON, split by newlines
            tasks = responseText
                .split('\n')
                .map(t => t.replace(/^[-*•\d.]\s*/, '').trim())
                .filter(t => t.length > 0)
                .slice(0, 5);
        }

        res.json({
            success: true,
            tasks: tasks.slice(0, 5),
            source: 'groq',
            model: 'llama-3.1-8b-instant'
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

// @route   POST /api/ai/process
// @desc    Process general chat from the AI assistant
// @access  Private
router.post('/process', protect, async (req, res) => {
    try {
        const { content, context } = req.body;

        if (!content || content.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Content is required'
            });
        }

        if (!isAIEnabled()) {
            return res.json({
                success: true,
                result: fallbackChat(content, context),
                source: 'fallback-matching',
                error: 'AI is not enabled. Missing API key.'
            });
        }

        // Fetch User Data for Context Injection
        let userDataContext = "";
        try {
            const userId = req.user.id;

            // Fetch recent Notes (Top 50)
            const notes = await Note.find({ user: userId })
                .sort({ updatedAt: -1 })
                .limit(50)
                .select('title content tags isPinned updatedAt createdAt');

            // Fetch upcoming/recent Tasks (Top 50)
            const tasks = await Task.find({ user: userId })
                .sort({ createdAt: -1 })
                .limit(50)
                .select('title description status priority dueDate category isCompleted createdAt');

            // Fetch recent Expenses (Top 50)
            const expenses = await Expense.find({ user: userId })
                .sort({ date: -1 })
                .limit(50)
                .select('amount category description date type');

            // Fetch active Habits (Top 50)
            const habits = await Habit.find({ user: userId })
                .sort({ createdAt: -1 })
                .limit(50)
                .select('name description frequency currentStreak category');

            // Format data into a readable string for the AI
            userDataContext = `
=== USER'S CURRENT WORKSPACE DATA ===
This is live data from the user's account. Use this context to answer their questions accurately.

**RECENT NOTES**:
${notes.length ? notes.map(n => `- Title: "${n.title}" (Pinned: ${n.isPinned}, Tags: ${n.tags.join(', ')}) | Created: ${new Date(n.createdAt).toLocaleDateString()} | Updated: ${new Date(n.updatedAt).toLocaleDateString()}\n  Summary snippet: ${n.content.substring(0, 150).replace(/\n/g, ' ')}...`).join('\n') : "No notes found."}

**UPCOMING/RECENT TASKS**:
${tasks.length ? tasks.map(t => `- Task: "${t.title}" | Status: ${t.status} | Priority: ${t.priority} | Due: ${t.dueDate ? new Date(t.dueDate).toLocaleDateString() : 'None'} | Category: ${t.category} | Created: ${new Date(t.createdAt).toLocaleDateString()}`).join('\n') : "No tasks found."}

**RECENT EXPENSES/INCOME**:
${expenses.length ? expenses.map(e => `- ${e.type === 'expense' ? 'Spent' : 'Earned'} ₹${e.amount} on ${e.category} (${e.description || 'No description'}) on ${new Date(e.date).toLocaleDateString()}`).join('\n') : "No expenses found."}

**ACTIVE HABITS**:
${habits.length ? habits.map(h => `- Habit: "${h.name}" | Frequency: ${h.frequency} | Current Streak: ${h.currentStreak} days`).join('\n') : "No habits found."}
=== END OF WORKSPACE DATA ===
`;
        } catch (dbError) {
            console.error("Failed to fetch user data for AI context:", dbError);
            userDataContext = "\n(Note: Failed to load user's live workspace data at the moment.)\n";
        }

        // Map history to OpenAI/Groq format
        let messages = [];

        messages.push({
            role: "system",
            content: `You are a highly capable and intelligent AI assistant built exclusively for "Smart Notes".
Your PRIMARY objective is to answer questions using the user's actual live database records provided below.

CRITICAL RULES:
1. ALWAYS reference the provided WORKSPACE DATA first before relying on general knowledge.
2. If the user asks about their notes, tasks, expenses, or habits, SEARCH the workspace data carefully and answer factually based ONLY on what is written there.
3. Be friendly, polite, and conversational.
4. Format your responses with bullet points, bolding, and clean Markdown layout to make it readable.
5. If the workspace data does not contain the answer to a specific personal question, state clearly that you cannot find it in their current notes/tasks.

=== USER'S LIVE WORKSPACE DATA ===
${userDataContext}
=== END OF WORKSPACE DATA ===`
        });

        if (context && Array.isArray(context)) {
            // Take the last 10 messages for context so we don't blow up the context window
            const recentContext = context.slice(-10);
            recentContext.forEach(msg => {
                if (msg.role && msg.content && !msg.isError) {
                    messages.push({
                        role: msg.role === 'assistant' ? 'assistant' : 'user',
                        content: msg.content
                    });
                }
            });
        }

        // Add the new message
        messages.push({ role: 'user', content: content });

        // Initialize Groq model
        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

        // Call Groq completion API
        const chatCompletion = await groq.chat.completions.create({
            messages,
            model: "llama-3.1-8b-instant",
            temperature: 0.7,
        });

        const finalResult = chatCompletion.choices[0]?.message?.content?.trim() || "No response generated.";

        res.json({
            success: true,
            result: finalResult,
            source: 'groq'
        });

    } catch (error) {
        console.error('AI Chat Error:', error);

        // Use friendly fallback if OpenAI fails (due to invalid key, quota, etc.)
        const fallbackResponse = fallbackChat(req.body.content, req.body.context);

        res.json({
            success: true,
            result: fallbackResponse,
            source: 'fallback-matching',
            error: 'AI service unavailable, using fallback'
        });
    }
});

export default router;
