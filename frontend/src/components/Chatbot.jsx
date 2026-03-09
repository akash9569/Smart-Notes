import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Minimize2, Maximize2, Sparkles, Bot, User, Loader2, ToggleLeft, ToggleRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { aiAPI } from '../api';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', content: "Hi there! 👋 I'm your AI assistant. How can I help you organize your thoughts today?" }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
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

            setMessages(prev => [...prev, { role: 'assistant', content: aiResponseText }]);

        } catch (error) {
            console.error('Chatbot Error:', error);
            let errorMessage = "Oops! I encountered an error. Please try again later.";

            // If backend returned a specific error message
            if (error.response && error.response.data) {
                const backendErrorMsg = error.response.data.error || error.response.data.message;
                if (backendErrorMsg) {
                    errorMessage = backendErrorMsg;
                }
            } else if (!error.response) {
                errorMessage = "Network error! Please check your connection.";
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
                                    {msg.role === 'user' ? (
                                        msg.content
                                    ) : (
                                        <div className="prose prose-sm dark:prose-invert max-w-none text-[15px] leading-relaxed break-words">
                                            <ReactMarkdown
                                                components={{
                                                    p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                                                    ul: ({ node, ...props }) => <ul className="list-disc pl-5 mb-2 space-y-1" {...props} />,
                                                    ol: ({ node, ...props }) => <ol className="list-decimal pl-5 mb-2 space-y-1" {...props} />,
                                                    li: ({ node, ...props }) => <li className="marker:text-blue-500" {...props} />,
                                                    strong: ({ node, ...props }) => <strong className="font-semibold text-gray-900 dark:text-gray-100" {...props} />
                                                }}
                                            >
                                                {msg.content}
                                            </ReactMarkdown>
                                        </div>
                                    )}
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
                    </div>
                </>
            )}
        </div>
    );
};

export default Chatbot;
