import api from './axios';

export const authAPI = {
    signup: (data) => api.post('/auth/signup', data),
    login: (data) => api.post('/auth/login', data),
    logout: () => api.post('/auth/logout'),
    getMe: () => api.get('/auth/me'),
    updateDetails: (data) => api.put('/auth/updatedetails', data),
};

export const notesAPI = {
    getNotes: (params) => api.get('/notes', { params }),
    createNote: (data) => api.post('/notes', data),
    updateNote: (id, data) => api.put(`/notes/${id}`, data),
    deleteNote: (id) => api.delete(`/notes/${id}`),
    pinNote: (id) => api.patch(`/notes/${id}/pin`),
    shareNote: (id, data) => api.post(`/notes/${id}/share`, data),
};

export const notebooksAPI = {
    getNotebooks: () => api.get('/notebooks'),
    createNotebook: (data) => api.post('/notebooks', data),
    updateNotebook: (id, data) => api.put(`/notebooks/${id}`, data),
    deleteNotebook: (id) => api.delete(`/notebooks/${id}`),
};

export const tagsAPI = {
    getTags: () => api.get('/tags'),
};

export const tasksAPI = {
    getTasks: () => api.get('/tasks'),
    createTask: (data) => api.post('/tasks', data),
    updateTask: (id, data) => api.put(`/tasks/${id}`, data),
    deleteTask: (id) => api.delete(`/tasks/${id}`),
};

export const aiAPI = {
    processContent: (data) => api.post('/ai/process', data),
};

export const templatesAPI = {
    uploadTemplate: (formData) => api.post('/templates/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    }),
    getTemplates: () => api.get('/templates'),
};

export const galleryAPI = {
    getImages: () => api.get('/gallery'),
    uploadImage: (formData) => api.post('/gallery/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    }),
    deleteImage: (id) => api.delete(`/gallery/${id}`),
};

export const expensesAPI = {
    getExpenses: () => api.get('/expenses'),
    createExpense: (data) => api.post('/expenses', data),
    deleteExpense: (id) => api.delete(`/expenses/${id}`),
    getStats: () => api.get('/expenses/stats'),
};

export const loansAPI = {
    getLoans: () => api.get('/loans'),
    createLoan: (data) => api.post('/loans', data),
    updateLoan: (id, data) => api.put(`/loans/${id}`, data),
    deleteLoan: (id) => api.delete(`/loans/${id}`),
    addRepayment: (id, data) => api.post(`/loans/${id}/repay`, data),
    getStats: () => api.get('/loans/stats'),
};

export const habitsAPI = {
    getHabits: () => api.get('/habits'),
    createHabit: (data) => api.post('/habits', data),
    updateHabit: (id, data) => api.patch(`/habits/${id}`, data),
    deleteHabit: (id) => api.delete(`/habits/${id}`),
    toggleCompletion: (id, date) => api.post(`/habits/${id}/toggle`, { date }),
};

export const stickyNotesAPI = {
    getStickyNotes: () => api.get('/sticky-notes'),
    createStickyNote: (data) => api.post('/sticky-notes', data),
    updateStickyNote: (id, data) => api.put(`/sticky-notes/${id}`, data),
    deleteStickyNote: (id) => api.delete(`/sticky-notes/${id}`),
};
