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
                    :label="$t('Military_ID')"
                    :rules="rules.militaryId"
                    v-model="soldier.militaryId"
                  />
                </v-flex>
                <v-flex xs12 md3>
                  <v-text-field
                    class="white-input"
                    @keypress="onlyNumber"
                    :maxlength="recordIdLength"
                    :label="$t('Record_ID')"
                    v-model="soldier.recordId"
                  />
                </v-flex>
                <!-- <v-flex xs12 md3>
                  <v-text-field
                    class="white-input"
                    :mask="'####/####/####'"
                    @keypress="onlyNumber"
                    :label="$t('Triple_Number')"
                    v-model="soldier.tripleNumber"
                  />
                </v-flex> -->
                <v-flex xs12 md3>
                  <v-text-field
                    class="white-input"
                    :maxlength="nationalIdLength"
                    :label="$t('National_ID')"
                    v-model="soldier.nationalId"
                  />
                </v-flex>
                <v-flex xs12 md3>
                  <v-select
                    :no-data-text="$t('No_Selections')"
                    class="form-select"
                    item-text="ar"
                    item-value="value"
                    v-model="soldier.recruitmentArea"
                    :items="locations.recruitmentAreas"
                    :label="$t('Recruitment_Area')"
                    :disabled="disabled.recruitmentArea"
                    :clearable="true"
                    @change="setGovernates"
                  />
                </v-flex>
              </v-layout>
              <v-layout wrap>
                <v-flex xs12 md3>
                  <v-text-field
                    class="white-input"
                    :label="$t('Name')"
                    v-model="soldier.fullName"
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
                    :clearable="true"
                    item-text="ar"
                    item-value="value"
                    v-model="soldier.address.governate"
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
                    :clearable="true"
                    v-model="soldier.address.centre"
                  ></v-combobox>
                </v-flex>
                <v-flex xs12 md3>
                  <v-combobox
                    v-model="soldier.address.village"
                    :items="
                      soldier.address.centre && defaults.villages
                        ? defaults.villages[soldier.address.centre]
                        : []
                    "
                    :clearable="true"
                    :label="$t('Village')"
                  ></v-combobox>
                </v-flex>
              </v-layout>

              <v-layout wrap>
                <v-flex xs12 md3>
                  <v-select
                    :no-data-text="$t('No_Selections')"
                    class="form-select"
                    :items="defaults.EDUCATION_RANKS"
                    :clearable="true"
                    item-text="ar"
                    item-value="value"
                    v-model="soldier.educationRank"
                    :label="$t('Eductional_Rank')"
                    :disabled="disabled.educationRank"
                  />
                </v-flex>
                <v-flex xs12 md3>
                  <v-select
                    :no-data-text="$t('No_Selections')"
                    class="form-select"
                    :items="defaults.FORCES_LIST"
                    :clearable="true"
                    item-text="ar"
                    item-value="value"
                    v-model="soldier.force"
                    :label="$t('Force')"
                    :disabled="disabled.force"
                  />
                </v-flex>
                <v-flex xs12 md3>
                  <v-select
                    :no-data-text="$t('No_Selections')"
                    class="form-select"
                    :items="defaults.SITUATIONS"
                    :clearable="true"
                    item-text="ar"
                    item-value="value"
                    v-model="soldier.situation"
                    :label="$t('Situation')"
                  />
                </v-flex>
                <v-flex xs12 md3>
                  <v-select
                    :no-data-text="$t('No_Selections')"
                    class="form-select"
                    :items="defaults.TREATMENTS"
                    :clearable="true"
                    item-text="ar"
                    item-value="value"
                    v-model="soldier.treatment"
                    :label="$t('Treatment')"
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
                      :range="true"
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
                        v-model="soldier.joinDate"
                        :label="$t('Join_Date')"
                        prepend-icon="event"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                        clearable
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      :allowed-dates="time => moment(time).diff(moment()) < 0"
                      :range="true"
                      v-model="soldier.joinDate"
                      @input="joinDateModal = false"
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
                        v-model="soldier.releaseDate"
                        :label="$t('Release_Date')"
                        prepend-icon="event"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                        clearable
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      :range="true"
                      v-model="soldier.releaseDate"
                      @input="releaseDateModal = false"
                      locale="ar"
                      dark
                    ></v-date-picker>
                  </v-menu>
                </v-flex>
                <v-flex xs12 md3>
                  <v-menu
                    v-model="joinMonthModal"
                    :close-on-content-click="false"
                    :nudge-left="50"
                    :nudge-bottom="5"
                    transition="scale-transition"
                    offset-y
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="soldier.joinMonth"
                        :disabled="!!soldier.joinYear || !!soldier.joinDate"
                        :label="$t('Join_Month')"
                        prepend-icon="event"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                        clearable
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      :allowed-dates="time => moment(time).diff(moment()) < 0"
                      :range="true"
                      v-model="soldier.joinMonth"
                      :disabled="!!soldier.joinYear || !!soldier.joinDate"
                      type="month"
                      @input="joinMonthModal = false"
                      locale="ar"
                      dark
                    ></v-date-picker>
                  </v-menu>
                </v-flex>
              </v-layout>

              <v-layout wrap>
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
                        v-model="soldier.joinYear"
                        :disabled="soldier.joinMonth"
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
                        :disabled="!!soldier.joinMonth || !!soldier.joinDate"
                        :items="prevYears"
                        class="form-select"
                        v-model="soldier.joinYear"
                        prepend-icon="event"
                        clearable
                      />
                    </template>
                    <v-date-picker
                      :allowed-dates="time => moment(time).diff(moment()) < 0"
                      :range="true"
                      :disabled="!!soldier.joinMonth || !!soldier.joinDate"
                      @input="joinYearModal = false"
                      locale="ar"
                      dark
                    ></v-date-picker>
                  </v-menu>
                </v-flex>
                <v-flex xs12 md3>
                  <v-menu
                    v-model="releaseMonthModal"
                    :close-on-content-click="false"
                    :nudge-left="50"
                    :nudge-bottom="5"
                    transition="scale-transition"
                    offset-y
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        :disabled="
                          !!soldier.releaseYear || !!soldier.releaseDate
                        "
                        :label="$t('Release_Month')"
                        v-model="soldier.releaseMonth"
                        prepend-icon="event"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                        clearable
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      :allowed-dates="time => moment(time).diff(moment()) < 0"
                      :range="true"
                      :disabled="!!soldier.releaseYear || !!soldier.releaseDate"
                      v-model="soldier.releaseMonth"
                      type="month"
                      @input="releaseMonthModal = false"
                      locale="ar"
                      dark
                      clearable
                    ></v-date-picker>
                  </v-menu>
                </v-flex>
                <v-flex xs12 md3>
                  <v-menu
                    v-model="releaseYearModal"
                    :close-on-content-click="false"
                    :nudge-left="50"
                    :nudge-bottom="5"
                    transition="scale-transition"
                    offset-y
                    min-width="290px"
                  >
                    <template v-slot:activator="{}">
                      <v-autocomplete
                        :disabled="
                          !!soldier.releaseMonth || !!soldier.releaseDate
                        "
                        v-model="soldier.releaseYear"
                        :label="$t('Release_Year')"
                        :items="nextYears"
                        class="form-select"
                        prepend-icon="event"
                        clearable
                      ></v-autocomplete>
                    </template>
                    <v-date-picker
                      :range="true"
                      :disabled="
                        !!soldier.releaseMonth || !!soldier.releaseDate
                      "
                      @input="releaseYearModal = false"
                      locale="ar"
                      dark
                    ></v-date-picker>
                  </v-menu>
                </v-flex>
                <v-flex xs12 md3>
                  <v-select
                    :no-data-text="$t('No_Selections')"
                    class="form-select"
                    :items="defaults.RECRUITMENT_LEVELS"
                    :clearable="true"
                    item-text="ar"
                    item-value="value"
                    :label="$t('RECRUITMENT_LEVEL')"
                    v-model="soldier.recruitmentLevel"
                  />
                </v-flex>
              </v-layout>

              <v-layout wrap>
                <v-flex xs12 md3>
                  <v-select
                    :no-data-text="$t('No_Selections')"
                    class="form-select"
                    :items="defaults.ARMY_LIST"
                    :clearable="true"
                    item-text="ar"
                    item-value="value"
                    v-model="soldier.army"
                    :label="$t('Army')"
                    @change="setAll"
                    @click:clear="clearDivisions"
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
                    :clearable="true"
                    @click:clear="clearUnits"
                  />
                </v-flex>
              </v-layout>
              <!-- <v-layout wrap>
                <v-flex xs12 md6>
                  <v-text-field
                    class="white-input"
                    :label="$t('Notes')"
                    v-model="soldier.notes"
                  />
                </v-flex>
              </v-layout> -->
              <v-flex xs12 text-xs-right>
                <v-btn class="font-weight-light add-button" @click="submit">
                  {{ $t("Search") }}
                </v-btn>
              </v-flex>
            </v-container>
          </v-form>
        </material-card>
      </v-flex>
    </v-layout>
    <!-- </v-container> -->
  </v-dialog>
