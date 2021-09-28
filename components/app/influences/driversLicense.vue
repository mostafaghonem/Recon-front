<template>
  <v-form ref="form">
    <v-container py-0>
      <v-layout wrap>
        <v-flex xs12 md6>
          <v-text-field
            class="white-input"
            type="number"
            v-model="value.firstLicenseNumber"
            :rukes="rules.firstLicenseNumber"
            :label="$t('Drivers_License_First_License_Number')"
          />
        </v-flex>
        <v-flex xs12 md6>
          <v-menu
            v-model="firstLicenseDateModal"
            :close-on-content-click="false"
            :nudge-left="200"
            :nudge-bottom="30"
            transition="scale-transition"
            offset-x
            min-width="290px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="value.firstLicenseDate"
                :rules="rules.firstLicenseDate"
                :label="$t('Drivers_License_First_License_Date')"
                prepend-icon="event"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              :allowed-dates="value => moment(value) <= moment()"
              v-model="value.firstLicenseDate"
              @input="firstLicenseDateModal = false"
              locale="ar"
              dark
              is-range
            ></v-date-picker>
          </v-menu>
        </v-flex>
      </v-layout>
      <v-layout wrap>
        <v-flex xs12 md6>
          <v-text-field
            class="white-input"
            v-model="value.secondLicenseNumber"
            :rukes="rules.secondLicenseNumber"
            :label="$t('Drivers_License_Second_License_Number')"
          />
        </v-flex>
        <v-flex xs12 md6>
          <v-menu
            v-model="secondLicenseDateModal"
            :close-on-content-click="false"
            :nudge-left="200"
            :nudge-bottom="30"
            transition="scale-transition"
            offset-x
            min-width="290px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="value.secondLicenseDate"
                :rules="rules.secondLicenseDate"
                :label="$t('Drivers_License_Second_License_Date')"
                prepend-icon="event"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              :allowed-dates="value => moment(value) <= moment()"
              v-model="value.secondLicenseDate"
              @input="secondLicenseDateModal = false"
              locale="ar"
              dark
              is-range
            ></v-date-picker>
          </v-menu>
        </v-flex>
      </v-layout>
      <v-layout wrap>
        <v-flex xs12 md6>
          <v-menu
            v-model="lastCommissionDateModal"
            :close-on-content-click="false"
            :nudge-left="200"
            :nudge-bottom="30"
            transition="scale-transition"
            offset-x
            min-width="290px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="value.lastCommissionDate"
                :rules="rules.lastCommissionDate"
                :label="$t('Drivers_License_Comission_Date')"
                prepend-icon="event"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              :allowed-dates="value => moment(value) <= moment()"
              v-model="value.lastCommissionDate"
              @input="lastCommissionDateModal = false"
              locale="ar"
              dark
              is-range
            ></v-date-picker>
          </v-menu>
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
import moment from "moment";
import { mapGetters } from "vuex";
import { Toaster } from "~/plugins/helpers";
export default {
  data() {
    return {
      firstLicenseDateModal: false,
      secondLicenseDateModal: false,
      rules: {
        firstLicenseNumber: [v => !!v || this.$t("Drivers_License_First_License_Number_Required")],
        firstLicenseDate: [
          v => !!v || this.$t("Drivers_License_First_License_Date_Required")
        ],
        secondLicenseNumber: [
          v => !!v || this.$t("Drivers_License_Second_License_Number_Required")
        ],
        secondLicenseDate: [v => !!v || this.$t("Drivers_License_Second_License_Date_Required")],
        lastCommissionDate: [v => !!v || this.$t("Drivers_License_Comission_Date_Required")]
      }
    };
  },
  props: {
    value: {
      type: Object,
      default: () => ({})
    }
  },
  components: {},
  computed: {
    ...mapGetters({
      locations: "app/getLocations",
      defaults: "app/getDefaults"
    })
  },
  methods: {
    moment,
    submit() {
      const valid = this.$refs.form.validate();
      this.$emit("submit", valid);
    }
  }
};
</script>
