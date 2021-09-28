export default {
  getImage(state) {
    return state.image;
  },

  getColor(state) {
    return state.color;
  },

  getDrawer(state) {
    return state.drawer;
  },

  getLocations(state) {
    return (
      state.locations || {
        governates: [],
        recruitmentAreas: []
      }
    );
  },

  getDefaults(state) {
    const defaults = state.defaults;
    const obj = {
      RECOMMENDATION_TYPES: [],
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
      BRANCHES: [],
      COUNTRIES: [],
      COURSETYPES: [],
      COLLEGES: [],
      CRIMEMAJORLAWS: [],
      INFLUENCES_CATEGORIES: [],
      STAFF_CATEGORIES: [],
      MEDICAL_SITUATIONS: [],
      STAFF_RANKS: [],
      TREATMENTS_KEYS: {},
      EDUCATION_RANKS_KEYS: {}
    };

    const returned = defaults || obj;
    return returned;
  },
  getUnAnswered(state) {
    const unanswered = state.unanswered;
    const obj = {
      MAILS: [],
      SIZE: 0
    };
    const returned = unanswered || obj;
    return returned;
  },

  getLinks(state) {
    const links = state.links;
    return links || [];
  }
};
