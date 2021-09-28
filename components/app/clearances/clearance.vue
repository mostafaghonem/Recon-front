<template>
  <v-form ref="form">
    <v-container py-0>
      <v-layout wrap>
        <v-flex xs12 md3>
          <v-menu
            v-model="joinDateModal"
            :close-on-content-click="false"
            :nudge-left="200"
            :nudge-bottom="30"
            transition="scale-transition"
            offset-x
            min-width="290px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="value.joinDate"
                :rules="rules.joinDate"
                :label="$t('Clearance_Join_Date')"
                prepend-icon="event"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              :allowed-dates="joinDateAllowed"
              @change="value => joinDateAllowed(value, true)"
              v-model="value.joinDate"
              @input="joinDateModal = false"
              locale="ar"
              dark
            ></v-date-picker>
          </v-menu>
        </v-flex>
        <v-flex xs12 md3>
          <v-autocomplete
            :no-data-text="$t('No_Selections')"
            class="form-select"
            :items="defaults.JOINPLACES"
            item-text="ar"
            item-value="_id"
            v-model="value.joinPlace"
            :rules="rules.joinPlace"
            :label="$t('Clearance_Join_Place')"
          />
        </v-flex>

        <v-flex xs12 md3>
          <v-autocomplete
            :no-data-text="$t('No_Selections')"
            class="form-select"
            :items="defaults.CLEARANCE_STATUSES"
            item-text="ar"
            item-value="value"
            v-model="value.clearanceStatus"
            :rules="rules.clearanceStatus"
            :label="$t('Clearance_Status')"
          />
        </v-flex>
        <v-flex xs12 md3>
          <v-autocomplete
            :no-data-text="$t('No_Selections')"
            class="form-select"
            :items="defaults.SOLDIER_STATUSES"
            item-text="ar"
            item-value="value"
            v-model="value.soldierStatus"
            :rules="rules.soldierStatus"
            :label="$t('Clearance_Soldier_Status')"
          />
        </v-flex>
      </v-layout>
      <v-layout
        v-if="
          value.clearanceStatus === 'rejected' ||
            value.soldierStatus === 'departed'
        "
        wrap
      >
        <v-flex v-if="value.clearanceStatus === 'rejected'" xs12 md3>
          <v-autocomplete
            :no-data-text="$t('No_Selections')"
            class="form-select"
            :items="Force_Statuses"
            item-text="ar"
            item-value="value"
            v-model="value.newUnitType"
            :rules="rules.newUnitType"
            :label="$t('Clearance_New_Unit_Type')"
          />
        </v-flex>
        <v-flex v-if="value.soldierStatus === 'departed'" xs12 md3>
          <v-menu
            v-model="departureDateModal"
            :close-on-content-click="false"
            :nudge-left="200"
            :nudge-bottom="30"
            transition="scale-transition"
            offset-x
            min-width="290px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="value.departureDate"
                :rules="rules.departureDate"
                :label="$t('Clearance_Departure_Date')"
                prepend-icon="event"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              :allowed-dates="departureDateAllowed"
              @change="value => departureDateAllowed(value, true)"
              v-model="value.departureDate"
              @input="departureDateModal = false"
              locale="ar"
              dark
            ></v-date-picker>
          </v-menu>
        </v-flex>
      </v-layout>

      <v-layout v-if="value.clearanceStatus === 'rejected'" wrap>
        <v-flex xs12 md3>
          <v-select
            :no-data-text="$t('No_Selections')"
            class="form-select"
            :items="defaults.ARMY_LIST"
            item-text="ar"
            item-value="value"
            v-model="value.army"
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
            v-model="value.divisionId"
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
            v-model="value.newUnitId"
            @change="setDivision"
            :label="$t('Unit')"
            :rules="rules.newUnitId"
            :clearable="true"
            :disabled="value.newUnitType === 'outside_of_force'"
          />
        </v-flex>
        <v-flex xs12 md3>
          <v-text-field v-model="value.notes" :label="$t('Notes')" />
        </v-flex>
      </v-layout>
      <v-flex xs12 text-xs-right>
        <v-btn class="font-weight-light add-button v-btn-add" @click="submit">
          {{ $t("Add") }}
        </v-btn>
      </v-flex>
    </v-container>
  </v-form>
