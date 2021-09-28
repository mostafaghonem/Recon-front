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
                    :items="INDIVIDUAL_TYPES"
                    item-text="ar"
                    item-value="value"
                    v-model="influence.indiviualType"
                    :label="$t('Individual_Type')"
                    @change="getIndiviuals"
                  />
                </v-flex>
                <v-flex xs12 md4>
                  <v-autocomplete
                    :no-data-text="$t('No_Selections')"
                    class="form-select"
                    :items="indiviuals"
                    item-text="militaryId"
                    item-value="_id"
                    v-model="influence.indiviualId"
                    :label="$t('Indiviual_Millitary_Id')"
                    @change="setIndiviual"
                    :clearable="true"
                  />
                </v-flex>

                <v-flex xs12 md4>
                  <v-autocomplete
                    :no-data-text="$t('No_Selections')"
                    class="form-select"
                    :items="filterTypes(defaults.INFLUENCES_TYPES)"
                    item-text="ar"
                    item-value="value"
                    v-model="influence.type"
                    :label="$t('Influence_Type')"
                    :disabled="!influence.indiviualId"
                    @change="setType"
                    :clearable="true"
                  />
                </v-flex>
              </v-layout>
              <v-layout wrap>
                <v-flex xs12 md4>
                  <v-autocomplete
                    :no-data-text="$t('No_Selections')"
                    class="form-select"
                    :items="indiviuals"
                    item-text="fullName"
                    item-value="_id"
                    v-model="influence.indiviualId"
                    :label="$t('Individual_Name')"
                    @change="setIndiviual"
                    :clearable="true"
                  />
                </v-flex>
                <v-flex xs12 md4>
                  <v-autocomplete
                    :no-data-text="$t('No_Selections')"
                    class="form-select"
                    :items="indiviuals"
                    item-text="unit.unitId.name"
                    item-value="_id"
                    v-model="influence.indiviualId"
                    :label="$t('Individual_Unit')"
                    :disabled="true"
                  />
                </v-flex>

                <v-flex xs12 md4> </v-flex>
              </v-layout>
              <!-- <v-flex xs12 text-xs-right>
                  <v-btn
                    class="font-weight-light add-button v-btn-add"
                    @click="submit"
                  >
                    {{ $t("Add") }}
                  </v-btn>
                </v-flex> -->
            </v-container>
          </v-form>
        </material-card>
      </v-flex>
      <v-divider />
      <v-flex xs12 md12>
        <material-card dark color="deep" :title="$t('Influence_Data')">
          <v-tabs @change="setCategory" color="deep" grow dark>
            <v-tabs-slider color="red"></v-tabs-slider>

            <v-tab
              v-for="category in defaults.INFLUENCES_CATEGORIES"
              :key="category.value"
              :href="`#${category.value}`"
            >
              {{ category.ar }}
            </v-tab>

            <v-tabs-items>
              <v-tab-item
                v-for="(category, i) in defaults.INFLUENCES_CATEGORIES"
                :key="i"
                :value="category.value"
              >
                <v-spacer></v-spacer>
                <!-- <component
                    v-if="influence.type"
                    v-bind:is="influence.type"
                    v-on:submit="submit"
                  ></component> -->
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
                    الحالى {{ props.pageStart }} - {{ props.pageStop }} من عدد
                    كلى
                    {{ props.itemsLength }}
                  </template>
                </v-data-table>
              </v-tab-item>
            </v-tabs-items>
          </v-tabs>
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
  processInfluences
} from "~/plugins/helpers";
import { get, post } from "~/plugins/axiosbase";
import materialCard from "~/components/material/AppCard";

import {
  fleeFields,
  comebackFields,
  fugitivesFields,
  trainingFields,
  travellingFields,
  literacyFields,
  rankingFields,
  demotionFields,
  executionFields,
  driversLicenseFields,
  punishmentsFields
} from "~/plugins/defaults";

