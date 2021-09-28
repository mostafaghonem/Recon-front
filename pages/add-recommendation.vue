<template>
  <v-container fill-height fluid grid-list-xl style="direction:rtl;">
    <v-layout justify-center wrap>
      <v-flex xs12 md12>
        <material-card dark color="deep" :title="$t('Add_Recommendation')">
          <v-form ref="form">
            <v-container py-0>
              <v-layout>
                <v-flex xs12 md3>
                  <v-autocomplete
                    :no-data-text="$t('No_Selections')"
                    class="form-select"
                    :items="defaults.RECOMMENDATION_TYPES"
                    item-text="ar"
                    item-value="value"
                    v-model="type"
                    :label="$t('Recommendation_Type')"
                    clearable
                  />
                </v-flex>
                <v-flex v-if="type" xs12 md3>
                  <v-text-field
                    class="white-input"
                    :label="$t('Name')"
                    :rules="rules.name"
                    v-model="recommendation.fullName"
                  />
                </v-flex>
                <v-flex v-if="['unit', 'distributed'].includes(type)" xs12 md3>
                  <v-text-field
                    class="white-input"
                    @keypress="onlyNumber"
                    :maxlength="recordIdLength"
                    :label="$t('Record_ID')"
                    :rules="rules.recordId"
                    @input="processRecordId"
                    :error-messages="recordIdErrorMessages"
                    v-model="recommendation.recordId"
                  />
                </v-flex>
                <v-flex v-if="['unit', 'distributed'].includes(type)" xs12 md3>
                  <v-text-field
                    class="white-input"
                    @keypress="onlyNumber"
                    :maxlength="militaryIdLength"
                    :minlength="militaryIdLength"
                    :label="$t('Military_ID')"
                    :rules="rules.militaryId"
                    @input="processMilitaryId"
                    :error-messages="militaryIdErrorMessages"
                    v-model="recommendation.militaryId"
                  />
                </v-flex>
                <v-flex v-if="['officers', 'weapons'].includes(type)" xs12 md1>
                  <v-text-field
                    class="white-input tripleNumber"
                    @keypress="onlyNumber"
                    :label="$t('Triple_Number_Third')"
                    :rules="rules.tripleNumber"
                    v-model="tripleNumber.third"
                    @change="processTripleNumber"
                    :error-messages="tripleNumberErrorMessages"
                  />
                </v-flex>
                <v-flex v-if="['officers', 'weapons'].includes(type)" xs12 md1>
                  <v-text-field
                    class="white-input tripleNumber"
                    @keypress="onlyNumber"
                    :label="$t('Triple_Number_Second')"
                    :rules="rules.tripleNumber"
                    v-model="tripleNumber.second"
                    @change="processTripleNumber"
                    :error-messages="tripleNumberErrorMessages"
                  />
                </v-flex>
                <v-flex v-if="['officers', 'weapons'].includes(type)" xs12 md1>
                  <v-text-field
                    class="white-input tripleNumber"
                    @keypress="onlyNumber"
                    :label="$t('Triple_Number_First')"
                    :rules="rules.tripleNumber"
                    v-model="tripleNumber.first"
                    @change="processTripleNumber"
                    :error-messages="tripleNumberErrorMessages"
                  />
                </v-flex>
                <v-flex v-if="type" xs12 md3>
                  <v-text-field
                    class="white-input"
                    :label="$t('Eductional_Rank')"
                    :rules="rules.education"
                    v-model="recommendation.education"
                  />
                </v-flex>
              </v-layout>
              <v-layout v-if="type" wrap>
                <v-flex xs12 md3>
                  <v-autocomplete
                    :no-data-text="$t('No_Selections')"
                    class="form-select"
                    :items="locations.recruitmentAreas"
                    item-text="ar"
                    item-value="value"
                    v-model="recommendation.recruitmentArea"
                    :label="$t('Recruitment_Area')"
                  />
                </v-flex>
                <v-flex xs12 md3>
                  <v-text-field
                    :no-data-text="$t('No_Selections')"
                    class="form-select"
                    v-model="recommendation.force"
                    :label="$t('Force')"
                  />
                </v-flex>
                <v-flex xs12 md3>
                  <v-autocomplete
                    :no-data-text="$t('No_Selections')"
                    class="form-select"
                    :items="defaults.RECRUITMENT_LEVELS"
                    item-text="ar"
                    item-value="value"
                    :label="$t('RECRUITMENT_LEVEL')"
                    v-model="recommendation.recruitmentLevel"
                  />
                </v-flex>
                <v-flex xs12 md3>
                  <v-text-field
                    :no-data-text="$t('No_Selections')"
                    class="white-input"
                    :label="$t('Recommender_Rank')"
                    v-model="recommendation.recommenderRank"
                  />
                </v-flex>
              </v-layout>

              <v-layout v-if="type" wrap>
                <v-flex xs12 md3>
                  <v-text-field
                    :no-data-text="$t('No_Selections')"
                    class="white-input"
                    :label="$t('Recommender_Name')"
                    v-model="recommendation.recommender"
                  />
                </v-flex>
                <v-flex v-if="['unit', 'distributed'].includes(type)" xs12 md3>
                  <v-text-field
                    class="white-input"
                    :label="$t('Unit_Only')"
                    v-model="recommendation.unit"
                    :rules="rules.unit"
                  />
                </v-flex>
                <v-flex xs12 md3>
                  <v-text-field
                    class="white-input"
                    :label="$t('Notes')"
                    v-model="recommendation.notes"
                  />
                </v-flex>
              </v-layout>
              <v-layout wrap>
                <v-flex md6 text-xs-right>
                  <v-btn
                    class="font-weight-light add-button v-btn-add"
                    @click="submit"
                  >
                    {{ edit ? $t("Edit") : $t("Add") }}
                  </v-btn>
                </v-flex>
                <v-flex v-if="!edit" md6 text-xs-right>
                  <v-btn
                    class="font-weight-light add-button v-btn-youtube"
                    color="yellow"
                    @click="reset"
                  >
                    {{ $t("RESET") }}
                  </v-btn>
                </v-flex>
              </v-layout>
            </v-container>
          </v-form>
        </material-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import _ from "lodash";
