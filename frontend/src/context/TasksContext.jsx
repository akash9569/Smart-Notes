import React, { createContext, useContext, useState, useEffect } from 'react';
import { tasksAPI } from '../api';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';
import { toggleTaskCompletion } from '../utils/taskHelpers';

const TasksContext = createContext();

export const useTasks = () => useContext(TasksContext);

export const TasksProvider = ({ children }) => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);
    const { user, updateUser } = useAuth();
    // We might want to track if data was loaded at least once to avoid re-fetching on every mount if not needed,
    // or just let Views trigger fetch if data is stale. For simplicity, we can fetch on auth.

    useEffect(() => {
        if (user) {
            fetchTasks();
        } else {
            setTasks([]);
        }
    }, [user]);

    const fetchTasks = async () => {
        setLoading(true);
        try {
            if (user?.isOffline) {
                const offlineTasks = JSON.parse(localStorage.getItem('offline_tasks') || '[]');
                setTasks(offlineTasks);
            } else {
                const response = await tasksAPI.getTasks();
                setTasks(response.data.data.tasks || []);
            }
        } catch (error) {
            console.error('Failed to fetch tasks:', error);
            // toast.error('Failed to load tasks'); // Optional: prevent toast spam on load
        } finally {
            setLoading(false);
        }
    };

    const createTask = async (taskData) => {
        try {
            if (user?.isOffline) {
                const newTask = {
                    ...taskData,
                    _id: `offline_${Date.now()}`,
                    completed: false,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    user: user._id
                };
                const existingTasks = JSON.parse(localStorage.getItem('offline_tasks') || '[]');
                const updatedTasks = [newTask, ...existingTasks];
                localStorage.setItem('offline_tasks', JSON.stringify(updatedTasks));
                setTasks(updatedTasks);
                toast.success('Task added');
                return newTask;
            } else {
                const response = await tasksAPI.createTask(taskData);
                setTasks([response.data.data.task, ...tasks]);
                toast.success('Task added');
                return response.data.data.task;
            }
        } catch (error) {
            toast.error('Failed to add task');
            throw error;
        }
    };

    const updateTask = async (id, taskData) => {
        try {
            if (user?.isOffline) {
                const existingTasks = JSON.parse(localStorage.getItem('offline_tasks') || '[]');
                const index = existingTasks.findIndex(t => t._id === id);
                if (index !== -1) {
                    const updatedTask = { ...existingTasks[index], ...taskData, updatedAt: new Date().toISOString() };
                    existingTasks[index] = updatedTask;
                    localStorage.setItem('offline_tasks', JSON.stringify(existingTasks));
                    setTasks(existingTasks);
                    return updatedTask;
                }
                throw new Error('Task not found locally');
            } else {
                const response = await tasksAPI.updateTask(id, taskData);
                setTasks(tasks.map(t => t._id === id ? response.data.data.task : t));
                return response.data.data.task;
            }
        } catch (error) {
            toast.error('Failed to update task');
            throw error;
        }
    };

    const deleteTask = async (id) => {
        try {
            if (user?.isOffline) {
                const existingTasks = JSON.parse(localStorage.getItem('offline_tasks') || '[]');
                const filteredTasks = existingTasks.filter(t => t._id !== id);
                localStorage.setItem('offline_tasks', JSON.stringify(filteredTasks));
                setTasks(filteredTasks);
            } else {
                await tasksAPI.deleteTask(id);
                setTasks(tasks.filter(t => t._id !== id));
            }
            toast.success('Task deleted');
        } catch (error) {
            toast.error('Failed to delete task');
            throw error;
        }
    };

    const toggleTask = async (id, completed) => {
        const taskToToggle = tasks.find(t => t._id === id);
        if (!taskToToggle) return;

        // Optimistic update
        const updatedTasksStart = tasks.map(t => t._id === id ? { ...t, completed: !completed } : t);
        setTasks(updatedTasksStart);

        try {
            if (user?.isOffline) {
                const existingTasks = JSON.parse(localStorage.getItem('offline_tasks') || '[]');
                const index = existingTasks.findIndex(t => t._id === id);
                if (index !== -1) {
                    existingTasks[index] = { ...existingTasks[index], completed: !completed, updatedAt: new Date().toISOString() };
                    localStorage.setItem('offline_tasks', JSON.stringify(existingTasks));
                    // No need to fetchTasks() as we already updated state optimistically, but let's confirm
                    // Actually, the original code calls fetchTasks(), so we might want to ensure state is consistent.
                    // But we already set state above.
                }
            } else {
                const response = await toggleTaskCompletion(taskToToggle, tasks);
                if (response.data.data.user) {
                    updateUser(response.data.data.user);
                }
                // Sync with server state
                fetchTasks();
            }
        } catch (error) {
            console.error('Failed to toggle task', error);
            toast.error('Failed to update task');
            // Revert or re-fetch
            fetchTasks();
            throw error;
        }
    };

    return (
        <TasksContext.Provider value={{
            tasks,
            loading,
            fetchTasks,
            createTask,
            updateTask,
            deleteTask,
            toggleTask
        }}>
            {children}
        </TasksContext.Provider>
    );
};
