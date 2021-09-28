<template>
  <v-dialog persistent v-model="value" max-width="1000px">
    <!-- <v-container fill-height fluid grid-list-xl style="direction:rtl;"> -->
    <v-layout justify-center wrap>
      <v-flex xs12 md12>
        <material-card
          dark
          color="deep"
          :title="$t('Change_Release_Date')"
          v-on:close="close"
          headerAction="close"
        >
          <v-form ref="form">
            <v-container py-0 style="direction:rtl;">
              <v-layout wrap>
                <v-flex xs12 md4>
                  <v-menu
                    v-model="releaseDateModal"
                    :close-on-content-click="false"
                    :nudge-left="50"
                    :nudge-bottom="5"
                    transition="scale-transition"
                    offset-y
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="soldier.releaseDate"
                        :label="$t('Release_Date')"
                        prepend-icon="event"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                        clearable
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      :allowed-dates="allowedReleaseDates"
                      v-model="soldier.releaseDate"
                      @input="releaseDateModal = false"
                      locale="ar"
                      dark
                    ></v-date-picker>
                  </v-menu>
                </v-flex>
              </v-layout>

              <v-flex xs12 text-xs-right>
                <v-btn class="font-weight-light add-button" @click="submit">
                  {{ $t("Edit") }}
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
  name: "app-change-of-release-date",
  components: {
    materialCard
  },
  data() {
    return {
      releaseDateModal: false,
      soldier: {}
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
    type: {
      type: String,
      default: "soldiers"
    },
    divisions: {
      type: Array,
      default: () => []
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
    allowedReleaseDates(value) {
      // Allow only dates after today and being the first of every month
       return moment(value) >= moment() && moment(value).date() === 1
    },
    async submit() {
      const isValid = this.$refs.form.validate();
      if (isValid) {
        console.log('the id', this.data)
        const path = `/soldiers/edit/${this.data._id}`;
        const obj = {
          releaseDate: this.soldier.releaseDate,
          releaseDateOnly: true
        };
        const response = await post(path, obj);
        if (response.error) {
          return Toaster.fire({
            icon: "error",
            title: response.error,
            timer: 4000,
            showConfirmButton: false
          });
        }
        Toaster.fire({
          icon: "success",
          title: this.$i18n.t("Soldier_Change_Of_Release_Date"),
          timer: 4000,
          showConfirmButton: false
        });
        this.$parent.init();
        this.$emit("close");
      }
    },
    cleared() {
      console.log("cleared");
    },
    clearAll(value) {
      this.unitId = undefined;
      this.divisionId = undefined;
    },
    setArmy(value) {
      const division = this.divisions.find(o => o._id === value);

      if (division) {
        this.soldier.army = division.army;
        this.unitId = undefined;
      }
    },
    setDivision(value) {
      const unit = this.unitsComputed.find(o => o._id === value);
      console.log("found unit", unit, value);
      if (unit) {
        this.unitId = unit._id;
        this.divisionId = unit.divisionId;
        this.soldier.army = unit.army;
      }
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
