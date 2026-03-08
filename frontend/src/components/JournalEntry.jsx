import React, { useState, useEffect } from 'react';
import {
    Smile,
    Meh,
    Frown,
    Sun,
    Cloud,
    Moon,
    Coffee,
    Heart,
    Star,
    Sparkles,
    CheckCircle2,
    PenLine,
    Lightbulb,
    Quote
} from 'lucide-react';
import RichTextEditor from './RichTextEditor';

const MOODS = [
    { value: 'great', emoji: '😄', label: 'Great', score: 5, color: 'text-green-500 bg-green-50' },
    { value: 'good', emoji: '😊', label: 'Good', score: 4, color: 'text-blue-500 bg-blue-50' },
    { value: 'okay', emoji: '😐', label: 'Okay', score: 3, color: 'text-yellow-500 bg-yellow-50' },
    { value: 'tough', emoji: '😔', label: 'Tough', score: 2, color: 'text-orange-500 bg-orange-50' },
    { value: 'bad', emoji: '😫', label: 'Bad', score: 1, color: 'text-red-500 bg-red-50' },
];

const GRATITUDE_PROMPTS = [
    "Today I am grateful for...",
    "One small moment that made me smile...",
    "Something I often take for granted...",
    "A person who helped me today...",
    "One thing my body/mind did well today...",
    "A challenge I overcame today...",
    "Something beautiful I saw today..."
];

