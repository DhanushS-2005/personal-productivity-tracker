import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const getTasks = () => {
  return API.get("/tasks");
};

export const getTodayTasks = () => {
  return API.get("/tasks/today");
};

export const createTask = (task) => {
  return API.post("/tasks", task);
};

export const updateTask = (id, task) => {
  return API.put(`/tasks/${id}`, task);
};

export const deleteTask = (id) => {
  return API.delete(`/tasks/${id}`);
};

export const toggleTask = (id) => {
  return API.patch(`/tasks/${id}/toggle`);
};