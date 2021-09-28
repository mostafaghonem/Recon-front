<template>
  <v-form ref="form">
    <v-container py-0>
      <v-layout wrap>
        <v-flex xs12 md3>
          <v-autocomplete
            :no-data-text="$t('No_Selections')"
            class="form-select"
            :items="defaults.PUNISHMENTS"
            item-text="ar"
            item-value="_id"
            v-model="value.title"
            :rules="rules.title"
            :label="$t('Punishments_title')"
          />
        </v-flex>
        <v-flex xs12 md3>
          <v-autocomplete
            :no-data-text="$t('No_Selections')"
            class="form-select"
            :items="defaults.ORDERMAKERS"
            item-text="ar"
            item-value="_id"
            v-model="value.orderMaker"
            :rules="rules.orderMaker"
            :label="$t('Punishments_Order_Maker')"
          />
        </v-flex>
        <v-flex xs12 md3>
          <v-menu
            v-model="startDateModal"
            :close-on-content-click="false"
            :nudge-left="200"
            :nudge-bottom="30"
            transition="scale-transition"
            offset-x
            min-width="290px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="value.startDate"
                :rules="rules.startDate"
                :label="$t('Punishments_Start_Date')"
                prepend-icon="event"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              :allowed-dates="value => moment(value) <= moment()"
              v-model="value.startDate"
              @input="startDateModal = false"
              locale="ar"
              dark
              is-range
            ></v-date-picker>
          </v-menu>
        </v-flex>
        <v-flex xs12 md2>
          <v-text-field
            v-model="value.period"
            type="number"
            :rules="rules.period"
            :label="$t('Punishments_Period')"
          />
        </v-flex>
        <v-flex xs12 md1>
          <v-autocomplete
            :no-data-text="$t('No_Selections')"
            class="form-select"
            :items="PERIOD_TYPES"
            item-text="ar"
            item-value="value"
            v-model="value.periodType"
            :rules="rules.periodType"
            :label="$t('Punishments_Period_Type')"
          />
        </v-flex>
      </v-layout>
      <v-layout wrap>
        <v-flex xs12 md3>
          <v-text-field
            class="white-input"
            v-model="value.orderNumber"
            :rukes="rules.orderNumber"
            :label="$t('Punishments_Order_Number')"
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
                :label="$t('Punishments_Order_Date')"
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
                v-model="value.abscenseDate"
                :rules="rules.abscenseDate"
                :label="$t('Punishments_Abscense_Date')"
                prepend-icon="event"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              :allowed-dates="value => moment(value) <= moment()"
              v-model="value.abscenseDate"
              @input="abscenseDateModal = false"
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
                :label="$t('Punishments_Comeback_Date')"
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
      </v-layout>
      <v-layout wrap>
        <v-flex xs12 md12>
          <v-autocomplete
            :no-data-text="$t('No_Selections')"
            class="form-select"
            :items="defaults.CRIMEMAJORLAWS"
            item-text="ar"
            item-value="_id"
            v-model="value.crimeMajorLaw"
            :rules="rules.crimeMajorLaw"
            :label="$t('Punishments_Crime_Major_Law')"
          />
        </v-flex>
      </v-layout>
      <v-layout wrap>
        <v-flex xs12 md3>
          <v-autocomplete
            :no-data-text="$t('No_Selections')"
            class="form-select"
            :items="defaults.DISHONORED"
            item-text="ar"
            item-value="value"
            v-model="value.dishonored"
            :rules="rules.dishonored"
            :label="$t('Punishments_Dishonored')"
          />
        </v-flex>
        <v-flex xs12 md6>
          <v-textarea
            class="black-input"
            v-model="value.statement"
            :rukes="rules.statement"
            :label="$t('Punishments_Statement')"
          />
        </v-flex>
        <v-flex xs12 md3>
          <v-autocomplete
            :no-data-text="$t('No_Selections')"
            class="form-select"
            :items="defaults.COURTS"
            item-text="ar"
            item-value="value"
            v-model="value.sentenceCourt"
            :label="$t('Punishments_Sentence_Court')"
            clearable
          />
        </v-flex>
      </v-layout>
      <v-layout wrap>
        <v-flex xs12 md3>
          <v-text-field
            class="white-input"
            v-model="value.courtPlace"
            :label="$t('Punishments_Court_Place')"
            :rules="rules.courtPlace"
            :disabled="!value.sentenceCourt"
          />
        </v-flex>
        <v-flex xs12 md3>
          <v-text-field
            class="white-input"
            v-model="value.caseNumber"
            :rules="rules.caseNumber"
            :label="$t('Punishments_Case_Number')"
          />
        </v-flex>
        <v-flex xs12 md3>
          <v-menu
            v-model="caseDateModal"
            :close-on-content-click="false"
            :nudge-left="200"
            :nudge-bottom="30"
            transition="scale-transition"
            offset-x
            min-width="290px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="value.caseDate"
                :rules="rules.caseDate"
                :label="$t('Punishments_Case_Date')"
                prepend-icon="event"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              :allowed-dates="value => moment(value) <= moment()"
              v-model="value.caseDate"
              @input="caseDateModal = false"
              locale="ar"
              dark
            ></v-date-picker>
          </v-menu>
        </v-flex>

        <v-flex xs12 md3>
          <v-text-field
            class="white-input"
            type="number"
            v-model="value.fine"
            :rukes="rules.fine"
            :label="$t('Punishments_Fine')"
          />
        </v-flex>
      </v-layout>
      <v-layout wrap>
        <v-flex xs12 md3>
          <v-autocomplete
            :no-data-text="$t('No_Selections')"
            class="form-select"
            :items="defaults.ANSWER_DIRECTIONS"
            item-text="ar"
            item-value="value"
            v-model="value.answerDirection"
            :rules="rules.answerDirection"
            :label="$t('Punishments_Direction')"
          />
        </v-flex>
        <v-flex xs12 md3>
          <v-menu
            v-model="answerDateModal"
            :close-on-content-click="false"
            :nudge-left="200"
            :nudge-bottom="30"
            transition="scale-transition"
            offset-x
            min-width="290px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="value.answerDate"
                :rules="rules.answerDate"
                :label="$t('Punishments_Answer_Date')"
                prepend-icon="event"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              :allowed-dates="value => moment(value) <= moment()"
              v-model="value.answerDate"
              @input="answerDateModal = false"
              locale="ar"
              dark
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
      startDateModal: false,
      absenceDateModal: false,
      comebackDateModal: false,
      courtDateModal: false,
      answerDateModal: false,
      caseDateModal: false,
      abscenseDateModal: false,
      orderDateModal: false,
      PERIOD_TYPES: [
        { ar: "يوم", value: "day" },
        { ar: "شهر", value: "month" },
        { ar: "سنة", value: "year" }
      ],
      DISHONORED: [
        { ar: "مخلة", value: true },
        { ar: "غير مخلة", value: false }
      ],
      rules: {
        title: [v => !!v || this.$t("Punishments_title_Required")],
        orderMaker: [v => !!v || this.$t("Punishments_Order_Maker_Required")],
        startDate: [v => !!v || this.$t("Punishments_Start_Date_Required")],
        period: [v => !!v || this.$t("Punishments_Period_Required")],
        orderNumber: [v => !!v || this.$t("Punishments_Order_Number_Required")],
        orderDate: [v => !!v || this.$t("Punishments_Order_Date_Required")],
        // abscenseDate: [
        //   v => !!v || this.$t("Punishments_Abscense_Date_Required")
        // ],
        // comebackDate: [
        //   v => !!v || this.$t("Punishments_Comeback_Date_Required")
        // ],
        crimeMajorLaw: [
          v => !!v || this.$t("Punishments_Crime_Major_Law_Required")
        ],
        dishonored: [
          v =>
            typeof v !== "undefined" ||
            this.$t("Punishments_Dishonored_Required")
        ],
        statement: [v => !!v || this.$t("Punishments_Statement_Required")],
        courtPlace: [
          v => {
            if (this.value.sentenceCourt) {
              return !!v || this.$t("Punishments_Court_Place_Required");
            }
            return false;
          }
        ],
        caseNumber: [
          v => {
            if (this.value.sentenceCourt) {
              return !!v || this.$t("Punishments_Case_Number_Required");
            }
            return false;
          }
        ],
        caseDate: [
          v => {
            if (this.value.sentenceCourt) {
              return !!v || this.$t("Punishments_Case_Date_Required");
            }
            return false;
          }
        ],
        fine: [
          v => {
            if (this.value.sentenceCourt) {
              return !!v || this.$t("Punishments_Fine_Required");
            }
            return false;
          }
        ],
        answerDirection: [
          v => {
            if (this.value.sentenceCourt) {
              return !!v || this.$t("Punishments_Direction_Required");
            }
            return false;
          }
        ],
        answerDate: [
          v => {
            if (this.value.sentenceCourt) {
              return !!v || this.$t("Punishments_Answer_Date_Required");
            }
            return false;
          }
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
    moment,
    submit() {
      this.value.periodType = this.value.periodType || "day";
      const valid = this.$refs.form.validate();
      this.$emit("submit", valid);
    }
  }
};
</script>
