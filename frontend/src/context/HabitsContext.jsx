import React, { createContext, useContext, useState, useEffect } from 'react';
import { habitsAPI } from '../api';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';

const HabitsContext = createContext();

export const useHabits = () => useContext(HabitsContext);

export const HabitsProvider = ({ children }) => {
    const [habits, setHabits] = useState([]);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            fetchHabits();
        } else {
            setHabits([]);
        }
    }, [user]);

    const fetchHabits = async () => {
        setLoading(true);
        try {
            if (user?.isOffline) {
                const offlineHabits = JSON.parse(localStorage.getItem('offline_habits') || '[]');
                setHabits(offlineHabits);
            } else {
                const response = await habitsAPI.getHabits();
                setHabits(response.data || []);
            }
        } catch (error) {
            console.error('Error fetching habits:', error);
            // toast.error('Failed to load habits');
        } finally {
            setLoading(false);
        }
    };

    const createHabit = async (habitData) => {
        try {
            if (user?.isOffline) {
                const newHabit = {
                    ...habitData,
                    _id: `offline_${Date.now()}`,
                    completedDates: [],
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    user: user._id
                };
                const existingHabits = JSON.parse(localStorage.getItem('offline_habits') || '[]');
                const updatedHabits = [newHabit, ...existingHabits];
                localStorage.setItem('offline_habits', JSON.stringify(updatedHabits));
                setHabits(updatedHabits);
                toast.success('Habit created successfully!');
                return newHabit;
            } else {
                const response = await habitsAPI.createHabit(habitData);
                setHabits([response.data, ...habits]);
                toast.success('Habit created successfully!');
                return response.data;
            }
        } catch (error) {
            console.error('Error creating habit:', error);
            toast.error('Failed to create habit');
            throw error;
        }
    };

    const updateHabit = async (id, updates) => {
        try {
            if (user?.isOffline) {
                const existingHabits = JSON.parse(localStorage.getItem('offline_habits') || '[]');
                const index = existingHabits.findIndex(h => h._id === id);
                if (index !== -1) {
                    const updatedHabit = { ...existingHabits[index], ...updates, updatedAt: new Date().toISOString() };
                    existingHabits[index] = updatedHabit;
                    localStorage.setItem('offline_habits', JSON.stringify(existingHabits));
                    setHabits(existingHabits);
                    toast.success('Habit updated successfully!');
                    return updatedHabit;
                }
                throw new Error('Habit not found locally');
            } else {
                const response = await habitsAPI.updateHabit(id, updates);
                setHabits(habits.map(h => h._id === id ? response.data : h));
                toast.success('Habit updated successfully!');
                return response.data;
            }
        } catch (error) {
            console.error('Error updating habit:', error);
            toast.error('Failed to update habit');
            throw error;
        }
    };

    const deleteHabit = async (id) => {
        try {
            if (user?.isOffline) {
                const existingHabits = JSON.parse(localStorage.getItem('offline_habits') || '[]');
                const filteredHabits = existingHabits.filter(h => h._id !== id);
                localStorage.setItem('offline_habits', JSON.stringify(filteredHabits));
                setHabits(filteredHabits);
            } else {
                await habitsAPI.deleteHabit(id);
                setHabits(habits.filter(h => h._id !== id));
            }
            toast.success('Habit deleted');
        } catch (error) {
            console.error('Error deleting habit:', error);
            toast.error('Failed to delete habit');
            throw error;
        }
    };

    const toggleCompletion = async (id, date) => {
        try {
            if (user?.isOffline) {
                const existingHabits = JSON.parse(localStorage.getItem('offline_habits') || '[]');
                const index = existingHabits.findIndex(h => h._id === id);
                if (index !== -1) {
                    const habit = existingHabits[index];
                    const dateStr = new Date(date).toISOString().split('T')[0]; // Simple date match
                    const hasCompleted = habit.completedDates.some(d => new Date(d).toISOString().split('T')[0] === dateStr);

                    let newCompletedDates;
                    if (hasCompleted) {
                        newCompletedDates = habit.completedDates.filter(d => new Date(d).toISOString().split('T')[0] !== dateStr);
                    } else {
                        newCompletedDates = [...habit.completedDates, date]; // Adding the date
                    }

                    const updatedHabit = { ...habit, completedDates: newCompletedDates, updatedAt: new Date().toISOString() };
                    existingHabits[index] = updatedHabit;
                    localStorage.setItem('offline_habits', JSON.stringify(existingHabits));
                    setHabits(habits.map(h => h._id === id ? updatedHabit : h));
                    return updatedHabit;
                }
            } else {
                const response = await habitsAPI.toggleCompletion(id, date);
                setHabits(habits.map(h => h._id === id ? response.data : h));
                return response.data;
            }
        } catch (error) {
            console.error('Error toggling habit:', error);
            toast.error('Failed to update progress');
            throw error;
        }
    };

    return (
        <HabitsContext.Provider value={{
            habits,
            loading,
            fetchHabits,
            createHabit,
            updateHabit,
            deleteHabit,
            toggleCompletion
        }}>
            {children}
        </HabitsContext.Provider>
    );
};
