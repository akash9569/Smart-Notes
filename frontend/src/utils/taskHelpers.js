import { format } from 'date-fns';
import { tasksAPI } from '../api';

/**
 * Toggles the completion status of a task or a specific instance of a recurring task.
 * 
 * @param {Object} task - The task object to toggle. Must handle both raw task objects and expanded instances.
 * @param {Array} allTasks - The list of all raw tasks (needed to find the original task for instances).
 * @returns {Promise<Object>} - The result of the API call.
 */
export const toggleTaskCompletion = async (task, allTasks) => {
    // Check if it's a recurring task
    // expanded instances usually have isRecurringInstance: true
    // raw tasks might have recurrence object

    // Find the original task ID
    const originalTaskId = task.originalTaskId || task._id;

    // Find the original raw task to get the latest completedDates
    const originalTask = allTasks.find(t => t._id === originalTaskId) || task;

    const isRecurring = originalTask.recurrence && originalTask.recurrence.type && originalTask.recurrence.type !== 'none';

    if (isRecurring) {
        // For recurring tasks, we operate on completedDates array
        // We need the date key for this specific instance
        const taskDate = new Date(task.startDate || task.dueDate || task.createdAt);
        const dateKey = format(taskDate, 'yyyy-MM-dd');

        const currentCompletedDates = originalTask.completedDates || [];
        let newCompletedDates;

        // If the *instance* is currently marked completed (passed in task object), we uncomplete it
        // The 'task' object passed here should be the expanded instance from the view
        if (task.completed) {
            // Mark as incomplete (remove from array)
            newCompletedDates = currentCompletedDates.filter(d => d !== dateKey);
        } else {
            // Mark as complete (add to array)
            if (!currentCompletedDates.includes(dateKey)) {
                newCompletedDates = [...currentCompletedDates, dateKey];
            } else {
                newCompletedDates = currentCompletedDates;
            }
        }

        return await tasksAPI.updateTask(originalTaskId, { completedDates: newCompletedDates });

    } else {
        // Regular task - simple boolean toggle
        return await tasksAPI.updateTask(originalTaskId, { completed: !task.completed });
    }
};
