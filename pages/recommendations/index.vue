<template>
  <v-container fill-height fluid grid-list-xl dir="rtl" dark>
    <AppFilterRecommendationCard
      :fields="fields"
      v-model="modals.search"
      v-on:close="modals.search = false"
    />

    <!-- <AppChangeOfRecommendationCard
      v-model="modals.changeOfRecommendation"
      v-on:close="modals.changeOfRecommendation = false"
      :data="soldier"
    /> -->
    <v-layout justify-center wrap>
      <v-flex md12>
        <material-card
          color="primary"
          :title="$t('List_Recommendations')"
          dir="rtl"
        >
          <v-card-title>
            <v-layout wrap>
              <v-flex xs12 md4>
                <v-select
                  :no-data-text="$t('No_Selections')"
                  class="form-select soldier-fields"
                  :items="fieldsItems"
                  item-text="ar"
                  item-value="value"
                  :label="$t('Shown_Fields')"
                  v-model="fieldsValue"
                  @input="selectAllFields"
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
              <!-- <v-layout wrap>
                <v-flex xs12 md4 text-xs-right>
                  <v-select
                    :no-data-text="$t('No_Selections')"
                    class="form-select soldier-fields"
                    :items="exporting.types"
                    item-text="ar"
                    item-value="value"
                    :label="$t('Report_Type')"
                    v-model="exporting.type"
                  />
                </v-flex>

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
                    class="font-weight-light filter-table-button v-btn-print"
                    @click="exportDialog"
                  >
                    {{ $t("Export") }}
                  </v-btn>
                </v-flex>
              </v-layout> -->
            </v-layout>
          </v-card-title>
          <v-data-table
            ref="recommendationsTable"
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
            prev-icon="mdi-menu-right"
            next-icon="mdi-menu-left"
          >
            <template slot="headerCell" slot-scope="{ header }">
              <span
                class="subheading font-weight-light text-label text--darken-3"
                v-text="header.text"
              />
            </template>

            <template slot="items" slot-scope="{ item, index }">
              <tr :active="item.selected">
                <td v-for="header in headers" :key="header.value">
                  <template v-if="header.value === 'actions'">
                    <v-tooltip
                      v-for="(action, actonIndex) in actions"
                      :key="'action-' + actonIndex"
                      top
                    >
                      <template v-slot:activator="{ on }">
                        <v-icon
                          v-on="on"
                          small
                          class="mr-2"
                          @click="action.call(item)"
                          style="font-size: x-large !important; color: #000000 !important"
                        >
                          {{ action.icon }}
                        </v-icon>
                      </template>
                      <span style="color:white">{{ action.text }}</span>
                    </v-tooltip>
                  </template>
                  <template v-else-if="header.value === 'mark'">
                    <!-- <template> -->
                    <label
                      class="container"
                      style="padding-top: 4px !important;"
                    >
                      <input
                        v-model="item.selected"
                        @change="e => reorderData(e, item, index)"
                        type="checkbox"
                      />
                      <span class="checkmark"></span>
                    </label>
                    <!-- </template> -->
                  </template>
                  <template v-else>
                    {{ getKeyPair(header.value.split("."), item) }}</template
                  >
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
import moment from "moment";
import materialCard from "~/components/material/AppCard";
import AppFilterRecommendationCard from "~/components/helper/AppFilterRecommendationCard";
// import AppChangeOfRecommendationCard from "~/components/helper/AppChangeOfRecommendationCard";
// import AppRecommendationInput from "~/components/helper/AppRecommendationInput";
import { mapGetters } from "vuex";
import { isAuthorized } from "~/middleware/isAuthorized";
import { get, post } from "~/plugins/axiosbase";
import {
  processRecommendations,
  getKeyPair,
  selectAllFields,
  Toaster,
  Confirmer
} from "~/plugins/helpers";
import { recommendationFields } from "~/plugins/defaults";
import { getLogo } from "~/plugins/reports/header";
import { exportFile } from "~/plugins/reports/export-doc";
import { editAction, removeAction } from "~/plugins/recommendations/defaults";
// import { generateDocument } from "~/plugins/reports/export-doc-template";

