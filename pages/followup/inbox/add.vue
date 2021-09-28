<template>
  <v-container fill-height fluid grid-list-xl style="direction:rtl;">
    <v-layout justify-center wrap>
      <v-flex xs12 md12>
        <material-card dark color="deep" :title="$t('Add_Inbox')">
          <v-form ref="form">
            <v-container py-0>
              <v-layout wrap>
                <v-flex xs12 md2>
                  <v-text-field
                    class="black-input"
                    :label="$t('Writing_Number')"
                    :rules="rules.number"
                    type="number"
                    v-model="mail.number"
                  />
                  <!-- 
                -->
                </v-flex>
                <v-flex xs12 md2>
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
                <v-flex xs12 md2>
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
                <v-flex xs12 md2>
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
                <v-flex xs12 md2>
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
                        :disabled="mail.answerResponse === 'no'"
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
                <v-flex xs12 md5>
                  <v-autocomplete
                    :no-data-text="$t('No_Selections')"
                    class="form-select black-input"
                    :items="defaults.CATEGORIES"
                    item-text="ar"
                    item-value="value"
                    v-model="mail.category"
                    clearable
                    :label="$t('Writing_Category')"
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
                <v-flex xs12 md7>
                  <v-textarea
                    class="black-input subject"
                    :label="$t('Writing_Subject')"
                    v-model="mail.subject"
                  ></v-textarea>
                </v-flex>
                <v-flex xs12 md5>
                  <dropzone
                    ref="myVueDropzone"
                    id="dropzone"
                    :options="dropzoneOptions"
                    @vdropzone-removed-file="vremoved"
                    @vdropzone-error="vremoved"
                  >
                  </dropzone>
                </v-flex>
              </v-layout>
              <!-- <v-layout wrap>
                <dropzone id="dropzone" :options="dropzoneOptions"> </dropzone>
              </v-layout> -->
              <v-layout wrap> </v-layout>
              <v-layout wrap> </v-layout>
              <v-layout wrap> </v-layout>
              <v-layout wrap> </v-layout>
              <v-layout wrap>
                <v-flex xs12 text-xs-right>
                  <v-btn
                    class="font-weight-light add-button v-btn-add"
                    @click="submit"
                  >
                    <template v-if="edit">{{ $t("Edit") }}</template>
                    <template v-else
                      >{{ $t("Add") }}
                    </template>
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
import { onlyNumber, Toaster } from "~/plugins/helpers";
import { get, post } from "~/plugins/axiosbase";
import {
  signFiles,
  getMeUploadUrl,
  sendFiles,
  uploadHandler,
  dropzoneOptions
} from "~/plugins/upload";
import moment from "moment";
import materialCard from "~/components/material/AppCard";

// Create component
export default {
  layout: "dashboard",
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
      edit: false,
      mail: {
        type: "inbox",
        category: undefined,
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
      dropzoneOptions: dropzoneOptions(this),
      rules: {
        number: [
          v => !!v || this.$t("Writing_Number_Required"),
          v => {
            return this.validateNumber(v);
          }
        ],
        date: [v => !!v || this.$t("Writing_Number_Required")]
      },
      permissions: []
    };
  },
  mounted() {
    if (this.edit && this.mail.attachments) {
      this.mail.attachments.map(o => {
        o.type = "application/pdf";
        o.size = 123;

        this.$refs.myVueDropzone.manuallyAddFile(
          o,
          o.link || "http://localhost:3000/"
        );
      });
    }
  },
  async asyncData({ route }) {
    const mailId = route.path.substr(route.path.lastIndexOf("/") + 1);
    if (!route.path.includes("edit")) {
      return {};
    }

    const path = `/mail/data/${mailId}`;
    const mail = await get(path);

    if (mail.error) {
      Toaster.fire({
        icon: "error",
        title: mail.error,
        timer: 4000,
        showConfirmButton: false
      });
      return {};
    }
    mail.answerResponse = mail.answer ? "yes" : "no";
    console.log("mail data ============>", mail.date);
    mail.date = moment(mail.date).format("YYYY-MM-DD");
    mail.answerDate = mail.answerDate
      ? moment(mail.answerDate).format("YYYY-MM-DD")
      : undefined;
    return { mailId, mail, edit: true };
  },
  async created() {
    const { context } = this.$store.app;
    const { nuxtState } = context;
    if (!nuxtState || (nuxtState && !nuxtState.mail)) {
      return;
    }
    this.setBranch(nuxtState.mail);
  },
  middleware: ["auth", "isNotLoggedIn", "isAuthorized"],
  meta: {
    branches: ["followup"]
  },
  components: {
    materialCard
  },
  computed: {
    ...mapGetters({
      defaults: "app/getDefaults"
    })
  },
  methods: {
    moment,
    uploadHandler,
    signFiles,
    getMeUploadUrl,
    sendFiles,
    vremoved(file, xhr, error) {
      console.log("file name removeed", file.name);
      const found = this.mail.attachments.find(
        o => o.originalName === file.name || file.name.includes(o.name)
      );
      if (found) {
        console.log("file still in array", found);
        this.mail.attachments.splice(this.mail.attachments.indexOf(found), 1);
      }
    },
    async handleFilePondInit() {
      console.log("FilePond has initialized");

      // FilePond instance methods are available on `this.$refs.pond`
    },
    async handleFileProcess() {
      console.log("a file is being processed");
    },
    async submit() {
      const addOrEdit = this.edit ? "Edited" : "Added";
      const isValid = this.$refs.form.validate();
      if (isValid) {
        const path = this.edit ? `/mail/edit/${this.mailId}` : "/mail";
        this.mail.answer = this.mail.answerResponse === "yes";
        const response = await post(path, this.mail);
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
          title: this.$i18n.t(`${addOrEdit}_Mail_Success`),
          timer: 4000,
          showConfirmButton: false
        });
        setTimeout(() => {
          location.href = "/followup/inbox/pending-mails";
        }, 4000);
      }
    },
    validateMailName(value) {
      if (typeof value === "undefined") {
        return true;
      }
      return false;
    },
    validateNumber(value) {
      if (parseInt(value) === NaN) {
        return this.$i18n.t("MailNumber_Invalid");
      }

      return false;
    }
  }
};
</script>
