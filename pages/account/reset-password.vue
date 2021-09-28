<template>
  <v-container fill-height fluid grid-list-xl style="direction:rtl;">
    <v-layout justify-center wrap>
      <v-flex xs12 md12>
        <material-card dark color="deep" :title="$t('RESET_PASSWORD')">
          <v-form ref="form" autocomplete="new-password">
            <v-container py-0>
              <v-layout wrap>
                <v-layout wrap>
                  <v-flex xs12 md5>
                    <v-text-field
                      class="white-input"
                      :minLength="5"
                      :label="$t('NEW_PASSWORD')"
                      :rules="rules.password"
                      type="password"
                      v-model="user.password"
                    />
                  </v-flex>
                </v-layout>

                <v-flex xs12 text-xs-right>
                  <v-btn
                    class="font-weight-light add-button v-btn-add"
                    @click="submit"
                  >
                    {{ $t("RESET") }}
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
import { post } from "~/plugins/axiosbase";
import materialCard from "~/components/material/AppCard";

export default {
  layout: "dashboard",
  data() {
    return {
      user: {
        password: undefined
      },
      rules: {
        password: [
          v => !!v || this.$t("Password_Required"),
          v => {
            return this.validatePassword(v);
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
  components: {
    materialCard
  },
  computed: {
    ...mapGetters({
      defaults: "app/getDefaults"
    })
  },
  methods: {
    async submit() {
      const isValid = this.$refs.form.validate();
      if (isValid) {
        const path = "/users/password/change";
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
          title: "تم إعادة تعيين كلمة السر بنجاح",
          timer: 4000,
          showConfirmButton: false
        });
        setTimeout(() => {
          window.location.href = "/";
        }, 4000);
      }
    },
    validatePassword(value) {
      if (typeof value === "undefined") {
        return true;
      }
      return false;
    }
  }
};
</script>
