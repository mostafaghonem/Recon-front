<template>
  <v-container fill-height fluid grid-list-xl style="direction:rtl;">
    <v-layout justify-center wrap>
      <v-flex xs12 md12>
        <material-card dark color="deep" :title="$t('Indiviual_Data')">
          <v-form ref="form">
            <v-container py-0>
              <v-layout wrap>
                <v-flex xs12 md4>
                  <v-autocomplete
                    :no-data-text="$t('No_Selections')"
                    class="form-select"
                    :items="previews"
                    item-text="ar"
                    item-value="value"
                    v-model="previewType"
                    :label="$t('Preview_Type')"
                    @change="setPreview"
                  />
                </v-flex>
                <v-flex v-if="previewType === 'clearanceArchive'" xs12 md4>
                  <v-autocomplete
                    :no-data-text="$t('No_Selections')"
                    class="form-select"
                    :items="soldiers"
                    item-text="militaryId"
                    item-value="_id"
                    v-model="clearance.indiviualId"
                    :label="$t('Indiviual_Millitary_Id')"
                    @change="setIndiviual"
                    :clearable="true"
                  />
                </v-flex>
                <v-flex v-if="previewType === 'clearanceArchive'" xs12 md4>
                  <v-autocomplete
                    :no-data-text="$t('No_Selections')"
                    class="form-select"
                    :items="soldiers"
                    item-text="fullName"
                    item-value="_id"
                    v-model="clearance.indiviualId"
                    :label="$t('Individual_Name')"
                    @change="setIndiviual"
                    :clearable="true"
                  />
                </v-flex>
                <v-flex v-if="previewType === 'clearanceArchive'" xs12 md4>
                  <v-autocomplete
                    :no-data-text="$t('No_Selections')"
                    class="form-select"
                    :items="soldiers"
                    item-text="unit.unitId.name"
                    item-value="_id"
                    v-model="clearance.indiviualId"
                    :label="$t('Individual_Unit')"
                    :disabled="true"
                  />
                </v-flex>
              </v-layout>
            </v-container>
          </v-form>
        </material-card>
      </v-flex>
      <v-divider />
      <v-flex xs12 md12>
        <material-card dark color="deep" :title="$t('Clearance_Data')">
          <v-data-table
            ref="soldiersTable"
            calculate-widths
            id="printMe"
            :headers="headers"
            :items="data"
            :no-data-text="$t('No_Data_Available')"
            :no-results-text="$t('No_Results_Available')"
            :rows-per-page-text="$t('Rows_Per_Page')"
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
            <template slot="items" slot-scope="{ item }">
              <tr>
                <td
                  width="1%"
                  class="text-xs-right"
                  v-for="header in headers"
                  :key="header.value"
                  style="word-wrap: break-word;"
                >
                  <template>
                    <span>
                      {{ getKeyPair(header.value.split("."), item) }}
                    </span></template
                  >
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
import _ from "lodash";
import moment from "moment";
import { mapGetters } from "vuex";
import {
  Toaster,
  filterInfluenceTypes,
  getKeyPair,
  processClearances
} from "~/plugins/helpers";
import { get, post } from "~/plugins/axiosbase";
import materialCard from "~/components/material/AppCard";

