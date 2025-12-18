import axios from 'axios';

const API_URL = '/api/ai';

// Summarize note content using AI
export const summarizeNote = async (content) => {
    try {
        const response = await axios.post(`${API_URL}/summarize`, { content });
        return response.data;
    } catch (error) {
        console.error('AI Summarization Error:', error);
        throw error;
    }
};

// Extract tasks from note content using AI
export const extractTasks = async (content) => {
    try {
        const response = await axios.post(`${API_URL}/extract-tasks`, { content });
        return response.data;
    } catch (error) {
        console.error('AI Task Extraction Error:', error);
        throw error;
    }
};
