import axios from "../plugins/axiosbase";

export default function({ store, app, redirect, beforeNuxtRender, nuxtState }) {
  //   we should hande authentication on routes here
  const reconToken = app.$cookies.get("reconToken");
  if (!reconToken) {
    // const { setStatus } = mapActions({ setStatus: "user/setStatus" });
    // setStatus("no_logged_in");
    // store.commit("user/setStatus", "no_logged_in");
    return Promise.resolve();
  }

  if (process.server) {
    console.log("getting user");
    return axios
      .get("users/profile", {
        headers: {
          Cookie: `reconToken=${reconToken}`
        }
      })
      .then(response => {
        console.log("got myself a user in back");
        beforeNuxtRender(({ nuxtState }) => {
          nuxtState.reconToken = reconToken;
          nuxtState.user = response.data.profileData;
          nuxtState.permissions = response.data.profileData.permissions;
        });
      })
      .catch(err => {
        console.log("cant get user ", err);
      });
  }

  if (process.client || process.browser) {
    console.log("got myself a user in FRONT");
    if (nuxtState.user) {
      return Promise.resolve();
    }

    return axios
      .get("users/profile", {
        headers: {
          Cookie: `reconToken=${reconToken}`
        }
      })
      .then(response => {
        console.log("got myself a user in client");

        nuxtState.reconAppToken = reconToken;
        nuxtState.reconToken = reconToken;
        nuxtState.user = response.data.profileData;
        nuxtState.permissions = response.data.profileData.permissions;
      })
      .catch(err => {
        console.log("user is invalid myself a user", err);
      });
  }
  return Promise.resolve();
}
