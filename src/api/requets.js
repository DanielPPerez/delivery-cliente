import axios from 'axios';

const baseURL = 'http://localhost:4000/user';

export const registerRequest = async (userData) => {
  try {
    const response = await axios.post(`${baseURL}/register`, userData);
    return response;
  } catch (error) {
    throw error;
  }
};

export const loginRequest = async (userData) => {
  try {
    const response = await axios.post(`${baseURL}/login`, userData);
    return response;
  } catch (error) {
    throw error;
  }
};

export const verifyTokenRequest = async (token) => {
  try {
    const response = await axios.post(`${baseURL}/verifyToken`, { token });
    return response;
  } catch (error) {
    throw error;
  }
};

export const logoutRequest = async () => {
  try {
  
    const response = await axios.post(`${baseURL}/logout`);
    return response;
  } catch (error) {
    throw error;
  }
};
