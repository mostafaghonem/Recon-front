<template>
  <v-content dir="auto">
    <v-container fluid fill-height>
      <v-layout align-center justify-center>
        <v-flex xs12 sm8 md4>
          <material-card
            color="success"
            elevation="12"
            :title="$t('RECON_LOGIN')"
            dark
          >
            <v-form @keyup.enter.native="authenticate">
              <v-card-text>
                <v-text-field
                  type="text"
                  v-model="username"
                  prepend-icon="person"
                  name="username"
                  :label="$t('USERNAME')"
                  :placeholder="username"
                ></v-text-field>
                <v-text-field
                  type="password"
                  v-model="password"
                  prepend-icon="lock"
                  name="password"
                  :label="$t('PASSWORD')"
                  :placeholder="defaultUserPassword"
                ></v-text-field>
              </v-card-text>
              <v-card-actions>
                <v-layout justify-center align-center>
                  <v-btn
                    color="success"
                    :disabled="isDisabled"
                    @click.prevent="authenticate"
                    >{{ $t("LOGIN") }}</v-btn
                  >
                </v-layout>
              </v-card-actions>
            </v-form>
          </material-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-content>
</template>

<script>
import { mapActions } from "vuex";
import { post } from "~/plugins/axiosbase";
import { Toaster } from "~/plugins/helpers";
import materialCard from "~/components/material/AppCard";

export default {
  components: {
    materialCard
  },
  mounted() {
    window.addEventListener("keypress", this.doCommand);
  },
  destroyed() {
    window.removeEventListener("keypress", this.doCommand);
  },
  data() {
    return {
      isLoading: false,
      username: undefined,
      password: undefined,
      defaultUserPassword: undefined
    };
  },
  computed: {
    isDisabled() {
      return this.isLoading;
    }
  },
  middleware: ["auth", "isLoggedIn"],
  methods: {
    ...mapActions({
      setUser: "localStorage/setUser"
    }),

    doCommand(e) {
      if (e.keyCode === 13) {
        return this.authenticate();
      }
    },

    async authenticate() {
      if (!this.isDisabled) {
        this.isLoading = true;

        const loginResponse = await this.login();

        this.isLoading = false;
        if (loginResponse.error) {
          console.log("the error", loginResponse.error);
          Toaster.fire({
            icon: "error",
            title: loginResponse.error,
            timer: 3000,
            showConfirmButton: false
          });
        } else {
          localStorage.setItem("reconToken", loginResponse.token);
          localStorage.setItem("user", JSON.stringify(loginResponse));
          await this.setUser(loginResponse);
          this.$router.push({ path: "/dashboard" });
        }

        // await this.setUsername(this.username);
        // this.({ path: "dashboard" });
      }
    },

    async login() {
      const response = await post("/users/login", {
        username: this.username,
        password: this.password
      });
      return response;
    }
  }
};
</script>
