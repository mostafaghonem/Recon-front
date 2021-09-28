<template>
  <v-dialog persistent v-model="value" max-width="1000px">
    <!-- <v-container fill-height fluid grid-list-xl style="direction:rtl;"> -->
    <v-layout justify-center wrap>
      <v-flex xs12 md12>
        <material-card
          dark
          color="deep"
          :title="title || $t('Writing_Distribute_Mail')"
          v-on:close="close"
          headerAction="close"
        >
          <v-form ref="form">
            <v-container py-0 style="direction:rtl;">
              <v-layout wrap>
                <v-flex xs12 md5>
                  <v-autocomplete
                    v-if="data.status === 'pending'"
                    :no-data-text="$t('No_Selections')"
                    class="form-select"
                    :items="defaults.BRANCHES"
                    item-text="ar"
                    item-value="value"
                    v-model="result.branch"
                    :rules="rules.branch"
                    :label="$t('Writing_Branch')"
                  />
                </v-flex>
                <v-flex xs12 md7>
                  <v-autocomplete
                    v-if="data.status === 'pending'"
                    multiple
                    :no-data-text="$t('No_Selections')"
                    class="form-select"
                    :items="
                      defaults.BRANCHES.filter(o => o.value !== result.branch)
                    "
                    item-text="ar"
                    item-value="value"
                    v-model="result.branches"
                    :label="$t('Writing_Branches')"
                  />
                </v-flex>
              </v-layout>
              <v-layout wrap>
                <v-flex xs12 md6>
                  <v-textarea
                    class="black-input"
                    v-if="data.status === 'pending'"
                    v-model="result.decision"
                    :label="$t('Writing_Decision')"
                  />
                </v-flex>
                <v-flex xs12 md6>
                  <v-textarea
                    class="black-input"
                    v-if="data.status === 'pending'"
                    v-model="result.arkanDecision"
                    :label="$t('Writing_arkan_Decision')"
                  />
                </v-flex>
              </v-layout>
              <v-flex xs12 text-xs-right>
                <v-btn
                  class="font-weight-light add-button"
                  @click="submit"
                  v-if="data.status === 'pending'"
                >
                  {{ $t("Send") }}
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
import materialCard from "~/components/material/AppCard";

const mailActions = [
  {
    ar: "تنفيذ",
    value: "execution"
  },
  {
    ar: "عرض",
    value: "show"
  },
  {
    ar: "للعلم",
    value: "knowledge"
  },
  {
    ar: "واجب الرد",
    value: "answer"
  }
];
export default {
  name: "app-distribute-mail-card",
  components: {
    materialCard
  },
  data() {
    return {
      mailActions,
      result: {},
      mail: {},
      rules: {
        branch: [v => !!v || this.$t("Writing_Branch_Required")]
      },
      unitId: undefined,
      divisionId: undefined
    };
  },
  props: {
    value: {
      type: Boolean
    },
    title: {
      type: String
    },
    data: {
      type: Object
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
    async submit() {
      const isValid = this.$refs.form.validate();
      if (isValid) {
        const path = "/mail/distribute";
        const obj = { ...this.result, mailId: this.data._id };
        console.log("object", obj);
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
          title: this.$i18n.t("Writing_Distribution_Success"),
          timer: 4000,
          showConfirmButton: false
        });
        this.$parent.init();
        this.$emit("close");
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
