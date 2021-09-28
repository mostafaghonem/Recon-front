<template>
  <v-container fill-height fluid grid-list-xl style="direction:rtl;">
    <v-layout justify-center wrap>
      <v-flex xs12 md12>
        <material-card dark color="deep" :title="$t('Sector_Data')">
          <v-form ref="form">
            <v-container py-0>
              <v-layout wrap>
                <v-flex xs12 md3>
                  <v-select
                    :no-data-text="$t('No_Selections')"
                    class="form-select"
                    :items="defaults.ARMY_LIST"
                    item-text="ar"
                    item-value="value"
                    v-model="clearance.army"
                    :label="$t('Army')"
                    :disabled="true"
                  />
                </v-flex>
                <v-flex xs12 md3>
                  <v-autocomplete
                    class="form-select"
                    item-text="name"
                    item-value="_id"
                    v-model="clearance.unitId"
                    :no-data-text="$t('No_Selections')"
                    :items="unitsComputed"
                    :label="$t('Sector')"
                    :clearable="true"
                    :rules="rules.unitId"
                    @change="getIndiviuals"
                  />
                </v-flex>
                <v-flex xs12 md3>
                  <v-autocomplete
                    :no-data-text="$t('No_Selections')"
                    class="form-select"
                    :items="indiviuals"
                    item-text="militaryId"
                    item-value="_id"
                    v-model="clearance.soldiersIds"
                    :label="$t('Clearance_Soldiers_IDs')"
                    :rules="rules.soldiersIds"
                    @change="setIndiviual"
                    clearable
                    multiple
                  />
                </v-flex>
                <v-flex xs12 md3>
                  <v-autocomplete
                    :no-data-text="$t('No_Selections')"
                    class="form-select"
                    :items="indiviuals"
                    item-text="fullName"
                    item-value="_id"
                    v-model="clearance.soldiersIds"
                    :label="$t('Clearance_Soldiers_Names')"
                    :rules="rules.soldiersIds"
                    @change="setIndiviual"
                    clearable
                    multiple
                  />
                </v-flex>
              </v-layout>
            </v-container>
          </v-form>
        </material-card>
      </v-flex>
      <v-divider />
      <v-flex xs12 md12>
        <material-card dark color="deep" :title="title">
          <keep-alive>
            <component
              v-if="componentName"
              v-bind:is="componentName"
              :value.sync="clearanceData"
              :indiviualData="indiviualData"
              :external="external"
              :divisions="divisions"
              v-on:submit="submit"
            ></component>
          </keep-alive>
        </material-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import _ from "lodash";
import moment from "moment";
import { mapGetters } from "vuex";
import { Toaster } from "~/plugins/helpers";
import { get, post } from "~/plugins/axiosbase";
import materialCard from "~/components/material/AppCard";

import clearance from "~/components/app/clearances/clearance";

export default {
  layout: "dashboard",
  data() {
    return {
      componentName: "clearance",
      unitId: undefined,
      clearance: {
        army: "general_headquarter"
      },
      divisions: [],
      indiviuals: [],
      cache: {},
      type: "soldiers",
      influence: {
        indiviual: {},
        soldierId: undefined,
        staffId: undefined,
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
      rules: {
        unitId: [v => !!v || this.$t("Division_Required")],
        soldiersIds: [
          v => (!!v && v.length) || this.$t("Clearance_Soldiers_Required")
        ]
      }
    };
  },
  async created() {
    const divisions = await this.getDivisions();
  },
  middleware: ["auth", "isNotLoggedIn"],
  meta: {
    branches: ["recon_force_people"],
    permissions: ["recon_clearance_creator", "recon_clearance_editor"]
  },
  components: {
    materialCard,
    clearance
  },
  computed: {
    unitsComputed() {
      const units = this.divisions.filter(
        o =>
          o.army === this.clearance.army &&
          ["battalion", "company"].includes(o.type) &&
          (o.name.includes("قطاع") || o.name.includes("قيادة قوات"))
      );

      return units;
    },
    title() {
      return this.$t("Soldiers_Data");
    },
    ...mapGetters({
      locations: "app/getLocations",
      defaults: "app/getDefaults"
    }),
    influencesTypes() {
      return this.defaults.INFLUENCES_TYPES;
    }
  },
  methods: {
    setIndiviual(indiviualId) {
      const key =
        this.influence.indiviualType === "soldiers" ? "soldierId" : "staffId";
      const indiviualData = this.indiviuals.find(o => o._id === indiviualId);
      this.influence[key] = indiviualId;
      this.indiviualData = indiviualData;
    },
    setExternal(type) {
      return {};
    },
    async submit(valid) {
      const isValid = this.$refs.form.validate();
      if (isValid && valid) {
        const path = "/clearance";
        const data = {
          soldiersIds: this.clearance.soldiersIds,
          unitId: this.clearance.unitId,
          ...this.clearanceData
        };
        const response = await post(path, data);
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
          title: this.$i18n.t(`Added_Clearance_Success`),
          timer: 4000,
          showConfirmButton: false
        });
        setTimeout(() => {
          window.location.href = "/";
        }, 4000);
      }
    },
    async getDivisions() {
      const path = "/divisions";
      const response = await get(path);
      if (response.error) {
        console.log("error getting divisions", response.error);
        return;
      }
      this.divisions = response.divisions;
    },
    async getIndiviuals() {
      const unitId = this.clearance.unitId;
      // Check if there is cache if not load new data
      if (unitId && this.cache[unitId] && this.cache[unitId].length) {
        this.indiviuals = this.cache[unitId];
        return true;
      } else {
        // Load new indiviuals data
        const indiviuals = await this.loadIndiviualsData({
          unitId,
          influenceType: this.influenceType
        });
        this.indiviuals = indiviuals;
        this.cache[unitId] = _.cloneDeep(this.indiviuals);
      }
    },
    async loadIndiviualsData({ unitId }) {
      const path = `/soldiers`;
      const query = { noClearance: true };
      if (unitId) query.unitId = unitId;
      query.queryObj = { releaseDate: { $gte: moment().toISOString() } };
      const response = await get(path, query);
      if (response.error) {
        console.log("error fetching soldiers", response.error);
        return [];
      }

      return response.soldiers;
    }
  }
};
</script>
