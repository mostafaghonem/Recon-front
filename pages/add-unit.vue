<template>
  <v-container fill-height fluid grid-list-xl style="direction:rtl;">
    <v-layout justify-center wrap>
      <v-flex xs12 md12>
        <material-card dark color="deep" :title="$t('ADD_UNIT')">
          <v-form ref="form" autocomplete="new-password">
            <v-container py-0>
              <v-layout wrap>
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
                  <v-flex
                    v-if="
                      ['company', 'battalion', 'brigade'].includes(divisionType)
                    "
                    xs12
                    md3
                  >
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
                  <v-flex
                    v-if="['company', 'battalion'].includes(divisionType)"
                    xs12
                    md3
                  >
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
                  <v-flex v-if="['company'].includes(divisionType)" xs12 md3>
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
                  <v-flex v-if="divisionType" xs12 md3>
                    <v-text-field
                      class="black-input"
                      :no-data-text="$t('No_Selections')"
                      v-model="name"
                      :label="$t(`${divisionType.toUpperCase()}_FULLNAME`)"
                      :rules="rules.name"
                    />
                  </v-flex>
                </v-layout>

                <v-flex xs12 text-xs-right>
                  <v-btn
                    class="font-weight-light add-button v-btn-add"
                    @click="submit"
                  >
                    {{ edit ? $t("Edit") : $t("Add") }}
                  </v-btn>
                </v-flex>
              </v-layout>
            </v-container>
          </v-form>
        </material-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
import { Toaster } from "~/plugins/helpers";
import { get, post } from "~/plugins/axiosbase";
import materialCard from "~/components/material/AppCard";

const keys = ["army", "divisionId", "brigadeId", "companyId"];
export default {
  layout: "dashboard",
  data() {
    return {
      code: "",
      type: "",
      divisions: [],
      divisionType: undefined,
      army: undefined,
      divisionId: undefined,
      brigadeId: undefined,
      battalionId: undefined,
      companyId: undefined,
      name: undefined,
      edit: false,
      force: "86",
      rules: {
        ar: [
          v => !!v || this.$t(`${this.codeTypesUpper}_FULLNAME_REQUIRED`),
          v => {
            return this.validateunitName(v);
          }
        ],

        force: [v => !!v || this.$t(`Force_Required`)],
        army: [v => !!v || this.$t(`Army_Required`)],
        name: [v => !!v || this.$t(`Name_Required`)],
        unitType: [v => !!v || this.$t(`Unit_Type_Required`)]
      }
    };
  },
  async created() {
    const divisions = await this.getDivisions();
    const { context } = this.$store.app;
    const { nuxtState } = context;
    if (!nuxtState || (nuxtState && !nuxtState.unit)) {
      return;
    }
  },
  middleware: ["auth", "isNotLoggedIn"],
  meta: {
    branches: ["recon_force_people"],
    permissions: ["recon_people_creator"]
  },
  components: {
    materialCard
  },
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
      const addOrEdit = this.edit ? "Edited" : "Added";
      const isValid = this.$refs.form.validate();
      if (isValid) {
        const path = this.edit
          ? `/divisions/edit/${this.unitId}`
          : "/divisions";
        const data = {
          type: this.divisionType,
          name: this.name,
          divisionId: this.divisionId,
          brigadeId: this.brigadeId,
          battalionId: this.battalionId,
          army: this.army,
          force: this.force
        };

        const response = await post(path, data);
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
          title: this.$i18n.t(
            `${addOrEdit}_${this.divisionType.toUpperCase()}_Success`
          ),
          timer: 4000,
          showConfirmButton: false
        });
        setTimeout(() => {
          window.location.href = "/units";
        }, 4000);
      }
    },
    validateunitName(value) {
      if (typeof value === "undefined") {
        return true;
      }
      return false;
    },
    setAll(value) {
      this.divisionId = undefined;
      this.brigadeId = undefined;
      this.battalionId = undefined;
      this.companyId = undefined;
    }
  },
  async asyncData({ route }) {
    const unitId = route.path.substr(route.path.lastIndexOf("/") + 1);
    if (!route.path.includes("edit")) {
      return {};
    }

    const path = `/divisions/data/${unitId}`;
    const unit = await get(path);

    if (unit.error) {
      Toaster.fire({
        icon: "error",
        title: unit.error,
        timer: 4000,
        showConfirmButton: false
      });
      return {};
    }

    return {
      unitId,
      ...unit,
      divisionType: unit.type,
      force: unit.force,
      edit: true
    };
  }
};
</script>
