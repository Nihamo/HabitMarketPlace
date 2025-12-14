import api from './api';

const HABIT_URL = '/habits';
const PROGRESS_URL = '/progress';

// ------------------------------------
// HABIT MANAGEMENT
// ------------------------------------

export const createHabit = async (habitData) => {
    const response = await api.post(`${HABIT_URL}/create`, habitData);
    return response.data;
};

export const adoptHabit = async (userId, habitId) => {
    const response = await api.post(`${HABIT_URL}/adopt/${userId}/${habitId}`);
    return response.data;
}

export const getUserHabits = async (userId) => {
    const response = await api.get(`${HABIT_URL}/user/${userId}`);
    return response.data;
}

export const getHabitById = async (id) => {
    const response = await api.get(`${HABIT_URL}/${id}`);
    return response.data;
}

export const updateHabit = async (habitId, data) => {
    const response = await api.put(`${HABIT_URL}/update/${habitId}`, data);
    return response.data;
}

export const deleteHabit = async (habitId) => {
    const response = await api.delete(`${HABIT_URL}/delete/${habitId}`);
    return response.data;
}

// ------------------------------------
// MARKETPLACE & SEARCH
// ------------------------------------

export const getMarketplaceHabits = async () => {
    const response = await api.get(`${HABIT_URL}/marketplace`);
    return response.data;
}

export const getHabitTemplates = async () => {
    const response = await api.get(`${HABIT_URL}/marketplace/templates`);
    return response.data;
}

export const getPublicHabits = async () => {
    const response = await api.get(`${HABIT_URL}/marketplace/public`);
    return response.data;
}

export const searchHabitsByTitle = async (keyword) => {
    const response = await api.get(`${HABIT_URL}/search/title/${keyword}`);
    return response.data;
}

export const searchHabitsByDescription = async (keyword) => {
    const response = await api.get(`${HABIT_URL}/search/description/${keyword}`);
    return response.data;
}

// ------------------------------------
// STATUS & REFRESH
// ------------------------------------

export const refreshHabitStatus = async (habitId) => {
    const response = await api.put(`${HABIT_URL}/refresh/${habitId}`);
    return response.data;
}

export const refreshAllHabits = async () => {
    const response = await api.put(`${HABIT_URL}/refreshAll`);
    return response.data;
}

// ------------------------------------
// PROGRESS TRAKKING
// ------------------------------------

export const checkInHabit = async (habitId, userId) => {
    const response = await api.post(`${PROGRESS_URL}/${habitId}/user/${userId}`);
    return response.data;
}

export const getHabitProgress = async (habitId, userId) => {
    const response = await api.get(`${PROGRESS_URL}/habit/${habitId}/user/${userId}`);
    return response.data;
}

export const getHabitStreak = async (habitId, userId) => {
    const response = await api.get(`${PROGRESS_URL}/streak/${habitId}/user/${userId}`);
    return response.data;
}

export const getTotalCompleted = async (habitId, userId) => {
    const response = await api.get(`${PROGRESS_URL}/total/${habitId}/user/${userId}`);
    return response.data;
}

export const deleteProgress = async (progressId, userId) => {
    const response = await api.delete(`${PROGRESS_URL}/${progressId}/user/${userId}`);
    return response.data;
}
