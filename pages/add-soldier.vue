<template>
  <v-container fill-height fluid grid-list-xl style="direction:rtl;">
    <v-layout justify-center wrap>
      <v-flex xs12 md12>
        <material-card dark color="deep" :title="$t('Add_Soldier')">
          <v-form ref="form">
            <v-container py-0>
              <v-layout>
                <v-flex xs12 md3>
                  <v-text-field
                    class="white-input"
                    @keypress="onlyNumber"
                    :maxlength="recordIdLength"
                    :label="$t('Record_ID')"
                    :rules="rules.recordId"
                    @input="processRecordId"
                    :error-messages="recordIdErrorMessages"
                    v-model="soldier.recordId"
                  />
                </v-flex>
                <v-flex xs12 md3>
                  <v-text-field
                    class="white-input"
                    @keypress="onlyNumber"
                    :maxlength="militaryIdLength"
                    :minlength="militaryIdLength"
                    :label="$t('Military_ID')"
                    :rules="rules.militaryId"
                    @input="processMilitaryId"
                    :error-messages="militaryIdErrorMessages"
                    v-model="soldier.militaryId"
                  />
                </v-flex>
                <v-flex xs12 md3>
                  <v-text-field
                    class="white-input"
                    :label="$t('Name')"
                    :rules="rules.name"
                    v-model="soldier.fullName"
                  />
                </v-flex>
                <v-flex xs12 md3>
                  <v-text-field
                    class="white-input"
                    @input="processNationalId"
                    :maxlength="nationalIdLength"
                    :minLength="nationalIdLength"
                    :label="$t('National_ID')"
                    :rules="rules.nationalId"
                    v-model="soldier.nationalId"
                  />
                </v-flex>
              </v-layout>
              <v-layout wrap>
                <v-flex xs12 md1>
                  <v-text-field
                    class="white-input tripleNumber"
                    @keypress="onlyNumber"
                    :label="$t('Triple_Number_Third')"
                    :rules="rules.tripleNumber"
                    v-model="soldier.tripleNumber.third"
                  />
                </v-flex>
                <v-flex xs12 md1>
                  <v-text-field
                    class="white-input tripleNumber"
                    @keypress="onlyNumber"
                    :label="$t('Triple_Number_Second')"
                    :rules="rules.tripleNumber"
                    v-model="soldier.tripleNumber.second"
                  />
                </v-flex>
                <v-flex xs12 md1>
                  <v-text-field
                    class="white-input tripleNumber"
                    @keypress="onlyNumber"
                    :label="$t('Triple_Number_First')"
                    :rules="rules.tripleNumber"
                    v-model="soldier.tripleNumber.first"
                  />
                </v-flex>
                <v-flex xs12 md3>
                  <v-select
                    :no-data-text="$t('No_Selections')"
                    class="form-select"
                    :items="locations.recruitmentAreas"
                    item-text="ar"
                    item-value="value"
                    v-model="soldier.recruitmentArea"
                    :label="$t('Recruitment_Area')"
                    disabled
                  />
                </v-flex>
                <v-flex xs12 md3>
                  <v-select
                    :no-data-text="$t('No_Selections')"
                    class="form-select"
                    :items="
                      soldier.recruitmentArea
                        ? governates
                        : locations
                        ? locations.governates
                        : []
                    "
                    :label="$t('Governate')"
                    item-text="ar"
                    item-value="value"
                    v-model="soldier.address.governate"
                    :rules="rules.governate"
                  />
                </v-flex>
                <v-flex xs12 md3>
                  <v-combobox
                    class="form-select"
                    :items="
                      soldier.address.centre && defaults.villages
                        ? defaults.villages[soldier.address.centre]
                        : []
                    "
                    :label="$t('Centre')"
                    :rules="rules.centre"
                    v-model="soldier.address.centre"
                  ></v-combobox>
                </v-flex>
              </v-layout>
              <v-layout wrap>
                <v-flex xs12 md3>
                  <!-- <v-select :no-data-text="$t('No_Selections')"
                      class="form-select"
                      :items="[]"
                      :label="$t('Village')"
                      item-text="ar"
                      item-value="value"
                      v-model="soldier.address.village"
                    /> -->
                  <!-- :items="
                        soldier.address.centre && defaults.villages
                          ? defaults.villages[soldier.address.centre]
                          : []
                      " -->
                  <v-combobox
                    v-model="soldier.address.village"
                    :items="
                      soldier.address.centre && defaults.villages
                        ? defaults.villages[soldier.address.centre]
                        : []
                    "
                    :label="$t('Village')"
                    :rules="rules.village"
                  ></v-combobox>
                </v-flex>
                <v-flex xs12 md3>
                  <v-select
                    :no-data-text="$t('No_Selections')"
                    class="form-select"
                    :items="defaults.EDUCATION_RANKS"
                    item-text="ar"
                    item-value="value"
                    v-model="educationRank"
                    :label="$t('Eductional_Rank')"
                    disabled
                  />
                </v-flex>
                <v-flex xs12 md3>
                  <v-select
                    :no-data-text="$t('No_Selections')"
                    class="form-select"
                    :items="
                      canSelectForce
                        ? forces
                        : defaults.FORCES_LIST
                        ? defaults.FORCES_LIST
                        : []
                    "
                    item-text="ar"
                    item-value="value"
                    v-model="soldier.force"
                    :label="$t('Force')"
                    :disabled="!canSelectForce"
                  />
                </v-flex>
                <v-flex xs12 md3>
                  <v-select
                    :no-data-text="$t('No_Selections')"
                    class="form-select"
                    :items="defaults.SITUATIONS"
                    item-text="ar"
                    item-value="value"
                    v-model="soldier.situation"
                    :label="$t('Situation')"
                  />
                </v-flex>
              </v-layout>
              <v-layout wrap>
                <v-flex xs12 md3>
                  <v-select
                    :no-data-text="$t('No_Selections')"
                    class="form-select"
                    :items="defaults.TREATMENTS"
                    item-text="ar"
                    item-value="value"
                    v-model="treatment"
                    :label="$t('Treatment')"
                  />
                </v-flex>
                <v-flex xs12 md3>
                  <v-menu
                    v-model="birthDateModal"
                    :close-on-content-click="false"
                    :nudge-left="50"
                    :nudge-bottom="5"
                    transition="scale-transition"
                    offset-y
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="soldier.birthDate"
                        :label="$t('Birth_Date')"
                        prepend-icon="event"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      :allowed-dates="
                        time => moment().diff(moment(time), 'year') >= 19
                      "
                      v-model="soldier.birthDate"
                      @input="birthDateModal = false"
                      locale="ar"
                      dark
                    ></v-date-picker>
                  </v-menu>
                </v-flex>
                <v-flex xs12 md3>
                  <v-menu
                    v-model="joinDateModal"
                    :close-on-content-click="false"
                    :nudge-left="50"
                    :nudge-bottom="5"
                    transition="scale-transition"
                    offset-y
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="joinDate"
                        :label="$t('Join_Date')"
                        :allowed-dates="time => getRightMonths(time)"
                        prepend-icon="event"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      :allowed-dates="time => moment(time).diff(moment()) < 0"
                      v-model="joinDate"
                      @input="joinDateModal = false"
                      @change="setRecruitmentLevel"
                      locale="ar"
                      dark
                    ></v-date-picker>
                  </v-menu>
                </v-flex>
                <v-flex xs12 md3>
                  <v-menu
                    v-model="releaseDateModal"
                    :close-on-content-click="false"
                    :nudge-left="50"
                    :nudge-bottom="5"
                    transition="scale-transition"
                    offset-y
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="releaseDate"
                        :label="$t('Release_Date')"
                        :value="releaseDate"
                        prepend-icon="event"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      :allowed-dates="time => moment(time).diff(moment()) > 0"
                      v-model="releaseDate"
                      @change="setRecruitmentLevel"
                      locale="ar"
                      dark
                      disabled
                    ></v-date-picker>
                  </v-menu>
                </v-flex>
              </v-layout>
              <v-layout wrap>
                <v-flex xs12 md3>
                  <v-select
                    :no-data-text="$t('No_Selections')"
                    class="form-select"
                    :items="defaults.RECRUITMENT_LEVELS"
                    item-text="ar"
                    item-value="value"
                    :label="$t('RECRUITMENT_LEVEL')"
                    v-model="recruitmentLevel"
                    disabled
                  />
                </v-flex>
                <v-flex xs12 md3>
                  <v-select
                    :no-data-text="$t('No_Selections')"
                    class="form-select"
                    :items="defaults.ARMY_LIST"
                    item-text="ar"
                    item-value="value"
                    v-model="soldier.army"
                    :label="$t('Army')"
                    @change="setAll"
                    :rules="rules.army"
                  />
                </v-flex>
                <v-flex xs12 md3>
                  <v-select
                    :no-data-text="$t('No_Selections')"
                    class="form-select"
                    item-text="name"
                    item-value="_id"
                    :items="divisionsComputed"
                    v-model="soldier.divisionId"
                    @change="setUnits"
                    :label="$t('Division')"
                    :disabled="divisionsComputed.length === 0"
                    :clearable="true"
                  />
                </v-flex>
                <v-flex xs12 md3>
                  <v-autocomplete
                    :no-data-text="$t('No_Selections')"
                    class="form-select"
                    item-text="name"
                    item-value="_id"
                    :items="unitsComputed"
                    v-model="soldier.unitId"
                    @change="setDivision"
                    :label="$t('Unit')"
                    :rules="rules.unitId"
                    :clearable="true"
                  />
                </v-flex>
                <!-- <v-flex xs12 md3>
                    <v-text-field
                      class="white-input"
                      :label="$t('Notes')"
                      v-model="soldier.notes"
                    />
                  </v-flex> -->
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
import { onlyNumber, Toaster, releaseDate } from "~/plugins/helpers";
import { get, post } from "~/plugins/axiosbase";
import moment, { months } from "moment";
import materialCard from "~/components/material/AppCard";

