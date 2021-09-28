<template>
  <v-container fill-height fluid grid-list-xl dir="rtl" dark>
    <!-- <appFilterCard v-model="isAdvancedSearch" :fields="fields" /> -->
    <AppFilterMailCardPresident
      type="outbox"
      :status="status"
      :fields="fields"
      v-model="modals.search"
      v-on:close="modals.search = false"
    />
    <AppDistributeMailCard
      v-model="modals.distributeMail"
      v-on:close="modals.distributeMail = false"
      :data="mail"
      :title="$t('Writing_Show_Distributions')"
    />
    <v-layout justify-center wrap>
      <v-flex md12>
        <material-card color="primary" :title="$t('List_Outbox_Mails')" dir="rtl">
          <v-card-title>
            <v-layout wrap>
              <v-flex xs12 md4>
                <v-select
                  :no-data-text="$t('No_Selections')"
                  class="form-select soldier-fields"
                  :items="fieldsItems"
                  item-text="ar"
                  item-value="value"
                  :label="$t('Shown_Fields')"
                  v-model="fieldsValue"
                  @input="selectAllFields"
                  multiple
                />
              </v-flex>
              <v-flex xs12 md2>
                <v-text-field
                  v-model="search"
                  append-icon="mdi-magnify"
                  :label="$t('Search')"
              
                ></v-text-field>
              </v-flex>
              <v-flex xs12 md3 text-xs-right>
                <v-btn
                  class="font-weight-light filter-table-button v-btn-facebook"
                  @click="showDialog"
                >
                  {{ $t("Advanced_Search") }}
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
                :class="[computedColor(item)]"
              >
                <td v-for="header in headers" :key="header.value">
                  <template v-if="header.value === 'attachments'">
                    <v-tooltip
                      v-for="(attachment, i) in item.attachments"
                      :key="attachment.name + i"
                      top
                    >
                      <template v-slot:activator="{ on }">
                        <a
                          v-on="on"
                          :href="attachment.link"
                          target="_blank"
                          style="font-size: large;"
                          @click="markSeen(item)"
                        >
                          📎
                        </a>
                      </template>
                      <span style="color:white">{{ attachment.name }}</span>
                    </v-tooltip>
                  </template>
                  <template v-else-if="header.value === 'actions'">
                    <v-tooltip top>
                      <template v-slot:activator="{ on }">
                        <a
                          v-on="on"
                          :href="`/followup/outbox/edit/${item._id}`"
                          style="font-size: large;"
                        >
                          ✎
                        </a>
                      </template>
                      <span style="color:white">{{ $t("Edit") }}</span>
                    </v-tooltip>
                  </template>
                  <template v-else-if="header.value === 'mark'">
                    <template>
                      <label
                        class="container"
                        style="padding-top: 4px !important;"
                      >
                        <input v-model="item.selected" type="checkbox" />
                        <span class="checkmark"></span>
                      </label>
                    </template>
                  </template>
                  <template
                    v-else-if="['subject', 'decision','arkanDecision'].includes(header.value)"
                  >
                    <v-tooltip top>
                      <template v-slot:activator="{ on }">
                        <span v-on:dblclick="openAttachment(item)" v-on="on">
                          {{ slice(getKeyPair(header.value.split("."), item)) }}
                        </span>
                      </template>
                      <span style="color:white;position:relative;">
                        {{ getKeyPair(header.value.split("."), item) }}
                      </span>
                    </v-tooltip>
                  </template>
                  <template v-else>
                    <span v-on:dblclick="openAttachment(item)">
                      {{ getKeyPair(header.value.split("."), item) }}</span
                    >
                  </template>
                </td>
              </tr>
            </template>
            <template v-slot:pageText="props">
              الحالى {{ props.pageStart }} - {{ props.pageStop }} من عدد كلى
              {{ props.itemsLength}}
            </template>
          </v-data-table>
        </material-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import materialCard from "~/components/material/AppCard";
import appFilterCard from "~/components/helper/AppFilterCard";
import AppFilterMailCardPresident from "~/components/helper/AppFilterMailCardPresident";
import AppDistributeMailCard from "~/components/helper/AppDistributeMailCard";
import { mapGetters } from "vuex";
import moment from "moment";
import { get } from "~/plugins/axiosbase";
import {
  filterAllNumbers,
  processMails,
  getKeyPair,
  selectAllFields,
  Toaster
} from "~/plugins/helpers";
import { outboxFields_presidents } from "~/plugins/defaults";

