import api from './api';

const USER_URL = '/users';

export const getUserAchievements = async (userId) => {
    // Correct Endpoint: GET /users/{id}/achievements
    const response = await api.get(`${USER_URL}/${userId}/achievements`);
    return response.data; // List<AchievementDTO>
}
