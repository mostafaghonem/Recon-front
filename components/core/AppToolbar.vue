<template>
  <v-toolbar fixed="top" id="core-toolbar" flat prominent dir="rtl">
    <!--     style="background: #eee;" -->
    <v-layout>
      <v-flex md3>
    <div class="v-toolbar-title" >
      <v-toolbar-title class="font-weight-light" >
        <v-btn
          v-if="responsive"
          class="default v-btn--simple one"
          
          icon
          @click.stop="onClickBtn"
        >
          <v-icon>mdi-view-list</v-icon>
        </v-btn>
        {{ title }}
      </v-toolbar-title>
    </div>
      </v-flex>
      <v-flex md6>
     <v-list dense style="display:flex;justifyContent:center;">
        <v-list-tile avatar to="/">
          <!-- <v-list-tile-title class="title">
              منظومة جهاز الإستطلاع
          </v-list-tile-title>
          <v-list-tile-avatar color="white">
            <v-img :src="logo" height="60" contain />
          </v-list-tile-avatar>
               <v-list-tile-title class="title">
              فرع نظم المعلومات
          </v-list-tile-title>
        </v-list-tile>
      </v-list>
            <v-divider /> -->
            <img src="./Capture.png" height="60" contain />
        </v-list-tile>
     </v-list>
      </v-flex>
      <v-flex md2></v-flex>
    <v-flex md1>
    <v-toolbar-items>
      <v-flex layout py-2>
        <nuxt-link
          v-ripple
          class="toolbar-items"
          to="/"
          :title="$t('Dashboard')"
        >
          <v-icon>mdi-view-dashboard</v-icon>
        </nuxt-link>

        <!-- <nuxt-link
          v-ripple
          class="toolbar-items"
          to="/user-profile"
          title="User profile"
        >
          <v-icon>mdi-account</v-icon>
        </nuxt-link> -->
        <nuxt-link
          v-ripple
          class="toolbar-items"
          to="/"
          :title="$t('LOGOUT')"
          @click.native="logout"
        >
        
          <v-icon>mdi-logout</v-icon>
        </nuxt-link>
      </v-flex>
    </v-toolbar-items>
    </v-flex>
    </v-layout>
  </v-toolbar>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { get } from "~/plugins/axiosbase";
export default {
  created() {
    const { context } = this.$store.app;
    const { nuxtState } = context;
    if (!nuxtState || (nuxtState && !nuxtState.user)) {
      return;
    }
    this.title = this.$t(nuxtState.user.branch);
  },
  data() {
    return {
      notifications: [
        "Mike, John responded to your email",
        "You have 5 new tasks",
        "You're now a friend with Andrew",
        "Another Notification",
        "Another One"
      ],
      title: undefined,
      responsive: true,
      responsiveInput: true,
      logo: require(`@/assets/images/vuetifylogo.png`),
      dashboardItem: {},
    
      responsive: true
    }
  },
  watch: {
    // $route(val) {
    //   this.title = val.name;
    // }
  },
  computed: {
    ...mapGetters({
      drawer: "app/getDrawer"
    })
  },
  methods: {
    ...mapActions({
      setUser: "localStorage/setUser",
      setDrawer: "app/setDrawer"
    }),

    onClickBtn() {
      this.setDrawer(!this.drawer);
    },
    onClick() {
      // Do something
    },
    onResponsiveInverted() {
      if (window.innerWidth > 991) {
        this.responsive = true;
        this.responsiveInput = false;
      } else {
        this.responsive = false;
        this.responsiveInput = true;
      }
    },
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
  },
  mounted() {
    this.onResponsiveInverted();
    window.addEventListener("resize", this.onResponsiveInverted);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.onResponsiveInverted);
  }
};
</script>

<style>
#core-toolbar a {
  text-decoration: none;
}
</style>
