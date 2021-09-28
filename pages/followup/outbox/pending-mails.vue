<template>
  <v-container fill-height fluid grid-list-xl dir="rtl" dark>
    <!-- <appFilterCard v-model="isAdvancedSearch" :fields="fields" /> -->
    <AppFilterMailCard
      type="outbox"
      :status="status"
      :fields="fields"
      v-model="modals.search"
      v-on:close="modals.search = false"
    />
    <v-layout justify-center wrap>
      <v-flex md12>
        <material-card color="primary" :title="$t('List_Mails')" dir="rtl">
          <v-card-title>
            <v-layout wrap>
              <v-flex xs12 md4>
                <v-select
                  :no-data-text="$t('No_Selections')"
                  class="form-select soldier-fields"
                  :items="fields"
                  item-text="ar"
                  item-value="value"
                  :label="$t('Shown_Fields')"
                  v-model="fieldsValue"
                  multiple
                />
              </v-flex>
              <v-flex xs12 md4>
                <v-text-field
                  v-model="search"
                  append-icon="mdi-magnify"
                  :label="$t('Search')"
                  single-line
                ></v-text-field>
              </v-flex>
              <v-flex xs12 md3 text-xs-right>
                <v-btn
                  class="font-weight-light filter-table-button v-btn-facebook"
                  @click="showDialog"
                >
                  {{ $t("Advanced_Search") }}
                </v-btn>
              </v-flex>
            </v-layout>
          </v-card-title>
          <v-data-table
            ref="soldiersTable"
            calculate-widths
            id="printMe"
            :headers="headers"
            :items="data"
            :search="search"
            :no-data-text="$t('No_Data_Available')"
            :no-results-text="$t('No_Results_Available')"
            :rows-per-page-text="$t('Rows_Per_Page')"
            :pagination.sync="pagination"
            :loading="isLoading"
            :filter="filterAllNumbers"
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
              <td v-for="header in headers" :key="header.value">
                <template v-if="header.value === 'attachments'">
                  <v-tooltip
                    v-for="(attachment, i) in item.attachments"
                    :key="attachment.name + i"
                    top
                  >
                    <template v-slot:activator="{ on }">
                      <a
                        v-on="on"
                        :href="attachment.link"
                        target="_blank"
                        style="font-size: large;"
                      >
                        📎
                      </a>
                    </template>
                    <span style="color:white">{{ attachment.name }}</span>
                  </v-tooltip>
                </template>

                <template v-else>
                  {{ getKeyPair(header.value.split("."), item) }}</template
                >

                <!-- <v-tooltip v-if="headerIndex === headers.length - 1" top>
                  <template v-slot:activator="{ on }">
                    <v-icon
                      v-on="on"
                      small
                      class="mr-2"
                      @click="showSoldierDialog('addSituation', item)"
                      style="font-size: x-large !important"
                    >
                      mdi-folder-plus-outline
                    </v-icon>
                  </template>
                  <span style="color:white">{{
                    $t("Soldier_Add_Situation")
                  }}</span>
                </v-tooltip> -->
              </td>
            </template>
            <template v-slot:pageText="props">
              الحالى {{ props.pageStart }} - {{ props.pageStop }} من عدد كلى
              {{ props.itemsLength }}
            </template>
          </v-data-table>
        </material-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import materialCard from "~/components/material/AppCard";
import appFilterCard from "~/components/helper/AppFilterCard";
import AppFilterMailCard from "~/components/helper/AppFilterMailCard";
import { mapGetters } from "vuex";
import { get } from "~/plugins/axiosbase";
import { filterAllNumbers, processMails, getKeyPair } from "~/plugins/helpers";
import { outboxFields } from "~/plugins/defaults";
import { paragraphs, getLogo } from "~/plugins/reports/header";

export default {
  layout: "dashboard",
  components: {
    materialCard,
    AppFilterMailCard
  },
  computed: {
    ...mapGetters({
      locations: "app/getLocations",
      defaults: "app/getDefaults"
    }),
    headers() {
      const headers = [];
      this.fields.map(o => {
        const found = this.fieldsValue.find(m => o.value === m);
        if (found) {
          headers.push({
            sortable: true,
            text: o.ar,
            value: o.value,
            width: o.width
          });
        }
      });
      return headers;
    }
  },
  data() {
    return {
      isLoading: false,
      isAdvancedSearch: false,
      status: "pending",
      exportType: undefined,
      modals: {
        search: false,
        distributeMail: false,
        addSituation: false
      },
      mail: {},
      divisions: [],
      search: "",
      fields: outboxFields,
      fieldsValue: outboxFields.map(o => o.value),
      data: [],
      pagination: { rowsPerPage: 25, sortBy: "createdAt" },
      searchFields: []
    };
  },
  methods: {
    getKeyPair,
    filterAllNumbers,
    showDialog() {
      this.modals.search = true;
    },
    showMailDialog(name, data) {
      this.modals[name] = true;
      this.mail = data;
    },
    hidDialog() {
      this.modals.search = false;
    },

    renderMails(data) {
      this.modals.search = false;
      console.log("data", data);
      this.data = processMails(data, {
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
      this.data = processMails(data, {
        locations: this.locations,
        defaults: this.defaults
      });
      // for (let i = 0; i < 50; i++) {
      //   this.data.push(this.data[0]);
      // }
      this.isLoading = true;
    },
    async loadData(query = false) {
      query = query || {};
      query.status = "pending";
      query.type = "outbox";
      const path = "/mail";
      const response = await get(path, query);
      if (response.error) {
        console.log("error fetching soldiers", response.error);
        return [];
      }

      return response.mails;
    }
  },
  async created() {
    const instance = this.init();
    getLogo();
  },
  middleware: ["auth", "isNotLoggedIn", "isAuthorized"],
  meta: {
    branches: ["followup"]
  }
};
</script>
