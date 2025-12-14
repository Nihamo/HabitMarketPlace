import api from './api';

const USER_URL = '/users';

export const followUser = async (userId, targetId) => {
    await api.post(`${USER_URL}/${userId}/follow/${targetId}`);
};

export const unfollowUser = async (userId, targetId) => {
    await api.delete(`${USER_URL}/${userId}/follow/${targetId}`);
};

export const getFollowers = async (userId) => {
    const response = await api.get(`${USER_URL}/${userId}/followers`);
    return response.data;
};

export const getFollowing = async (userId) => {
    const response = await api.get(`${USER_URL}/${userId}/following`);
    return response.data;
};
