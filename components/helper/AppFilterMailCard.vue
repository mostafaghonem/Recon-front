<template>
  <v-dialog persistent v-model="value" max-width="1000px">
    <!-- <v-container fill-height fluid grid-list-xl style="direction:rtl;"> -->
    <v-layout justify-center wrap>
      <v-flex xs12 md12>
        <material-card
          dark
          color="deep"
          :title="$t('Advanced_Search')"
          v-on:close="close"
          headerAction="close"
        >
          <v-form ref="form" style="direction:rtl;">
            <v-container py-0>
              <v-layout wrap>
                <!-- <v-flex xs12 md2>
                  <v-text-field 
                    class="black-input"
                    :label="$t('Writing_Number')"
                    type="number"
                    v-model="mail.number"
                  />
                </v-flex> -->
                <v-flex xs12 md3>
                  <v-menu
                    v-model="dateModal"
                    :close-on-content-click="false"
                    :nudge-left="50"
                    :nudge-bottom="5"
                    transition="scale-transition"
                    offset-y
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="mail.date"
                        :label="$t('Writing_Date')"
                        prepend-icon="event"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      :allowed-dates="time => moment(time) <= moment()"
                      v-model="mail.date"
                      @input="dateModal = false"
                      locale="ar"
                      dark
                    ></v-date-picker>
                  </v-menu>
                </v-flex>
                <v-flex xs12 md3>
                  <v-text-field
                    class="black-input"
                    :label="$t('Writing_AdminNo')"
                    type="number"
                    v-model="mail.adminNo"
                  />
                </v-flex>
                <v-flex xs12 md3>
                  <v-select
                    :no-data-text="$t('No_Selections')"
                    class="form-select"
                    :items="mailTypes"
                    item-text="ar"
                    item-value="value"
                    v-model="mail.mailType"
                    :label="$t('Writing_Type')"
                  />
                </v-flex>
                <v-flex xs12 md3>
                  <v-autocomplete
                    :no-data-text="$t('No_Selections')"
                    class="form-select"
                    :items="defaults.DIRECTIONS"
                    item-text="ar"
                    item-value="value"
                    v-model="mail.direction"
                    :label="$t('Wrtiting_Sender_From')"
                  />
                </v-flex>
              </v-layout>
              <v-layout wrap>
                <v-flex xs12 md3>
                  <v-select
                    :no-data-text="$t('No_Selections')"
                    class="form-select black-input"
                    :items="YES_NO"
                    item-text="ar"
                    item-value="value"
                    v-model="mail.answerResponse"
                    :label="$t('Writing_Should_Reply')"
                  />
                </v-flex>
                <v-flex xs12 md3>
                  <v-menu
                    v-model="answerDateModal"
                    :close-on-content-click="false"
                    :nudge-left="200"
                    :nudge-bottom="30"
                    transition="scale-transition"
                    offset-x
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="mail.answerDate"
                        :label="$t('Writing_Answer_Date')"
                        prepend-icon="event"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      :allowed-dates="time => moment(time) >= moment()"
                      v-model="mail.answerDate"
                      @input="answerDateModal = false"
                      locale="ar"
                      dark
                    ></v-date-picker>
                  </v-menu>
                </v-flex>
                <v-flex xs12 md3>
                  <v-autocomplete
                    multiple
                    :no-data-text="$t('No_Selections')"
                    class="form-select"
                    :items="defaults.BRANCHES"
                    item-text="ar"
                    item-value="value"
                    v-model="mail.branches"
                    :label="$t('Writing_Branches')"
                  />
                </v-flex>
                <v-flex xs12 md3>
                  <v-autocomplete
                    multiple
                    :no-data-text="$t('No_Selections')"
                    class="form-select"
                    :items="defaults.BRANCHES"
                    item-text="ar"
                    item-value="value"
                    v-model="mail.branches"
                    :label="$t('Writing_Branches')"
                  />
                </v-flex>

                <v-flex xs12 md3>
                  <v-select
                    :no-data-text="$t('No_Selections')"
                    class="form-select black-input"
                    :items="defaults.WORD_MULES"
                    item-text="ar"
                    item-value="value"
                    v-model="mail.wordMule"
                    :label="$t('Writing_Word_Mule')"
                  />
                </v-flex>
              </v-layout>
              <v-layout wrap>
                <v-flex xs12 md4>
                  <v-textarea
                    class="black-input"
                    :label="$t('Writing_Subject')"
                    v-model="mail.subject"
                  ></v-textarea>
                </v-flex>
              </v-layout>
              <!-- <v-layout wrap>
                <dropzone id="dropzone" :options="dropzoneOptions"> </dropzone>
              </v-layout> -->
              <v-layout wrap>
                <v-flex xs12 text-xs-right>
                  <v-btn
                    class="font-weight-light add-button v-btn-add"
                    @click="submit"
                  >
                    {{ $t("Search") }}
                  </v-btn>
                </v-flex>
              </v-layout>
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
import moment from "moment";
import materialCard from "~/components/material/AppCard";

export default {
  name: "app-filter-card",
  components: {
    materialCard
  },
  data() {
    return {
      defaultPermissions: [],
      defaultRanks: [],
      attachments: [],
      files: [],
      dateModal: false,
      answerDateModal: false,
      mailTypes: [
        { value: "mail", ar: "بريد" },
        { value: "email", ar: "تراسل" },
        { value: "fax", ar: "فاكس" }
      ],
      YES_NO: [
        {
          value: "yes",
          ar: "نعم"
        },
        {
          value: "no",
          ar: "لا"
        }
      ],
      mail: {
        mailType: undefined,
        number: undefined,
        date: undefined,
        adminNo: undefined,
        direction: undefined,
        subject: undefined,
        summary: undefined,
        wordMule: undefined,
        folder: undefined,
        attachments: []
      },
      disabled: {
        branch: false,
        permissions: false
      },
      rules: {},
      disabled: {
        recruitmentArea: false,
        educationRank: false,
        force: false
      }
    };
  },
  async created() {},
  props: ["value", "fields", "status", "type", "view", "seen", "follow"],
  computed: {
    ...mapGetters({
      user: "user/getUser",
      locations: "app/getLocations",
      defaults: "app/getDefaults",
      fullname: "user/getFullname"
    })
  },
  methods: {
    moment,
    async submit() {
      const isValid = this.$refs.form.validate();
      if (isValid) {
        const path = this.view
          ? "/mail/view"
          : this.follow
          ? "/mail/unanswered"
          : "/mail";
        const obj = JSON.parse(JSON.stringify(this.mail));
        if (obj.answerResponse) {
          obj.answer = obj.answerResponse === "yes";
        }
        obj.status = this.status;
        obj.type = this.type;
        obj.seen = this.seen;
        const response = await get(path, obj);
        if (response.error) {
          return Toaster.fire({
            icon: "error",
            title: response.error,
            timer: 4000,
            showConfirmButton: false
          });
        }
        this.setSearchFields(obj);
        this.$parent.renderMails(response.mails);
      }
    },
    setSearchFields(obj) {
      const fields = Object.keys(obj).map(o => {
        const keyObj = this.fields.find(m => m.value === o);
        const value = obj[o];

        console.log("setting for key", o, keyObj, value);
        return { keyObj, value };
      });
      this.$parent.searchFields = fields;
      return fields;
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
