<template>
  <v-form ref="form">
    <v-container py-0>
      <v-layout wrap>
        <v-flex xs12 md3>
          <v-text-field
            v-model="value.noticeNumber"
            :rules="rules.noticeNumber"
            :label="$t('Flee_Notice_Number')"
          />
        </v-flex>

        <v-flex xs12 md3>
          <v-menu
            v-model="abscenseDateModal"
            :close-on-content-click="false"
            :nudge-left="200"
            :nudge-bottom="30"
            transition="scale-transition"
            offset-x
            min-width="290px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="value.abscenseDate"
                :rules="rules.abscenseDate"
                :label="$t('Flee_Abscense_Date')"
                prepend-icon="event"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              :allowed-dates="abscenseDateAllowed"
              v-model="value.abscenseDate"
              @input="abscenseDateModal = false"
              locale="ar"
              dark
              @change="value => abscenseDateAllowed(value, true)"
            ></v-date-picker>
          </v-menu>
        </v-flex>
        <v-flex xs12 md3>
          <v-menu
            v-model="removalDateModal"
            :close-on-content-click="false"
            :nudge-left="200"
            :nudge-bottom="30"
            transition="scale-transition"
            offset-x
            min-width="290px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="value.removalDate"
                :rules="rules.removalDate"
                :label="$t('Flee_Removal_Date')"
                prepend-icon="event"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              :allowed-dates="removalDateAllowed"
              @change="value => removalDateAllowed(value, true)"
              v-model="value.removalDate"
              @input="removalDateModal = false"
              locale="ar"
              dark
            ></v-date-picker>
          </v-menu>
        </v-flex>
        <v-flex xs12 md3>
          <v-menu
            v-model="noticeDateModal"
            :close-on-content-click="false"
            :nudge-left="200"
            :nudge-bottom="30"
            transition="scale-transition"
            offset-x
            min-width="290px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="value.noticeDate"
                :rules="rules.noticeDate"
                :label="$t('Flee_Notice_Date')"
                prepend-icon="event"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              :allowed-dates="noticeDateAllowed"
              @change="value => noticeDateAllowed(value, true)"
              v-model="value.noticeDate"
              @input="noticeDateModal = false"
              locale="ar"
              dark
            ></v-date-picker>
          </v-menu>
        </v-flex>
      </v-layout>
      <v-layout wrap>
        <v-flex xs12 md3>
          <v-menu
            v-model="noticeArrivalDateModal"
            :close-on-content-click="false"
            :nudge-left="200"
            :nudge-bottom="30"
            transition="scale-transition"
            offset-x
            min-width="290px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="value.noticeArrivalDate"
                :rules="rules.noticeArrivalDate"
                :label="$t('Flee_Notice_Arrival_Date')"
                prepend-icon="event"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              :allowed-dates="noticeArrivalDateAllowed"
              @change="value => noticeArrivalDateAllowed(value, true)"
              v-model="value.noticeArrivalDate"
              @input="noticeArrivalDateModal = false"
              locale="ar"
              dark
            ></v-date-picker>
          </v-menu>
        </v-flex>
        <v-flex xs12 md6>
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
    }
  },
  data() {
    return {
      noticeDateModal: false,
      abscenseDateModal: false,
      removalDateModal: false,
      noticeArrivalDateModal: false,
      rules: {
        noticeNumber: [v => !!v || this.$t("Flee_Notice_Number_Required")],
        noticeDate: [v => !!v || this.$t("Flee_Notice_Date_Required")],
        abscenseDate: [v => !!v || this.$t("Flee_Abscense_Date_Required")],
        removalDate: [v => !!v || this.$t("Flee_Removal_Date_Required")],
        noticeArrivalDate: [
          v => !!v || this.$t("Flee_Notice_Arrival_Date_Required")
        ]
      }
    };
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
    noticeDateAllowed(time, update) {
      const cases = [];
      if (this.value.removalDate) {
        const first = moment(time) >= moment(this.value.removalDate);
        if (update && !first) {
          this.value.removalDate = undefined;
        }
        cases.push(first);
      }
      if (this.value.abscenseDate) {
        const second = moment(time) >= moment(this.value.abscenseDate);
        if (update && !second) {
          this.value.abscenseDate = undefined;
        }
        cases.push(second);
      }
      const third = moment(time) <= moment();
      cases.push(third);
      return !cases.includes(false);
    },
    abscenseDateAllowed(time, update) {
      const cases = [];
      if (this.value.noticeDate) {
        const first = moment(time) <= moment(this.value.noticeDate);
        if (update && !first) {
          this.value.noticeDate = undefined;
        }
        cases.push(first);
      }
      if (this.value.removalDate) {
        const second = moment(time) <= moment(this.value.removalDate);
        if (update && !second) {
          this.value.noticeDate = undefined;
        }
        cases.push(second);
      }
      const third = moment(time) <= moment();
      cases.push(third);
      return !cases.includes(false);
    },
    removalDateAllowed(time, update) {
      const cases = [];
      if (this.value.noticeDate) {
        const first = moment(time) <= moment(this.value.noticeDate);
        if (update && !first) {
          this.value.noticeDate = undefined;
        }
        cases.push(first);
      }
      if (this.value.abscenseDate) {
        const second = moment(time) >= moment(this.value.abscenseDate);
        if (update && !second) {
          this.value.abscenseDate = undefined;
        }
        cases.push(second);
      }
      const third = moment(time) <= moment();
      cases.push(third);
      return !cases.includes(false);
    },
    noticeArrivalDateAllowed(time, update) {
      const cases = [];
      if (this.value.noticeDate) {
        const first = moment(time) >= moment(this.value.noticeDate);
        if (update && !first) {
          this.value.noticeDate = undefined;
        }
        cases.push(first);
      }
      const second = moment(time) <= moment();
      cases.push(second);
      return !cases.includes(false);
    },

    submit() {
      const valid = this.$refs.form.validate();
      this.$emit("submit", valid);
    }
  }
};
</script>
