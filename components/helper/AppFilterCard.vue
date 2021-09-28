<template>
  <v-dialog v-model="value" max-width="800px">
    <!-- <template v-slot:activator="{ on, attrs }">
      <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on"
        >New Item</v-btn
      >
    </template> -->
    <material-card dark color="deep" :title="$t('Advanced_Search')">
      <v-card-text>
        <!-- <v-container> -->
        <v-form ref="form">
          <v-container style="direction: rtl;" py-0>
            <v-layout
              v-for="(item, index) in shown"
              :key="'shown' + index"
              wrap
            >
              <v-flex xs12 md4>
                <v-select
                  :no-data-text="$t('No_Selections')"
                  class="form-select"
                  :items="availableFields"
                  item-text="ar"
                  item-value="value"
                  item-disabled="disabled"
                  :label="$t('The_Field')"
                  v-model="item.key"
                  @change="value => updateInputField(value, index)"
                />
              </v-flex>
              <v-flex xs12 md4>
                <v-text-field
                  v-if="item.type === 'text-field'"
                  class="white-input"
                  :label="$t('The_Value')"
                  v-model="item.value"
                />

                <v-select
                  :no-data-text="$t('No_Selections')"
                  class="form-select"
                  v-if="item.type === 'select'"
                  :items="[]"
                  item-text="ar"
                  item-value="value"
                  :label="$t('The_Value')"
                />
              </v-flex>
              <v-flex xs12 md4 v-if="index === shown.length - 1">
                <v-btn
                  class="mx-2"
                  fab
                  dark
                  small
                  color="#111b24"
                  @click="addField"
                >
                  <v-icon light>mdi-plus</v-icon>
                </v-btn>
              </v-flex>
            </v-layout>
          </v-container>
        </v-form>
        <!-- </v-container> -->
      </v-card-text>

      <v-card-actions>
        <v-flex xs12 text-xs-right>
          <v-btn
            class="font-weight-light add-button v-btn-add"
            @click.stop="close"
          >
            {{ $t("Add") }}
          </v-btn>
        </v-flex>
      </v-card-actions>
    </material-card>
  </v-dialog>
</template>
<script>
import materialCard from "~/components/material/AppCard";

const empty = {
  field: "empty",
  type: "text-field",
  key: undefined,
  value: undefined
};
export default {
  name: "app-filter-card",
  components: {
    materialCard
  },
  data() {
    return {
      editedItem: {},
      soldier: {},
      rules: {},
      shown: [JSON.parse(JSON.stringify(empty))],
      choosen: []
    };
  },
  props: ["value", "fields"],
  computed: {
    availableFields() {
      const choosen = this.shown.filter(o => o.key).map(o => o.key);
      return this.fields.map(o => {
        if (choosen.includes(o.value)) {
          o.disabled = true;
        } else {
          o.disabled = false;
        }
        return o;
      });
    },
    choosen() {
      const data = this.shown.filter(o => o.key);
      console.log("data in getting choosen", data);
      const extras = data.map(item => {
        const obj = this.fields.find(o => o.value === item.key);
        delete obj.value;
        Object.assign(item, obj);
        return item;
      });
      console.log("extras in getting choosen", data);
    }
  },
  methods: {
    addField() {
      this.shown.push(JSON.parse(JSON.stringify(empty)));
    },
    updateInputField(value, index) {
      console.log("update input field", value);
      const obj = this.fields.find(o => o.value === value);
      const keys = Object.keys(obj).filter(o => o !== "value");
      keys.map(o => (this.shown[index][o] = obj[o]));
      console.log(
        "update input field",
        obj,
        "and the shown",
        this.shown[index]
      );
    },
    close() {
      this.value = false;
      this.$emit("input", this.value);
    }
  }
};
</script>
