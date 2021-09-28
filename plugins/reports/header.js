import {
  Document,
  Header,
  Paragraph,
  TextRun,
  TextDirection,
  Table,
  TableRow,
  TableCell,
  AlignmentType,
  UnderlineType,
  Media,
  ThematicBreak,
  WidthType,
  HeadingLevel,
  Packer
} from "docx";
import { saveAs } from "file-saver";
import axios from "axios";
import moment from "moment";

let logoBuffer;
let imagePath = require("~/assets/images/logo.jpg");
const texts = [
  "إدارة المخابـرات الحربيـة والإسـتطلاع",
  "جهـــــــــــــــاز الأســـــــــــــــتطــــلاع ",
  "فـــــــــــــــــــرع الأفــــــــــــــــــــراد",
  `التــــــــــاريخ: ${moment()
    .locale("ar")
    .format("YYYY/MM/DD")}`
];

export const paragraphs = texts.map(text => {
  const textObj = new TextRun({
    text,
    underline: {
      type: UnderlineType.SINGLE,
      color: "000000"
    },
    bold: true
  });

  const paragraph = new Paragraph({
    children: [textObj],
    alignment: AlignmentType.LEFT,
    bidirectional: true
  });
  return paragraph;
});

export const PageHeader = new Header({
  children: paragraphs,
  alignment: AlignmentType.RIGHT
});

export const getLogo = async () => {
  try {
    if (logoBuffer) {
      return logoBuffer;
    }
    const response = await axios.get(imagePath, {
      responseType: "arraybuffer"
    });
    logoBuffer = Buffer.from(response.data, "binary");
    console.log("got logo for first time");
    return Buffer.from(response.data, "binary");
  } catch (error) {
    console.log("logo buffer error", error.message);
    return { error: error.response ? error.response.message : error.message };
  }
};
