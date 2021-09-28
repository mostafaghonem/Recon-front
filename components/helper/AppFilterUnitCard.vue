<template>
  <v-dialog persistent v-model="value" max-width="1000px">
    <!-- <v-container fill-height fluid grid-list-xl style="direction:rtl;"> -->
    <v-layout justify-center wrap>
      <v-flex xs12 md12>
        <material-card
          dark
          color="deep"
          :title="$t('Advanced_Search')"
          v-on:close="close"
          headerAction="close"
        >
          <v-form ref="form" autocomplete="new-password">
            <v-container py-0 style="direction:rtl;">
              <v-layout wrap>
                <v-flex xs12 md3>
                  <v-autocomplete
                    :no-data-text="$t('No_Selections')"
                    class="form-select"
                    :items="defaults.UNIT_TYPES"
                    item-text="ar"
                    item-value="value"
                    v-model="divisionType"
                    :label="$t('Unit_Type')"
                    clearable
                  />
                </v-flex>
                <v-flex xs12 md3>
                  <v-select
                    :no-data-text="$t('No_Selections')"
                    class="form-select"
                    :items="defaults.FORCES_LIST"
                    item-text="ar"
                    item-value="value"
                    v-model="force"
                    :label="$t('Force')"
                  />
                </v-flex>
                <v-flex xs12 md3>
                  <v-select
                    :no-data-text="$t('No_Selections')"
                    class="form-select"
                    :items="defaults.ARMY_LIST"
                    item-text="ar"
                    item-value="value"
                    v-model="army"
                    :label="$t('Army')"
                    @change="setAll"
                    clearable
                  />
                </v-flex>
                <v-flex xs12 md3>
                  <v-select
                    :no-data-text="$t('No_Selections')"
                    class="form-select"
                    :items="divisionsComputed"
                    item-text="name"
                    item-value="_id"
                    v-model="divisionId"
                    :label="$t('Division')"
                    clearable
                  />
                </v-flex>
              </v-layout>
              <v-layout wrap>
                <v-flex xs12 md3>
                  <v-select
                    :no-data-text="$t('No_Selections')"
                    class="form-select"
                    :items="brigadesComputed"
                    item-text="name"
                    item-value="_id"
                    v-model="brigadeId"
                    :label="$t('Brigade')"
                    clearable
                  />
                </v-flex>
                <v-flex xs12 md3>
                  <v-select
                    :no-data-text="$t('No_Selections')"
                    class="form-select"
                    :items="battalionsComputed"
                    item-text="name"
                    item-value="_id"
                    v-model="battalionId"
                    :label="$t('Battalion')"
                    clearable
                  />
                </v-flex>
                <v-flex xs12 md3>
                  <v-text-field
                    class="black-input"
                    :no-data-text="$t('No_Selections')"
                    v-model="name"
                    :label="
                      $t(
                        `${
                          divisionType ? divisionType.toUpperCase() : 'UNIT'
                        }_FULLNAME`
                      )
                    "
                  />
                </v-flex>
              </v-layout>
              <v-flex xs12 text-xs-right>
                <v-btn
                  class="font-weight-light add-button v-btn-add"
                  @click="submit"
                >
                  {{ $t("Search") }}
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

const keys = ["army", "divisionId", "brigadeId", "companyId"];
export default {
  name: "app-filter-card",
  components: {
    materialCard
  },
  data() {
    return {
      divisions: [],
      divisionType: undefined,
      army: undefined,
      divisionId: undefined,
      brigadeId: undefined,
      battalionId: undefined,
      companyId: undefined,
      name: undefined,
      force: undefined,

      rules: {
        ar: [
          v => !!v || this.$t(`${this.codeTypesUpper}_FULLNAME_REQUIRED`),
          v => {
            return this.validateunitName(v);
          }
        ]
      }
    };
  },
  async created() {
    const divisions = await this.getDivisions();
  },
  props: ["value", "fields"],
  computed: {
    ...mapGetters({
      locations: "app/getLocations",
      defaults: "app/getDefaults"
    }),
    divisionsComputed() {
      const divisions = this.army
        ? this.divisions.filter(
            o => o.army === this.army && ["division"].includes(o.type)
          )
        : this.divisions.filter(o => ["division"].includes(o.type));
      return divisions;
    },
    brigadesComputed() {
      if (this.army || this.battalionId || this.companyId) {
      }
      console.log("Computing brigade stuff", this.army);
      console.log("Computing brigade stuff division", this.divisionType);
      const existing = keys
        .filter(o => this[o])
        .map(o => ({ key: o, value: this[o] }));
      const brigades = this.divisions.filter(o => {
        const length = existing.length;
        if (["brigade"].includes(o.type)) {
          const found = existing.filter(({ key, value }) => {
            return o[key] == value;
          });
          return found.length === length;
        }
      });
      return brigades;
    },
    battalionsComputed() {
      if (this.army || this.battalionId || this.companyId) {
      }
      console.log("Computing brigade stuff", this.army);
      console.log("Computing brigade stuff division", this.divisionType);
      const existing = keys
        .filter(o => this[o])
        .map(o => ({ key: o, value: this[o] }));
      const battalions = this.divisions.filter(o => {
        const length = existing.length;
        if (["battalion"].includes(o.type)) {
          const found = existing.filter(({ key, value }) => {
            return o[key] == value;
          });
          return found.length === length;
        }
      });
      return battalions;
    }
  },
  methods: {
    moment,
    async getDivisions() {
      const path = "/divisions";
      const response = await get(path);
      if (response.error) {
        console.log("error getting divisions", response.error);
        return;
      }
      this.divisions = response.divisions;
    },
    async submit() {
      const isValid = this.$refs.form.validate();
      if (isValid) {
        const path = "/divisions";
        const data = {
          type: this.divisionType,
          name: this.name,
          divisionId: this.divisionId,
          brigadeId: this.brigadeId,
          battalionId: this.battalionId,
          army: this.army,
          force: this.force
        };
        const obj = JSON.parse(JSON.stringify(data));
        const response = await get(path, obj);
        if (response.error) {
          return Toaster.fire({
            icon: "error",
            title: response.error,
            timer: 4000,
            showConfirmButton: false
          });
        }
        this.setSearchFields(obj);
        this.$parent.renderUnits(response.divisions);
      }
    },
    setAll(value) {
      this.divisionId = undefined;
      this.brigadeId = undefined;
      this.battalionId = undefined;
      this.companyId = undefined;
    },
    setSearchFields(obj) {
      const fields = Object.keys(obj).map(o => {
        const keyObj = this.fields.find(m => m.value === o);
        const value = obj[o];

        return { keyObj, value };
      });
      this.$parent.searchFields = fields;
      return fields;
    },
    setDivision(value) {
      const unit = this.unitsComputed.find(o => o._id === value);
      if (unit) {
        this.unit.unitId = unit._id;
        this.unit.divisionId = unit.divisionId;
        this.unit.army = unit.army;
      }
    },
    clearDivisions() {
      this.unit.divisionId = undefined;
      this.unit.unitId = undefined;
    },
    clearUnits() {
      this.unit.unitId = undefined;
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
