<template> </template>
<script>
import { mapActions } from "vuex";
import { get } from "~/plugins/axiosbase";
export default {
  middleware({ beforeNuxtRender, nuxtState }) {
    // If the user is not authenticated
    if (process.server) {
      beforeNuxtRender(({ nuxtState }) => {
        nuxtState.reconToken = undefined;
        nuxtState.user = undefined;
        nuxtState.permissions = undefined;
      });
    }
    if (process.client) {
      nuxtState.reconToken = undefined;
      nuxtState.user = undefined;
      nuxtState.permissions = undefined;
    }
  },
  created() {
    this.logout({ nuxtState: this.$ });
  },
  methods: {
    ...mapActions({
      setUser: "localStorage/setUser"
    }),

    async logout() {
      const logoutResponse = await get("users/logout");

      await this.setUser({
        username: null,
        fullName: null,
        permissions: [],
        branch: null,
        rank: null
      });
      if (process.client && localStorage) {
        localStorage.removeItem("reconToken");
        localStorage.removeItem("user");
        localStorage.removeItem("localStorage");
      }
      this.$router.push({ path: "/login" });
    }
  }
};
</script>
