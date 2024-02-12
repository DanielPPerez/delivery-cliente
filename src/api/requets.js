import axios from "axios";

const API = "http://localhost:4000/user";

export const registerRequest = (user) =>
  axios.post(`${API}/register`, user);

export const loginRequest = (user) =>
  axios.post(`${API}/login`, user);

export const verifyTokenRequest = (user) =>
  axios.post(`${API}/verify`, user);



export const sendMessageRoute = `${API}/api/messages/addmsg`;
export const recieveMessageRoute = `${API}/api/messages/getmsg`;