export default {
  layout: "dashboard",
  components: {
    materialCard,
    AppFilterMailCardPresident,
    AppDistributeMailCard
  },
  computed: {
    ...mapGetters({
      locations: "app/getLocations",
      defaults: "app/getDefaults"
    }),
    headers() {
      const headers = this.fieldsValue.length
        ?[]: [{ text: "الإختيار", value: "mark", sortable: false }]
    

      if (this.view && this.fieldsValue.length) {
        if (
          this.user ||
          (!this.user && this.user.branch && this.user.branch !== "presidents"&&this.user.branch !== "president_gehaz"&&this.user.branch !== "president_arkan")
        ) {
          headers.push({
            text: "الإجراءات",
            value: "actions",
            sortable: false
          });
        }
      }

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
    fieldsItems() {
      const selectAll = { ar: "إختيار الكل", value: "select_all" };
      return [selectAll].concat(this.fields);
    },
    user() {
      try {
        return JSON.parse(localStorage.getItem("user"));
      } catch (error) {
        return {};
      }
    }
  },
  asyncData({ route }) {
    const data = {};
    if (!route.path.includes("followup")) {
      data.view = true;
    }
    return data;
  },
  data() {
    return {
      isLoading: false,
      isAdvancedSearch: false,
      view: false,
      status: "accepted",
      exportType: undefined,
      modals: {
        search: false,
        addSituation: false
      },
      mail: {},
      divisions: [],
      search: "",
      fields: outboxFields_presidents,
      fieldsValue: outboxFields_presidents.map(o => o.value),
      data: [],
      pagination: { rowsPerPage: 25, sortBy: "createdAt", descending: true },
      searchFields: []
    };
  },
  methods: {
    getKeyPair,
    filterAllNumbers,
    selectAllFields,
    slice(text) {
      if (text) {
        const size = text.slice(0, 100);
        if (size.length < 100) {
          return size;
        }
        return [size, "..."].join("");
      }
    },
    edit(item) {
      window.open(`/followup/outbox/edit/${item._id}`, "_blank");
    },
    openAttachment(item) {
      if (item.attachments && item.attachments.length) {
        window.open(item.attachments[0].link, "_blank");
      }
    },
    async markSeen(mail) {
      if (this.view) {
        const path = `/mail/mark-seen/${mail._id}`;
        const response = await get(path);
        if (response.error) {
          return Toaster.fire({
            icon: "error",
            title: response.error,
            timer: 4000,
            showConfirmButton: false
          });
        }
      }
    },
    showDialog() {
      this.modals.search = true;
    },
    showMailDialog(name, data) {
      this.modals[name] = true;
      this.mail = data;
    },
    hidDialog() {
      this.modals.search = false;
    },
    
computedColor(item) {
      // get day
      const createdDay = moment(item.createdAt).date();
      const createdMonth = moment(item.createdAt).month()+1;
      const createdYear = moment(item.createdAt).year();
      const creatredDate = `${createdDay}/${createdMonth}/${createdYear}`;

      const newDay = moment().date();
      const newMonth = moment().month()+1;
      const newYear = moment().year();
      const createdNewDate = `${newDay}/${newMonth}/${newYear}`;
       
      // get yesterday
      const createdYesterDay = moment(item.createdAt).add(-1, "days");
      const createdYesterDayDate = createdYesterDay.format("DD/MM/YYYY");
      const yesterDay = moment().add(-1, "days");
      const yesterDayDate = yesterDay.format("DD/MM/YYYY");
    
       console.log(createdYesterDayDate);
       console.log(yesterDayDate);
      
      if (creatredDate === createdNewDate) {
        return "mail_colored";
      } 
     
   
},
computedColorYesterday(item) {
      
      // get yesterday
      const createdYesterDay = moment(item.createdAt).add(-1, "days");
      const createdYesterDayDate = createdYesterDay.format("DD/MM/YYYY");
      const yesterDay = moment().add(-1, "days");
      const yesterDayDate = yesterDay.format("DD/MM/YYYY");
      console.log(yesterDayDate);
      console.log(createdYesterDayDate);
      if(createdYesterDayDate === yesterDayDate)
      {
        return "mail_yesterday";
      }
    },
    renderMails(data) {
      this.modals.search = false;
      console.log("data", data);
      this.data = processMails(data, {
        locations: this.locations,
        defaults: this.defaults
      });
      // for (let i = 0; i < 50; i++) {
      //   this.data.push(this.data[0]);
      // }
      this.pagination.totalItems = this.data.length;
      this.isLoading = true;
    },

    async init() {
      this.isLoading = true;
      const data = await this.loadData();
      console.log("db mail data", data);
      this.data = processMails(data, {
        locations: this.locations,
        defaults: this.defaults
      });
      this.isLoading = true;
    },
    async loadData(query = false) {
      query = query || {};
      query.status = "accepted";
      query.type = "outbox";
      const path = this.view ? "/mail/view" : "/mail";
      const response = await get(path, query);
      if (response.error) {
        console.log("error fetching soldiers", response.error);
        return [];
      }

      return response.mails;
    }
  },
  async created() {
    const instance = this.init();
  },
  middleware: ["auth", "isNotLoggedIn", "isAuthorized"]
};
</script>
