<template>
  <v-dialog persistent v-model="value" max-width="1000px">
    <!-- <v-container fill-height fluid grid-list-xl style="direction:rtl;"> -->
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
            <v-container py-0 style="direction:rtl;">
              <v-layout wrap>
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
                    v-model="staff.militaryId"
                  />
                </v-flex>
                <v-flex xs12 md3>
                  <v-text-field
                    class="white-input"
                    :label="$t('Name')"
                    :rules="rules.name"
                    v-model="staff.fullName"
                  />
                </v-flex>
                <v-flex xs12 md3>
                  <v-text-field
                    class="white-input"
                    :maxlength="nationalIdLength"
                    :minLength="nationalIdLength"
                    :label="$t('National_ID')"
                    :rules="rules.nationalId"
                    v-model="staff.nationalId"
                  />
                </v-flex>
                <v-flex xs12 md3>
                  <v-text-field
                    class="white-input"
                    :label="$t('Individual_ID')"
                    v-model="staff.individualId"
                    readonly
                  />
                </v-flex>
              </v-layout>
              <v-layout wrap>
                <v-flex xs12 md3>
                  <v-text-field
                    class="white-input"
                    :label="$t('Batch_ID')"
                    v-model="staff.batchId"
                  />
                </v-flex>
                <v-flex xs12 md3>
                  <v-autocomplete
                    :no-data-text="$t('No_Selections')"
                    class="form-select"
                    :items="defaults.MEDICAL_SITUATIONS"
                    item-text="ar"
                    item-value="value"
                    v-model="staff.medicalSituation"
                    :label="$t('Medical_Situation')"
                    clearable
                  />
                </v-flex>
                <v-flex xs12 md3>
                  <v-autocomplete
                    :no-data-text="$t('No_Selections')"
                    class="form-select"
                    :items="defaults.STAFF_RANKS"
                    item-text="ar"
                    item-value="value"
                    v-model="staff.rank"
                    :label="$t('Rank_Only')"
                    :rules="rules.rank"
                    clearable
                  />
                </v-flex>
                <v-flex xs12 md3>
                  <v-autocomplete
                    :no-data-text="$t('No_Selections')"
                    class="form-select"
                    :items="defaults.STAFF_CATEGORIES"
                    item-text="ar"
                    item-value="value"
                    v-model="staff.category"
                    :label="$t('Category')"
                    clearable
                  />
                </v-flex>
              </v-layout>
              <v-layout wrap>
                <v-flex xs12 md3>
                  <v-autocomplete
                    :no-data-text="$t('No_Selections')"
                    class="form-select"
                    :items="forces"
                    item-text="ar"
                    item-value="value"
                    v-model="staff.force"
                    :label="$t('Force')"
                    :rules="rules.force"
                    clearable
                  />
                </v-flex>
                <v-flex xs12 md3>
                  <v-autocomplete
                    :no-data-text="$t('No_Selections')"
                    class="form-select"
                    :items="locations ? locations.governates : []"
                    :label="$t('Governate')"
                    item-text="ar"
                    item-value="value"
                    v-model="staff.address.governate"
                    :rules="rules.governate"
                    clearable
                  />
                </v-flex>
                <v-flex xs12 md3>
                  <v-combobox
                    class="form-select"
                    :items="
                      staff.address.centre && defaults.villages
                        ? defaults.villages[staff.address.centre]
                        : []
                    "
                    :label="$t('Centre')"
                    :rules="rules.centre"
                    v-model="staff.address.centre"
                    clearable
                  ></v-combobox>
                </v-flex>
                <v-flex xs12 md3>
                  <v-combobox
                    v-model="staff.address.village"
                    :items="
                      staff.address.centre && defaults.villages
                        ? defaults.villages[staff.address.centre]
                        : []
                    "
                    :label="$t('Village')"
                    :rules="rules.village"
                    clearable
                  ></v-combobox>
                </v-flex>
              </v-layout>
              <v-layout wrap>
                <v-flex xs12 md3>
                  <v-text-field
                    :no-data-text="$t('No_Selections')"
                    class="form-select"
                    v-model="staff.education"
                    :label="$t('Eductional_Rank')"
                  />
                </v-flex>
                <v-flex xs12 md3>
                  <v-autocomplete
                    :no-data-text="$t('No_Selections')"
                    class="form-select"
                    :items="defaults.ARMY_LIST"
                    item-text="ar"
                    item-value="value"
                    v-model="staff.army"
                    :label="$t('Army')"
                    @change="setAll"
                    :rules="rules.army"
                    clearable
                  />
                </v-flex>
                <v-flex xs12 md3>
                  <v-autocomplete
                    :no-data-text="$t('No_Selections')"
                    class="form-select"
                    item-text="name"
                    item-value="_id"
                    :items="divisionsComputed"
                    v-model="staff.divisionId"
                    @change="setUnits"
                    :label="$t('Division')"
                    :disabled="divisionsComputed.length === 0"
                    clearable
                  />
                </v-flex>
                <v-flex xs12 md3>
                  <v-autocomplete
                    :no-data-text="$t('No_Selections')"
                    class="form-select"
                    item-text="name"
                    item-value="_id"
                    :items="unitsComputed"
                    v-model="staff.unitId"
                    @change="setDivision"
                    :label="$t('Unit')"
                    :rules="rules.unitId"
                    clearable
                  />
                </v-flex>
              </v-layout>
              <v-layout wrap>
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
                        v-model="staff.birthDate"
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
                      v-model="staff.birthDate"
                      @input="birthDateModal = false"
                      locale="ar"
                      dark
                      clearable
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
                        v-model="staff.joinDate"
                        :label="$t('Staff_Join_Date')"
                        prepend-icon="event"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      :allowed-dates="time => moment(time).diff(moment()) < 0"
                      v-model="staff.joinDate"
                      @input="joinDateModal = false"
                      locale="ar"
                      dark
                      clearable
                    ></v-date-picker>
                  </v-menu>
                </v-flex>
                <v-flex xs12 md3>
                  <v-menu
                    v-model="rankingDateModal"
                    :close-on-content-click="false"
                    :nudge-left="50"
                    :nudge-bottom="5"
                    transition="scale-transition"
                    offset-y
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="staff.rankingDate"
                        :label="$t('Staff_Ranking_Date')"
                        prepend-icon="event"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                        :rules="rules.rankingDate"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      :allowed-dates="time => moment(time).diff(moment()) < 0"
                      v-model="staff.rankingDate"
                      @input="rankingDateModal = false"
                      locale="ar"
                      dark
                      clearable
                    ></v-date-picker>
                  </v-menu>
                </v-flex>
                <v-flex xs12 md3>
                  <v-autocomplete
                    :no-data-text="$t('No_Selections')"
                    class="form-select"
                    :items="defaults.BLOOD_TYPES"
                    item-text="ar"
                    item-value="value"
                    v-model="staff.blood"
                    :label="$t('Blood_Type')"
                    clearable
                  />
                </v-flex>
              </v-layout>
              <v-layout wrap>
                <v-flex xs12 md3>
                  <v-text-field
                    class="form-select"
                    v-model="staff.phoneNumber"
                    :label="$t('Phone_Number')"
                  />
                </v-flex>
                <v-flex xs12 md3>
                  <v-autocomplete
                    :no-data-text="$t('No_Selections')"
                    class="form-select"
                    :items="defaults.MEDICAL_CARDS"
                    item-text="ar"
                    item-value="value"
                    v-model="staff.medicalCard"
                    :label="$t('Medical_Card')"
                    clearable
                  />
                </v-flex>
                <v-flex xs12 md3>
                  <v-autocomplete
                    :no-data-text="$t('No_Selections')"
                    class="form-select"
                    :items="defaults.RELIGIONS"
                    item-text="ar"
                    item-value="value"
                    v-model="staff.religion"
                    :label="$t('Religion')"
                    clearable
                  />
                </v-flex>
                <v-flex xs12 md3>
                  <v-text-field
                    class="form-select"
                    v-model="staff.weight"
                    :label="$t('Weight')"
                  />
                </v-flex>
              </v-layout>
              <v-layout wrap>
                <v-flex xs12 md3>
                  <v-text-field
                    class="form-select"
                    v-model="staff.height"
                    :label="$t('Height')"
                  />
                </v-flex>
              </v-layout>
              <v-layout wrap>
                <v-flex xs12 text-xs-right>
                  <v-btn class="font-weight-light add-button" @click="submit">
                    {{ $t("Search") }}
                  </v-btn>
                </v-flex>
              </v-layout>
            </v-container>
          </v-form>
        </material-card>
      </v-flex>
    </v-layout>
    <!-- </v-container> -->
  </v-dialog>
