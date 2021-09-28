<template>
  <v-container fill-height fluid grid-list-xl style="direction:rtl;">
    <v-layout justify-center wrap>
      <v-flex xs12 md12>
        <material-card
          dark
          color="deep"
          :title="edit ? $t('Edit_Staff') : $t('Add_Staff')"
        >
          <v-form ref="form">
            <v-container py-0>
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
                    disabled
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
                    v-model="staff.unitId"
                    @change="setDivision"
                    :label="$t('Unit')"
                    :rules="rules.unitId"
                    :clearable="true"
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
import { Toaster } from "~/plugins/helpers";
import { get, post } from "~/plugins/axiosbase";
import moment, { months } from "moment";
import materialCard from "~/components/material/AppCard";

const professional = ["40", "10", "29", "66", "16", "32", "20", "19"];
const professionalKey = "47";
const initial = {
  isDuplicate: false,
  address: {},
  militaryId: undefined,
  individualId: undefined,
  fullName: undefined,
  religion: "مسلم",
  category: undefined,
  force: undefined,
  army: undefined,
  medicalSituation: "fit",
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
  education: undefined,
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
      militaryIdErrorMessages: [],
      staff: _.cloneDeep(initial),
      forces: [],
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
        name: [v => !!v || this.$t("Name_Required")],
        rank: [v => !!v || this.$t("Rank_Required")],
        category: [v => !!v || this.$t("Category_Required")],
        force: [v => !!v || this.$t("Force_Required")],
        rankingDate: [v => !!v || this.$t("Ranking_Date_Required")],
        governate: [v => !!v || this.$t("Governate_Required")],
        centre: [v => !!v || this.$t("Centre_Required")],
        village: [v => !!v || this.$t("Village_Required")]
      },
      divisions: [],
      unitId: undefined,
      divisionId: undefined,
      edit: false,
      birthDateModal: false,
      joinDateModal: false,
      rankingDateModal: false,
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
      this.staff = _.cloneDeep(initial);
    } else {
      this.processMilitaryId(this.staff.militaryId);
      this.setDivision(this.staff.unitId, this.edit);
      this.joinDate = this.staff.joinDate;
      this.rankingDate = this.staff.rankingDate;
      this.birthDate = this.staff.birthDate;
    }
    // this.joinDate = this.staff.joinDate;
    // this.educationRank = this.staff.educationRank;
    // this.recruitmentLevel = this.staff.recruitmentLevel;
  },
  middleware: ["auth", "isNotLoggedIn", "isAuthorized"],
  meta: {
    branches: ["recon_force_people"],
    permissions: ["recon_staff_creator"]
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
      const divisions = this.staff.army
        ? this.divisions.filter(
            o => o.army === this.staff.army && ["division"].includes(o.type)
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

      if (!this.divisionId && this.staff.army) {
        units = units.filter(o => o.army === this.staff.army);
      }
      return units;
    }
  },
  methods: {
    moment,
    getRightMonths(time) {
      return [0, 3, 6, 9].includes(moment(time).month());
    },
    reset() {
      this.joinDateBack = this.joinDate;
      this.staff = _.cloneDeep(initial);
      this.treatment = this.staff.treatment;
      this.educationRank = this.staff.educationRank;
      this.recruitmentLevel = this.staff.recruitmentLevel;
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
        const path = this.edit ? `/staffs/edit/${this.staffId}` : "/staffs";

        const response = await post(path, this.staff);
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
          title: this.$i18n.t(`${addOrEdit}_Staff_Success`),
          timer: 4000,
          showConfirmButton: false
        });
      }
    },
    async isDuplicate({ key, value }) {
      const path = "/staffs/is-duplicate";
      const query = { key, value };
      const response = await get(path, query);
      if (response.error) {
        return false;
      }

      return response.isDuplicate;
    },
    setAll(value) {
      this.staff.unitId = undefined;
      this.staff.divisionId = undefined;
    },
    setUnits(value) {
      const division = this.divisions.find(o => o._id === value);
      this.divisionId = value;
      if (division) {
        this.staff.army = division.army;
        this.staff.unitId = undefined;
      }
    },
    setDivision(value, edit) {
      let unit = this.unitsComputed.find(o => o._id === value);

      if (edit) {
        unit = this.divisions.find(o => o._id === value);
      }

      if (unit) {
        this.staff.unitId = unit._id;
        this.staff.divisionId = unit.divisionId
          ? unit.divisionId._id
          : unit.divisionId;
        this.staff.army = unit.army;
      }
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

      if (value.length === 13 && !this.edit) {
        try {
          const militaryIdValidation = await this.isDuplicate({
            key: "militaryId",
            value
          });
          this.staff.isDuplicate = militaryIdValidation;
          if (this.staff.isDuplicate) {
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
    }
  },
  mounted() {
    window.addEventListener("keypress", this.command);
    if (this.staffId) {
      this.processMilitaryId(this.staff.militaryId);
    }
  },
  destroyed() {
    window.removeEventListener("keypress", this.command);
  },
  async asyncData({ route }) {
    const staffId = route.path.substr(route.path.lastIndexOf("/") + 1);
    if (!route.path.includes("edit")) {
      return {};
    }

    const path = `/staffs/data/${staffId}`;
    const staff = await get(path);

    if (staff.error) {
      Toaster.fire({
        icon: "error",
        title: staff.error,
        timer: 4000,
        showConfirmButton: false
      });
      return {};
    }
    staff.birthDate = moment(staff.birthDate)
      .toISOString()
      .substr(0, 10);

    staff.joinDate = moment(staff.joinDate)
      .toISOString()
      .substr(0, 10);

    staff.rankingDate = moment(staff.rankingDate)
      .toISOString()
      .substr(0, 10);

      
    if (staff.unit && staff.unit.unitId) {
      staff.unitId = staff.unit.unitId;
    }

    return { staffId, staff, edit: true };
  }
};
</script>
