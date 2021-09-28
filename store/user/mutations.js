export default {
  SET_USER(state, user) {
    state = JSON.parse(JSON.stringify(user));
  },
  SET_USERNAME(state, username) {
    state.username = username;
  },
  SET_STATUS(state, status) {
    state.status = status;
  }
};
