import { addDays, addWeeks, addMonths, addYears, startOfDay, endOfDay, format } from 'date-fns';

export const expandRecurringTasks = (tasks, startRange, endRange) => {
    const expanded = [];

    // Ensure ranges are Date objects
    const start = new Date(startRange);
    const end = new Date(endRange);

    tasks.forEach(task => {
        const taskStart = new Date(task.startDate || task.dueDate || task.createdAt);

        // If invalid date, skip
        if (isNaN(taskStart.getTime())) return;

        // Non-recurring tasks
        if (!task.recurrence || task.recurrence.type === 'none' || !task.recurrence.type) {
            // Check if it falls within range
            // For tasks with duration, check overlap. For point tasks, check if point is in range.
            const taskEnd = task.endDate ? new Date(task.endDate) : taskStart;

            if (taskStart <= end && taskEnd >= start) {
                expanded.push(task);
            }
            return;
        }

        // Recurring tasks
        let current = new Date(taskStart);
        const recurrenceEnd = task.recurrence.endDate ? new Date(task.recurrence.endDate) : end;
        const actualEnd = recurrenceEnd < end ? recurrenceEnd : end;

        // Calculate duration to maintain it for instances
        const duration = task.endDate ? (new Date(task.endDate).getTime() - taskStart.getTime()) : (60 * 60 * 1000); // Default 1h if no end date

        // Get applicable months filter (if any)
        const applicableMonths = task.recurrence.applicableMonths;
        const hasMonthFilter = applicableMonths && applicableMonths.length > 0;

        // Safety break counter
        let count = 0;
        while (current <= actualEnd && count < 1000) {
            const instanceStart = new Date(current);
            const instanceEnd = new Date(current.getTime() + duration);

            // Check if this instance's month is in the applicable months
            const instanceMonth = instanceStart.getMonth() + 1; // getMonth() is 0-indexed
            const monthIsApplicable = !hasMonthFilter || applicableMonths.includes(instanceMonth);

            // Check overlap with view range AND month filter
            if (instanceStart <= end && instanceEnd >= start && monthIsApplicable) {
                // Check if this specific instance date is completed
                const dateKey = format(instanceStart, 'yyyy-MM-dd');
                const isInstanceCompleted = task.completedDates?.includes(dateKey) || false;

                expanded.push({
                    ...task,
                    _id: `${task._id}_${instanceStart.getTime()}`, // Unique ID for instance
                    startDate: task.startDate ? instanceStart : undefined,
                    dueDate: task.dueDate ? instanceStart : undefined,
                    endDate: task.endDate ? instanceEnd : undefined,
                    isRecurringInstance: true,
                    originalTaskId: task._id,
                    completed: isInstanceCompleted // Override master completed status
                });
            }

            // Advance
            if (task.recurrence.type === 'daily') {
                current = addDays(current, 1);
            } else if (task.recurrence.type === 'weekly') {
                current = addWeeks(current, 1);
            } else if (task.recurrence.type === 'monthly') {
                current = addMonths(current, 1);
            } else if (task.recurrence.type === 'yearly') {
                current = addYears(current, 1);
            } else {
                break;
            }
            count++;
        }
    });

    return expanded;
};
