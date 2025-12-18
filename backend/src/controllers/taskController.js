import Task from '../models/Task.js';
import User from '../models/User.js';
import { calculateStreak } from '../utils/streakUtils.js';

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private
export const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.user.id })
            .populate('noteId', 'title')
            .sort({ completed: 1, dueDate: 1, createdAt: -1 });

        res.status(200).json({ success: true, data: { tasks } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
export const createTask = async (req, res) => {
    try {
        console.log('Creating task with body:', req.body);
        const task = await Task.create({
            ...req.body,
            userId: req.user.id,
        });

        res.status(201).json({ success: true, data: { task } });
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
export const updateTask = async (req, res) => {
    try {
        let task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ success: false, message: 'Task not found' });
        }

        if (task.userId.toString() !== req.user.id) {
            return res.status(401).json({ success: false, message: 'Not authorized' });
        }

        task = await Task.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        }).populate('noteId', 'title');

        // Check for streak update
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const todaysTasks = await Task.find({
            userId: req.user.id,
            dueDate: {
                $gte: startOfDay,
                $lte: endOfDay
            }
        });

        if (todaysTasks.length > 0) {
            const user = await User.findById(req.user.id);
            const { user: updatedUser, updated } = calculateStreak(user, task, todaysTasks);

            if (updated) {
                await updatedUser.save();
                return res.status(200).json({ success: true, data: { task, user: updatedUser } });
            }
        }

        res.status(200).json({ success: true, data: { task } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
export const deleteTask = async (req, res) => {
    try {
        console.log('Attempting to delete task with ID:', req.params.id);
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ success: false, message: 'Task not found' });
        }

        if (task.userId.toString() !== req.user.id) {
            return res.status(401).json({ success: false, message: 'Not authorized' });
        }

        await task.deleteOne();

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
