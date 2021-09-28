<template>
  <v-container fill-height fluid grid-list-xl dir="rtl" dark>
    <AppReadMoreCard
      persistent
      v-model="modals.readMore"
      :data="readMore"
      v-on:close="modals.readMore = false"
      max-width="1000px"
    >
    </AppReadMoreCard>
    <AppFilterMailCardPresident
      type="inbox"
      :status="status"
      :fields="fields"
      :view="view"
      :seen="seen"
      :follow="follow"
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
        <material-card
          color="primary"
          :title="$t('List_Inbox_Mails')"
          dir="rtl"
        >
          <v-card-title>
            <v-layout wrap>
              <v-flex xs12 md6>
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

              <v-flex xs12 md4>
                <v-text-field
                  v-model="search"
                  append-icon="mdi-magnify"
                  :label="$t('Search')"
                ></v-text-field>
              </v-flex>

              <v-flex xs12 md2 text-xs-right>
                <v-btn
                  class="font-weight-light filter-table-button v-btn-facebook"
                  @click="showDialog"
                >
                  {{ $t("Advanced_Search") }}
                </v-btn>
              </v-flex>
              <v-flex xs12 md2>
                <div>
                  <div class="white color-box"></div>
                  <span class="color-text" style="fontSize:15px">
                    مكاتبات ليس لها وجوب رد
                  </span>
                </div>
              </v-flex>
              <v-flex xs12 md2>
                <div>
                  <div
                    class="yellow color-box"
                    style="boxShadow: 0px 0px 2px 2px #ffeb3b !important;"
                  ></div>
                  <span class="color-text" style="fontSize:15px">
                    مكاتبات للمتابعة ولم يتم الرد
                  </span>
                </div>
              </v-flex>
              <v-flex xs12 md3>
                <div>
                  <div class="red color-box"></div>
                  <span class="color-text" style="fontSize:15px">
                    مكاتبات لها وجوب رد لم يتم الرد
                  </span>
                </div>
              </v-flex>
              <v-flex xs12 md3>
                <div>
                  <div>
                    <div class="green color_ color-box"></div>
                    <span class="color-text" style="fontSize:15px">
                      مكاتبات لها وجوب رد و تم الرد
                    </span>
                  </div>
                </div>
              </v-flex>
              <v-flex xs12 md2>
                <div>
                  <div>
                    <div class="blue color-box"></div>
                    <span class="color-text" style="fontSize:15px">
                      مكاتبات واردة عن اليوم
                    </span>
                  </div>
                </div>
              </v-flex>
            
            </v-layout>
            <!-- <v-layout>
              <div v-for="color in colors" :key="color" style="color-key">
                <div :class="['color-box', color.value].join(' ')"></div>
                <span class="color-text">
                  {{ color.ar }}
                </span>
              </div>
            </v-layout> -->
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
                width="1%"
                class="subheading font-weight-light text-label text--darken-3"
                v-text="header.text"
              />
            </template>

            <template slot="items" slot-scope="{ item }">
              <tr
                id="tr"
                @click="getelement()"
                :active="
                  (item.delievered && !item.delievered.includes(user.id)) ||
                    item.selected
                "
                :class="[computeItemClass(item), computedColor(item)]"
              >
                <td
                  class="text-xs-right"
                  v-for="header in headers"
                  :key="header.value"
                  style="word-wrap: break-word;"
                >
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
                    <v-tooltip
                      v-if="
                        !follow &&
                          item.answerId &&
                          item.answerId.attachments &&
                          item.answerId.attachments[0]
                      "
                      top
                    >
                      <template v-slot:activator="{ on }">
                        <a
                          v-on="on"
                          :href="
                            `${MINIO_URL}${item.answerId.attachments[0].path}`
                          "
                          target="_blank"
                          style="font-size: large;"
                        >
                          📨
                        </a>
                      </template>
                      <span style="color:white">{{
                        $t("Show_Answer")
                      }}</span></v-tooltip
                    >
                  </template>
                  <template v-else-if="header.value === 'actions'">
                    <v-tooltip top>
                      <template v-slot:activator="{ on }">
                        <a
                          v-on="on"
                          :href="`/followup/inbox/edit/${item._id}`"
                          style="font-size: large;"
                        >
                          ✎
                        </a>
                      </template>
                      <span style="color:white">{{ $t("Edit") }}</span>
                    </v-tooltip>
                    <v-tooltip
                      v-if="
                        (follow || (item.answer && !item.answerId)) && !view
                      "
                      top
                    >
                      <template v-slot:activator="{ on }">
                        <a
                          v-on="on"
                          :href="`/followup/outbox/add?answerForId=${item._id}`"
                          target="_blank"
                          style="font-size: large;"
                        >
                          📤
                        </a>
                      </template>
                      <span style="color:white">{{
                        $t("Answer")
                      }}</span></v-tooltip
                    >

                    <v-tooltip
                      v-if="
                        !follow &&
                          item.answer &&
                          item.answerId &&
                          item.answerId.attachments &&
                          item.answerId.attachments[0]
                      "
                      top
                    >
                      <template v-slot:activator="{ on }">
                        <a
                          v-on="on"
                          :href="
                            `${MINIO_URL}${item.answerId.attachments[0].path}`
                          "
                          target="_blank"
                          style="font-size: large;"
                        >
                          📨
                        </a>
                      </template>
                      <span style="color:white">{{
                        $t("Show_Answer")
                      }}</span></v-tooltip
                    >
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
                    <span
                      @click="decisionHandler(item, header)"
                      v-on:dblclick="openAttachment(item)"
                    >
                      {{ slice(getKeyPair(header.value.split("."), item)) }}
                    </span>
                  </template>

                  <template v-else>
                    <span v-on:dblclick="openAttachment(item)">
                      {{ getKeyPair(header.value.split("."), item) }}
                    </span></template
                  >
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
import AppFilterMailCardPresident from "~/components/helper/AppFilterMailCardPresident";
import AppDistributeMailCard from "~/components/helper/AppDistributeMailCard";
import AppReadMoreCard from "~/components/helper/AppReadMoreCard";
import { mapGetters } from "vuex";
import { get, MINIO_URL } from "~/plugins/axiosbase";
import jquery from "jquery";
import {
  filterAllNumbers,
  processMails,
  getKeyPair,
  selectAllFields,
  Toaster
} from "~/plugins/helpers";
import { inboxFields_presidents } from "~/plugins/defaults";
// Importing Icon
import { mdiAttachment } from "@mdi/js";
import moment from "moment";
export default {
  layout: "dashboard",
  components: {
    materialCard,
    AppFilterMailCardPresident,
    AppDistributeMailCard,
    AppReadMoreCard
  },
  computed: {
    ...mapGetters({
      locations: "app/getLocations",
      defaults: "app/getDefaults"
    }),
    headers() {
      const headers = this.fieldsValue.length
        ? []
        : [{ text: "الإختيار", value: "mark", sortable: false }];

      if (this.view && this.fieldsValue.length) {
        if (
          !this.user ||
          (this.user && this.user.branch && this.user.branch !== "presidents")
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
            align: "left",
            width: "0.25%"
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
    const delievryStatus = route.path.substr(route.path.lastIndexOf("/") + 1);
    if (!route.path.includes("followup")) {
      data.view = true;
    }

    if (route.query.follow || route.path.includes("follow-mails")) {
      data.follow = true;
    }

    switch (delievryStatus) {
      case "unseen-mails":
        data.seen = false;
        break;
      case "seen-mails":
        data.seen = true;
        break;
      case "mails":
        break;
    }
    return data;
  },
  data() {
    return {
      MINIO_URL,
      mdiAttachment,
      selectAll: false,
      isLoading: false,
      isAdvancedSearch: false,
      view: false,
      followup: false,
      status: "accepted",
      seen: undefined,
      follow: false,
      exportType: undefined,
      modals: {
        search: false,
        distributeMail: false,
        readMore: false
      },
      readMore: {
        key: undefined,
        ar: undefined,
        title: undefined
      },
      pagination: { rowsPerPage: 25, sortBy: "createdAt", descending: true },
      mail: {},
      colors: [
        { value: "white", ar: "مكاتبات ليس لها وجوب رد" },
        { value: "red", ar: "مكاتبات لها وجوب رد لم يتم الرد" },
        { value: "green", ar: "مكاتبات لها وجوب رد و تم الرد" },
        {
          value: "orange",
          ar: "مكاتبات للمتابعة ولم يتم الرد من الفرع المختص"
        }
      ],
      divisions: [],
      search: "",
      fields: inboxFields_presidents,
      fieldsValue: inboxFields_presidents.map(o => o.value),
      data: [],
      searchFields: []
    };
  },
  methods: {
    getKeyPair,
    filterAllNumbers,
    selectAllFields,
    getelement()
    {
        return "mail_red"
    },
    computeItemClass(item) {
      
      const branch = item.branch ? item.branch.value : item.branch;
      if (item.selected) {
        return undefined;
      }
      if (item.answer && !item.answerId) {
        if (!this.user) {
          return "mail_red";
        } else if (this.user.branch === "followup") {
          return "mail_red";
        } else if (this.user.branch !== branch) {
          return "mail_warning";
        }
        return "mail_red";
      } else if (item.answer && item.answerId) {
        return "mail_success";
      }
      return "";
    },
    computedColor(item) {
      // get day
      const createdDay = moment(item.createdAt).date();
      const createdMonth = moment(item.createdAt).month() + 1;
      const createdYear = moment(item.createdAt).year();
      const creatredDate = `${createdDay}/${createdMonth}/${createdYear}`;

      const newDay = moment().date();
      const newMonth = moment().month() + 1;
      const newYear = moment().year();
      const createdNewDate = `${newDay}/${newMonth}/${newYear}`;
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
      if (createdYesterDayDate === yesterDayDate) {
        return "mail_yesterday";
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
    decisionHandler(item, header) {
      const key = header.value;
      const title = header.text;
      if (item[key] && item[key].length >= 25) {
        this.readMore.key = key;
        this.readMore.ar = this.getKeyPair(key.split("."), item);
        this.readMore.title = title;
        this.modals.readMore = true;
      }
    },
    openAttachment(item) {
      if (item.attachments && item.attachments.length) {
        window.open(item.attachments[0].link, "_blank");
        this.markSeen(item);
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

        if (this.seen === false) {
          const index = this.data.findIndex(o => o._id === mail._id);
          this.data.splice(index, 1);
          Toaster.fire({
            icon: "success",
            title: this.$i18n.t(`Mark_Seen_Mail_Success`),
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

    renderMails(data) {
      this.modals.search = false;
      console.log("data", data);
      this.data = processMails(data, {
        locations: this.locations,
        defaults: this.defaults
      });

      this.pagination.totalItems = this.data.length;
      this.isLoading = true;
    },
    async init() {
      this.isLoading = true;
      const data = await this.loadData();
      this.data = processMails(data, {
        locations: this.locations,
        defaults: this.defaults
      });
      this.isLoading = true;
    },
    async loadData(query = {}) {
      query = query || {};
      query.status = "accepted";
      query.type = "inbox";
      query.seen = this.seen;
      query.branch = this.follow && this.view ? true : undefined;
      const path =
        this.view && !this.follow
          ? "/mail/view"
          : this.follow
          ? `/mail/unanswered`
          : "/mail";

      const response = await get(path, query);
      if (response.error) {
        console.log("error fetching mails", response.error);
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