const initial = {
  isDuplicate: false,
  tripleNumber: {
    first: undefined,
    second: undefined,
    third: undefined
  },
  address: {},
  militaryId: undefined,
  recordId: undefined,
  fullName: undefined,
  name: undefined,
  force: undefined,
  army: undefined,
  situation: "without",
  joinDate: moment()
    .month(2)
    .startOf("month")
    .toISOString()
    .substr(0, 10),
  birthDate: moment()
    .subtract(20, "year")
    .toDate()
    .toISOString()
    .substr(0, 10),
  recruitmentLevel: "first",
  educationRank: undefined,
  treatment: "without_extra_year",
  notes: "",
  influences: []
};
export default {
  layout: "dashboard",
  data() {
    return {
      militaryIdLength: 13,
      nationalIdLength: 14,
      recordIdLength: 10,
      militaryIdErrorMessages: [],
      recordIdErrorMessages: [],
      canSelectForce: false,
      forces: [],
      soldier: _.cloneDeep(initial),
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
        nationalId: [
          v => {
            return this.validateNationalId(v);
          }
        ],
        recordId: [v => !!v || this.$t("RecordId_Required")],
        tripleNumber: [v => !!v || this.$t("TripleNumber_Required")],
        name: [v => !!v || this.$t("Name_Required")],
        governate: [v => !!v || this.$t("Governate_Required")],
        centre: [v => !!v || this.$t("Centre_Required")],
        village: [v => !!v || this.$t("Village_Required")],
        educationRank: [v => !!v || this.$t("Education_Rank_Required")]
      },
      divisions: [],
      unitId: undefined,
      divisionId: undefined,
      edit: false,
      birthDateModal: false,
      joinDateModal: false,
      releaseDateModal: false,
      recruitmentLevel: "first",
      educationRank: undefined,
      treatment: "without_extra_year",
      situation: "without",
      joinDate: moment()
        .month(2)
        .startOf("month")
        .toISOString()
        .substr(0, 10)
    };
  },
  async created() {
    const divisions = await this.getDivisions();
    if (!this.edit) {
      this.soldier = _.cloneDeep(initial);
      console.log("triple", this.soldier.tripleNumber);
    } else {
      this.processMilitaryId(this.soldier.militaryId);
      this.setDivision(this.soldier.unitId, this.edit);
      this.joinDate = this.soldier.joinDate;
      this.treatment = this.soldier.treatment;
      this.educationRank = this.soldier.educationRank;
      this.recruitmentLevel = this.soldier.recruitmentLevel;
      // this.releaseDate = this.soldier.releaseDate;
    }
    // this.joinDate = this.soldier.joinDate;
    // this.educationRank = this.soldier.educationRank;
    // this.recruitmentLevel = this.soldier.recruitmentLevel;
  },
  middleware: ["auth", "isNotLoggedIn", "isAuthorized"],
  meta: {
    branches: ["recon_force_people"],
    permissions: ["recon_people_creator"]
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
    }),
    divisionsComputed() {
      const divisions = this.soldier.army
        ? this.divisions.filter(
            o => o.army === this.soldier.army && ["division"].includes(o.type)
          )
        : this.divisions.filter(o => ["division"].includes(o.type));
      return divisions;
    },
    unitsComputed() {
      console.log("computing units");
      let units = this.divisionId
        ? this.divisions
            .filter(o => ["battalion", "company"].includes(o.type))
            .filter(
              o =>
                o.divisionId === this.divisionId ||
                (o.divisionId && o.divisionId._id === this.divisionId)
            )
        : this.divisions.filter(o => ["battalion", "company"].includes(o.type));

      if (!this.divisionId && this.soldier.army) {
        units = units.filter(o => o.army === this.soldier.army);
      }
      return units;
    },
    releaseDate
  },
  methods: {
    moment,
    getRightMonths(time) {
      return [0, 3, 6, 9].includes(moment(time).month());
    },
    reset() {
      this.joinDateBack = this.joinDate;
      this.soldier = _.cloneDeep(initial);
      this.treatment = this.soldier.treatment;
      this.educationRank = this.soldier.educationRank;
      this.recruitmentLevel = this.soldier.recruitmentLevel;
      this.joinDate = this.joinDateBack;
      this.militaryIdErrorMessages = [];
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
      if (isValid) {
        const path = this.edit
          ? `/soldiers/edit/${this.soldierId}`
          : "/soldiers";
        this.soldier.joinDate = this.joinDate;
        this.soldier.treatment = this.treatment;
        this.soldier.educationRank = this.educationRank;
        this.soldier.recruitmentLevel = this.recruitmentLevel;
        this.soldier.releaseDate = this.releaseDate;
        this.soldier.nationalId = !!this.soldier.nationalId
          ? this.soldier.nationalId
          : undefined;
        const response = await post(path, this.soldier);
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
          title: this.$i18n.t(`${addOrEdit}_Soldier_Success`),
          timer: 4000,
          showConfirmButton: false
        });
      }
    },
    async isDuplicate({ key, value }) {
      const path = "/soldiers/is-duplicate";
      const query = { key, value };
      const response = await get(path, query);
      if (response.error) {
        return false;
      }

      return response.isDuplicate;
    },
    setAll(value) {
      this.soldier.unitId = undefined;
      this.soldier.divisionId = undefined;
    },
    setUnits(value) {
      const division = this.divisions.find(o => o._id === value);
      this.divisionId = value;
      if (division) {
        console.log("clearing unit", division);
        this.soldier.army = division.army;
        this.soldier.unitId = undefined;
      }
    },
    setDivision(value, edit) {
      // Give divisionId dummy value to get unitsComputed function running
      let unit = this.unitsComputed.find(o => o._id === value);
      if (edit) {
        unit = this.divisions.find(o => o._id === value);
      }
      if (unit) {
        this.soldier.unitId = unit._id;
        this.soldier.divisionId = unit.divisionId
          ? unit.divisionId._id
          : unit.divisionId;
        this.soldier.army = unit.army;
      }
    },
    setRecruitmentLevel(date) {
      const month = moment(date).month();
      const recruitmentLevels = this.defaults.RECRUITMENT_LEVELS;
      const months = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
      const values = {};
      let holder = [];
      let index = 0;
      let level;
      recruitmentLevels.map((o, i) => {
        values[i] = [index, index + 1, index + 2];
        const found = values[i].find(p => p === month);
        if (found) {
          this.recruitmentLevel = o.value;
        }
        index += 3;
      });
    },
    async processMilitaryId(value) {
      const year = value.substr(0, 4);
      if (year.length >= 4 && parseInt(year, 10) <= new Date().getFullYear()) {
        const joinDate = new Date(this.joinDate);
        joinDate.setFullYear(parseInt(year, 10));
        this.joinDate = joinDate.toISOString().substr(0, 10);
        this.joinDate = joinDate.toISOString().substr(0, 10);
      }

      if (value.length >= 5) {
        const code = parseInt(value[4]);
        const recruitmentArea = this.locations.recruitmentAreas[code - 1];
        if (recruitmentArea) {
          this.soldier.recruitmentArea = recruitmentArea.value;
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
        this.soldier.recruitmentArea = undefined;
      }

      if (value.length >= 6) {
        const code = parseInt(value[5]);
        const educationRank = this.defaults.EDUCATION_RANKS.find(
          o => o.code == code
        );

        if (educationRank) {
          this.educationRank = educationRank.value;
        }
      } else {
        this.educationRank = undefined;
      }

      if (value.length >= 8) {
        const code = `${value[6]}${value[7]}`;
        const force = this.defaults.FORCES_LIST.find(o => o.code == code);
        if (code == "47") {
          this.canSelectForce = true;
          this.forces = this.defaults.FORCES_LIST.filter(
            o => o.code && o.code.length > 2
          );
        }
        if (force) {
          this.soldier.force = force.value;
        }
      } else {
        this.soldier.force = undefined;
      }

      if (value.length === 13 && !this.edit) {
        try {
          const militaryIdValidation = await this.isDuplicate({
            key: "militaryId",
            value
          });
          this.soldier.isDuplicate = militaryIdValidation;
          if (this.soldier.isDuplicate) {
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
      if (value.length >= 1 && !this.edit) {
        try {
          const recordIdValidation = await this.isDuplicate({
            key: "recordId",
            value
          });
          this.soldier.isDuplicate = recordIdValidation;
          if (this.soldier.isDuplicate) {
            this.recordIdErrorMessages = [this.$i18n.t("RecordId_Duplicate")];
          } else {
            this.recordIdErrorMessages = [];
          }
        } catch (error) {}
      } else {
        this.recordIdErrorMessages = [];
      }
    },
    processNationalId(value) {
      const yearTarget = value.substr(0, 3);
      let year, month, day, governate;
      if (yearTarget.length >= 3) {
        const code = value[0];
        const start = code === "2" ? 1900 : code === "3" ? 2000 : undefined;

        if (start) {
          year =
            start +
            parseInt(
              yearTarget
                .split("")
                .splice(1, 3)
                .join(""),
              10
            );
        }
      }

      if (value.length >= 5) {
        month = parseInt(`${value[3]}${value[4]}`, 10) - 1;
      }

      if (value.length >= 7) {
        day = parseInt(`${value[5]}${value[6]}`, 10);
      }

      if (value.length >= 9) {
        governate = `${value[7]}${value[8]}`;
      }

      if (year) {
        const birthDate = new Date(this.soldier.birthDate);
        birthDate.setFullYear(parseInt(year, 10));
        this.soldier.birthDate = birthDate.toISOString().substr(0, 10);
      }

      if (month && month <= 11) {
        const birthDate = new Date(this.soldier.birthDate);
        birthDate.setMonth(month);
        this.soldier.birthDate = birthDate.toISOString().substr(0, 10);
      }

      if (day && day <= 31) {
        const birthDate = new Date(this.soldier.birthDate);
        birthDate.setDate(day);
        this.soldier.birthDate = birthDate.toISOString().substr(0, 10);
      }

      if (governate) {
        // const found = this.locations.governates.find(o => o.code === governate);
        // if (found) {
        //   this.soldier.address.governate = found.value;
        // }
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

      if (value.length >= 6) {
        const code = parseInt(value[5]);
        const educationRank = this.defaults.EDUCATION_RANKS.find(
          o => o.code == code
        );

        if (!educationRank) {
          return this.$i18n.t("MillitaryId_Invalid");
        }
      }

      const year = value.substr(0, 4);
      const isValid =
        year.length >= 4 && parseInt(year) <= new Date().getFullYear();

      if (!isValid) {
        return this.$i18n.t("MillitaryId_Invalid");
      }

      // if (value.length === 13 && this.soldier.isDuplicate) {
      //   return this.$i18n.t("MillitaryId_Duplicate");
      // }

      if (value.length < 13) {
        return this.$i18n.t("MillitaryId_Incomplete");
      }

      return false;
    },
    validateNationalId(value) {
      if (typeof value === "undefined") {
        return false;
      }

      if (value.length >= 1) {
        const yearCode = value[0];
        if (!["2", "3"].includes(yearCode))
          return this.$i18n.t("NationalId_Invalid");
      }

      if (value.length >= 5) {
        const monthCode = parseInt(`${value[3]}${value[4]}`, 10);
        if (monthCode > 12 || monthCode < 1)
          return this.$i18n.t("NationalId_Invalid");
      }

      if (value.length >= 7) {
        const dayCode = parseInt(`${value[5]}${value[6]}`, 10);
        if (dayCode > 31 || dayCode < 1)
          return this.$i18n.t("NationalId_Invalid");
      }

      if (value.length >= 9) {
        const governCode = `${value[7]}${value[8]}`;
        const found = this.locations.governates.find(
          o => o.code === governCode
        );
        if (!found) {
          return this.$i18n.t("NationalId_Invalid");
        }
      }

      if (value.length && value.length < 14) {
        return this.$i18n.t("NationalId_Incomplete");
      }

      return false;
    },
    updateJoinDate(value) {
      const index = this.defaults.RECRUITMENT_LEVELS.findIndex(
        o => o.value === value
      );
      const formula = index * 3 - 1 + 3;
      // console.log("the index of recruitment leve", index, value, formula);
      // this.soldier.joinDate = moment(this.soldier.joinDate)
      //   .month(formula)
      //   .startOf("month")
      //   .add("1", "day")
      //   .toISOString()
      //   .substr(0, 10);
    }
  },
  mounted() {
    window.addEventListener("keypress", this.command);
    if (this.soldierId) {
      this.processMilitaryId(this.soldier.militaryId);
    }
  },
  destroyed() {
    window.removeEventListener("keypress", this.command);
  },
  async asyncData({ route }) {
    const soldierId = route.path.substr(route.path.lastIndexOf("/") + 1);
    if (!route.path.includes("edit")) {
      return {};
    }

    const path = `/soldiers/data/${soldierId}`;
    const soldier = await get(path);

    if (soldier.error) {
      Toaster.fire({
        icon: "error",
        title: soldier.error,
        timer: 4000,
        showConfirmButton: false
      });
      return {};
    }
    soldier.birthDate = moment(soldier.birthDate)
      .toISOString()
      .substr(0, 10);

    soldier.joinDate = moment(soldier.joinDate)
      .toISOString()
      .substr(0, 10);
    soldier.releaseDate = soldier.releaseDate
      ? moment(soldier.answerDate)
          .toISOString()
          .substr(0, 10)
      : undefined;
    console.log("soldier ", soldier);
    if (soldier.tripleNumber.value) {
      const tripleNumberArr = soldier.tripleNumber.value.split("\/");
      const tripleNumber = {
        first: tripleNumberArr[2],
        second: tripleNumberArr[1],
        third: tripleNumberArr[0]
      };
      soldier.tripleNumber = tripleNumber;
    } else {
      soldier.tripleNumber = {};
    }

    if (soldier.unit && soldier.unit.unitId) {
      soldier.unitId = soldier.unit.unitId;
    }
    return { soldierId, soldier, edit: true };
  }
};
</script>
