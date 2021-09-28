<template>
  <v-dialog
    persistent
    v-model="value"
    :data="data"
    max-width="1000px"
    min-height="600px"
  >
    <!-- <v-container fill-height fluid grid-list-xl style="direction:rtl;"> -->
    <v-layout justify-center class="read-more" wrap>
      <v-flex xs12 md12>
        <material-card
          dark
          class="read-more"
          color="deep"
          :title="data.title || $t('Writing_Subject')"
          v-on:close="close"
          headerAction="close"
        >
          <span>{{ data.ar }}</span>
        </material-card>
      </v-flex>
    </v-layout>
  </v-dialog>
</template>
<script>
import { mapGetters } from "vuex";
import materialCard from "~/components/material/AppCard";

export default {
  name: "app-read-more-card",
  components: {
    materialCard
  },
  data() {
    return {
      result: {},
      mail: {},
      unitId: undefined,
      divisionId: undefined
    };
  },
  props: {
    value: {
      type: Boolean
    },
    data: {
      default: () => {},
      type: Object
    }
  },
  computed: {
    ...mapGetters({})
  },
  methods: {
    onClickOutside(event) {
      console.log("clicked outside", Object.keys(event));
    },
    close() {
      this.$emit("close");
    }
  }
};
</script>
