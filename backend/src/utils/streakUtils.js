export const calculateStreak = (user, completedTask, allDailyTasks) => {
    const today = new Date();
    const lastStreakDate = user.lastStreakDate ? new Date(user.lastStreakDate) : null;
    const isStreakUpdatedToday = lastStreakDate && lastStreakDate.toDateString() === today.toDateString();

    // Check if all tasks are completed
    const allCompletedNow = allDailyTasks.every(t =>
        String(t._id) === String(completedTask._id) ? completedTask.completed : t.completed
    );

    if (completedTask.completed) {
        if (allCompletedNow) {
            if (isStreakUpdatedToday) {
                return { user, updated: false };
            }

            if (lastStreakDate) {
                const yesterday = new Date(today);
                yesterday.setDate(yesterday.getDate() - 1);

                if (lastStreakDate.toDateString() === yesterday.toDateString()) {
                    // Consecutive day
                    user.streak = (user.streak || 0) + 1;
                } else {
                    // Broken streak
                    user.streak = 1;
                }
            } else {
                // First streak
                user.streak = 1;
            }

            user.lastStreakDate = new Date();

            // Update highest streak
            if (user.streak > (user.highestStreak || 0)) {
                user.highestStreak = user.streak;
            }

            return { user, updated: true };
        }
    } else {
        // Task unchecked
        if (!allCompletedNow && isStreakUpdatedToday) {
            user.streak = Math.max(0, (user.streak || 0) - 1);

            // Reset lastStreakDate to yesterday
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            user.lastStreakDate = yesterday;

            return { user, updated: true };
        }
    }

    return { user, updated: false };
};
