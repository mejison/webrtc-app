import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:3000/api",
  timeout: 1000,
});

const getAllUsers = () => {
  return instance.get("/user/all");
};

const getUser = (id) => {
  return instance.get(`/user/${id}`);
};

export { getAllUsers, getUser };