export default {
  layout: "dashboard",
  data() {
    return {
      tab: undefined,
      influenceTypeComponent: "promotion",
      fields: [],
      data: [],
      indiviuals: [],
      influencesFields: {
        fleeFields,
        comebackFields,
        fugitivesFields,
        trainingFields,
        travellingFields,
        literacyFields,
        rankingFields,
        demotionFields,
        executionFields,
        driversLicenseFields,
        punishmentsFields
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
      influence: {
        indiviual: {},
        soldierId: undefined,
        staffId: undefined,
        type: undefined,
        category: undefined,
        indiviualType: undefined,
        indiviualId: undefined
      },
      indiviualData: {},
      influenceData: {},
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
  async created() {},
  middleware: ["auth", "isNotLoggedIn"],
  meta: {
    branches: ["recon_force_people"],
    permissions: ["recon_influences_creator", "recon_influences_editor"]
  },
  components: {
    materialCard
  },
  computed: {
    ...mapGetters({
      locations: "app/getLocations",
      defaults: "app/getDefaults"
    }),
    influencesTypes() {
      return this.defaults.INFLUENCES_TYPES;
    },
    headers() {
      const influenceCategory = this.influence.category;
      // if (influenceType === "all" || !influenceType) {
      //   Object.keys(this.influencesFields).map(
      //     o => (all = all.concat(this.influencesFields[o]))
      //   );
      //   return _.uniqBy(all, function(e) {
      //     return e.ar;
      //   }).map(o => ({
      //     sortable: true,
      //     text: o.ar,
      //     value: o.value,
      //     align: "left",
      //     width: "0.25%"
      //   }));

      //   // return all;
      // } else {
      // }
      const fields = this.influencesFields[`${influenceCategory}Fields`];
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
    filterTypes(types) {
      if (!this.influence.indiviualId) {
        return types;
      }
      return this.filterInfluenceTypes(
        types,
        this.defaults.RANKS,
        this.influence.category
      );
    },
    setIndiviual(indiviualId) {
      const key =
        this.influence.indiviualType === "soldiers" ? "soldierId" : "staffId";
      const indiviualData = this.indiviuals.find(o => o._id === indiviualId);
      this.influence[key] = indiviualId;
      this.indiviualData = indiviualData;
      this.updateData(this.indiviualData);
    },
    setCategory(value) {
      this.influence.category = value;
      this.data = [];
      this.updateData(this.indiviualData);
    },
    setType() {
      this.data = [];
      this.updateData(this.indiviualData);
    },
    updateData(indiviualData) {
      if (!indiviualData.influences) {
        return false;
      }

      const data = indiviualData.influences
        .filter(o => {
          const inCategory =
            o.influenceId && o.influenceId.category === this.influence.category;
          const inType = this.influence.type
            ? o.influenceId && o.influenceId.type === this.influence.type
            : true;

          return inType && inCategory;
        })
        .map(o => ({
          ...o.influenceId[o.influenceId.type],
          createdAt: o.influenceId.createdAt,
          type: o.influenceId.type,
          category: o.influenceId.category
        }));

      if (data) {
        this.data = processInfluences(data, {
          locations: this.locations,
          defaults: this.defaults
        });
      }
    },
    async submit(valid) {
      const isValid = this.$refs.form.validate();
      if (isValid && valid) {
        const path = "/influence";
        this.influence[this.influence.category] = this.influenceData;
        const response = await post(path, this.influence);
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
    async getIndiviuals(type) {
      const indiviuals = await this.loadIndiviualsData({
        type,
        influenceType: this.influenceType
      });
      this.indiviuals = indiviuals;
    },
    async init() {
      // this.isLoading = true;
      // const data = await this.loadData();
      // this.isLoading = true;
    },
    async loadIndiviualsData({ type, influenceType }) {
      const path = `/${type}`;
      const query = {};
      query.influenceType = influenceType;
      const response = await get(path, query);
      if (response.error) {
        console.log("error fetching soldiers", response.error);
        return [];
      }

      // Parse the data the right way to make sure the existense of unit object not to break code
      const data = response[type].map(o => {
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
