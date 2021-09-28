<template>
  <v-container fill-height fluid grid-list-xl style="direction:rtl;">
    <v-layout justify-center wrap>
      <v-flex xs12 md12>
        <material-card dark color="deep" :title="$t(codeTypesTitle)">
          <v-form ref="form" autocomplete="new-password">
            <v-container py-0>
              <v-layout wrap>
                <v-layout wrap>
                  <v-flex xs12 md5 v-if="type === 'word_mules'">
                    <v-select
                      :no-data-text="$t('No_Selections')"
                      class="form-select"
                      :items="defaults.RANKS"
                      item-text="ar"
                      item-value="value"
                      v-model="constant.extra.rank"
                      :label="$t('Rank')"
                    />
                  </v-flex>
                  <v-flex xs12 md7>
                    <v-text-field
                      class="black-input"
                      :label="$t(`${codeTypesUpper}_FULLNAME`)"
                      :rules="rules.ar"
                      v-model="constant.ar"
                    />
                  </v-flex>
                </v-layout>

                <v-flex xs12 text-xs-right>
                  <v-btn
                    class="font-weight-light add-button v-btn-add"
                    @click="submit"
                  >
                    {{ $t("Add") }}
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

export default {
  layout: "dashboard",
  asyncData({ route }) {
    const code = route.path.substr(route.path.lastIndexOf("/") + 1);
    const type = code.replace("add-", "").replace(/\-/g, "_");
    const codeTypesUpper = type.replace(/\-/g, "_").toUpperCase();
    const codeTypesTitle = code.replace(/\-/g, "_").toUpperCase();

    return {
      code,
      type,
      codeTypesUpper,
      codeTypesTitle
    };
  },
  data() {
    return {
      type: "",
      code: "",
      type: "",
      constant: {
        ar: undefined,
        value: undefined,
        type: undefined,
        extra: {
          rank: undefined
        }
      },
      disabled: {
        branch: false,
        permissions: false
      },
      rules: {
        ar: [
          v => !!v || this.$t(`${this.codeTypesUpper}_FULLNAME_REQUIRED`),
          v => {
            return this.validateconstantName(v);
          }
        ]
      }
    };
  },
  async created() {
    const { context } = this.$store.app;
    const { nuxtState } = context;
    if (!nuxtState || (nuxtState && !nuxtState.constant)) {
      return;
    }
    this.setBranch(nuxtState.constant);
  },
  middleware: ["auth", "isNotLoggedIn"],
  meta: {
    branches: ["followup"]
  },
  components: {
    materialCard
  },
  computed: {
    ...mapGetters({
      locations: "app/getLocations",
      defaults: "app/getDefaults"
    })
  },
  methods: {
    async submit() {
      const isValid = this.$refs.form.validate();
      if (isValid) {
        const path = "/constant";
        this.constant.type = this.type;
        this.constant.value = this.constant.ar;
        const response = await post(path, this.constant);
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
          title: this.$i18n.t(`Added_${this.codeTypesUpper}_Success`),
          timer: 4000,
          showConfirmButton: false
        });
        setTimeout(() => {
          window.location.href = "/";
        }, 4000);
      }
    },
    validateconstantName(value) {
      if (typeof value === "undefined") {
        return true;
      }
      return false;
    },
    validatePassword(value) {
      if (typeof value === "undefined") {
        return true;
      }
      return false;
    },
    setPermissions(rank) {
      const rankIndex = this.defaults.RANKS.findIndex(o => o.value === rank);
      let permissionIndex = undefined;

      switch (rankIndex) {
        case 0:
          permissionIndex = 0;
          break;
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          permissionIndex = 1;
          break;
        case 6:
        case 7:
        case 8:
        case 9:
        case 10:
          permissionIndex = 2;
          break;
        case 11:
        case 12:
          permissionIndex = 3;
          break;
      }
      console.log("permissions index", permissionIndex);
      this.constant.permissions = this.defaults.PERMISSIONS[
        permissionIndex
      ].value;
    },
    setBranch(constant) {
      const { permissions, branch } = constant;

      if (
        !permissions.includes("admin") &&
        permissions.includes("branch_head")
      ) {
        this.constant.branch = constant.branch;
        this.disabled.branch = true;
        this.disabled.permissions = true;
      }
      // const constant = this.constant;
    }
  }
};
</script>
