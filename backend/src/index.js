import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';

dotenv.config();

// Route imports
import authRoutes from './routes/auth.js';
import noteRoutes from './routes/notes.js';
import notebookRoutes from './routes/notebooks.js';
import tagRoutes from './routes/tags.js';
import taskRoutes from './routes/tasks.js';
import aiRoutes from './routes/ai.js';
import templateRoutes from './routes/templates.js';
import expenseRoutes from './routes/expenseRoutes.js';
import loanRoutes from './routes/loanRoutes.js';
import habitRoutes from './routes/habitRoutes.js';
import stickyNoteRoutes from './routes/stickyNotes.js';
import galleryRoutes from './routes/gallery.js';
import scheduleReminders from './services/reminderService.js';
import connectCloudinary from './config/cloudinary.js';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// Connect to Cloudinary
connectCloudinary();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});
app.use(cors({
    origin: 'http://localhost:5173', // Fixed to match frontend port
    credentials: true,
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/notebooks', notebookRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/tags', tagRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api/habits', habitRoutes);
app.use('/api/sticky-notes', stickyNoteRoutes);
app.use('/api/gallery', galleryRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: err.message || 'Server Error',
    });
});

// Database connection
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

// Start server
const PORT = process.env.PORT || 5001;

connectDB().then(() => {
    // Start the scheduler
    scheduleReminders();

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});
