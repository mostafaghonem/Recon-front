<template>
  <v-form ref="form">
    <v-container py-0>
      <v-layout wrap>
        <v-flex xs12 md3>
          <v-autocomplete
            :no-data-text="$t('No_Selections')"
            class="form-select"
            :items="locations ? locations.governates : []"
            item-text="ar"
            item-value="value"
            v-model="value.governate"
            :rules="rules.governate"
            :label="$t('Literacy_Governate')"
          />
        </v-flex>
        <v-flex xs12 md3>
          <v-autocomplete
            :no-data-text="$t('No_Selections')"
            class="form-select"
            :items="defaults.GRADUATION_LEVELS"
            item-text="ar"
            item-value="value"
            v-model="value.graduationLevel"
            :rules="rules.graduationLevel"
            :label="$t('Literacy_Graduation_Level')"
          />
        </v-flex>
        <v-flex xs12 md3>
          <v-menu
            v-model="dateModal"
            :close-on-content-click="false"
            :nudge-left="200"
            :nudge-bottom="30"
            transition="scale-transition"
            offset-x
            min-width="290px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="value.date"
                :rules="rules.date"
                :label="$t('Literacy_Date')"
                prepend-icon="event"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              :allowed-dates="value => moment(value) <= moment()"
              v-model="value.date"
              @input="dateModal = false"
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
            :items="defaults.DEGREES"
            item-text="ar"
            item-value="value"
            v-model="value.degree"
            :rules="rules.degree"
            :label="$t('Literacy_Degree')"
          />
        </v-flex>
      </v-layout>
      <v-layout wrap>
        <v-flex xs12 md3>
          <v-text-field
            v-model="value.literacyNumber"
            :rules="rules.literacyNumber"
            :label="$t('Literacy_Number')"
          />
        </v-flex>
        <v-flex xs12 md3>
          <v-text-field
            v-model="value.seatNumber"
            :rules="rules.seatNumber"
            :label="$t('Literacy_Seat_Number')"
          />
        </v-flex>
        <v-flex xs12 md3>
          <v-text-field
            v-model="value.score"
            :rules="rules.score"
            :label="$t('Literacy_Score')"
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
export default {
  data() {
    return {
      dateModal: false,
      rules: {
        governate: [v => !!v || this.$t("Literacy_Governate_Required")],
        graduationLevel: [
          v => !!v || this.$t("Literacy_Graduation_Level_Required")
        ],
        date: [v => !!v || this.$t("Literacy_Date_Required")],
        degree: [v => !!v || this.$t("Literacy_Degree_Required")]
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
