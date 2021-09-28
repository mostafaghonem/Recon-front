import {
  Footer,
  Paragraph,
  TextRun,
  AlignmentType,
  UnderlineType,
  Spacing
} from "docx";
const texts = [
  "التــوقيع  (                     ) ",
  "لـواء أ ح/حسـام علي خضـر",
  "رئـيـس جـهـاز الاسـتـطـلاع"
];
const first = new Paragraph({
  text: " ",
  spacing: { line: 3500 },
  alignment: AlignmentType.RIGHT,
  bidirectional: true
});

export const paragraphs = [
  first,
  ...texts.map((text, i) => {
    const textObj = new TextRun({
      text,
      size: 26,
      bold: true
    });

    const paragraph = new Paragraph({
      children: [textObj],
      alignment: AlignmentType.RIGHT,
      bidirectional: true,
      contextualSpacing: true
    });

    return paragraph;
  })
];

export const FooterParagraphs = paragraphs;
