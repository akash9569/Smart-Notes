import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Minimize2, Maximize2, Sparkles, Bot, User, Loader2, ToggleLeft, ToggleRight } from 'lucide-react';
import { aiAPI } from '../api';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', content: "Hi there! 👋 I'm your AI assistant. How can I help you organize your thoughts today?" }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isDemoMode, setIsDemoMode] = useState(true);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            let aiResponseText = '';

            if (isDemoMode) {
                // Simulate network delay
                await new Promise(resolve => setTimeout(resolve, 1500));

                // Friendly demo responses
                const lowerInput = userMessage.content.toLowerCase();
                if (lowerInput.includes('hello') || lowerInput.includes('hi')) {
                    aiResponseText = "Hello! It's great to see you. Ready to get productive? 🚀";
                } else if (lowerInput.includes('help')) {
                    aiResponseText = "I'd love to help! You can ask me to summarize notes, fix spelling, or just brainstorm ideas. What's on your mind?";
                } else if (lowerInput.includes('name')) {
                    aiResponseText = "I'm your friendly Smart Notes Assistant! I don't have a personal name, but you can call me whatever you like. 😊";
                } else {
                    aiResponseText = "That's interesting! In this demo mode, I can simulate a conversation. In the real version, I'll use advanced AI to give you detailed answers. Try asking me to help with your notes!";
                }
            } else {
                // Real API call
                const response = await aiAPI.processContent({
                    type: 'chat',
                    content: userMessage.content,
                    context: messages // Pass history for context
                });

                if (response.data.success) {
                    aiResponseText = response.data.result;
                } else {
                    aiResponseText = "I'm having a little trouble connecting right now. Please try again later.";
                }
            }

            setMessages(prev => [...prev, { role: 'assistant', content: aiResponseText }]);

        } catch (error) {
            console.error('Chatbot Error:', error);
            let errorMessage = "Oops! Something went wrong.";
            if (error.response?.data?.error?.code === 'insufficient_quota' || error.response?.data?.error?.code === 'invalid_api_key' || !error.response) {
                setIsDemoMode(true);
                errorMessage = "I've switched to Demo Mode so we can keep chatting! (No API credits/key found)";
            }
            setMessages(prev => [...prev, { role: 'assistant', content: errorMessage, isError: true }]);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-50 group animate-in zoom-in"
            >
                <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
                <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    Chat with AI
                </span>
            </button>
        );
    }

    return (
        <div
            className={`fixed bottom-6 right-6 bg-white/80 dark:bg-[#191919]/90 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-2xl rounded-2xl overflow-hidden z-50 transition-all duration-300 flex flex-col ring-1 ring-black/5 ${isMinimized ? 'w-72 h-14' : 'w-80 sm:w-96 h-[500px] max-h-[80vh]'
                }`}
        >
            {/* Header */}
            <div
                className="px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-between cursor-pointer"
                onClick={() => !isMinimized && setIsMinimized(!isMinimized)}
            >
                <div className="flex items-center space-x-2 text-white">
                    <Bot className="w-5 h-5" />
                    <span className="font-medium">AI Assistant</span>
                </div>
                <div className="flex items-center space-x-2">
                    {!isMinimized && (
                        <button
                            onClick={(e) => { e.stopPropagation(); setIsDemoMode(!isDemoMode); }}
                            className="flex items-center space-x-1 px-2 py-0.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors text-white text-[10px] font-medium uppercase tracking-wider"
                            title="Toggle Demo Mode"
                        >
                            <span>Demo</span>
                            {isDemoMode ? <ToggleRight className="w-3 h-3" /> : <ToggleLeft className="w-3 h-3" />}
                        </button>
                    )}
                    <button
                        onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); }}
                        className="p-1 hover:bg-white/20 rounded-full text-white transition-colors"
                    >
                        {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
                        className="p-1 hover:bg-white/20 rounded-full text-white transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Messages Area */}
            {!isMinimized && (
                <>
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-gray-50/50 dark:bg-black/20">
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${msg.role === 'user'
                                        ? 'bg-blue-600 text-white rounded-br-none'
                                        : msg.isError
                                            ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 border border-red-100 dark:border-red-800 rounded-bl-none'
                                            : 'bg-white dark:bg-[#2d2d2d] text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-[#444] rounded-bl-none'
                                        }`}
                                >
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white dark:bg-[#2d2d2d] border border-gray-100 dark:border-[#444] rounded-2xl rounded-bl-none px-4 py-3 shadow-sm">
                                    <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-3 bg-white dark:bg-[#191919] border-t border-gray-100 dark:border-[#333]">
                        <form onSubmit={handleSend} className="relative flex items-center">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask me anything..."
                                disabled={isLoading}
                                className="w-full pl-4 pr-12 py-2.5 bg-gray-100 dark:bg-[#222] border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500/50 dark:text-white placeholder-gray-400 focus:outline-none transition-all"
                            />
                            <button
                                type="submit"
                                disabled={!input.trim() || isLoading}
                                className="absolute right-1.5 p-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </form>
                        {isDemoMode && (
                            <div className="text-[10px] text-center text-green-600 dark:text-green-400 mt-2 font-medium">
                                Demo Mode Active • Simulated Responses
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default Chatbot;
