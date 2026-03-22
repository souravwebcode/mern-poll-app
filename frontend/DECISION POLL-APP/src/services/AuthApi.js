// services/authApi.js
import axios from "axios";

const API = "http://localhost:5000/api/auth";

export const signupUser = (data) => axios.post(`${API}/signup`, data);
export const loginUser = (data) => axios.post(`${API}/Login`, data);