</template>

<script>
import { mapGetters } from "vuex";
import moment from "moment";
export default {
  data() {
    return {};
  },
  props: {
    value: {
      type: Object,
      default: () => ({})
    },
    external: {
      type: Object,
      default: () => ({})
    },
    divisions: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      joinDateModal: false,
      departureDateModal: false,
      Force_Statuses: [
        { value: "outside_of_force", ar: "خارج السلاح" },
        { value: "inside_of_force", ar: "داخل السلاح" }
      ],
      rules: {
        joinPlace: [v => !!v || this.$t("Clearance_Join_Place_Required")],
        joinDate: [v => !!v || this.$t("Clearance_Join_Date_Required")],
        clearanceStatus: [v => !!v || this.$t("Clearance_Status_Required")],
        soldierStatus: [
          v => !!v || this.$t("Clearance_Soldier_Status_Required")
        ],
        newUnitType: [
          v =>
            (!!v && this.value.clearanceStatus === "rejected") ||
            this.$t("Clearance_New_Unit_Type_Required")
        ],
        newUnitId: [
          v =>
            this.value.newUnitType !== "inside_of_force" ||
            (!!v && this.value.clearanceStatus === "rejected") ||
            this.$t("Clearance_New_Unit")
        ],
        departureDate: [
          v =>
            (!!v && this.value.soldierStatus === "departed") ||
            this.$t("Clearance_Departure_Date")
        ]
      }
    };
  },
  components: {},
  computed: {
    ...mapGetters({
      defaults: "app/getDefaults"
    }),
    divisionsComputed() {
      const divisions = this.value.army
        ? this.divisions.filter(
            o => o.army === this.value.army && ["division"].includes(o.type)
          )
        : this.divisions.filter(o => ["division"].includes(o.type));
      return divisions;
    },
    unitsComputed() {
      let units = this.divisionId
        ? this.divisions
            .filter(o => ["battalion", "company"].includes(o.type))
            .filter(
              o =>
                o.divisionId === this.divisionId ||
                (o.divisionId && o.divisionId._id === this.divisionId)
            )
        : this.divisions.filter(o => ["battalion", "company"].includes(o.type));

      if (!this.divisionId && this.value.army) {
        units = units.filter(o => o.army === this.value.army);
      }
      return units;
    }
  },
  methods: {
    moment,
    joinDateAllowed(time, update) {
      const cases = [moment(time) <= moment()];
      if (this.value.departureDate) {
        const first = moment(time) <= moment(this.value.departureDate);
        cases.push(first);
        if (!first && update) {
          this.value.departureDate = undefined;
        }
      }
      return !cases.includes(false);
    },
    departureDateAllowed(time, update) {
      const cases = [moment(time) <= moment()];
      if (this.value.joinDate) {
        const first = moment(time) >= moment(this.value.joinDate);
        cases.push(first);
        if (!first && update) {
          this.value.joinDate = undefined;
        }
      }
      return !cases.includes(false);
    },
    setAll(value) {
      this.value.newUnitId = undefined;
      this.value.divisionId = undefined;
    },
    setUnits(value) {
      const division = this.divisions.find(o => o._id === value);
      this.divisionId = value;
      if (division) {
        console.log("clearing unit", division);
        this.value.army = division.army;
        this.value.newUnitId = undefined;
      }
    },
    setDivision(value) {
      const unit = this.unitsComputed.find(o => o._id === value);
      if (unit) {
        this.value.newUnitId = unit._id;
        this.value.divisionId = unit.divisionId
          ? unit.divisionId._id
          : unit.divisionId;
        this.value.army = unit.army;
      }
    },
    submit() {
      const valid = this.$refs.form.validate();
      this.$emit("submit", valid);
    }
  }
};
</script>
