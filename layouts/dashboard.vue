<template>
  <v-app dark>
    <core-filter />

    <core-toolbar />

    <core-drawer />

    <core-view />

    <core-footer />
  </v-app>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import coreFilter from "~/components/core/AppFilter";
import coreToolbar from "~/components/core/AppToolbar";
import coreDrawer from "~/components/core/AppDrawer";
import coreView from "~/components/core/AppView";
import coreFooter from "~/components/core/AppFooter";
import { get } from "~/plugins/axiosbase";
export default {
  components: {
    coreFilter,
    coreToolbar,
    coreDrawer,
    coreView,
    coreFooter
  },
  methods: {
    ...mapActions({
      setLocations: "app/setLocations",
      setDefaults: "app/setDefaults",
      setUnAnswered: "app/setUnAnswered",
      setConstants: "sessionStorage/setConstants",
      setLinks: "app/setLinks",
      setUser: "localStorage/setUser"
    }),
    ...mapGetters({
      getConstants: "sessop"
    })
  },
  async created() {
    try {
      const response = await get("/soldiers/constants");

      // this.$store.state.sessionStorage.constants = response;

      this.setLocations(response.locations);
      this.setDefaults(response.defaultConstants);
      this.setLinks(response.links);

      // if (this.$route.path && this.$route.path.includes("followup")) {
      const unanswered = await get("/mail/unanswered?destroy=true");
      this.setUnAnswered({ MAILS: unanswered.mails, SIZE: unanswered.total });
      // }
    } catch (error) {
      console.log("error in ", error.message);
    }
  },
  async mounted() {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const response = await get("/soldiers/constants");

      // this.$store.state.sessionStorage.constants = response;

      this.setLocations(response.locations);
      this.setDefaults(response.defaultConstants);
      this.setUser(user);
    } catch (error) {
      console.log("error in ", error.message);
    }
  }
};
</script>

<style lang="scss">
/* Remove in 1.2 */
.v-datatable thead th.column.sortable i {
  vertical-align: unset;
  text-align: right !important;
}
</style>
