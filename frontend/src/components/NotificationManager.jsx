import React, { useEffect, useState } from 'react';
import { tasksAPI } from '../api';
import { useAuth } from '../context/AuthContext';

const NotificationManager = () => {
    const { user } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [processedReminders, setProcessedReminders] = useState(() => {
        const saved = localStorage.getItem('processedReminders');
        return saved ? JSON.parse(saved) : {};
    });

    // Request permission on mount
    useEffect(() => {
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }, []);

    // Fetch tasks periodically
    useEffect(() => {
        if (!user) return;

        const fetchTasks = async () => {
            try {
                const response = await tasksAPI.getTasks();
                setTasks(response.data.data.tasks);
            } catch (error) {
                console.error('Failed to fetch tasks for notifications', error);
            }
        };

        fetchTasks();
        const interval = setInterval(fetchTasks, 60000); // Fetch every minute

        return () => clearInterval(interval);
    }, [user]);

    // Check for due reminders
    useEffect(() => {
        if (!tasks.length) return;

        const checkReminders = () => {
            const now = new Date();
            const newProcessed = { ...processedReminders };
            let hasUpdates = false;

            tasks.forEach(task => {
                if (!task.reminder || task.completed) return;

                const reminderTime = new Date(task.reminder);
                const taskId = task._id;
                const reminderKey = `${taskId}-${reminderTime.getTime()}`;

                // Check if reminder is due (within last 2 minutes to be safe) and not yet processed
                const timeDiff = now.getTime() - reminderTime.getTime();
                const isDue = timeDiff >= 0 && timeDiff < 120000; // 2 minutes window

                if (isDue && !newProcessed[reminderKey]) {
                    // Send notification
                    if (Notification.permission === 'granted') {
                        new Notification(`Reminder: ${task.title}`, {
                            body: `It's time for your task: ${task.title}`,
                            icon: '/vite.svg' // specific to vite project, can be changed
                        });
                    }

                    // Mark as processed
                    newProcessed[reminderKey] = true;
                    hasUpdates = true;
                }
            });

            if (hasUpdates) {
                setProcessedReminders(newProcessed);
                localStorage.setItem('processedReminders', JSON.stringify(newProcessed));
            }
        };

        const interval = setInterval(checkReminders, 10000); // Check every 10 seconds
        checkReminders(); // Check immediately on tasks update

        return () => clearInterval(interval);
    }, [tasks, processedReminders]);

    return null; // This component doesn't render anything
};

export default NotificationManager;