export default {
  layout: "dashboard",
  components: {
    materialCard,
    AppFilterRecommendationCard
  },
  asyncData({ route }) {},
  computed: {
    ...mapGetters({
      locations: "app/getLocations",
      defaults: "app/getDefaults"
    }),
    headers() {
      console.log("computing headers");
      const headers = [];
      if (!this.view && this.fieldsValue.length) {
        let user = {};
        if (
          this.$store.app.context &&
          this.$store.app.context.app &&
          this.$store.app.context.app.context.nuxtState
        ) {
          user = this.$store.app.context.app.context.nuxtState.user;
        }
        const auth = isAuthorized({
          permissions: ["recon_people_editor"],
          branches: ["recon_force_people"],
          userBranch: user.branch,
          userPermissions: user.permissions || []
        });
        if (auth) {
          headers.push({
            text: "الإجراءات",
            value: "actions",
            sortable: false
          });
        }
      }

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
      return headers;
    },
    fieldsItems() {
      const selectAll = { ar: "إختيار الكل", value: "select_all" };
      return [selectAll].concat(this.fields);
    }
  },
  data() {
    return {
      isLoading: false,
      isAdvancedSearch: false,
      exportType: undefined,
      modals: {
        search: false,
        changeOfRecommendation: false,
        addSituation: false
      },
      soldier: {},
      search: "",
      fields: recommendationFields,
      fieldsValue: recommendationFields.map(o => o.value),
      data: [],
      selected: [],
      pagination: { rowsPerPage: 10, sortBy: "recommendationId.name" },
      searchFields: [],
      actions: [editAction(this), removeAction(this)],
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
          }
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
    selectAllFields,
    print() {
      // Pass the element id here
      this.$htmlToPaper("printMe");
    },
    showDialog() {
      this.modals.search = true;
    },
    async showRemoveDialog(item) {
      const confirmation = await Confirmer.fire({
        icon: "error",
        showCancelButton: true,
        title: this.$i18n.t("Confirm_Recommendation_Remove"),
        text: this.$i18n.t("Confirm_Recommendation_Text", {
          name: item.name
        }),
        confirmButtonText: this.$i18n.t("Remove"),
        cancelButtonText: this.$i18n.t("Cancel")
      });

      if (confirmation.isConfirmed) {
        const secondConfirmation = await Confirmer.fire({
          icon: "error",
          showCancelButton: true,
          title: this.$i18n.t("Confirm_Recommendation_Remove_Confirm"),
          text: this.$i18n.t("Confirm_Recommendation_Text_Confirm", {
            name: item.name
          }),
          confirmButtonText: this.$i18n.t("Confirm"),
          cancelButtonText: this.$i18n.t("Cancel")
        });

        if (secondConfirmation.isConfirmed) {
          const path = `/recommendations/delete/${item._id}`;
          const removeResponse = await post(path);
          if (!removeResponse.error) {
            Confirmer.fire({
              icon: "success",
              showConfirmButton: false,
              title: this.$i18n.t("Deleted"),
              text: this.$i18n.t("Recommendation_Deleted", { name: item.name })
            });
            this.data.splice(this.data.findIndex(o => o._id === item._id), 1);
          } else {
            Toaster.fire({
              icon: "error",
              title: removeResponse.error,
              timer: 4000,
              showConfirmButton: false
            });
          }
        }
      }

      this.data.splice(this.data.findIndex(o => o._id === item._id), 1);
    },
    showEditDialog(item) {
      const url = `/recommendations/edit/${item._id}`;
      window.open(url, "_self");
    },
    showRecommendationDialog(name, data) {
      console.log("showing soldier dialog", name);
      this.modals[name] = true;
      this.soldier = data;
    },
    hidDialog() {
      this.modals.search = false;
    },
    reorderData(e, item, index) {
      if (e.target.checked) {
        const obj = JSON.parse(JSON.stringify(item));
        obj.selected = e.target.checked;
        this.selected.push(item);
        // const found = this.data.findIndex(o => o._id === item._id);
        this.data.splice(index, 1);
        this.data = [obj, ...this.data];
        e.target.checked = false;
      } else {
        const index = this.selected.findIndex(o => o._id === item._id);
        this.selected.splice(index, 1);
      }
    },
    async exportDialog() {
      const headers =
        this.exporting.type === "short_report" ? this.headers : this.fields;
      const response = await exportFile({
        data: this.data,
        dataFields: headers,
        fileExtension: this.exporting.file
      });
      // generateDocument({ data: this.data });
    },
    renderRecommendations(data) {
      this.modals.search = false;
      this.data = processRecommendations(data, {
        locations: this.locations,
        defaults: this.defaults
      });

      this.pagination.totalItems = this.data.length;
      this.isLoading = true;
    },
    async init() {
      this.isLoading = true;
      const query = {};
      const data = await this.loadData(query);
      console.log("dat", data);
      this.data = processRecommendations(data, {
        locations: this.locations,
        defaults: this.defaults
      });

      this.isLoading = true;
    },
    async loadData(query = false) {
      const path = "/recommendations";
      const response = await get(path, query);
      if (response.error) {
        console.log("error fetching recommendations", response.error);
        return [];
      }

      return response.recommendations;
    }
  },
  async created() {
    const instance = this.init();
  },
  middleware: ["auth", "isNotLoggedIn", "isAuthorized"],
  meta: {
    branches: ["recon_force_people"],
    permissions: ["recon_recommendations_manager"]
  }
};
</script>