</template>
<script>
import _ from "lodash";
import { mapGetters } from "vuex";
import { onlyNumber, Toaster } from "~/plugins/helpers";
import { get, post } from "~/plugins/axiosbase";
import moment from "moment";
import materialCard from "~/components/material/AppCard";
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
      soldier: {
        tripleNumber: undefined,
        address: {},
        militaryId: undefined,
        recordId: undefined,
        fullName: undefined,
        name: undefined,
        force: undefined,
        army: undefined,
        situation: undefined,
        joinDate: undefined,
        birthDate: undefined,
        releaseDate: undefined,
        recruitmentLevel: undefined,
        educationRank: undefined,
        treatment: undefined,
        notes: undefined
      },
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
          v => {
            return this.validateJoinYear(v);
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
        const path = "/soldiers";
        const obj = JSON.parse(JSON.stringify(this.soldier));
        Object.keys(obj.address).map(o => {
          obj[o] = obj.address[o];
        });
        if (obj.unitId && obj.divisionId) {
          obj.divisionId = undefined;
        }
        if (obj.divisionId && obj.divisionId._id) {
          obj.divisionId = obj.divisionId._id;
        }

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
        this.$parent.renderSoldiers(response.soldiers);
      }
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
      console.log('extras', extras)
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
    setGovernates(recruitmentArea) {
      this.governates = this.locations.governates.filter(
        o => o.recruitment_area && o.recruitment_area.value === recruitmentArea
      );
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
    clearDivisions() {
      this.soldier.divisionId = undefined;
      this.soldier.unitId = undefined;
    },
    clearUnits() {
      this.soldier.unitId = undefined;
    },
    onClickOutside(event) {
      console.log("clicked outside", Object.keys(event));
    },
    onlyNumber($event) {
      //console.log($event.keyCode); //keyCodes value
      let keyCode = $event.keyCode ? $event.keyCode : $event.which;
      if ((keyCode < 48 || keyCode > 57) && keyCode !== 46) {
        // 46 is dot
        $event.preventDefault();
      }
    },
    tripleNumberParser($event) {
      if (this.soldier.tripleNumber.length > 4) {
        this.$nextTick(() => {
          let chuncks = this.soldier.tripleNumber
            .replace(/\//g, "")
            .match(/.{1,3}/g);
          chuncks[0] = chuncks[0] + chuncks[1][0];
          chuncks[1] = chuncks[1].substr(1);
          this.soldier.tripleNumber = chuncks.join("\/");
        });
      }
    },
    validateJoinYear(value) {
      if (typeof value === "undefined") {
        return true;
      }

      if (value.length < 4) {
        return this.$i18n.t("MillitaryId_Invalid");
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
        console.log(
          "supposed string",
          this.$i18n.t("MillitaryId_Invalid"),
          year,
          year.length,
          new Date().getFullYear(),
          parseInt(year) <= new Date().getFullYear()
        );
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
