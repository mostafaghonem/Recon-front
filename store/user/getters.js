export default {
  getUser(state) {
    return state;
  },

  getFullname(state) {
    return state.firstname + " " + state.lastname;
  },

  getStatus(state) {
    return state.status;
  }
};
