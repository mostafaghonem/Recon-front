<template>
  <v-form ref="form">
    <v-container py-0>
      <v-layout wrap>
        <v-flex xs12 md3>
          <v-text-field
            v-model="external.noticeNumber"
            :rules="rules.noticeNumber"
            :label="$t('Flee_Notice_Number')"
          />
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
                v-model="external.noticeDate"
                :rules="rules.noticeDate"
                :label="$t('Flee_Notice_Date')"
                prepend-icon="event"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              :allowed-dates="time => moment(time) <= moment()"
              v-model="value.noticeDate"
              @input="noticeDateModal = false"
              locale="ar"
              dark
            ></v-date-picker>
          </v-menu>
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
                v-model="external.abscenseDate"
                :rules="rules.abscenseDate"
                :label="$t('Flee_Abscense_Date')"
                prepend-icon="event"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              :allowed-dates="time => moment(time) <= moment()"
              v-model="value.abscenseDate"
              @input="abscenseDateModal = false"
              locale="ar"
              dark
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
                v-model="external.removalDate"
                :rules="rules.removalDate"
                :label="$t('Flee_Removal_Date')"
                prepend-icon="event"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              :allowed-dates="time => moment(time) <= moment()"
              v-model="value.removalDate"
              @input="removalDateModal = false"
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
                v-model="external.noticeArrivalDate"
                :rules="rules.noticeArrivalDate"
                :label="$t('Flee_Notice_Arrival_Date')"
                prepend-icon="event"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              :allowed-dates="time => moment(time) <= moment()"
              v-model="value.noticeArrivalDate"
              @input="noticeArrivalDateModal = false"
              locale="ar"
              dark
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
                :label="$t('Flee_Comeback_Date')"
                prepend-icon="event"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              :allowed-dates="time => moment(time) <= moment()"
              v-model="value.comebackDate"
              @input="comebackDateModal = false"
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
    },
    external: {
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
      comebackDateModal: false,
      rules: {
        noticeNumber: [v => !!v || this.$t("Flee_Notice_Number_Required")],
        noticeDate: [v => !!v || this.$t("Flee_Notice_Date_Required")],
        abscenseDate: [v => !!v || this.$t("Flee_Abscense_Date_Required")],
        removalDate: [v => !!v || this.$t("Flee_Removal_Date_Required")],
        comebackDate: [v => !!v || this.$t("Flee_Comeback_Date_Required")],
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
    submit() {
      Object.assign(this.value, this.external);
      const valid = this.$refs.form.validate();
      this.$emit("submit", valid);
    }
  }
};
</script>
