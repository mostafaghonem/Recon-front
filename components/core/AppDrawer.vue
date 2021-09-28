<template>
  <v-navigation-drawer
    id="app-drawer"
    v-model="inputValue"
    app
    
    floating
    persistent
    mobile-break-point="991"
    width="260"
    right
    class="aside"
  >
    <!-- <v-img :src="image" height="100%"> -->
    <v-layout class="fill-height" tag="v-list" column>
     
      
      <v-list dense>
        <!-- <v-list-tile
            :key="'dashboard'"
            :to="dashboardItem.to"
            :active-class="color"
            avatar
            class="v-list-item"
            expand
          >
            <v-list-tile-title v-text="dashboardItem.title" />
            <v-list-tile-action>
              <v-icon>{{ dashboardItem.icon }}</v-icon>
            </v-list-tile-action>
          </v-list-tile> -->
        <v-list-group
          v-for="(item, index) in items"
          v-model="item.active"
          :key="item.title"
          :sub-group="true"
          :class="getColor(index)"
        >
          <template v-slot:activator>
            <v-list-tile>
              <v-list-tile-title v-text="item.title" />
              <v-icon>{{ item.icon }}</v-icon>
              <!-- <v-list-tile-action>
                  <v-icon>{{ item.icon }}</v-icon>
                </v-list-tile-action> -->
            </v-list-tile>
          </template>

          <v-list-tile v-if="responsive">
            <v-text-field
              class="purple-input search-input"
              label="Search..."
              color="purple"
            />
          </v-list-tile>
          <v-list-tile
            v-for="(link, i) in item.items"
            :key="i"
            :to="link.to"
            :active-class="color"
            avatar
            class="v-list-item"
            expand
          >
            <v-list-tile-title v-text="link.text" />
            <v-list-tile-action>
              <v-icon>{{ link.icon }}</v-icon>
            </v-list-tile-action>
          </v-list-tile>
        </v-list-group>
      </v-list>

      <!-- <v-list-tile
          to="/logout"
          :active-class="color"
          avatar
          class="v-list-item logout-tile"
          expand
        > <v-flex xs12 text-xs-right>
            <v-btn to="/logout" class="font-weight-light add-button">
              {{ $t("LOGOUT") }}
            </v-btn>
          </v-flex> -->
      <!-- <v-list-tile-title v-text="$t('LOGOUT')" /> -->
      <!-- <v-list-tile-action>
              <v-icon>{{ link.icon }}</v-icon>
            </v-list-tile-action> 
        </v-list-tile> -->
    </v-layout>
    <!-- </v-img> -->
  </v-navigation-drawer>
</template>

<script>
// Utilities
import { mapActions, mapGetters } from "vuex";
export default {
  data() {
    return {
      logo: require(`@/assets/images/vuetifylogo.png`),
      dashboardItem: {},
      // items: [
      //   {
      //     icon: "mdi-view-dashboard",
      //     title: this.$i18n.t("Dashboard"),
      //     items: [
      //       {
      //         to: "/dashboard",
      //         icon: "mdi-newspaper",
      //         text: this.$i18n.t("News")
      //       }
      //     ]
      //   },
      //   {
      //     actions: "user",
      //     icon: "mdi-account",
      //     title: this.$i18n.t("Users"),
      //     items: [
      //       {
      //         to: "/add-user",
      //         icon: "mdi-account-plus",
      //         text: this.$i18n.t("Add_User"),
      //         permissions: ["all"]
      //       }
      //     ],
      //     permissions: [],
      //     authority: () => {}
      //   },
      //   {
      //     actions: "mdi-loyalty",
      //     icon: "mdi-human",
      //     title: this.$i18n.t("Soldiers"),
      //     items: [
      //       {
      //         to: "/add-soldier",
      //         icon: "mdi-human-male",
      //         text: this.$i18n.t("Add_Soldier")
      //       },
      //       {
      //         to: "/soldiers",
      //         icon: "mdi-clipboard-outline",
      //         text: this.$i18n.t("List_Soldier")
      //       }
      //     ]
      //   }
      // ],
      responsive: true
    };
  },
  computed: {
    ...mapGetters({
      links: "app/getLinks",
      user: "app/getUser",
      image: "app/getImage",
      color: "app/getColor",
      drawer: "app/getDrawer"
    }),

    inputValue: {
      get() {
        return this.drawer;
      },
      set(val) {
        this.setDrawer(val);
      }
    },
    items() {
      const user = this.$store.state.localStorage.user;
      const links = this.$store.getters["app/getLinks"];
      if (links && links.length) {
        return JSON.parse(JSON.stringify(links));
      }
      return [];
    }
  },
  mounted() {
    this.onResponsiveInverted();
    window.addEventListener("resize", this.onResponsiveInverted);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.onResponsiveInverted);
  },
  methods: {
    ...mapActions({
      setDrawer: "app/setDrawer"
    }),
    getColor(index) {
      let color = `recon-`;
      switch (index) {
        case 0:
          color += "red";
          break;
        case 1:
          color += "white";
          break;
        case 2:
          color += "black";
          break;
      }
      color += "-transparent";
      return color;
    },
    onResponsiveInverted() {
      this.responsive = window.innerWidth < 991;
    }
  }
};
</script>

<style lang="scss">
.aside{
  height: auto!important;
  margin-top: 20px;
}
#app-drawer {
  &.v-navigation-drawer .v-list {
    background: rgba(27, 27, 27, 0.4);
    padding: 0;
  }

  .v-divider {
    margin: 0;
  }

  .v-list__tile {
    border-radius: 4px;

    &--buy {
      margin-top: auto;
      margin-bottom: 17px;
    }

    &__title {
      color: #ffffff;
    }
  }

  .v-image__image--contain {
    top: 0px;
    height: 100%;
  }

  .search-input {
    margin-bottom: 30px !important;
    padding-left: 15px;
    padding-right: 15px;
  }
}
#app-drawer{
  margin-top:80px!important
}
</style>
