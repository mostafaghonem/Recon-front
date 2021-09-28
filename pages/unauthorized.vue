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
            <v-card-text class="card-message">{{
              $t("Unauthorized_Message")
            }}</v-card-text>
            <v-card-actions>
              <v-layout justify-center align-center>
                <v-btn :to="'/dashboard'" color="success">{{
                  $t("BACK")
                }}</v-btn>
              </v-layout>
            </v-card-actions>
          </material-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-content>
</template>

<script>
import materialCard from "~/components/material/AppCard";

export default {
  components: {
    materialCard
  },
  created() {},
  mounted() {
    console.log("unauthenticated page mounted");
  },
  data() {
    return {};
  },
  computed: {}
};
</script>
