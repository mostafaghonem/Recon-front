<template>
  <v-container fill-height fluid grid-list-xl dir="rtl" dark>
    <!-- <appFilterCard v-model="isAdvancedSearch" :fields="fields" /> -->
    <AppFillLetter
      v-model="modals.fillLetter"
      v-on:close="modals.fillLetter = false"
      :data="change"
      :extra.sync="extra"
    />
    <v-layout justify-center wrap>
      <v-flex md12>
        <material-card
          color="primary"
          :title="
            type === 'staff'
              ? $t('Staff_Change_Of_Units')
              : $t('Soldiers_Change_Of_Units')
          "
          dir="rtl"
        >
          <v-card-title>
            <v-layout wrap>
              <v-flex xs12 md4 text-xs-right>
                <v-select
                  :no-data-text="$t('No_Selections')"
                  class="form-select soldier-fields"
                  :items="exporting.files"
                  item-text="ar"
                  item-value="value"
                  :label="$t('Report_FileType')"
                  v-model="exporting.file"
                />
              </v-flex>
              <v-flex xs12 md3 text-xs-right>
                <v-btn
                  class="font-weight-light filter-table-button"
                  @click="exportFileDialog"
                >
                  {{ $t("Export") }}
                </v-btn>
              </v-flex>
            </v-layout>
          </v-card-title>
          <v-data-table
            ref="usersTable"
            calculate-widths
            :disable-initial-sort="false"
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
              <tr :active="item.selected">
                <td v-for="header in headers" :key="header.value">
                  <template v-if="header.value === 'actions'">
                    <v-tooltip top>
                      <template v-slot:activator="{ on }">
                        <v-icon
                          v-on="on"
                          small
                          class="mr-2"
                          style="font-size: x-large !important"
                          @click="showChangeDialog('fillLetter', item)"
                        >
                          <!-- @click="exportLetterDialog(item)" -->
                          mdi-email
                        </v-icon>
                      </template>
                      <span style="color:white">{{
                        $t("Change_Of_Unit_Letter")
                      }}</span>
                    </v-tooltip>
                  </template>

                  {{ getKeyPair(header.value.split("."), item) }}

                  <!-- <v-tooltip v-if="headerIndex === headers.length - 1" top>
                  <template v-slot:activator="{ on }">
                    <v-icon
                      v-on="on"
                      small
                      class="mr-2"
                      @click="showChangeDialog('changeOfUnit', item)"
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
              </tr>
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
import _ from "lodash";
import materialCard from "~/components/material/AppCard";
import AppFillLetter from "~/components/helper/AppFillLetter";
import { mapGetters } from "vuex";
import { get } from "~/plugins/axiosbase";
import { processChangeOfUnits, getKeyPair } from "~/plugins/helpers";
import { changeOfUnitFields } from "~/plugins/defaults";
import { paragraphs, getLogo } from "~/plugins/reports/header";
import { exportLetter } from "~/plugins/reports/export-letter";
import { exportFile } from "~/plugins/reports/export-doc";
export default {
  layout: "dashboard",
  components: {
    materialCard,
    AppFillLetter
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
            value: o.value
          });
        }
      });
      if (this.type === "soldier") {
        headers.push({ text: "الإجراءات", value: "actions", sortable: false });
      }
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
        fillLetter: false,
        addSituation: false
      },
      change: {},
      extra: {
        referenceNumber: undefined,
        sender: {
          rank: undefined,
          name: undefined,
          movingDate: undefined,
          movingDateModal: false
        }
      },
      divisions: [],
      search: "",
      data: [],
      pagination: { rowsPerPage: 10, sortBy: "unitName" },
      exporting: {
        types: [
          {
            ar: "تقرير مفصل",
            value: "detailed_report"
          },
          {
            ar: "تقرير مختصر (الحقول المعروضة فقط)",
            value: "short_report"
          }
        ],
        files: [
          {
            ar: "excel",
            value: "excel"
          },
          {
            ar: "docx",
            value: "docx"
          },
          // {
          //   ar: "pdf",
          //   value: "pdf"
          // }
        ],
        type: undefined,
        file: undefined
      }
    };
  },
  methods: {
    getKeyPair,
    showChangeDialog(name, data) {
      console.log("showing soldier dialog", data);
      this.modals[name] = true;
      this.change = data;
    },
    async exportFileDialog() {
      const titleText = ``;
      const headers = _.cloneDeep(this.fields);
      const response = await exportFile({
        titleText,
        dataFields: headers,
        data: this.data,
        fileExtension: this.exporting.file
      });
    },
    async exportLetterDialog() {
      const headers = _.cloneDeep(this.fields).slice(0, 3);
      const response = await exportLetter({
        dataFields: headers,
        data: this.change,
        extra: this.extra,
        fileExtension: this.exporting.file
      });
    },
    renderChangeOfUnits(data) {
      this.modals.search = false;
      this.data = processChangeOfUnits(data, {
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
      this.data = processChangeOfUnits(data, {
        locations: this.locations,
        defaults: this.defaults
      });
      this.isLoading = true;
    },
    async loadData(query = false) {
      const path = `/change-of-unit?type=${this.type}`;
      const response = await get(path, query);
      if (response.error) {
        console.log("error fetching soldiers", response.error);
        return [];
      }

      return response.changes;
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
  middleware: ["auth", "isNotLoggedIn"],
  async asyncData({ route }) {
    let type = "soldier";
    if (route.path.includes("staff")) {
      type = "staff";
    }
    const fields = changeOfUnitFields(type);
    const fieldsValue = fields.slice(0, 7).map(o => o.value);
    console.log("fields", type, fields);
    return { type, fields, fieldsValue };
  }
};
</script>
