<template>
  <v-dialog persistent v-model="value" max-width="1000px">
    <!-- <v-container fill-height fluid grid-list-xl style="direction:rtl;"> -->
    <v-layout justify-center wrap>
      <v-flex xs12 md12>
        <material-card
          dark
          color="deep"
          :title="$t('Letter_Data')"
          v-on:close="close"
          headerAction="close"
        >
          <v-form ref="form">
            <v-container py-0 style="direction:rtl;">
              <v-layout wrap>
                <v-flex xs12 md4>
                  <v-text-field
                    class="white-input"
                    @keypress="onlyNumber"
                    :label="$t('Reference_Number')"
                    :rules="rules.referenceNumber"
                    v-model="extra.referenceNumber"
                  />
                </v-flex>
                <v-flex xs12 md4>
                  <v-select
                    :no-data-text="$t('No_Selections')"
                    class="form-select"
                    :items="
                      defaults.RANKS
                        ? defaults.RANKS.slice(0, 8)
                        : defaults.RANKS
                    "
                    item-text="ar"
                    item-value="ar"
                    v-model="extra.sender.rank"
                    :label="$t('Sender_Rank')"
                  />
                </v-flex>
                <v-flex xs12 md4>
                  <v-text-field
                    class="white-input"
                    :label="$t('Sender_Name')"
                    :rules="rules.senderName"
                    v-model="extra.sender.name"
                  />
                </v-flex>
                <v-flex xs12 md4>
                  <v-menu
                    v-model="extra.movingDateModal"
                    :close-on-content-click="false"
                    :nudge-left="50"
                    :nudge-bottom="5"
                    transition="scale-transition"
                    offset-y
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="extra.sender.movingDate"
                        :label="$t('Sender_Moving_Date')"
                        prepend-icon="event"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      :allowed-dates="time => moment(time).diff(moment(), 'day') > -1"
                      v-model="extra.sender.movingDate"
                      @input="joinDateModal = false"
                      locale="ar"
                      dark
                    ></v-date-picker>
                  </v-menu>
                </v-flex>
              </v-layout>

              <v-flex xs12 text-xs-right>
                <v-btn class="font-weight-light add-button" @click="submit">
                  {{ $t("Print_Letter") }}
                </v-btn>
              </v-flex>
            </v-container>
          </v-form>
        </material-card>
      </v-flex>
    </v-layout>
    <!-- </v-container> -->
  </v-dialog>
</template>
<script>
import { mapGetters } from "vuex";
import { onlyNumber, Toaster } from "~/plugins/helpers";
import { get, post } from "~/plugins/axiosbase";
import moment from "moment";
import materialCard from "~/components/material/AppCard";

export default {
  name: "app-change-of-unit",
  components: {
    materialCard
  },
  data() {
    return {
      militaryIdLength: 13,
      recordIdLength: 15,
      change: {},

      rules: {
        referenceNumber: [v => !!v || this.$t("ReferenceNumber_Required")],
        senderRank: [v => !!v || this.$t("SenderRank_Required")],
        senderName: [v => !!v || this.$t("SenderName_Required")],
        senderMovingDate: [v => !!v || this.$t("SenderMovingDate_Required")]
      },
      unitId: undefined,
      divisionId: undefined
    };
  },
  async created() {},
  // props: ["value", "soldier", "divisions"],
  props: {
    value: {
      type: Boolean
    },
    data: {
      type: Object,
      default: () => ({ army: undefined })
    },
    extra: {
      type: Object,
      default: () => ({ sender: {} })
    }
  },
  computed: {
    ...mapGetters({
      user: "app/getUser",
      locations: "app/getLocations",
      defaults: "app/getDefaults",
      fullname: "user/getFullname"
    })
  },
  methods: {
    moment,

    async submit() {
      const isValid = this.$refs.form.validate();
      if (isValid) {
        this.$parent.exportLetterDialog();
        this.$emit("close");
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
    cleared() {
      console.log("cleared");
    },

    onClickOutside(event) {
      console.log("clicked outside", Object.keys(event));
    },
    close() {
      this.$emit("close");
    }
  }
};
</script>
