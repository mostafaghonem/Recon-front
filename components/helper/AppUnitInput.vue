<template>
  <v-layout wrap>
    <!-- <v-form ref="form"> -->
    <v-flex xs12 md3>
      <v-select
        :no-data-text="$t('No_Selections')"
        class="form-select"
        :items="defaults.ARMY_LIST"
        item-text="ar"
        item-value="value"
        v-model="value.army"
        :label="$t('Army')"
        @change="setAll"
        :rules="rules.army"
        clearable
      />
    </v-flex>
    <v-flex xs12 md3>
      <v-select
        :no-data-text="$t('No_Selections')"
        class="form-select"
        item-text="name"
        item-value="_id"
        :items="divisionsComputed"
        v-model="value.divisionId"
        @change="setUnits"
        :label="$t('Division')"
        :disabled="divisionsComputed.length === 0"
        :clearable="true"
      />
    </v-flex>
    <v-flex xs12 md3>
      <v-autocomplete
        :no-data-text="$t('No_Selections')"
        class="form-select"
        item-text="name"
        item-value="_id"
        :items="unitsComputed"
        v-model="value.unitId"
        @change="setDivision"
        :label="$t('Unit')"
        :rules="rules.unitId"
        :clearable="true"
      />
    </v-flex>
    <v-flex xs12 md2 text-xs-right>
      <v-btn
        class="font-weight-light filter-table-button v-btn-print"
        @click="submit"
      >
        {{ $t("Distribute") }}
      </v-btn>
    </v-flex>
    <!-- </v-form> -->
  </v-layout>
</template>

<script>
export default {
  computed: {
    divisionsComputed() {
      const divisions = this.value.army
        ? this.divisions.filter(
            o => o.army === this.value.army && ["division"].includes(o.type)
          )
        : this.divisions.filter(o => ["division"].includes(o.type));
      return divisions;
    },
    unitsComputed() {
      console.log("computing units");
      let units = this.divisionId
        ? this.divisions
            .filter(o => ["battalion", "company"].includes(o.type))
            .filter(
              o =>
                o.divisionId === this.divisionId ||
                (o.divisionId && o.divisionId._id === this.divisionId)
            )
        : this.divisions.filter(o => ["battalion", "company"].includes(o.type));

      if (!this.divisionId && this.value.army) {
        units = units.filter(o => o.army === this.value.army);
      }
      return units;
    }
  },
  props: {
    defaults: {
      type: Object,
      default: () => {}
    },
    value: {
      type: Object,
      defaults: () => {}
    },
    divisions: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      rules: {}
    };
  },
  methods: {
    setAll(value) {
      this.value.unitId = undefined;
      this.value.divisionId = undefined;
    },
    setUnits(value) {
      const division = this.divisions.find(o => o._id === value);
      this.divisionId = value;
      if (division) {
        console.log("clearing unit", division);
        this.value.army = division.army;
        this.value.unitId = undefined;
      }
    },
    setDivision(value) {
      const unit = this.unitsComputed.find(o => o._id === value);
      if (unit) {
        this.value.unitId = unit._id;
        this.value.divisionId = unit.divisionId
          ? unit.divisionId._id
          : unit.divisionId;
        this.value.army = unit.army;
      }
    },
    submit() {
      const valid = !!this.value.unitId;
      this.$emit("submit", valid);
    }
  }
};
</script>
