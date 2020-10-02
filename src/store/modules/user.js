import * as api from "@/api";

const user = {
  namespaced: true,
  state: {
    user: {},
    all: [],
  },
  getters: {
    user: (state) => state.user,
    all: (state) => state.all,
  },
  mutations: {
    setUsers(state, data) {
      state.all = data;
    },
    setUser(state, data) {
      state.user = data;
    },
  },
  actions: {
    getAllUsers({ commit }) {
      return api.getAllUsers().then(({ data }) => {
        commit("setUsers", data);
      });
    },
    getUser({ commit }, data) {
      return api.getUser(data.id).then((res) => {
        commit("setUsers", res);
      });
    },
  },
};

export default user;
