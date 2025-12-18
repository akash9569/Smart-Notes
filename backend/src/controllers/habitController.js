import Habit from '../models/Habit.js';

// Get all habits for a user
export const getHabits = async (req, res) => {
    try {
        const habits = await Habit.find({ userId: req.user.id, isArchived: false }).sort({ reminder: 1, createdAt: -1 });
        res.json(habits);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new habit
export const createHabit = async (req, res) => {
    try {
        const { name, category, frequency, days, reminder, color, startDate } = req.body;

        const habit = new Habit({
            userId: req.user.id,
            name,
            category,
            frequency,
            days,
            reminder,
            color,
            startDate: startDate || new Date(),
        });

        const savedHabit = await habit.save();
        res.status(201).json(savedHabit);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update a habit
export const updateHabit = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const habit = await Habit.findOneAndUpdate(
            { _id: id, userId: req.user.id },
            updates,
            { new: true }
        );

        if (!habit) {
            return res.status(404).json({ message: 'Habit not found' });
        }

        res.json(habit);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a habit (archive it)
export const deleteHabit = async (req, res) => {
    try {
        const { id } = req.params;

        const habit = await Habit.findOneAndUpdate(
            { _id: id, userId: req.user.id },
            { isArchived: true },
            { new: true }
        );

        if (!habit) {
            return res.status(404).json({ message: 'Habit not found' });
        }

        res.json({ message: 'Habit deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Toggle habit completion for a specific date
export const toggleHabitCompletion = async (req, res) => {
    try {
        const { id } = req.params;
        const { date } = req.body; // Expecting ISO date string

        if (!date) {
            return res.status(400).json({ message: 'Date is required' });
        }

        const habit = await Habit.findOne({ _id: id, userId: req.user.id });

        if (!habit) {
            return res.status(404).json({ message: 'Habit not found' });
        }

        const targetDate = new Date(date);
        targetDate.setHours(0, 0, 0, 0);

        const dateIndex = habit.completedDates.findIndex(
            (d) => new Date(d).getTime() === targetDate.getTime()
        );

        if (dateIndex > -1) {
            // If already completed, remove it (toggle off)
            habit.completedDates.splice(dateIndex, 1);
        } else {
            // If not completed, add it (toggle on)
            habit.completedDates.push(targetDate);
        }

        // Recalculate streak
        // Sort dates descending
        const sortedDates = [...habit.completedDates].sort((a, b) => new Date(b) - new Date(a));

        let currentStreak = 0;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Check if completed today or yesterday to maintain streak
        let lastDate = sortedDates.length > 0 ? new Date(sortedDates[0]) : null;

        if (lastDate) {
            const diffTime = Math.abs(today - lastDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            // If last completion was today or yesterday, streak is active
            if (diffDays <= 1) {
                currentStreak = 1;
                for (let i = 0; i < sortedDates.length - 1; i++) {
                    const curr = new Date(sortedDates[i]);
                    const next = new Date(sortedDates[i + 1]);

                    const dTime = Math.abs(curr - next);
                    const dDays = Math.ceil(dTime / (1000 * 60 * 60 * 24));

                    if (dDays === 1) {
                        currentStreak++;
                    } else {
                        break;
                    }
                }
            }
        }

        habit.streak = currentStreak;
        if (currentStreak > habit.longestStreak) {
            habit.longestStreak = currentStreak;
        }

        await habit.save();
        res.json(habit);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
