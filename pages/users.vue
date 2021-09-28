<template>
  <v-container fill-height fluid grid-list-xl dir="rtl" dark>
    <v-layout justify-center wrap>
      <v-flex md12>
      <material-card color="primary" :title="$t('List_Users')" dir="rtl">
          <v-data-table
            ref="usersTable"
            calculate-widths
            :headers="headers"
            :items="data"
            :search="search"
            :no-data-text="$t('No_Data_Available')"
            :no-results-text="$t('No_Results_Available')"
            :rows-per-page-text="$t('Rows_Per_Page')"
            :pagination.sync="pagination"
            :loading="isLoading"
            prev-icon="mdi-menu-right"
            next-icon="mdi-menu-left"
          >
            <template slot="headerCell" slot-scope="{ header }">
              <span
                class="subheading font-weight-light text-label text--darken-3"
                v-text="header.text"
              />
            </template>
            <template slot="items" slot-scope="{ item }">
              <td v-for="(header, headerIndex) in headers" :key="header.value">
                {{ getKeyPair(header.value.split("."), item) }}
                <!-- <v-tooltip v-if="headerIndex === headers.length - 1" top>
                  <template v-slot:activator="{ on }">
                    <v-icon
                      v-on="on"
                      small
                      class="mr-2"
                      @click="showUserDialog('changeOfUnit', item)"
                      style="font-size: x-large !important"
                    >
                      mdi-folder-move
                    </v-icon>
                  </template>
                  <span style="color:white">{{
                    $t("Soldier_Change_Of_Unit")
                  }}</span>
                </v-tooltip> -->
              </td>
            </template>
          </v-data-table>
          <!-- <v-progress-circular
            style="z-index: 11111111111; position: relative; left: 40%; bottom: 50%"
            color="primary"
            indeterminate
          ></v-progress-circular> -->
        </material-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import materialCard from "~/components/material/AppCard";
import appFilterCard from "~/components/helper/AppFilterCard";
import { mapGetters } from "vuex";
import { get } from "~/plugins/axiosbase";
import { processUsers, getKeyPair } from "~/plugins/helpers";
import { userFields } from "~/plugins/defaults";
import { paragraphs, getLogo } from "~/plugins/reports/header";

export default {
  layout: "dashboard",
  components: {
    materialCard
  },
  computed: {
    ...mapGetters({
      locations: "app/getLocations",
      defaults: "app/getDefaults"
    }),
    headers() {
      const headers = [];
      this.userFields.map(o => {
        const found = this.fieldsValue.find(m => o.value === m);
        if (found) {
          headers.push({
            sortable: true,
            text: o.ar,
            value: o.value
          });
        }
      });
      //   headers.push({ text: "الإجراءات", value: "actions", sortable: false });
      return headers;
    }
  },
  data() {
    return {
      isLoading: false,
      isAdvancedSearch: false,
      exportType: undefined,
      modals: {
        search: false,
        changeOfUnit: false,
        addSituation: false
      },
      soldier: {},
      divisions: [],
      search: "",
      userFields,
      fieldsValue: userFields.slice(0, 7).map(o => o.value),
      data: [],
      pagination: { rowsPerPage: 25 }
    };
  },
  methods: {
    getKeyPair,

    showUserDialog(name, data) {
      console.log("showing soldier dialog", name);
      this.modals[name] = true;
      this.soldier = data;
    },
    renderUsers(data) {
      this.modals.search = false;
      this.data = processUsers(data, {
        locations: this.locations,
        defaults: this.defaults
      });
      // for (let i = 0; i < 50; i++) {
      //   this.data.push(this.data[0]);
      // }
      this.pagination.totalItems = this.data.length;
      this.isLoading = true;
    },
    async init() {
      this.isLoading = true;
      const data = await this.loadData();
      this.data = processUsers(data, {
        locations: this.locations,
        defaults: this.defaults
      });
      this.isLoading = true;
    },
    async loadData(query = false) {
      const path = "/users";
      const response = await get(path, query);
      if (response.error) {
        console.log("error fetching soldiers", response.error);
        return [];
      }

      return response.users;
    },
    async getDivisions() {
      const path = "/divisions";
      const response = await get(path);
      if (response.error) {
        console.log("error getting divisions", response.error);
        return;
      }
      this.divisions = response.divisions;
    }
  },
  async created() {
    const divisions = await this.getDivisions();
    const instance = this.init();
  },
  middleware: ["auth", "isNotLoggedIn", "isAuthorized"],
  meta: {
    permissions: ["admin", "branch_head"]
  }
};
</script>
