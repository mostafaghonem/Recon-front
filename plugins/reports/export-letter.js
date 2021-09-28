import _ from "lodash";
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
import { getSection } from "~/plugins/reports/methods";
import { paragraphs, getLogo } from "~/plugins/reports/header";
import { FooterParagraphs } from "~/plugins/reports/footer";
import { changeOfUnitLetter } from "~/plugins/reports/messages";
import { getKeyPair } from "~/plugins/helpers";

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

export const getCaption = ({ data, extra }) => {
  const messages = changeOfUnitLetter({ change: data, extra });
  const texts = messages.map(
    (o, i) =>
      new TextRun({
        size: 36,
        text: i !== 0 ? "\n" + o : o,
        color: "000000",
        bold: true,
        font: {
          name: "arial"
        }
      })
  );
  // const textObj = new TextRun({
  //   size: 36,
  //   text: message,
  //   color: "000000",
  //   bold: true,
  //   font: {
  //     name: "arial"
  //   }
  // });
  const title = new Paragraph({
    children: texts,
    alignment: AlignmentType.LEFT,
    spacing: {
      after: 1000
    },
    bidirectional: true
  });

  return title;
};

export const exportLetter = async ({
  data,
  extra,
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
  //   const headersDataReversed = JSON.parse(JSON.stringify(dataFields)).reverse();
  //   const headersData = headersDataReversed.map(field => {
  //     const textObj = new TextRun({
  //       size: 16,
  //       rightToLeft: true,
  //       text: field.ar || field.text,
  //       color: "000000",
  //       bold: true
  //     });
  //     return new TableCell({
  //       // width: {
  //       //   size: 100 / headersDataReversed.length,
  //       //   type: WidthType.PERCENTAGE
  //       // },
  //       children: [
  //         new Paragraph({
  //           children: [textObj],
  //           alignment: AlignmentType.CENTER,
  //           heading: HeadingLevel.HEADING_4
  //         })
  //       ],
  //       margins: {
  //         right: 50,
  //         top: 100,
  //         left: 50,
  //         bottom: 50
  //       },
  //       verticalAlign: VerticalAlign.CENTER
  //     });
  //   });

  // Prepare Header
  //   const tableHeader = new TableRow({
  //     tableHeader: true,
  //     cantSplit: true,
  //     children: headersData
  //   });

  // Prepare Title
  console.log("letter data", data);
  const params = { text: titleText || `إلى / ${data.unitName}` };
  const title = getTitle(params);
  const caption = getCaption({ data, extra });
  const section = getSection({
    orientation: PageOrientation.PORTRAIT,
    title,
    caption,
    data,
    image,
    FooterParagraphs
  });

  doc.addSection(section);

  Packer.toBlob(doc).then(blob => {
    saveAs(blob, `${titleText || `إلى / ${data.unitName}`}`);
  });
};
