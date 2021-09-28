import pdfMake from "pdfmake";
import pdfFonts from "~/plugins/vfs_fonts";
import { getKeyPair } from "~/plugins/helpers";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

pdfMake.fonts = {
  arial: {
    normal: "Amiri-Regular.ttf",
    bold: "Amiri-Bold.ttf",
    italics: "Amiri-Italic.ttf",
    bolditalics: "Amiri-BoldItalic.ttf"
  }
};

export const exportPDF = async ({
  // data,
  // dataFields,
  fileExtension,
  titleText
}) => {
  // Create a new Document an save it in a variable

  // Create table
  const dataFields = [
    { value: "one", ar: "واحدة هيدر" },
    { value: "two", ar: "اثنين هيدر" },
    { value: "three", ar: "ثلاثة هيدر" }
  ];
  const data = [
    {
      one: "one",
      two: "two",
      three: "three"
    }
  ];
  const headersDataReversed = JSON.parse(JSON.stringify(dataFields)).reverse();
  const headersData = headersDataReversed.map(field => {
    const textObj = {
      size: 16,
      rightToLeft: true,
      text: field.ar || field.text,
      color: "000000",
      bold: true
    };
    return textObj;
  });

  const rows = [headersData];

  data.map((soldier, index) => {
    const paragraphs = headersDataReversed.map(field => {
      const textObj = {
        size: 16,
        rightToLeft: true,
        text: getKeyPair(field.value.split("."), soldier),
        color: "000000",
        bold: true
      };
      return textObj;
    });
    rows.push(paragraphs);
  });
  // Prepare Title
  const params = { text: titleText || "كشف بأسماء المجندين دفعة (      )" };
  //   const title = getTitle(params);
  const tableLayout = {};
  const table = {
    headerRows: 1,

    body: rows
  };
  const docDefinition = {
    content: [
      {
        layout: "lightHorizontalLines", // optional
        table
      }
    ],
    defaultStyle: {
      font: "arial"
    }
  };

  // download the PDF
  pdfMake.createPdf(docDefinition).download();
};
