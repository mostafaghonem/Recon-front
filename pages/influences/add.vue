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
                    @change="setExternal"
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
        <material-card dark color="deep" :title="title">
          <keep-alive>
            <component
              v-if="influence.type"
              v-bind:is="influence.type"
              :value.sync="influenceData"
              :indiviualData="indiviualData"
              :external="external"
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
import { Toaster, filterInfluenceTypes } from "~/plugins/helpers";
import { get, post } from "~/plugins/axiosbase";
import materialCard from "~/components/material/AppCard";

import promotion from "~/components/app/influences/promotion";
import demotion from "~/components/app/influences/demotion";
import execution from "~/components/app/influences/execution";
import flee from "~/components/app/influences/flee";
import comeback from "~/components/app/influences/comeback";
import training from "~/components/app/influences/training";
import travelling from "~/components/app/influences/travelling";
import punishments from "~/components/app/influences/punishments";
import driversLicense from "~/components/app/influences/driversLicense";
import literacy from "~/components/app/influences/literacy";

export default {
  layout: "dashboard",
  data() {
    return {
      influenceTypeComponent: "promotion",
      indiviuals: [],
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
    materialCard,
    promotion,
    demotion,
    execution,
    flee,
    comeback,
    training,
    travelling,
    punishments,
    driversLicense,
    literacy
  },
  computed: {
    title() {
      if (this.influence.type) {
        return [
          this.$t("DATA"),
          this.$t(this.influence.type.toUpperCase())
        ].join(" ");
      }
      return this.$t("Influence_Data");
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
    filterInfluenceTypes,
    filterTypes(types) {
      if (!this.influence.indiviualId) {
        return types;
      }
      return this.filterInfluenceTypes(types, this.defaults.RANKS);
    },
    setIndiviual(indiviualId) {
      const key =
        this.influence.indiviualType === "soldiers" ? "soldierId" : "staffId";
      const indiviualData = this.indiviuals.find(o => o._id === indiviualId);
      this.influence[key] = indiviualId;
      this.indiviualData = indiviualData;
    },
    setExternal(type) {
      console.log(
        "setting external and",
        type,
        this.promotionData,
        this.executionData
      );
      if (type === "comeback") {
        this.external = JSON.parse(JSON.stringify(this.flee));
      }
      if (type === "promotion") {
        this.external = JSON.parse(JSON.stringify(this.promotionData));
      }
      if (type === "demotion") {
        this.external = JSON.parse(JSON.stringify(this.demotionData));
      }
      if (type === "execution") {
        this.external = JSON.parse(JSON.stringify(this.executionData));
      }
      return {};
    },
    async submit(valid) {
      console.log("is valid or not ", valid);
      const isValid = this.$refs.form.validate();
      if (isValid && valid) {
        const path = "/influence";
        this.influence[this.influence.type] = this.influenceData;
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
      // Check if there is cache if not load new data
      if (this[type] && this[type].length) {
        this.indiviuals = this[type];
        return true;
      }

      // Load new indiviuals data
      const indiviuals = await this.loadIndiviualsData({
        type,
        influenceType: this.influenceType
      });
      this.indiviuals = indiviuals;
      this[type] = _.cloneDeep(this.indiviuals);
    },
    async loadIndiviualsData({ type, influenceType }) {
      const path = `/${type}`;
      const query = {};
      if (type === "soldiers")
        query.queryObj = { releaseDate: { $gte: moment().toISOString() } };
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