import { mapGetters } from "vuex";
import { onlyNumber, Toaster } from "~/plugins/helpers";
import { get, post } from "~/plugins/axiosbase";
import moment, { months } from "moment";
import materialCard from "~/components/material/AppCard";

const initial = {
  isDuplicate: false,
  tripleNumber: undefined,
  address: {},
  militaryId: undefined,
  recordId: undefined,
  fullName: undefined,
  name: undefined,
  force: undefined,
  situation: "without",
  recruitmentLevel: "first",
  treatment: "without_extra_year",
  notes: "",
  influences: []
};
export default {
  layout: "dashboard",
  data() {
    return {
      tripleNumber: {
        first: undefined,
        second: undefined,
        third: undefined
      },
      militaryIdLength: 13,
      recordIdLength: 10,
      militaryIdErrorMessages: [],
      recordIdErrorMessages: [],
      tripleNumberErrorMessages: [],
      recommendation: _.cloneDeep(initial),
      address: {
        governate: undefined,
        centre: undefined,
        village: undefined
      },
      governates: [],
      rules: {
        militaryId: [
          v => !!v || this.$t("MilitaryId_Required"),
          v => {
            return this.validateMilitaryId(v);
          }
        ],
        recordId: [v => !!v || this.$t("RecordId_Required")],
        tripleNumber: [v => !!v || this.$t("TripleNumber_Required")],
        name: [v => !!v || this.$t("Name_Required")],
        governate: [v => !!v || this.$t("Governate_Required")],
        centre: [v => !!v || this.$t("Centre_Required")],
        village: [v => !!v || this.$t("Village_Required")],
        education: [v => !!v || this.$t("Education_Rank_Required")],
        unit: [v => !!v || this.$t("Unit_Name_Required")]
      },
      type: undefined,
      divisions: [],
      unitId: undefined,
      divisionId: undefined,
      edit: false,
      recruitmentLevel: "first",
      treatment: "without_extra_year",
      situation: "without"
    };
  },
  async created() {
    const divisions = await this.getDivisions();
    console.log("the edit", this.edit);
    if (!this.edit) {
      this.recommendation = _.cloneDeep(initial);
      console.log("triple", this.recommendation.tripleNumber);
    } else {
      this.processMilitaryId(this.recommendation.militaryId);
      this.education = this.recommendation.education;
      this.recruitmentLevel = this.recommendation.recruitmentLevel;
    }
  },
  middleware: ["auth", "isNotLoggedIn", "isAuthorized"],
  meta: {
    branches: ["recon_force_people"],
    permissions: ["recon_recommendations_manager"]
  },
  components: {
    materialCard
  },
  computed: {
    ...mapGetters({
      user: "app/getUser",
      locations: "app/getLocations",
      defaults: "app/getDefaults",
      fullname: "user/getFullname"
    })
  },
  methods: {
    moment,
    reset() {

      this.recommendation = _.cloneDeep(initial);
      this.treatment = this.recommendation.treatment;
      this.education = this.recommendation.education;
      this.recruitmentLevel = this.recommendation.recruitmentLevel;
  
      this.militaryIdErrorMessages = [];
      this.tripleNumber = {
        first: undefined,
        second: undefined,
        third: undefined
      };
    },
    command(e) {
      if (e.keyCode === 13) {
        return this.submit();
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
    async submit() {
      const addOrEdit = this.edit ? "Edited" : "Added";
      const isValid = this.$refs.form.validate();
      const data = _.cloneDeep(this.recommendation);
      data.type = this.type;
      if (isValid) {
        const path = this.edit
          ? `/recommendations/edit/${this.recommendationId}`
          : "/recommendations";
        if (this.tripleNumber && this.tripleNumber.first) {
          const tripleNumberObj = _.cloneDeep(this.tripleNumber);
          this.recommendation.tripleNumber = Object.keys(tripleNumberObj)
            .map(o => tripleNumberObj[o])
            .join("/");
          data.tripleNumber = this.recommendation.tripleNumber;
        } else {
          delete data.tripleNumber;
        }
        if (data.recommenderRank && data.recommender) {
          data.recommender = [data.recommenderRank, data.recommender].join(
            " \/ "
          );
        }

        if (!data.recommender) {
          data.recommender = "";
        }

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
          title: this.$i18n.t(`${addOrEdit}_Recommendation_Success`),
          timer: 4000,
          showConfirmButton: false
        });
      }
    },
    async isDuplicate({ key, value }) {
      const keys = ["type", key];
      const values = [this.type, value];
      console.log("keys", key, "values", values);
      const path = `/recommendations/is-duplicate?keys=${keys}&values=${values}`;

      console.log("path", path);
      const response = await get(path);
      console.log("response", response);
      if (response.error) {
        return false;
      }

      return response.isDuplicate;
    },
    async processMilitaryId(value) {
      if (!value) {
        return;
      }
      if (value.length >= 5) {
        const code = parseInt(value[4]);
        const recruitmentArea = this.locations.recruitmentAreas[code - 1];
        if (recruitmentArea) {
          this.recommendation.recruitmentArea = recruitmentArea.value;
          this.governates = this.locations.governates.filter(o => {
            if (o.recruitment_area && o.recruitment_area.length) {
              return o.recruitment_area.find(
                p => p.value === recruitmentArea.value
              );
            }
            return (
              o.recruitment_area &&
              o.recruitment_area.value === recruitmentArea.value
            );
          });
        }
      } else {
        this.recommendation.recruitmentArea = undefined;
      }

      if (value.length >= 8) {
        const code = `${value[6]}${value[7]}`;
        const force = this.defaults.FORCES_LIST.find(o => o.code == code);

        if (force) {
          this.recommendation.force = force.value;

          console.log("force", force.value, code);
        }
      } else {
        this.recommendation.force = undefined;
      }

      if (value.length === 13 && !this.edit && this.type) {
        try {
          const militaryIdValidation = await this.isDuplicate({
            key: "militaryId",
            value
          });
          this.recommendation.isDuplicate = militaryIdValidation;
          if (this.recommendation.isDuplicate) {
            this.militaryIdErrorMessages = [
              this.$i18n.t("MillitaryId_Duplicate")
            ];
          } else {
            this.militaryIdErrorMessages = [];
          }
        } catch (error) {}
      } else {
        this.militaryIdErrorMessages = [];
      }
    },
    async processRecordId(value) {
      if (value.length >= 1 && !this.edit && this.type) {
        try {
          const recordIdValidation = await this.isDuplicate({
            key: "recordId",
            value
          });
          this.recommendation.isDuplicate = recordIdValidation;
          if (this.recommendation.isDuplicate) {
            this.recordIdErrorMessages = [this.$i18n.t("RecordId_Duplicate")];
          } else {
            this.recordIdErrorMessages = [];
          }
        } catch (error) {}
      } else {
        this.recordIdErrorMessages = [];
      }
    },
    async processTripleNumber(value) {
      if (
        this.tripleNumber.first &&
        this.tripleNumber.second &&
        this.tripleNumber.third &&
        !this.edit &&
        this.type
      ) {
        try {
          const tripleNumberObj = _.cloneDeep(this.tripleNumber);
          const value = Object.keys(tripleNumberObj)
            .map(o => tripleNumberObj[o])
            .join("/");
          const recordIdValidation = await this.isDuplicate({
            key: "tripleNumber",
            value
          });
          this.recommendation.isDuplicate = recordIdValidation;
          if (this.recommendation.isDuplicate) {
            this.tripleNumberErrorMessages = [
              this.$i18n.t("TripleNumber_Duplicate")
            ];
          } else {
            this.tripleNumberErrorMessages = [];
          }
        } catch (error) {}
      } else {
        this.tripleNumberErrorMessages = [];
      }
    },
    onlyNumber($event) {
      //console.log($event.keyCode); //keyCodes value
      let keyCode = $event.keyCode ? $event.keyCode : $event.which;
      if ((keyCode < 48 || keyCode > 57) && keyCode !== 46) {
        // 46 is dot
        $event.preventDefault();
      }
    },
    validateMilitaryId(value) {
      if (typeof value === "undefined") {
        return true;
      }

      if (value.length < 4) {
        return this.$i18n.t("MillitaryId_Invalid");
      }

      if (value.length >= 5) {
        const recruitmentCode = parseInt(value[4]);
        if (recruitmentCode === 0) return this.$i18n.t("MillitaryId_Invalid");
      }

      const year = value.substr(0, 4);
      const isValid =
        year.length >= 4 && parseInt(year) <= new Date().getFullYear();

      if (!isValid) {
        return this.$i18n.t("MillitaryId_Invalid");
      }

      if (value.length < 13) {
        return this.$i18n.t("MillitaryId_Incomplete");
      }

      return false;
    }
  },
  mounted() {
    window.addEventListener("keypress", this.command);
    if (this.recommendationId) {
      this.processMilitaryId(this.recommendation.militaryId);
    }
  },
  destroyed() {
    window.removeEventListener("keypress", this.command);
  },
  async asyncData({ route }) {
    let tripleNumber;
    const recommendationId = route.path.substr(route.path.lastIndexOf("/") + 1);
    if (!route.path.includes("edit")) {
      return {};
    }

    const path = `/recommendations/data/${recommendationId}`;
    const recommendation = await get(path);

    if (recommendation.error) {
      Toaster.fire({
        icon: "error",
        title: recommendation.error,
        timer: 4000,
        showConfirmButton: false
      });
      return {};
    }

    if (recommendation.tripleNumber) {
      const tripleNumberArr = recommendation.tripleNumber.split("\/");
      tripleNumber = {
        first: tripleNumberArr[2],
        second: tripleNumberArr[1],
        third: tripleNumberArr[0]
      };
    } else {
      tripleNumber = {};
    }
    return {
      recommendationId,
      recommendation,
      type: recommendation.type,
      tripleNumber,
      edit: true
    };
  }
};
</script>
