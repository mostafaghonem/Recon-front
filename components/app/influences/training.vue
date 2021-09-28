<template>
  <v-form ref="form">
    <v-container py-0>
      <v-layout wrap>
        <v-flex xs12 md3>
          <v-autocomplete
            :no-data-text="$t('No_Selections')"
            class="form-select"
            :items="defaults.COURSETYPES"
            item-text="ar"
            item-value="_id"
            v-model="value.courseType"
            :rukes="rules.courseType"
            :label="$t('Training_Course')"
          />
        </v-flex>
        <v-flex xs12 md3>
          <v-text-field
            class="white-input"
            v-model="value.courseNumber"
            :rukes="rules.courseNumber"
            :label="$t('Training_Course_Number')"
          />
        </v-flex>
        <v-flex xs12 md3>
          <v-text-field
            v-model="value.courseName"
            :rukes="rules.courseName"
            :label="$t('Training_Course_Name')"
          />
        </v-flex>
        <v-flex xs12 md3>
          <v-autocomplete
            :no-data-text="$t('No_Selections')"
            class="form-select"
            :items="defaults.COLLEGES"
            item-text="ar"
            item-value="_id"
            v-model="value.courseCollege"
            :label="$t('Training_College')"
          />
        </v-flex>
      </v-layout>

      <v-layout wrap>
        <v-flex xs12 md3>
          <v-menu
            v-model="fromModal"
            :close-on-content-click="false"
            :nudge-left="200"
            :nudge-bottom="30"
            transition="scale-transition"
            offset-x
            min-width="290px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="value.from"
                :rules="rules.from"
                :label="$t('Training_From')"
                prepend-icon="event"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              :allowed-dates="fromAllowed"
              @change="value => fromAllowed(value, true)"
              v-model="value.from"
              @input="fromModal = false"
              locale="ar"
              dark
              is-range
            ></v-date-picker>
          </v-menu>
        </v-flex>
        <v-flex xs12 md3>
          <v-menu
            v-model="toModal"
            :close-on-content-click="false"
            :nudge-left="200"
            :nudge-bottom="30"
            transition="scale-transition"
            offset-x
            min-width="290px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="value.to"
                :rules="rules.to"
                :label="$t('Training_To')"
                prepend-icon="event"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              :allowed-dates="toAllowed"
              @change="value => toAllowed(value, true)"
              v-model="value.to"
              @input="toModal = false"
              locale="ar"
              dark
            ></v-date-picker>
          </v-menu>
        </v-flex>

        <v-flex xs12 md3>
          <v-text-field
            class="white-input"
            v-model="value.orderNumber"
            :rukes="rules.orderNumber"
            :label="$t('Training_Order_Number')"
          />
        </v-flex>

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
                :label="$t('Training_Order_Date')"
                prepend-icon="event"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              :allowed-dates="fromAllowed"
              v-model="value.orderDate"
              @input="orderDateModal = false"
              locale="ar"
              dark
            ></v-date-picker>
          </v-menu>
        </v-flex>
      </v-layout>
      <v-layout wrap>
        <v-flex xs12 md3>
          <v-autocomplete
            :no-data-text="$t('No_Selections')"
            class="form-select"
            :items="[
              { ar: 'قصر', value: 'قصر' },
              { ar: 'ممتاز', value: 'ممتاز' },
              { ar: 'جيد جداً', value: 'جيد جداً' },
              { ar: 'جيد', value: 'جيد' },
              { ar: 'مقبول', value: 'مقبول' },
              { ar: 'ضعيف', value: 'ضعيف' },
              { ar: 'متخلف', value: 'متخلف' },
              { ar: 'الغاء', value: 'الغاء' }
            ]"
            item-text="ar"
            item-value="value"
            v-model="value.score"
            :rukes="rules.score"
            :label="$t('Training_Score')"
          /> </v-flex
      ></v-layout>
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
      fromModal: false,
      toModal: false,
      orderDateModal: false,
      rules: {
        courseType: [v => !!v || this.$t("Training_Course_Required")],
        courseNumber: [v => !!v || this.$t("Training_Course_Number_Required")],
        courseName: [v => !!v || this.$t("Training_Course_Name_Required")],
        courseCollege: [v => !!v || this.$t("Training_College_Required")],
        from: [v => !!v || this.$t("Training_From_Required")],
        to: [v => !!v || this.$t("Training_To_Required")],
        orderNumber: [v => !!v || this.$t("Training_Order_Number_Required")],
        orderDate: [v => !!v || this.$t("Training_Order_Date_Required")]
        // score: [v => !!v || this.$t("Training_Score_Required")]
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
    fromAllowed(time, update) {
      const cases = [moment(time) <= moment()];
      if (this.value.to) {
        const first = moment(time) <= moment(this.value.to);
        cases.push(first);
        if (!first && update) {
          this.value.to = undefined;
        }
      }
      return !cases.includes(false);
    },
    toAllowed(time, update) {
      const cases = [];
      if (this.value.from) {
        const first = moment(time) >= moment(this.value.from);
        cases.push(first);
        if (!first && update) {
          this.value.to = undefined;
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
