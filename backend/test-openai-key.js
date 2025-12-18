import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const testOpenAI = async () => {
    console.log('Testing OpenAI API Key...');
    console.log('Key length:', process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.length : 'MISSING');

    if (!process.env.OPENAI_API_KEY) {
        console.error('ERROR: OPENAI_API_KEY is missing in .env');
        return;
    }

    try {
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });

        const completion = await openai.chat.completions.create({
            messages: [{ role: 'user', content: 'Say "Hello World"' }],
            model: 'gpt-3.5-turbo',
        });

        console.log('Success! Response:', completion.choices[0].message.content);
    } catch (error) {
        console.error('OpenAI API Error:', error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        }
    }
};

testOpenAI();
