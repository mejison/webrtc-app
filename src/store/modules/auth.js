import * as api from "@/api";

const auth = {
  namespaced: true,
  state: {
    user: {},
  },
  getters: {
    user: (state) => state.user,
  },
  mutations: {
    setMe(state, data) {
      state.user = data;
    },
  },
  actions: {
    getMe({ commit }) {
      return api.getMe().then(({ data }) => {
        commit("setMe", data);
      });
    },
  },
};

export default auth;
