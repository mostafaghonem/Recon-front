export const state = () => ({
  constants: {
    locations: {
      governates: [],
      recruitmentAreas: []
    },
    defaults: {
      EDUCATION_RANKS: {},
      FORCES_LIST: {},
      ARMY_LIST: {},
      SITUATIONS: {},
      RECRUITMENT_LEVELS: {},
      EDUCATION_RANKS: [],
      FORCES_LIST: [],
      ARMY_LIST: [],
      SITUATIONS: [],
      RECRUITMENT_LEVELS: [],
      TREATMENTS: [],
      TREATMENTS_KEYS: {},
      EDUCATION_RANKS_KEYS: {}
    }
  }
});

export const mutations = {
  SET_CONSTANTS(state, constants) {
    state.constants = constants;
  }
};

export const actions = {
  setConstants({ commit }, constants) {
    console.log("commiting constants", constants);
    commit("SET_CONSTANTS", constants);
  }
};
