<template>
  <v-dialog persistent v-model="value" max-width="1000px">
    <!-- <v-container fill-height fluid grid-list-xl style="direction:rtl;"> -->
    <v-layout justify-center wrap>
      <v-flex xs12 md12>
        <material-card
          dark
          color="deep"
          :title="$t('Soldier_Change_Of_Unit')"
          v-on:close="close"
          headerAction="close"
        >
          <v-form ref="form">
            <v-container py-0 style="direction:rtl;">
              <v-layout wrap>
                <v-flex xs12 md4>
                  <v-select
                    :no-data-text="$t('No_Selections')"
                    class="form-select"
                    :items="defaults.ARMY_LIST"
                    item-text="ar"
                    item-value="value"
                    v-model="soldier.army"
                    :label="$t('Army')"
                    @change="clearAll"
                    clearable
                  />
                </v-flex>
                <v-flex xs12 md4>
                  <v-select
                    :no-data-text="$t('No_Selections')"
                    class="form-select"
                    item-text="name"
                    item-value="_id"
                    :items="divisionsComputed"
                    v-model="divisionId"
                    @change="setArmy"
                    :label="$t('Division')"
                    clearable
                  />
                </v-flex>
                <v-flex xs12 md4>
                  <v-autocomplete
                    :no-data-text="$t('No_Selections')"
                    class="form-select"
                    item-text="name"
                    item-value="_id"
                    :items="unitsComputed"
                    v-model="unitId"
                    @change="setDivision"
                    :label="$t('Unit')"
                    clearable
                  />
                </v-flex>
              </v-layout>

              <v-flex xs12 text-xs-right>
                <v-btn class="font-weight-light add-button" @click="submit">
                  {{ $t("Set_Soldier_Unit") }}
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
      soldier: {},
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
    }),
    divisionsComputed() {
      const divisions = this.soldier.army
        ? this.divisions.filter(
            o => o.army === this.soldier.army && ["division"].includes(o.type)
          )
        : this.divisions.filter(o => ["division"].includes(o.type));
      return divisions;
    },
    unitsComputed() {
      let units = this.divisionId
        ? this.divisions
            .filter(o => ["battalion", "company"].includes(o.type))
            .filter(
              o =>
                o.divisionId === this.divisionId ||
                (o.divisionId && o.divisionId._id === this.divisionId)
            )
        : this.divisions.filter(o => ["battalion", "company"].includes(o.type));

      if (!this.divisionId && this.soldier.army) {
        units = units.filter(o => o.army === this.soldier.army);
      }
      return units;
    }
  },
  methods: {
    moment,

    async submit() {
      const isValid = this.$refs.form.validate();
      if (isValid) {
        const path = "/change-of-unit";
        const idsKey = `${this.type}Ids`;
        const obj = {
          unitId: this.unitId,
          divisionId: this.divisionId,
          [idsKey]: [this.data._id],
          type: this.type
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
          title: this.$i18n.t("Soldier_Change_Of_Unit_Success"),
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