const JournalEntry = ({ note, onUpdate, isSaving }) => {
    const [mood, setMood] = useState(note.mood?.value || null);
    const [gratitude, setGratitude] = useState(note.gratitude || [{ text: '', id: Date.now().toString() }]);
    const [dailyHighlight, setDailyHighlight] = useState(note.dailyHighlight || '');
    const [intention, setIntention] = useState(note.intention || '');
    const [content, setContent] = useState(note.content || '');
    const [activePrompt, setActivePrompt] = useState(GRATITUDE_PROMPTS[0]);

    // Initialize prompt rotation on mount
    useEffect(() => {
        // Simple rotation based on day of year to keep it consistent for the day
        const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
        setActivePrompt(GRATITUDE_PROMPTS[dayOfYear % GRATITUDE_PROMPTS.length]);
    }, []);

    // Sync with prop updates
    useEffect(() => {
        if (note) {
            if (note.mood?.value !== mood) setMood(note.mood?.value || null);
            if (JSON.stringify(note.gratitude) !== JSON.stringify(gratitude) && note.gratitude?.length > 0) {
                setGratitude(note.gratitude);
            }
            if (note.dailyHighlight !== dailyHighlight) setDailyHighlight(note.dailyHighlight || '');
            if (note.intention !== intention) setIntention(note.intention || '');
            // Content sync is handled by Editor, but we track it for local changes if needed
        }
    }, [note]);

    // Auto-save wrapper
    const handleUpdate = (field, value) => {
        const updates = {};
        if (field === 'mood') {
            const moodObj = MOODS.find(m => m.value === value);
            updates.mood = { value, label: moodObj.label, score: moodObj.score };
            setMood(value);
        }
        if (field === 'gratitude') {
            updates.gratitude = value;
            setGratitude(value);
        }
        if (field === 'dailyHighlight') {
            updates.dailyHighlight = value;
            setDailyHighlight(value);
        }
        if (field === 'intention') {
            updates.intention = value;
            setIntention(value);
        }

        onUpdate(updates);
    };

    const handleGratitudeChange = (index, text) => {
        const newGratitude = [...gratitude];
        newGratitude[index] = { ...newGratitude[index], text };
        handleUpdate('gratitude', newGratitude);

        // Auto-add new line if typing in last line and it's not empty
        if (index === gratitude.length - 1 && text.length > 0 && gratitude.length < 5) {
            setGratitude([...newGratitude, { text: '', id: Date.now().toString() }]);
        }
    };

    return (
        <div className="flex-1 flex flex-col bg-white dark:bg-[#1a1a1a] overflow-hidden">
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="max-w-6xl mx-auto px-6 lg:px-12 py-8 space-y-8">

                    {/* Header - Daily Check-in */}
                    <section className="bg-white dark:bg-[#1e1e1e] p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-[#2a2a2a]">
                        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-6 flex items-center gap-2">
                            <Sun className="w-6 h-6 text-orange-400" />
                            Daily Check-in
                        </h3>

                        <div className="space-y-6">
                            {/* Mood Selector */}
                            <div>
                                <label className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 block">
                                    How are you feeling today?
                                </label>
                                <div className="flex justify-between sm:justify-start sm:gap-4">
                                    {MOODS.map((m) => (
                                        <button
                                            key={m.value}
                                            onClick={() => handleUpdate('mood', m.value)}
                                            className={`group flex flex-col items-center p-3 rounded-xl transition-all duration-200 ${mood === m.value
                                                ? `${m.color} ring-2 ring-offset-2 ring-blue-500 dark:ring-offset-[#1e1e1e] scale-105`
                                                : 'hover:bg-gray-50 dark:hover:bg-[#2d2d2d] grayscale hover:grayscale-0 opacity-70 hover:opacity-100'
                                                }`}
                                        >
                                            <span className="text-3xl mb-1 transform group-hover:scale-110 transition-transform duration-200">{m.emoji}</span>
                                            <span className="text-xs font-medium">{m.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Intention Setting */}
                            <div>
                                <label className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 block flex items-center gap-1">
                                    <Sparkles className="w-4 h-4 text-purple-400" />
                                    Today's Intention
                                </label>
                                <input
                                    type="text"
                                    value={intention}
                                    onChange={(e) => handleUpdate('intention', e.target.value)}
                                    placeholder="What is your main focus or mindset for today?"
                                    className="w-full bg-transparent border-b border-gray-200 dark:border-gray-700 py-2 text-gray-800 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Gratitude Journal */}
                    <section className="bg-white dark:bg-[#1e1e1e] p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-[#2a2a2a] relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5">
                            <Heart className="w-32 h-32" />
                        </div>

                        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2 flex items-center gap-2">
                            <Heart className="w-6 h-6 text-red-400 fill-current" />
                            Gratitude
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 italic">
                            "{activePrompt}"
                        </p>

                        <div className="space-y-3">
                            {gratitude.map((item, index) => (
                                <div key={item.id} className="flex items-center gap-3 group">
                                    <div className={`w-1.5 h-1.5 rounded-full ${item.text ? 'bg-red-400' : 'bg-gray-300 dark:bg-gray-600'} transition-colors`} />
                                    <input
                                        type="text"
                                        value={item.text}
                                        onChange={(e) => handleGratitudeChange(index, e.target.value)}
                                        placeholder={`I am grateful for...`}
                                        className="w-full bg-transparent border-none py-1 text-gray-700 dark:text-gray-300 placeholder-gray-300 dark:placeholder-gray-600 focus:outline-none focus:ring-0"
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-50 dark:border-[#2d2d2d]">
                            <p className="text-xs text-center text-gray-400 flex items-center justify-center gap-1">
                                <Lightbulb className="w-3 h-3" />
                                Tip: Be specific. Small things often matter the most.
                            </p>
                        </div>
                    </section>

                    {/* Daily Highlight */}
                    <section className="bg-white dark:bg-[#1e1e1e] p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-[#2a2a2a]">
                        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-6 flex items-center gap-2">
                            <Star className="w-6 h-6 text-yellow-400" />
                            Highlight of the Day
                        </h3>
                        <textarea
                            value={dailyHighlight}
                            onChange={(e) => handleUpdate('dailyHighlight', e.target.value)}
                            placeholder="What was the best part of your day?"
                            className="w-full bg-yellow-50/50 dark:bg-yellow-900/10 rounded-xl p-4 border-none text-gray-800 dark:text-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-yellow-400/50 resize-none"
                            rows={3}
                        />
                    </section>

                    {/* Deep Reflection - Rich Text */}
                    <section className="bg-white dark:bg-[#1e1e1e] p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-[#2a2a2a] min-h-[500px] flex flex-col mb-12">
                        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                            <PenLine className="w-6 h-6 text-indigo-400" />
                            Daily Reflection
                        </h3>
                        <div className="flex-1 -mx-8 -mb-8">
                            <RichTextEditor
                                content={note.content}
                                onChange={(newContent) => onUpdate({ content: newContent })}
                                isSaving={isSaving}
                                placeholder="Write your thoughts freely..."
                                isZenMode={false}
                            />
                        </div>
                    </section>

                </div>
            </div>
        </div>
    );
};

export default JournalEntry;
