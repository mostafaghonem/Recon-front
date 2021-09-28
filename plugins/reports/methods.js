import _ from "lodash";

import { paragraphs, getLogo } from "~/plugins/reports/header";
import {
  Paragraph,
  Table,
  TableRow,
  TableCell,
  TextRun,
  AlignmentType,
  WidthType,
  Header,
  OverlapType,
  PageOrientation,
  PageBorderDisplay,
  PageBorderOffsetFrom,
  PageBorderZOrder,
  BorderStyle,
  VerticalAlign
} from "docx";

export const getSection = ({
  orientation,
  title,
  caption,
  data,
  headersDataReversed,
  tableHeader,
  image,
  FooterParagraphs
}) => {
  let table;

  if (headersDataReversed) {
    // Prepare Table
    const rows = [tableHeader];

    data.map((soldier, index) => {
      const para = headersDataReversed.map(field => {
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
        children: para,
        cantSplit: true
      });
      rows.push(row);
    });

    table = new Table({
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
  }

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

  if (caption) {
    children.push(caption);
  }

  if (table) {
    children.push(table);
  }

  if (FooterParagraphs && FooterParagraphs.length) {
    FooterParagraphs.map(o => children.push(o));
  }

  return {
    properties: {
      orientation: orientation || PageOrientation.LANDSCAPE,
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
