export default {
  async setUser({ commit }, user) {
    commit("SET_USER", user);
  },
  async setUsername({ commit }, user) {
    commit("SET_USERNAME", user);
  },
  async setStatus({ commit }, user) {
    commit("SET_STATUS", user);
  }
};
