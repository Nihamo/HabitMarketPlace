import api from './api';

const USER_URL = '/users';

// ------------------------------------
// USER PROFILE & STATS
// ------------------------------------

export const getUserProfile = async (userId) => {
    const response = await api.get(`${USER_URL}/${userId}`);
    return response.data;
};

export const updateProfile = async (userId, data) => {
    const response = await api.put(`${USER_URL}/${userId}/update`, data);
    return response.data;
}

export const getUserStats = async (userId) => {
    const response = await api.get(`${USER_URL}/${userId}/stats`);
    return response.data;
};

export const getUserCoins = async (userId) => {
    const response = await api.get(`${USER_URL}/${userId}/coins`);
    return response.data;
}

export const addCoins = async (userId, amount) => {
    const response = await api.put(`${USER_URL}/${userId}/coins/add?coins=${amount}`);
    return response.data;
}

export const deductCoins = async (userId, amount) => {
    const response = await api.put(`${USER_URL}/${userId}/coins/deduct?coins=${amount}`);
    return response.data;
}

export const getLeaderboard = async () => {
    const response = await api.get(`${USER_URL}/leaderboard`);
    return response.data;
}

export const checkAndAwardAchievements = async (userId) => {
    await api.post(`${USER_URL}/${userId}/achievements/check`);
}

// ------------------------------------
// SOCIAL / FOLLOW
// ------------------------------------

export const followUser = async (userId, targetId) => {
    await api.post(`${USER_URL}/${userId}/follow/${targetId}`);
}

export const unfollowUser = async (userId, targetId) => {
    await api.delete(`${USER_URL}/${userId}/follow/${targetId}`);
}

export const getFollowers = async (userId) => {
    const response = await api.get(`${USER_URL}/${userId}/followers`);
    return response.data;
}

export const getFollowing = async (userId) => {
    const response = await api.get(`${USER_URL}/${userId}/following`);
    return response.data;
}
