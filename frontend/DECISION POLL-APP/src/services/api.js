// services/api.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const createPoll = (data) => API.post("/polls", data);
export const getPolls = (status) =>
  API.get(`/polls?status=${status || ""}`);
export const votePoll = (id, optionIndex) =>
  API.post(`/polls/${id}/vote`, { optionIndex });