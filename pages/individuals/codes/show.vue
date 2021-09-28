<template>
  <v-container fill-height fluid grid-list-xl dir="rtl" dark>
    <v-layout justify-center wrap>
      <v-flex md12>
        <material-card color="primary" :title="$t('List_Codes')" dir="rtl">
          <v-card-title>
            <v-layout wrap>
              <v-flex xs12 md2>
                <v-select
                  :no-data-text="$t('No_Selections')"
                  class="form-select soldier-fields"
                  :items="types"
                  item-text="ar"
                  item-value="value"
                  :label="$t('Code_Type')"
                  v-model="type"
                  @change="init"
                />
              </v-flex>
              <v-flex xs12 md4>
                <v-text-field
                  v-model="search"
                  append-icon="mdi-magnify"
                  :label="$t('Search')"
                  single-line
                ></v-text-field>
              </v-flex>
              <v-flex xs12 md4>
                <v-text-field
                  v-model="constant.ar"
                  :label="
                    $t(`ADD_${this.type.replace(/\-/g, '_').toUpperCase()}`)
                  "
                  single-line
                ></v-text-field>
              </v-flex>
              <v-flex xs12 md2 text-xs-right>
                <v-btn
                  class="font-weight-light filter-table-button v-btn-facebook"
                  @click="submit"
                >
                  {{ $t("Add") }}
                </v-btn>
              </v-flex>
            </v-layout>
          </v-card-title>
          <v-data-table
            ref="soldiersTable"
            calculate-widths
            id="printMe"
            :headers="headers"
            :items="data"
            :search="search"
            :no-data-text="$t('No_Data_Available')"
            :no-results-text="$t('No_Results_Available')"
            :rows-per-page-text="$t('Rows_Per_Page')"
            :pagination.sync="pagination"
            :loading="isLoading"
            :filter="filterAllNumbers"
            prev-icon="mdi-menu-right"
            next-icon="mdi-menu-left"
          >
            <template slot="headerCell" slot-scope="{ header }">
              <span
                class="subheading font-weight-light text-label text--darken-3"
                v-text="header.text"
              />
            </template>
            <template slot="items" slot-scope="{ item }">
              <tr
                :active="
                  (item.delievered && !item.delievered.includes(user.id)) ||
                    item.selected
                "
              >
                <td v-for="header in headers" :key="header.value">
                  <template v-if="header.value === 'type'">
                    <span> {{ translateType(item) }}</span>
                  </template>
                  <template v-else>
                    <span>
                      {{ getKeyPair(header.value.split("."), item) }}</span
                    >
                  </template>
                </td>
              </tr>
            </template>
            <template v-slot:pageText="props">
              الحالى {{ props.pageStart }} - {{ props.pageStop }} من عدد كلى
              {{ props.itemsLength }}
            </template>
          </v-data-table>
        </material-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import materialCard from "~/components/material/AppCard";
import { mapGetters } from "vuex";
import { get, post } from "~/plugins/axiosbase";
import { filterAllNumbers, Toaster, getKeyPair } from "~/plugins/helpers";
import { constantFields, constantTypes } from "~/plugins/defaults";

export default {
  layout: "dashboard",
  components: {
    materialCard
  },
  computed: {
    ...mapGetters({
      locations: "app/getLocations",
      defaults: "app/getDefaults"
    }),
    headers() {
      const headers = [];
      //   if (!this.view) {
      //     headers.push({ text: "الإجراءات", value: "actions", sortable: false });
      //   }
      this.fields.map(o => {
        const found = this.fieldsValue.find(m => o.value === m);
        if (found) {
          headers.push({
            sortable: true,
            text: o.ar,
            value: o.value,
            width: o.width
          });
        }
      });

      return headers;
    },
    user() {
      try {
        return JSON.parse(localStorage.getItem("user"));
      } catch (error) {
        return {};
      }
    }
  },
  data() {
    return {
      isLoading: false,
      isAdvancedSearch: false,
      view: false,
      status: "accepted",
      search: "",
      type: "branches",
      constant: {
        ar: undefined,
        value: undefined,
        type: undefined,
        extra: {
          rank: undefined
        }
      },
      types: constantTypes,
      fields: constantFields,
      fieldsValue: constantFields.map(o => o.value),
      data: [],
      pagination: { rowsPerPage: 10, sortBy: "createdAt", descending: true },
      searchFields: []
    };
  },
  methods: {
    getKeyPair,
    filterAllNumbers,
    translateType(item) {
      const obj = constantTypes.find(o => o.value === item.type);
      if (obj) {
        return obj.ar;
      }
    },
    slice(text) {
      if (text) {
        const size = text.slice(0, 100);
        if (size.length < 100) {
          return size;
        }
        return [size, "..."].join("");
      }
    },
    renderConstants(data) {
      this.data = data;
      this.pagination.totalItems = this.data.length;
      this.isLoading = true;
    },

    async init() {
      this.isLoading = true;
      this.data = [];
      const data = await this.loadData();
      console.log("constants data", data);
      this.data = data;
      this.isLoading = true;
    },
    async loadData(query = false) {
      query = query || {};
      query.type = this.type;
      const path = "/constant";
      const response = await get(path, query);
      if (response.error) {
        console.log("error fetching soldiers", response.error);
        return [];
      }
      return response.constants;
    },
    async submit() {
      if (this.constant.ar) {
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
          title: this.$i18n.t(
            `Added_${this.type.replace(/\-/g, "_").toUpperCase()}_Success`
          ),
          timer: 4000,
          showConfirmButton: false
        });
        setTimeout(() => {
          this.init();
        }, 2000);
      }
    }
  },
  async created() {
    const instance = this.init();
  },
  middleware: ["auth", "isNotLoggedIn", "isAuthorized"]
};
</script>
