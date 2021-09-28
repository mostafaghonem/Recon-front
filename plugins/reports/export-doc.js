import _ from "lodash";
import AxiosBase from "~/plugins/axiosbase";
import {
  Document,
  Paragraph,
  TextDirection,
  Table,
  TableRow,
  TableCell,
  TextRun,
  AlignmentType,
  WidthType,
  TableLayoutType,
  HeadingLevel,
  Packer,
  LocalPacker,
  Media,
  Header,
  OverlapType,
  RelativeHorizontalPosition,
  RelativeVerticalPosition,
  TableAnchorType,
  HorizontalPositionAlign,
  VerticalPositionAlign,
  HorizontalPositionRelativeFrom,
  VerticalPositionRelativeFrom,
  VerticalMergeType,
  PageOrientation,
  IPageBordersOptions,
  TextWrappingSide,
  TextWrappingType,
  HeightRule,
  PageBorders,
  PageBorderDisplay,
  PageBorderOffsetFrom,
  PageBorderZOrder,
  BorderStyle,
  VerticalAlign
} from "docx";
import { saveAs } from "file-saver";

import { paragraphs, getLogo } from "~/plugins/reports/header";
import { FooterParagraphs } from "~/plugins/reports/footer";
import { getKeyPair } from "~/plugins/helpers";
import { WorkBook, WorkSheet, utils, writeFile } from "xlsx";

//import { fields } from "../defaults";
export const set_right_to_left = (wb /*:Workbook*/) => {
  if (!wb.Workbook) wb.Workbook = {};
  if (!wb.Workbook.Views) wb.Workbook.Views = [];
  if (!wb.Workbook.Views[0]) wb.Workbook.Views[0] = {};
  wb.Workbook.Views[0].RTL = true;
  return wb;
};

export const getTitle = ({ text }) => {
  const textObj = new TextRun({
    size: 36,
    text,
    underline: true,
    color: "000000",
    bold: true,
    font: {
      name: "arial"
    }
  });

  const title = new Paragraph({
    children: [textObj],
    alignment: AlignmentType.CENTER,
    spacing: {
      after: 1000
    },
    bidirectional: true
  });
  return title;
};

export const getCaption = ({ text }) => {};

export const getSection = ({
  title,
  data,
  headersDataReversed,
  tableHeader,
  image,
  FooterParagraphs
}) => {
  // Prepare Table
  const rows = [tableHeader];

  data.map((soldier, index) => {
    const paragraphs = headersDataReversed.map(field => {
      const textObj = new TextRun({
        size: 16,
        rightToLeft: true,
        text: getKeyPair(field.value.split("."), soldier),
        color: "000000",
        bold: true
      });
      return new TableCell({
        // width: {
        //   size: 100 / headersDataReversed.length,
        //   type: WidthType.PERCENTAGE
        //  },
        margins: {
          right: 50,
          top: 100,
          left: 50,
          bottom: 50
        },
        verticalAlign: VerticalAlign.CENTER,
        children: [
          new Paragraph({
            children: [textObj],
            alignment: AlignmentType.CENTER
          })
        ]
      });
    });

    const row = new TableRow({
      children: paragraphs,
      cantSplit: true
    });
    rows.push(row);
  });

  const table = new Table({
    rows,
    float: {
      bottomFromText: 505000,
      verticalAnchor: 50000,
      horizontalAnchor: 0,
      overlap: OverlapType.NEVER
    },
    margins: {
      right: 0
    },
    alignment: AlignmentType.CENTER,
    cantSplit: true,
    width: {
      size: 500000,
      type: WidthType.PERCENTAGE
    }
  });
  if (image) {
    paragraphs.push(new Paragraph(image));
  }

  const borderOptions = {
    size: 300,
    color: "000000",
    style: BorderStyle.THREE_D_EMBOSS,
    space: 5
  };

  const children = [];
  // Push items in section doc
  if (title) {
    children.push(title);
  }

  children.push(table);

  if (FooterParagraphs && FooterParagraphs.length) {
    FooterParagraphs.map(o => children.push(o));
  }

  return {
    properties: {
      orientation: PageOrientation.LANDSCAPE,
      pageBorderTop: borderOptions,
      pageBorderRight: borderOptions,
      pageBorderBottom: borderOptions,
      pageBorderLeft: borderOptions,
      pageBorders: {
        display: PageBorderDisplay.ALL_PAGES,
        offsetFrom: PageBorderOffsetFrom.PAGE,
        zOrder: PageBorderZOrder.FRONT
      }
    },
    headers: {
      default: new Header({
        children: paragraphs,
        alignment: AlignmentType.RIGHT
      })
    },

    children
  };
};

