<template>
  <v-container fill-height fluid grid-list-xl style="direction:rtl;">
    <v-layout justify-center wrap>
      <v-flex xs12 md12>
        <material-card dark color="deep" :title="$t('Add_User')">
          <v-form ref="form" autocomplete="new-password">
            <v-container py-0>
              <v-layout wrap>
                <v-layout wrap>
                  <v-flex xs12 md2>
                    <v-text-field
                      class="black-input"
                      :label="$t('FullName')"
                      :rules="rules.fullName"
                      v-model="user.fullName"
                    />
                  </v-flex>
                  <v-flex xs12 md2>
                    <v-text-field
                      class="white-input"
                      :label="$t('USERNAME')"
                      :rules="rules.username"
                      v-model="user.username"
                    />
                  </v-flex>
                  <v-flex xs12 md2>
                    <v-text-field
                      class="white-input"
                      :minLength="5"
                      :label="$t('PASSWORD')"
                      :rules="rules.password"
                      type="password"
                      v-model="user.password"
                    />
                  </v-flex>
                  <v-flex xs12 md2>
                    <v-autocomplete
                      :no-data-text="$t('No_Selections')"
                      class="form-select"
                      :items="
                        disabled.branch && defaults.RANKS
                          ? defaults.RANKS.slice(0, 11)
                          : defaults.RANKS
                      "
                      item-text="ar"
                      item-value="value"
                      v-model="user.rank"
                      :label="$t('Rank')"
                    />
                  </v-flex>
                  <v-flex xs12 md2>
                    <v-autocomplete
                      :no-data-text="$t('No_Selections')"
                      class="form-select"
                      :items="defaults.BRANCHES"
                      item-text="ar"
                      item-value="value"
                      v-model="user.branch"
                      :disabled="disabled.branch"
                      :label="$t('Branch')"
                    />
                  </v-flex>
                  <v-flex xs12 md2>
                    <v-autocomplete
                      :no-data-text="$t('No_Selections')"
                      class="form-select"
                      :items="
                        disabled.branch && defaults.PERMISSIONS
                          ? defaults.PERMISSIONS.slice(0, 3)
                          : defaults.PERMISSIONS
                      "
                      item-text="ar"
                      item-value="value"
                      v-model="user.permissions"
                      :label="$t('Permissions')"
                      multiple
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
import { onlyNumber, Toaster } from "~/plugins/helpers";
import { get, post } from "~/plugins/axiosbase";
import moment, { months } from "moment";
import materialCard from "~/components/material/AppCard";

export default {
  layout: "dashboard",
  data() {
    return {
      militaryIdLength: 13,
      nationalIdLength: 14,
      recordIdLength: 10,
      defaultPermissions: [],
      defaultRanks: [],
      user: {
        fullName: undefined,
        username: undefined,
        password: undefined,
        permission: [],
        permissions: []
      },
      disabled: {
        branch: false,
        permissions: false
      },
      rules: {
        fullName: [
          v => !!v || this.$t("FullName_Required"),
          v => {
            return this.validateUserName(v);
          }
        ],
        username: [
          v => !!v || this.$t("Username_Required"),
          v => {
            return this.validateUserName(v);
          }
        ],
        password: [
          v => !!v || this.$t("Password_Required"),
          v => {
            return this.validatePassword(v);
          }
        ]
      },
      permissions: []
    };
  },
  async created() {
    console.log("the component", this);
    const { context } = this.$store.app;
    const { nuxtState } = context;
    if (!nuxtState || (nuxtState && !nuxtState.user)) {
      return;
    }
    this.setBranch(nuxtState.user);
  },
  middleware: ["auth", "isNotLoggedIn", "isAuthorized"],
  components: {
    materialCard
  },
  computed: {
    ...mapGetters({
      locations: "app/getLocations",
      defaults: "app/getDefaults",
      fullname: "user/getFullname"
    }),
    divisionsComputed() {
      const divisions = this.user.army
        ? this.divisions.filter(
            o => o.army === this.user.army && ["division"].includes(o.type)
          )
        : this.divisions.filter(o => ["division"].includes(o.type));
      return divisions;
    },
    unitsComputed() {
      let units = this.divisions.filter(o =>
        ["battalion", "company"].includes(o.type)
      );

      if (this.user.divisionId) {
        units = this.user.divisionId
          ? units.filter(
              o => o.divisionId && o.divisionId._id === this.user.divisionId
            )
          : units;
      }

      if (!this.user.divisionId && this.user.army) {
        units = units.filter(o => o.army === this.user.army);
      }
      return units;
    },
    branchesComputed() {
      // items="defaults.BRANCHES"
    }
  },
  methods: {
    moment,
    async submit() {
      const isValid = this.$refs.form.validate();
      if (isValid) {
        const path = "/users/create-user";
        const response = await post(path, this.user);
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
          title: this.$i18n.t("Added_User_Success"),
          timer: 4000,
          showConfirmButton: false
        });
        setTimeout(() => {
          window.location.href = "/users";
        }, 4000);
      }
    },
    validateUserName(value) {
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
      this.user.permissions = this.defaults.PERMISSIONS[permissionIndex].value;
    },
    setBranch(user) {
      const { permissions, branch } = user;

      if (
        !permissions.includes("admin") &&
        permissions.includes("branch_head")
      ) {
        this.user.branch = user.branch;
        this.disabled.branch = true;
        this.disabled.permissions = true;
      }
      // const user = this.user;
    }
  }
};
</script>
