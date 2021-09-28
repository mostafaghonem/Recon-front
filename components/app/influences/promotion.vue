<template>
  <v-form ref="form">
    <v-container py-0>
      <v-layout wrap>
        <v-flex xs12 md3>
          <v-autocomplete
            :no-data-text="$t('No_Selections')"
            class="form-select"
            :items="defaults.RANKS"
            item-text="ar"
            item-value="value"
            v-model="external.lowerRank"
            :label="$t('Promotion_Lower_Rank')"
            :disabled="true"
          />
        </v-flex>
        <v-flex xs12 md3>
          <v-autocomplete
            :no-data-text="$t('No_Selections')"
            class="form-select"
            :items="defaults.RANKS"
            item-text="ar"
            item-value="value"
            v-model="external.higherRank"
            :label="$t('Promotion_Higher_Rank')"
            :disabled="true"
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
                :label="$t('Promotion_Date')"
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
          <v-text-field
            v-model="value.orderNumber"
            :rules="rules.orderNumber"
            :label="$t('Promotion_Order_ID')"
          />
        </v-flex>
      </v-layout>
      <v-layout wrap>
        <v-flex xs12 md3>
          <v-menu
            v-model="orderDateModal"
            :close-on-content-click="false"
            :nudge-left="200"
            :nudge-bottom="30"
            transition="scale-transition"
            offset-x
            min-width="290px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="value.orderDate"
                :rules="rules.orderDate"
                :label="$t('Promotion_Order_Date')"
                prepend-icon="event"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              :allowed-dates="value => moment(value) <= moment()"
              v-model="value.orderDate"
              @input="orderDateModal = false"
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
export default {
  data() {
    return {
      dateModal: false,
      orderDateModal: false,
      rules: {
        date: [v => !!v || this.$t("Promotion_Date_Required")],
        orderNumber: [v => !!v || this.$t("Promotion_Order_ID_Required")],
        orderDate: [v => !!v || this.$t("Promotion_Order_Date_Required")]
      }
    };
  },
  props: {
    value: {
      type: Object,
      default: () => ({})
    },
    indiviualData: {
      type: Object,
      default: () => ({})
    },
    external: {
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
      Object.assign(this.value, this.external);
      const valid = this.$refs.form.validate();
      this.$emit("submit", valid);
    }
  }
};
</script>
