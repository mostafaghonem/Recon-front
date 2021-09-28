<template>
  <v-container fill-height fluid grid-list-xl style="direction:rtl;">
    <v-layout justify-center wrap>
      <v-flex xs12 md12>
        <material-card dark color="deep" :title="$t('Add_Outbox')">
          <v-form ref="form">
            <v-container py-0>
              <v-layout wrap>
                <v-flex xs12 md2>
                  <v-text-field
                    class="black-input"
                    :label="$t('Writing_Number')"
                 
                    v-model="mail.number"
                  />
                     <!-- :rules="rules.number"
                    type="number" -->
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
                <v-flex xs12 md2>
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
                <v-flex xs12 md4>
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
              </v-layout>
              <!-- For Answering For 
       !-->
              <v-layout wrap>
                <v-flex xs12 md2>
                  <v-autocomplete
                    :no-data-text="$t('No_Selections')"
                    class="form-select"
                    :items="unanswered.MAILS"
                    item-text="number"
                    item-value="_id"
                    v-model="mail.answerForId"
                    :clearable="!disableForIdEdit"
                    :label="$t('Writing_Answer_To')"
                    :disabled="disableForIdEdit"
                  />
                </v-flex>
                <v-flex xs12 md2>
                  <v-text-field
                    v-model="answerFor.date"
                    :label="$t('Writing_For_Date')"
                    prepend-icon="event"
                    readonly
                  ></v-text-field>
                  <!-- <v-menu
                    :close-on-content-click="false"
                    :nudge-left="50"
                    :nudge-bottom="5"
                    transition="scale-transition"
                    offset-y
                    min-width="290px"
                  >
                    <template v-slot:activator="{}">
                      <v-text-field
                        v-model="answerFor.date"
                        :label="$t('Writing_For_Date')"
                        prepend-icon="event"
                        disabled
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="answerFor.date"
                      locale="ar"
                      dark
                    ></v-date-picker>
                  </v-menu> -->
                </v-flex>
                <v-flex xs12 md4>
                  <v-autocomplete
                    :no-data-text="$t('No_Selections')"
                    class="form-select"
                    :items="defaults.DIRECTIONS"
                    item-text="ar"
                    item-value="value"
                    v-model="answerFor.direction"
                    :label="$t('Wrtiting_Sender_From')"
                    :disabled="true"
                  />
                </v-flex>
                <v-flex xs12 md3>
                  <v-autocomplete
                    :no-data-text="$t('No_Selections')"
                    class="form-select"
                    :items="defaults.BRANCHES"
                    item-text="ar"
                    item-value="value"
                    v-model="answerFor.branch"
                    :label="$t('Writing_Branch_From')"
                    :disabled="true"
                  />
                </v-flex>

                <v-flex
                  xs12
                  md1
                  style="display: flex;justify-content: center;align-items: center;"
                >
                  <v-tooltip top>
                    <template v-slot:activator="{ on }">
                      <v-btn v-on="on" @click="goToAttachment(answerFor)">
                        📎
                      </v-btn>
                    </template>
                    <span style="color:white">عرض المكاتبة الواردة</span>
                  </v-tooltip>
                </v-flex>
              </v-layout>
              <!-- END For Answering For 
       !-->

              <v-layout wrap>
                <v-flex xs12 md4>
                  <v-autocomplete
                    :no-data-text="$t('No_Selections')"
                    class="form-select"
                    :items="defaults.DIRECTIONS"
                    item-text="ar"
                    item-value="value"
                    v-model="mail.direction"
                    :label="$t('Writing_Receiver_To')"
                  />
                </v-flex>
                <v-flex xs12 md4>
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
                <v-flex xs12 md4>
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
              </v-layout>

              <v-layout wrap>
                <v-flex xs12 md4>
                  <v-autocomplete
                    :no-data-text="$t('No_Selections')"
                    class="form-select"
                    :items="defaults.BRANCHES"
                    item-text="ar"
                    item-value="value"
                    v-model="mail.branch"
                    :label="$t('Writing_Sender_Branch')"
                  />
                </v-flex>
                <v-flex xs12 md4>
                  <v-select
                    :no-data-text="$t('No_Selections')"
                    class="form-select black-input"
                    :items="defaults.WORD_MULES"
                    item-text="ar"
                    item-value="value"
                    v-model="mail.wordMule"
                    :label="$t('Writing_Word_Mule_Sender')"
                  />
                </v-flex>
                <v-flex xs12 md4>
                  <v-text-field
                    class="black-input"
                    :label="$t('Writing_Word_Mule_Receiver')"
                    v-model="mail.directionWordMule"
                  />
                </v-flex>
              </v-layout>
              <v-layout wrap>
                <v-flex xs12 md8>
                  <v-textarea
                    class="black-input"
                    :label="$t('Writing_Subject')"
                    v-model="answerFor.subject"
                  ></v-textarea>
                </v-flex>
                <v-flex xs12 md4>
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
// // Import Vue FilePond
// import vueFilePond from "vue-filepond";

