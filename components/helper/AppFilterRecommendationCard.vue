<template>
  <v-dialog persistent v-model="value" max-width="1000px">
    <v-layout justify-center wrap>
      <v-flex xs12 md12>
        <material-card
          dark
          color="deep"
          :title="$t('Advanced_Search')"
          v-on:close="close"
          headerAction="close"
        >
          <v-form ref="form">
            <v-container py-0 style="direction: rtl">
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
                    v-model="recommendation.fullName"
                    clearable
                  />
                </v-flex>
                <v-flex v-if="['unit', 'distributed'].includes(type)" xs12 md3>
                  <v-text-field
                    class="white-input"
                    @keypress="onlyNumber"
                    :maxlength="recordIdLength"
                    :label="$t('Record_ID')"
                    v-model="recommendation.recordId"
                    clearable
                  />
                </v-flex>
                <v-flex v-if="['unit', 'distributed'].includes(type)" xs12 md3>
                  <v-text-field
                    class="white-input"
                    @keypress="onlyNumber"
                    :maxlength="militaryIdLength"
                    :minlength="militaryIdLength"
                    :label="$t('Military_ID')"
                    v-model="recommendation.militaryId"
                    clearable
                  />
                </v-flex>
                <v-flex v-if="['officers', 'weapons'].includes(type)" xs12 md1>
                  <v-text-field
                    class="white-input tripleNumber"
                    @keypress="onlyNumber"
                    :label="$t('Triple_Number_Third')"
                    v-model="tripleNumber.third"
                    clearable
                  />
                </v-flex>
                <v-flex v-if="['officers', 'weapons'].includes(type)" xs12 md1>
                  <v-text-field
                    class="white-input tripleNumber"
                    @keypress="onlyNumber"
                    :label="$t('Triple_Number_Second')"
                    v-model="tripleNumber.second"
                    clearable
                  />
                </v-flex>
                <v-flex v-if="['officers', 'weapons'].includes(type)" xs12 md1>
                  <v-text-field
                    class="white-input tripleNumber"
                    @keypress="onlyNumber"
                    :label="$t('Triple_Number_First')"
                    v-model="tripleNumber.first"
                    clearable
                  />
                </v-flex>
                <v-flex v-if="type" xs12 md3>
                  <v-text-field
                    class="white-input"
                    :label="$t('Eductional_Rank')"
                    v-model="recommendation.education"
                    clearable
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
                    clearable
                  />
                </v-flex>
                <v-flex xs12 md3>
                  <v-text-field
                    :no-data-text="$t('No_Selections')"
                    class="form-select"
                    v-model="recommendation.force"
                    :label="$t('Force')"
                    clearable
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
                    clearable
                  />
                </v-flex>
                <v-flex xs12 md3>
                  <v-menu
                    v-model="joinYearModal"
                    :close-on-content-click="false"
                    :nudge-left="50"
                    :nudge-bottom="5"
                    transition="scale-transition"
                    offset-y
                    min-width="290px"
                  >
                    <template v-slot:activator="{}">
                      <!-- <v-text-field
                        v-model="recommendation.joinYear"
                        :disabled="recommendation.joinMonth"
                        :label="$t('Join_Year')"
                        prepend-icon="event"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                        clearable
                      ></v-text-field> -->
                      <v-autocomplete
                        :no-data-text="$t('No_Selections')"
                        :label="$t('Join_Year')"
                        :disabled="
                          !!recommendation.joinMonth ||
                          !!recommendation.joinDate
                        "
                        :items="prevYears"
                        class="form-select"
                        v-model="recommendation.joinYear"
                        prepend-icon="event"
                        clearable
                      />
                    </template>
                    <v-date-picker
                      :allowed-dates="(time) => moment(time).diff(moment()) < 0"
                      :range="true"
                      :disabled="
                        !!recommendation.joinMonth || !!recommendation.joinDate
                      "
                      @input="joinYearModal = false"
                      locale="ar"
                      dark
                    ></v-date-picker>
                  </v-menu>
                </v-flex>
              </v-layout>

              <v-layout v-if="type" wrap>
                <v-flex xs12 md3>
                  <v-text-field
                    :no-data-text="$t('No_Selections')"
                    class="white-input"
                    :label="$t('Recommender_Rank')"
                    v-model="recommendation.recommenderRank"
                    clearable
                  />
                </v-flex>
                <v-flex xs12 md3>
                  <v-text-field
                    :no-data-text="$t('No_Selections')"
                    class="white-input"
                    :label="$t('Recommender_Name')"
                    v-model="recommendation.recommender"
                    clearable
                  />
                </v-flex>
                <v-flex v-if="['unit', 'distributed'].includes(type)" xs12 md3>
                  <v-text-field
                    class="white-input"
                    :label="$t('Unit_Only')"
                    v-model="recommendation.unit"
                    clearable
                  />
                </v-flex>
                <v-flex xs12 md3>
                  <v-text-field
                    class="white-input"
                    :label="$t('Notes')"
                    v-model="recommendation.notes"
                    clearable
                  />
                </v-flex>
              </v-layout>
              <v-layout wrap>
                <v-flex md6 text-xs-right>
                  <v-btn
                    class="font-weight-light add-button v-btn-add"
                    @click="submit"
                  >
                    {{ $t("Search") }}
                  </v-btn>
                </v-flex>
              </v-layout>
            </v-container>
          </v-form>
        </material-card>
      </v-flex>
    </v-layout>
  </v-dialog>
