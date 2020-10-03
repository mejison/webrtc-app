import axios from "axios";
import VueCookie from "vue-cookies";

const instance = axios.create({
  baseURL: "https://e544f311e43d.ngrok.io/api",
  timeout: 1000,
});

instance.interceptors.request.use(function(config) {
  const token = VueCookie.get("token");
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const getMe = () => {
  return instance.get("/user/me");
};

const getAllUsers = () => {
  return instance.get("/user/all");
};

const getUser = (id) => {
  return instance.get(`/user/${id}`);
};

const createOffer = (data) => {
  return instance.post(`/webrtc/create-offer`, data);
};

const generateRandomUser = () => {
  return instance.get("https://randomuser.me/api/");
};

const signin = (data) => {
  return instance.post("/auth/signin", data);
};

const signup = (data) => {
  return instance.post("/auth/signup", data);
};

const createAnswer = (data) => {
  return instance.post("/webrtc/create-answer", data);
};

const getIceCandidate = () => {
  return axios.put(
    "https://global.xirsys.net/_turn/MyFirstApp",
    {},
    {
      headers: {
        Authorization:
          "Basic " + btoa("digary:0bedd2ac-0518-11eb-b2f9-0242ac150002"),
      },
    }
  );
};

const sendIceCandidate = (data) => {
  return instance.post("/webrtc/send-ice-candidate", data);
};

export {
  getAllUsers,
  getUser,
  createOffer,
  createAnswer,
  generateRandomUser,
  sendIceCandidate,
  getIceCandidate,
  signin,
  getMe,
  signup,
};
