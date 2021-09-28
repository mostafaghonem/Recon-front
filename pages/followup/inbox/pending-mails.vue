<template>
  <v-container fill-height fluid grid-list-xl dir="rtl" dark>
    <!-- <appFilterCard v-model="isAdvancedSearch" :fields="fields" /> -->
    <AppFilterMailCard
      type="inbox"
      :status="status"
      :fields="fields"
      v-model="modals.search"
      v-on:close="modals.search = false"
    />
    <AppDistributeMailCard
      v-model="modals.distributeMail"
      v-on:close="modals.distributeMail = false"
      :data="mail"
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
                width="1%"
                class="subheading font-weight-light text-label text--darken-3"
                v-text="header.text"
              />
            </template>
            <template slot="items" slot-scope="{ item }"
              ><tr :active="item.selected">
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
                  <template v-else-if="header.value === 'actions'">
                    <v-tooltip top>
                      <template v-slot:activator="{ on }">
                        <v-icon
                          v-on="on"
                          small
                          class="mr-2"
                          @click="showMailDialog('distributeMail', item)"
                          style="font-size: x-large !important"
                        >
                          mdi-folder-move
                        </v-icon>
                      </template>
                      <span style="color:white">{{
                        $t("Writing_Distribute_Mail")
                      }}</span>
                    </v-tooltip>
                  </template>
                  <template v-else-if="header.value === 'mark'">
                    <template>
                      <label
                        class="container"
                        style="padding-top: 4px !important;"
                      >
                        <input v-model="item.selected" type="checkbox" />
                        <span class="checkmark"></span>
                      </label>
                    </template>
                  </template>
                  <template v-else>
                    <span v-on:dblclick="openAttachment(item)">
                      {{ getKeyPair(header.value.split("."), item) }}</span
                    >
                  </template>
                </td>
              </tr>
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
import AppDistributeMailCard from "~/components/helper/AppDistributeMailCard";
import { mapGetters } from "vuex";
import { get } from "~/plugins/axiosbase";
import { filterAllNumbers, processMails, getKeyPair } from "~/plugins/helpers";
import { inboxFields } from "~/plugins/defaults";
import { paragraphs, getLogo } from "~/plugins/reports/header";

// Importing Icon
import { mdiAttachment } from "@mdi/js";
export default {
  layout: "dashboard",
  components: {
    materialCard,
    AppFilterMailCard,
    AppDistributeMailCard
  },
  computed: {
    ...mapGetters({
      locations: "app/getLocations",
      defaults: "app/getDefaults"
    }),
    headers() {
      const headers = [{ text: "الإختيار", value: "mark", sortable: false }, { text: "الإجراءات", value: "actions", sortable: false }];
      this.fields.map(o => {
        const found = this.fieldsValue.find(m => o.value === m);
        if (found) {
          headers.push({
            sortable: true,
            text: o.ar,
            value: o.value
          });
        }
      });
      // headers.push({ text: "الإجراءات", value: "actions", sortable: false });
      return headers;
    }
  },
  data() {
    return {
      mdiAttachment,
      isLoading: false,
      isAdvancedSearch: false,
      status: "pending",
      exportType: undefined,
      modals: {
        search: false,
        distributeMail: false,
        changeOfUnit: false,
        addSituation: false
      },
      mail: {},
      divisions: [],
      search: "",
      fields: inboxFields.filter(
        o => !["branch", "branches", "decision",'arkanDecision'].find(p => p === o.value)
      ),
      fieldsValue: inboxFields.map(o => o.value),
      data: [],
      pagination: { rowsPerPage: 25, sortBy: "createdAt", descending: true },
      searchFields: []
    };
  },
  methods: {
    getKeyPair,
    filterAllNumbers,
    openAttachment(item) {
      if (item.attachments && item.attachments.length) {
        window.open(item.attachments[0].link, "_blank");
      }
    },
    print() {
      // Pass the element id here
      this.$htmlToPaper("printMe");
    },
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
      console.log("db mail data", data);
      this.data = processMails(data, {
        locations: this.locations,
        defaults: this.defaults
      });
      // for (let i = 0; i < 50; i++) {
      //   this.data.push(this.data[0]);
      // }
      this.isLoading = true;
    },
    async loadData(query = {}) {
      query = query || {};
      query.status = "pending";
      query.type = "inbox";
      const path = "/mail";
      const response = await get(path, query);
      if (response.error) {
        console.log("error fetching soldiers", response.error);
        return [];
      }

      return response.mails;
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
    getLogo();
  },
  middleware: ["auth", "isNotLoggedIn", "isAuthorized"],
  meta: {
    branches: ["followup"]
  }
};
</script>
