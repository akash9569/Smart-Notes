import OpenAI from 'openai';



export const processContent = async (req, res) => {
    try {
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });

        const { type, content, context } = req.body;

        if (!content && type !== 'custom' && type !== 'chat') {
            return res.status(400).json({ success: false, message: 'Content is required' });
        }

        let prompt = '';
        let systemRole = 'You are a helpful AI writing assistant.';

        switch (type) {
            case 'summarize':
                systemRole = 'You are a precise summarizer.';
                prompt = `Summarize the following text concisely:\n\n${content}`;
                break;
            case 'fix-spelling':
                systemRole = 'You are a proofreader.';
                prompt = `Fix the spelling and grammar of the following text. Return ONLY the corrected text, no explanations:\n\n${content}`;
                break;
            case 'translate':
                systemRole = 'You are a translator.';
                prompt = `Translate the following text to Spanish (or the most appropriate language based on context). Return ONLY the translated text:\n\n${content}`;
                break;
            case 'continue':
                prompt = `Continue writing the following text naturally:\n\n${content}`;
                break;
            case 'custom':
                systemRole = 'You are a helpful AI assistant.';
                prompt = content ? `${req.body.prompt}:\n\n${content}` : req.body.prompt;
                break;
            case 'chat':
                systemRole = 'You are a friendly, helpful, and enthusiastic AI assistant for the Smart Notes app. You love helping users organize their thoughts, brainstorm ideas, and be productive. Keep your responses concise and encouraging.';
                // For chat, we rely on the messages array passed in context, but we also need to handle the current content
                // If context (messages) is provided, we'll use that structure below instead of just system/user prompt
                break;
            default:
                return res.status(400).json({ success: false, message: 'Invalid operation type' });
        }

        let messages = [
            { role: 'system', content: systemRole }
        ];

        if (type === 'chat' && context && Array.isArray(context)) {
            // Filter out any client-side specific fields like isError and map to OpenAI format
            const history = context.map(msg => ({
                role: msg.role,
                content: msg.content
            }));
            messages = [...messages, ...history];
            // The current user message is already added to 'messages' in the frontend before sending context, 
            // OR we can append 'content' here if it's not in context. 
            // Let's assume frontend sends full history including latest message.
            // Actually, looking at Chatbot.jsx: setMessages(prev => [...prev, userMessage]); then calls API with content=userMessage.content and context=messages (including userMessage).
            // So 'context' has everything.
        } else {
            messages.push({ role: 'user', content: prompt });
        }

        const completion = await openai.chat.completions.create({
            messages: messages,
            model: 'gpt-3.5-turbo',
        });

        const result = completion.choices[0].message.content.trim();

        res.status(200).json({
            success: true,
            result,
        });

    } catch (error) {
        console.error('AI Processing Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to process AI request',
            error: error.message
        });
    }
};