</template>
<script>
import { mapGetters } from "vuex";
import { Toaster } from "~/plugins/helpers";
import { get } from "~/plugins/axiosbase";
import _ from "lodash";
import moment from "moment";
import materialCard from "~/components/material/AppCard";
const professional = ["40", "10", "29", "66", "16", "32", "20", "19"];
const professionalKey = "47";
const initial = {
  isDuplicate: false,
  address: {},
  militaryId: undefined,
  individualId: undefined,
  fullName: undefined,
  religion: undefined,
  category: undefined,
  force: undefined,
  army: undefined,
  medicalSituation: undefined,
  education: undefined,
  treatment: undefined
};
export default {
  name: "app-filter-card",
  components: {
    materialCard
  },
  data() {
    return {
      militaryIdLength: 13,
      nationalIdLength: 14,
      recordIdLength: 15,
      nextYears: [],
      prevYears: [],
      forces: [],
      militaryIdErrorMessages: [],
      birthDateModal: false,
      joinDateModal: false,
      rankingDateModal: false,
      staff: _.cloneDeep(initial),
      disabled: {
        recruitmentArea: false,
        educationRank: false,
        force: false
      },
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
        ]
      },
      divisions: [],
      unitId: undefined,
      divisionId: undefined,
      birthDateModal: false,
      joinDateModal: false,
      releaseDateModal: false,
      joinMonthModal: false,
      joinYearModal: false,
      releaseMonthModal: false,
      releaseYearModal: false
    };
  },
  async created() {
    const divisions = await this.getDivisions();
    this.setNextYears();
    this.setPreviousYears();
  },
  props: ["value", "fields"],
  computed: {
    ...mapGetters({
      locations: "app/getLocations",
      defaults: "app/getDefaults"
    }),
    divisionsComputed() {
      const divisions = this.staff.army
        ? this.divisions.filter(
            o => o.army === this.staff.army && ["division"].includes(o.type)
          )
        : this.divisions.filter(o => ["division"].includes(o.type));
      return divisions;
    },
    unitsComputed() {
      let units = this.divisions.filter(o =>
        ["battalion", "company"].includes(o.type)
      );

      if (this.staff.divisionId) {
        units = this.staff.divisionId
          ? units.filter(
              o => o.divisionId && o.divisionId._id === this.staff.divisionId
            )
          : units;
      } else {
      }

      if (!this.staff.divisionId && this.staff.army) {
        units = units.filter(o => o.army === this.staff.army);
      }
      return units;
    }
  },
  methods: {
    moment,
    setNextYears(length) {
      const years = [];
      let currentYear = moment()
        .subtract(10, "years")
        .toDate()
        .getFullYear();
      let end = length || 20;
      for (let i = 0; i < end; i++) {
        const year = currentYear++;
        years.push(String(year));
      }
      this.nextYears = years;
    },
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
    setDivision(value) {
      const unit = this.unitsComputed.find(o => o._id === value);
      if (unit) {
        this.soldier.unitId = unit._id;
        this.soldier.divisionId = unit.divisionId
          ? unit.divisionId._id
          : unit.divisionId;
        this.soldier.army = unit.army;
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
      const isValid = this.$refs.form.validate();
      if (isValid) {
        const path = "/staffs";
        const obj = JSON.parse(JSON.stringify(this.staff));
        Object.keys(obj.address).map(o => {
          obj[o] = obj.address[o];
        });
        const response = await get(path, obj);
        if (response.error) {
          return Toaster.fire({
            icon: "error",
            title: response.error,
            timer: 4000,
            showConfirmButton: false
          });
        }
        this.setSearchFields(obj);
        this.$parent.renderStaffs(response.staffs);
      }
    },
    setSearchFields(obj) {
      delete obj.address;
      const fields = Object.keys(obj).map(o => {
        const keyObj = this.fields.find(m => m.value === o);
        const value = obj[o];
        return { keyObj, value };
      });
      this.$parent.searchFields = fields;
      return fields;
    },
    setSearchFields(item) {
      const obj = _.cloneDeep(item);
      const extras = [];
      // console.log("obj for search at first", obj);
      if (obj.address) {
        if (obj.address.governate) {
          delete obj.governate;
          extras.push({
            keyObj: this.fields.find(m => m.value === "address.governate"),
            value: obj.address.governate
          });
        }
        if (obj.address.centre) {
          delete obj.centre;
          extras.push({
            keyObj: this.fields.find(m => m.value === "address.centre"),
            value: obj.address.centre
          });
        }
        if (obj.address.village) {
          delete obj.village;
          extras.push({
            keyObj: this.fields.find(m => m.value === "address.village"),
            value: obj.address.village
          });
        }
      }
      if (obj.divisionId) {
        extras.push({
          keyObj: this.fields.find(m => m.value === "unit.divisionId.name"),
          value: obj.divisionId
        });
        delete obj.divisionId;
      }
      if (obj.unitId) {
        extras.push({
          keyObj: this.fields.find(m => m.value === "unit.unitId.name"),
          value: obj.unitId
        });
        delete obj.unitId;
      }
      if (obj.joinYear) {
        extras.push({
          keyObj: { ar: this.$i18n.t("Join_Year") },
          value: obj.joinYear
        });
        delete obj.joinYear;
      }
      if (obj.joinMonth) {
        extras.push({
          keyObj: { ar: this.$i18n.t("Join_Month") },
          value: obj.joinMonth
        });
        delete obj.joinMonth;
      }
      if (obj.releaseYear) {
        extras.push({
          keyObj: { ar: this.$i18n.t("Release_Year") },
          value: obj.releaseYear
        });
        delete obj.releaseYear;
      }
      if (obj.releaseMonth) {
        extras.push({
          keyObj: { ar: this.$i18n.t("Release_Month") },
          value: obj.releaseMonth
        });
        delete obj.releaseMonth;
      }
      console.log("extras", extras);
      delete obj.address;
      const fields = Object.keys(obj)
        .map(o => {
          const keyObj = this.fields.find(m => m.value === o);
          const value = obj[o];
          return { keyObj, value };
        })
        .filter(o => o.value);
      this.$parent.searchFields = [...fields, ...extras];
      return fields;
    },
    setArmy(value) {
      const division = this.divisions.find(o => o._id === value);

      if (division) {
        this.staff.army = division.army;
      }
    },
    setDivision(value) {
      const unit = this.unitsComputed.find(o => o._id === value);
      if (unit) {
        this.staff.unitId = unit._id;
        this.staff.divisionId = unit.divisionId;
        this.staff.army = unit.army;
      }
    },
    clearDivisions() {
      this.staff.divisionId = undefined;
      this.staff.unitId = undefined;
    },
    clearUnits() {
      this.staff.unitId = undefined;
    },
    onClickOutside(event) {
      console.log("clicked outside", Object.keys(event));
    },

    async processMilitaryId(value) {
      this.forces = _.cloneDeep(this.defaults.FORCES_LIST);
      const year = value.substr(0, 4);
      if (year.length >= 4 && parseInt(year, 10) <= new Date().getFullYear()) {
        const joinDate = new Date(this.joinDate);
        joinDate.setFullYear(parseInt(year, 10));
        this.joinDate = joinDate.toISOString().substr(0, 10);
        this.joinDate = joinDate.toISOString().substr(0, 10);
      }

      if (value.length >= 8) {
        const code = `${value[6]}${value[7]}`;
        const category = this.defaults.STAFF_CATEGORIES.find(
          o => o.code == code
        );

        if (category) {
          this.staff.category = category.value;
          if (category.value === professionalKey) {
            this.forces = _.cloneDeep(this.defaults.FORCES_LIST).filter(o =>
              professional.includes(o.value)
            );
          }
        }
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

      const year = value.substr(0, 4);
      const isValid =
        year.length >= 4 && parseInt(year) <= new Date().getFullYear();

      if (!isValid) {
        return this.$i18n.t("MillitaryId_Invalid");
      }

      if (value.length >= 8) {
        const code = `${value[6]}${value[7]}`;
        const category = this.defaults.STAFF_CATEGORIES.find(
          o => o.code == code
        );

        if (!category) {
          return this.$i18n.t("MillitaryId_Invalid");
        }
      }

      if (value.length < 13) {
        return this.$i18n.t("MillitaryId_Incomplete");
      }

      if (value.length === 13) {
        this.staff.individualId = value.substr(value.length - 4);
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
    validateJoinYear(value) {
      if (typeof value === "undefined") {
        return true;
      }

      if (value.length < 4) {
        return this.$i18n.t("MillitaryId_Invalid");
      }

      const year = value.substr(0, 4);
      const isValid =
        year.length >= 4 && parseInt(year) <= new Date().getFullYear();

      if (!isValid) {
        return this.$i18n.t("MillitaryId_Invalid");
      }

      return false;
    },
    close() {
      this.$emit("close");
    }
  }
};
</script>
