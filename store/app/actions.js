export default {
  setDrawer({ commit }, drawer) {
    commit("SET_DRAWER", drawer);
  },
  setImage({ commit }, image) {
    commit("SET_IMAGE", image);
  },
  setColor({ commit }, color) {
    commit("SET_COLOR", color);
  },
  setLocations({ commit }, locations) {
    commit("SET_LOCATIONS", locations);
  },
  setDefaults({ commit }, defaults) {
    commit("SET_DEFAULTS", defaults);
  },
  setUnAnswered({ commit }, unanswered) {
    commit("SET_UNANSWERED", unanswered);
  },
  setLinks({ commit }, links) {
    commit("SET_LINKS", links);
  }
};