import { clearanceFields } from "~/plugins/defaults";
export default {
  layout: "dashboard",
  data() {
    return {
      tab: undefined,
      previewType: undefined,
      clearanceTypeComponent: "promotion",
      previews: [
        {
          ar: "الكل",
          value: "clearance"
        },
        {
          ar: "سجل تحركات مجند",
          value: "clearanceArchive"
        }
      ],
      fields: [],
      data: [],
      soldiers: [],
      previewFields: {
        clearanceFields,
        clearanceArchiveFields: []
      },
      INDIVIDUAL_TYPES: [
        {
          ar: "مجند",
          value: "soldiers"
        },
        {
          ar: "صف",
          value: "staff"
        }
      ],
      clearance: {
        indiviual: {},
        soldierId: undefined,
        staffId: undefined,
        type: undefined,
        category: undefined,
        indiviualType: undefined,
        indiviualId: undefined
      },
      indiviualData: {},
      clearanceData: {},
      flee: {},
      promotionData: {},
      demotionData: {},
      executionData: {},
      external: {},
      disabled: {
        branch: false,
        permissions: false
      },
      rules: {}
    };
  },
  async created() {
    // this.getData();
  },
  middleware: ["auth", "isNotLoggedIn"],
  meta: {
    branches: ["recon_force_people"],
    permissions: ["recon_clearance_creator", "recon_clearance_editor"]
  },
  components: {
    materialCard
  },
  computed: {
    ...mapGetters({
      locations: "app/getLocations",
      defaults: "app/getDefaults"
    }),
    clearancesTypes() {
      return this.defaults.INFLUENCES_TYPES;
    },
    headers() {
      const fields = this.previewFields.clearanceFields;
      const headers = [];
      if (!fields) {
        return [];
      }
      fields.map(o => {
        headers.push({
          sortable: true,
          text: o.ar,
          value: o.value,
          align: "left",
          width: "0.25%"
        });
      });
      return headers;
    }
  },
  methods: {
    getKeyPair,
    filterInfluenceTypes,
    async setPreview() {
      if (this.previewType === "clearanceArchive") {
        const soldiers = await this.loadIndiviuals();
        this.soldiers = soldiers;
      } else {
        const clearances = await this.loadClearances();
        this.data = processClearances(clearances, {
          defaults: this.defaults,
          locations: this.locations
        });
      }
    },
    filterTypes(types) {
      if (!this.clearance.indiviualId) {
        return types;
      }
      return this.filterInfluenceTypes(
        types,
        this.defaults.RANKS,
        this.clearance.category
      );
    },
    setIndiviual(indiviualId) {
      const indiviualData = this.soldiers.find(o => o._id === indiviualId);
      this.indiviualData = indiviualData;
      this.updateData(this.indiviualData);
    },
    setCategory(value) {
      this.data = [];
      this.updateData(this.indiviualData);
    },
    setType() {
      this.data = [];
      this.updateData(this.indiviualData);
    },
    updateData(indiviualData) {
      if (!indiviualData.clearances) {
        return false;
      }

      const data = indiviualData.clearances.map(o => ({
        ...indiviualData,
        ...o.clearanceId,
        createdAt: o.clearanceId.createdAt
      }));

      console.log("data", data);
      if (data) {
        this.data = processClearances(data, {
          locations: this.locations,
          defaults: this.defaults
        });
        console.log("the final data", this.data);
      }
    },
    async submit(valid) {
      const isValid = this.$refs.form.validate();
      if (isValid && valid) {
        const path = "/clearance";
        this.clearance[this.clearance.category] = this.clearanceData;
        const response = await post(path, this.clearance);
        if (response.error) {
          return Toaster.fire({
            icon: "error",
            title: response.error,
            timer: 4000,
            showConfirmButton: false
          });
        }
        Toaster.fire({
          icon: "success",
          title: this.$i18n.t(`Added_Influence_Success`),
          timer: 4000,
          showConfirmButton: false
        });
        setTimeout(() => {
          window.location.href = "/";
        }, 4000);
      }
    },
    async getData() {
      if (this.previewType === "individual") {
      } else {
        const clearances = await this.loadClearances();
        this.data = processClearances(clearances, {
          defaults: this.defaults,
          locations: this.locations
        });
      }
    },
    async init() {
      // this.isLoading = true;
      // const data = await this.loadData();
      // this.isLoading = true;
    },
    async loadIndiviuals() {
      const path = `/soldiers?clearance=true`;
      const query = {};
      query.soldierId = this.soldierId;
      const response = await get(path, query);
      if (response.error) {
        console.log("error fetching soldiers", response.error);
        return [];
      }

      // Parse the data the right way to make sure the existense of unit object not to break code
      const data = response.soldiers.map(o => {
        if (!o.unit) {
          o.unit = {
            unitId: ""
          };
        }
        if (!o.unit.unitId) {
          o.unit.unitId = "";
        }
        return o;
      });
      return data;
    },
    async loadClearances() {
      const path = `/clearance`;
      const query = {};
      const response = await get(path, query);
      if (response.error) {
        console.log("error fetching soldiers", response.error);
        return [];
      }

      // Parse the data the right way to make sure the existense of unit object not to break code
      const data = response.clearances.map(o => {
        if (!o.unit) {
          o.unit = {
            unitId: ""
          };
        }
        if (!o.unit.unitId) {
          o.unit.unitId = "";
        }
        return o;
      });
      return data;
    }
  }
};
</script>