</template>
<script>
import _ from "lodash";
import { mapGetters } from "vuex";
import { Toaster } from "~/plugins/helpers";
import { get, post } from "~/plugins/axiosbase";
import moment, { months } from "moment";
import materialCard from "~/components/material/AppCard";

const initial = {
  tripleNumber: undefined,
  address: {},
  militaryId: undefined,
  recordId: undefined,
  fullName: undefined,
  name: undefined,
  force: undefined,
  situation: undefined,
  recruitmentLevel: undefined,
  treatment: undefined,
  notes: undefined,
  influences: [],
};
export default {
  layout: "dashboard",
  props: ["value", "fields"],
  data() {
    return {
      tripleNumber: {
        first: undefined,
        second: undefined,
        third: undefined,
      },
      prevYears: [],
      militaryIdLength: 13,
      recordIdLength: 10,
      militaryIdErrorMessages: [],
      recordIdErrorMessages: [],
      tripleNumberErrorMessages: [],
      recommendation: _.cloneDeep(initial),
      address: {
        governate: undefined,
        centre: undefined,
        village: undefined,
      },
      governates: [],
      rules: {
        militaryId: [
          (v) => !!v || this.$t("MilitaryId_Required"),
          (v) => {
            return this.validateMilitaryId(v);
          },
        ],
        recordId: [(v) => !!v || this.$t("RecordId_Required")],
        tripleNumber: [(v) => !!v || this.$t("TripleNumber_Required")],
        name: [(v) => !!v || this.$t("Name_Required")],
        governate: [(v) => !!v || this.$t("Governate_Required")],
        centre: [(v) => !!v || this.$t("Centre_Required")],
        village: [(v) => !!v || this.$t("Village_Required")],
        education: [(v) => !!v || this.$t("Education_Rank_Required")],
        unit: [(v) => !!v || this.$t("Unit_Name_Required")],
      },
      type: undefined,
      divisions: [],
      unitId: undefined,
      divisionId: undefined,
      recruitmentLevel: undefined,
      treatment: undefined,
      situation: undefined,
    };
  },
  async created() {
    this.setPreviousYears();
    const divisions = await this.getDivisions();
  },
  middleware: ["auth", "isNotLoggedIn", "isAuthorized"],
  meta: {
    branches: ["recon_force_people"],
  },
  components: {
    materialCard,
  },
  computed: {
    ...mapGetters({
      user: "app/getUser",
      locations: "app/getLocations",
      defaults: "app/getDefaults",
      fullname: "user/getFullname",
    }),
  },
  methods: {
    moment,
    setPreviousYears(startYear) {
      const years = [];
      const currentYear = new Date().getFullYear();
      startYear = startYear || 2017;
      while (startYear <= currentYear) {
        const year = startYear++;
        years.push(String(year));
      }
      years.unshift();
      this.prevYears = years;
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
      const isValid = this.$refs.form.validate();

      if (isValid) {
        const path = "/recommendations";
        const obj = JSON.parse(JSON.stringify(this.recommendation));
        obj.type = this.type;
        if (this.tripleNumber && this.tripleNumber.first) {
          const tripleNumberObj = _.cloneDeep(this.tripleNumber);
          this.recommendation.tripleNumber = Object.keys(tripleNumberObj)
            .map((o) => tripleNumberObj[o])
            .join("/");
          obj.tripleNumber = this.recommendation.tripleNumber;
        } else {
          delete obj.tripleNumber;
        }
        if (obj.recommenderRank && obj.recommender) {
          obj.recommender = [obj.recommenderRank, obj.recommender].join(" / ");
        }

        const response = await get(path, obj);
        if (response.error) {
          return Toaster.fire({
            icon: "error",
            title: response.error,
            timer: 4000,
            showConfirmButton: false,
          });
        }
        this.setSearchFields(obj);
        this.$parent.renderRecommendations(response.recommendations);
      }
    },

    setSearchFields(item) {
      const obj = _.cloneDeep(item);
      // console.log("obj for search at first", obj);
      const fields = Object.keys(obj)
        .map((o) => {
          const keyObj = this.fields.find((m) => m.value === o);
          const value = obj[o];
          return { keyObj, value };
        })
        .filter((o) => o.value);
      this.$parent.searchFields = fields;
      return fields;
    },
    close() {
      this.$emit("close");
    },
    onlyNumber($event) {
      //console.log($event.keyCode); //keyCodes value
      let keyCode = $event.keyCode ? $event.keyCode : $event.which;
      if ((keyCode < 48 || keyCode > 57) && keyCode !== 46) {
        // 46 is dot
        $event.preventDefault();
      }
    },
  },
};
</script>
