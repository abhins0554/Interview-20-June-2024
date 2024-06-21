import axios from 'axios';

const apiClient = axios.create({
    baseURL: ``,
});

// Function to make authorized requests
export const makeAuthorizedRequest = (method, url, data, accessToken) => {
    return apiClient({
        method,
        url,
        data,
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
};

// Function to make unauthorized requests
export const makeUnauthorizedRequest = (method, url, data) => {
    return apiClient({
        method,
        url,
        data,
    });
};