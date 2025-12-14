import api from './api';

const REWARD_URL = '/rewards';

export const getAllRewards = async () => {
    const response = await api.get(REWARD_URL);
    return response.data;
};

export const getRewardById = async (id) => {
    const response = await api.get(`${REWARD_URL}/${id}`);
    return response.data;
};

export const redeemReward = async (rewardId, userId) => {
    const response = await api.post(`${REWARD_URL}/redeem/${rewardId}/user/${userId}`);
    return response.data;
};

export const getUserRedemptions = async (userId) => {
    const response = await api.get(`${REWARD_URL}/user/${userId}`);
    return response.data;
};