export const exportXLSX = (data, dataFields) => {
  const filtered = data.map(item => {
    const value = {};
    dataFields.map(field => {
      // value[key] = field.ar || field.text;
      const key = field.ar || field.text;
      value[key] = getKeyPair(field.value.split("."), item);
    });
    return value;
  });
  const worksheet = utils.json_to_sheet(filtered);
  const workbook = utils.book_new();
  set_right_to_left(workbook);
  utils.book_append_sheet(workbook, worksheet, "المجندين");
  workbook.Workbook.Views = [{ RTL: true }];
  writeFile(
    workbook,
    `تقرير مجندى وحدات الإستطلاع ${new Date().toUTCString()}.xlsx`
  );
};

export const exportFile = async ({
  data,
  dataFields,
  fileExtension,
  titleText
}) => {
  fileExtension = fileExtension || "docx";
  if (fileExtension === "excel") {
    return exportXLSX(data, dataFields);
  }
  // Create a new Document an save it in a variable
  let doc = new Document();
  let image;
  // Add paragraph in the document
  // doc.addParagraph(new Paragraph(`Tourist `).title().center());

  // // Add map image
  // doc.createImage(this.state.map, 600, 250, {});
  const logo = await getLogo();

  if (!logo.error) {
    image = Media.addImage(doc, logo, 100, 70, {
      floating: {
        horizontalPosition: {
          // relative: HorizontalPositionRelativeFrom.PAGE,
          // align: HorizontalPositionAlign.LEFT,
          offset: 505500
        },
        verticalPosition: {
          // relative: VerticalPositionRelativeFrom.PAGE,
          offset: 202750
        }
      }
    });
  }

  // Create table

  const headersDataReversed = JSON.parse(JSON.stringify(dataFields)).reverse();
  const headersData = headersDataReversed.map(field => {
    const textObj = new TextRun({
      size: 16,
      rightToLeft: true,
      text: field.ar || field.text,
      color: "000000",
      bold: true
    });
    return new TableCell({
      // width: {
      //   size: 100 / headersDataReversed.length,
      //   type: WidthType.PERCENTAGE
      // },
      children: [
        new Paragraph({
          children: [textObj],
          alignment: AlignmentType.CENTER,
          heading: HeadingLevel.HEADING_4
        })
      ],
      margins: {
        right: 50,
        top: 100,
        left: 50,
        bottom: 50
      },
      verticalAlign: VerticalAlign.CENTER
    });
  });

  // Prepare Header
  const tableHeader = new TableRow({
    tableHeader: true,
    cantSplit: true,
    children: headersData
  });

  // Prepare Title
  const params = { text: titleText || "كشف بأسماء المجندين دفعة (      )" };
  const title = getTitle(params);

  const chunked = _.chunk(data, 6);

  if (chunked.length === 1) {
    const section = getSection({
      title,
      data,
      headersDataReversed,
      tableHeader,
      image,
      FooterParagraphs
    });

    doc.addSection(section);
  } else {
    chunked.map((chunk, index) => {
      const params = {
        data: chunk,
        headersDataReversed,
        tableHeader,
        image
      };
      if (index === 0) {
        params.title = title;
      }
      if (index === chunked.length - 1) {
        params.FooterParagraphs = FooterParagraphs;
      }
      const section = getSection(params);
      doc.addSection(section);
    });
  }

  // const section = getSection({
  //   title,
  //   data,
  //   headersDataReversed,
  //   tableHeader,
  //   image,
  //   FooterParagraphs
  // });

  // doc.addSection(section);
  // To export into a .docx file
  // let packer = new docx.Packer();

  // if (fileExtension === "pdf") {
  //   const exporter = new LocalPacker(doc);
  //   exporter.packPdf(
  //     `تقرير مجندى وحدات الإستطلاع ${new Date().toUTCString()}.pdf`
  //   );
  // } else {
  //   Packer.toBlob(doc).then(blob => {
  //     saveAs(
  //       blob,
  //       `تقرير مجندى وحدات الإستطلاع ${new Date().toUTCString()}.${fileExtension}`
  //     );
  //   });
  // }

  Packer.toBlob(doc).then(blob => {
    const fileName = `تقرير مجندي الاستطلاع_${new Date().getTime()}.docx`;
    if (fileExtension === "pdf") {
      return convertToPDF(blob, fileName);
    }
    return saveAs(blob, fileName);
  });
};

export const convertToPDF = async (blob, fileName) => {
  const formData = new FormData();
  const file = new File([blob], fileName);
  formData.append("file", file);
  const path = "/upload";
  try {
    const response = await AxiosBase.post(path, formData, {
      "Content-Type": "multipart/form-data"
    });
    const data = response.data;
    if (data && data.converted) {
      openInNewTab(data.path, data.fileName);
    }
  } catch (err) {
    console.log("error uploading", err.message);
  }
};

function openInNewTab(url, fileName) {
  var win = window.open(url, "_blank");
  if (!win) {
    download(url, fileName);
  }
}

function download(url, fileName) {
  var element = document.createElement("a");
  element.setAttribute("href", url);
  element.setAttribute("download", fileName);

  element.style.display = "none";
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}
