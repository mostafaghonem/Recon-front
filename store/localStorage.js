export const state = () => ({
  constants: {
    locations: {
      governates: [],
      recruitmentAreas: []
    },
    user: {
      username: null,
      fullName: null,
      permissions: [],
      branch: null,
      rank: null
    }
  }
});

export const mutations = {
  SET_USER(state, user) {
    state.user = JSON.parse(JSON.stringify(user));
  }
};

export const actions = {
  setUser({ commit }, user) {
    console.log("COMMITING USER ", user);
    commit("SET_USER", user);
  }
};

export const getters = {
  getUser(state) {
    return state.user;
  }
};
