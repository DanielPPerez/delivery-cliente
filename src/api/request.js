// request.js
import axios from 'axios';

const API_URL = 'https://localhost:4000'; 

export const registerRequest = async (userData, token) => {
  try {
    const response = await axios.post(`${API_URL}/user/register`, userData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const loginRequest = async (userData, token) => {
  try {
    const response = await axios.post(`${API_URL}/user/login`, userData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const verifyTokenRequest = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/user/verify-token`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
