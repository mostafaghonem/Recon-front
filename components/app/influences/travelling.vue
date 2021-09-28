<template>
  <v-form ref="form">
    <v-container py-0>
      <v-layout wrap>
        <v-flex xs12 md3>
          <v-autocomplete
            :no-data-text="$t('No_Selections')"
            class="form-select"
            :items="defaults.COUNTRIES"
            item-text="ar"
            item-value="_id"
            v-model="value.country"
            :rules="rules.country"
            :label="$t('Travelling_Country')"
          />
        </v-flex>
        <v-flex xs12 md3>
          <v-menu
            v-model="travelDateModal"
            :close-on-content-click="false"
            :nudge-left="200"
            :nudge-bottom="30"
            transition="scale-transition"
            offset-x
            min-width="290px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="value.travelDate"
                :rules="rules.travelDate"
                :label="$t('Travelling_Date')"
                prepend-icon="event"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              :allowed-dates="travelDateAllowed"
              @change="value => travelDateAllowed(value, true)"
              v-model="value.travelDate"
              @input="travelDateModal = false"
              locale="ar"
              dark
              is-range
            ></v-date-picker>
          </v-menu>
        </v-flex>
        <v-flex xs12 md3>
          <v-menu
            v-model="comebackDateModal"
            :close-on-content-click="false"
            :nudge-left="200"
            :nudge-bottom="30"
            transition="scale-transition"
            offset-x
            min-width="290px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="value.comebackDate"
                :rules="rules.comebackDate"
                :label="$t('Travelling_Comeback_Date')"
                prepend-icon="event"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              :allowed-dates="comebackDateAllowed"
              @change="value => comebackDateAllowed(value, true)"
              v-model="value.comebackDate"
              @input="comebackDateModal = false"
              locale="ar"
              dark
              is-range
            ></v-date-picker>
          </v-menu>
        </v-flex>
        <v-flex xs12 md3>
          <v-autocomplete
            :no-data-text="$t('No_Selections')"
            class="form-select"
            :items="defaults.TRAVELTYPES"
            item-text="ar"
            item-value="_id"
            v-model="value.travelType"
            :rules="rules.travelType"
            :label="$t('Travelling_Type')"
          />
        </v-flex>
      </v-layout>

      <v-layout wrap>
        <v-flex xs12 md3>
          <v-autocomplete
            :no-data-text="$t('No_Selections')"
            class="form-select"
            :items="CONFIRMATION_DIRECTIONS"
            item-text="ar"
            item-value="ar"
            v-model="value.confirmationDirection"
            :rules="rules.confirmationDirection"
            :label="$t('Travelling_Confirmation_Direction')"
          />
        </v-flex>
        <v-flex xs12 md3>
          <v-menu
            v-model="confirmationDateModal"
            :close-on-content-click="false"
            :nudge-left="200"
            :nudge-bottom="30"
            transition="scale-transition"
            offset-x
            min-width="290px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="value.confirmationDate"
                :rules="rules.confirmationDate"
                :label="$t('Travelling_Confirmation_Date')"
                prepend-icon="event"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              :allowed-dates="travelDateAllowed"
              @change="value => travelDateAllowed(value, true)"
              v-model="value.confirmationDate"
              @input="confirmationDateModal = false"
              locale="ar"
              dark
              is-range
            ></v-date-picker>
          </v-menu>
        </v-flex>
        <v-flex xs12 md3>
          <v-menu
            v-model="confirmationComebackDateModal"
            :close-on-content-click="false"
            :nudge-left="200"
            :nudge-bottom="30"
            transition="scale-transition"
            offset-x
            min-width="290px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="value.confirmationComebackDate"
                :rules="rules.comebackDate"
                :label="$t('Travelling_Confirmation_Comeback_Date')"
                prepend-icon="event"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              :allowed-dates="comebackDateAllowed"
              @change="value => comebackDateAllowed(value, true)"
              v-model="value.confirmationComebackDate"
              @input="confirmationComebackDateModal = false"
              locale="ar"
              dark
              is-range
            ></v-date-picker>
          </v-menu>
        </v-flex>
        <v-flex xs12 md3>
          <v-text-field
            v-model="value.confirmationNumber"
            :rules="rules.confirmationNumber"
            :label="$t('Travelling_Confirmation_Number')"
          />
        </v-flex>
      </v-layout>
      <v-layout wrap>
        <v-flex xs12 md3>
          <v-text-field
            v-model="value.confirmationComebackNumber"
            :rules="rules.confirmationComebackNumber"
            :label="$t('Travelling_Confirmation_Comeback_Number')"
          />
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
      travelDateModal: false,
      comebackDateModal: false,
      confirmationDateModal: false,
      confirmationComebackDateModal: false,
      CONFIRMATION_DIRECTIONS: [
        {
          ar: "الأمانة العامة"
        },
        {
          ar: "هيئة التنظيم والإدارة ق.م"
        },
        {
          ar: "وزارة الدفاع"
        }
      ],
      rules: {
        country: [v => !!v || this.$t("Travelling_Country_Required")],
        travelDate: [v => !!v || this.$t("Travelling_Date_Required")],
        comebackDate: [
          v => !!v || this.$t("Travelling_Comeback_Date_Required")
        ],
        travelType: [v => !!v || this.$t("Travelling_Type_Required")],
        confirmationNumber: [
          v => !!v || this.$t("Travelling_Confirmation_Number_Required")
        ],
        confirmationDirection: [
          v => !!v || this.$t("Travelling_Confirmation_Direction_Required")
        ],
        confirmationDate: [
          v => !!v || this.$t("Travelling_Confirmation_Date_Required")
        ],
        confirmationComebackDate: [
          v => !!v || this.$t("Travelling_Confirmation_Comeback_Date_Required")
        ],
        confirmationComebackNumber: [
          v =>
            !!v || this.$t("Travelling_Confirmation_Comeback_Number_Required")
        ]
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
    travelDateAllowed(time, update) {
      const cases = [moment(time) <= moment()];
      if (this.value.comebackDate) {
        const first = moment(time) <= moment(this.value.comebackDate);
        cases.push(first);
        if (!first && update) {
          this.value.comebackDate = undefined;
        }
      }
      return !cases.includes(false);
    },
    comebackDateAllowed(time, update) {
      const cases = [];
      if (this.value.travelDate) {
        const first = moment(time) >= moment(this.value.travelDate);
        cases.push(first);
        if (!first && update) {
          this.value.travelDate = undefined;
        }
      }
      return !cases.includes(false);
    },
    submit() {
      const valid = this.$refs.form.validate();
      this.$emit("submit", valid);
    }
  }
};
</script>