// // Import FilePond styles
// import "filepond/dist/filepond.min.css";

// // Import FilePond plugins
// // Please note that you need to install these plugins separately

// // Import image preview plugin styles
// import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css";

// // Import image preview and file type validation plugins
// import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
// import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import { Toaster } from "~/plugins/helpers";
import { get, post, MINIO_URL } from "~/plugins/axiosbase";
import {
  signFiles,
  getMeUploadUrl,
  sendFiles,
  vremoved,
  uploadHandler,
  dropzoneOptions
} from "~/plugins/upload";
import moment from "moment";
import materialCard from "~/components/material/AppCard";

const mailObj = {
  type: "outbox",
  number: undefined,
  date: undefined,
  adminNo: undefined,
  direction: undefined,
  subject: undefined,
  summary: undefined,
  wordMule: undefined,
  folder: undefined,
  answerForId: undefined,
  attachments: []
};
export default {
  layout: "dashboard",
  data() {
    return {
      defaultPermissions: [],
      defaultRanks: [],
      dateModal: false,
      answerDateModal: false,
      edit: false,
      answerForId: undefined,
      disableForIdEdit: false,
      mailTypes: [
        { value: "mail", ar: "بريد" },
        { value: "email", ar: "تراسل" },
        { value: "fax", ar: "فاكس" }
      ],
      dropzoneOptions: dropzoneOptions(this),
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
      mail: mailObj,
      disabled: {
        branch: false,
        permissions: false
      },
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
        o.size = o.size || 2540;
        console.log("the file", o);
        this.$refs.myVueDropzone.manuallyAddFile(
          o,
          o.link || "http://localhost:3000/"
        );
      });
    }
  },
  async asyncData({ route }) {
    const mailId = route.path.substr(route.path.lastIndexOf("/") + 1);
    if (route.query.answerForId) {
      mailObj.answerForId = route.query.answerForId;
      return {
        mail: mailObj,
        disableForIdEdit: true
      };
    }

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
      defaults: "app/getDefaults",
      unanswered: "app/getUnAnswered"
    }),
    answerFor() {
      if (this.mail.answerForId) {
        const mail = this.unanswered.MAILS.find(
          o => o._id == this.mail.answerForId
        );
        const response = JSON.parse(JSON.stringify(mail));
        response.date = moment(response.date).format("YYYY-MM-DD");
        response.subject = ["رداً على موضوع:", response.subject].join(" ");
        console.log("the maile", mail);
        return response;
      }
      return {};
    }
  },
  methods: {
    moment,
    uploadHandler,
    signFiles,
    getMeUploadUrl,
    sendFiles,
    vremoved,
    goToAttachment(mail) {
      if (mail && mail.attachments) {
        mail.attachments = mail.attachments.map(o => {
          o.link = `${MINIO_URL}${o.path}`;
          return o;
        });
        const link =
          mail.attachments && mail.attachments.length
            ? mail.attachments[0].link
            : undefined;
        window.open(link, "_blank");
      }
    },
    async submit() {
      const addOrEdit = this.edit ? "Edited" : "Added";
      const isValid = this.$refs.form.validate();
      if (isValid) {
        const path = this.edit ? `/mail/edit/${this.mailId}` : "/mail";
        this.mail.answer = this.mail.answerResponse === "yes";
        this.mail.subject = this.answerFor.subject;
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
          window.location.href = "/followup/outbox/mails";
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
    },
    setBranch(mail) {
      const { permissions, branch } = mail;

      if (
        !permissions.includes("admin") &&
        permissions.includes("branch_head")
      ) {
        this.mail.branch = mail.branch;
        this.disabled.branch = true;
        this.disabled.permissions = true;
      }
      // const mail = this.mail;
    }
  }
};
</script>
