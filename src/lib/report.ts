import { jsPDF } from "jspdf";

const NAVY: [number, number, number] = [11, 61, 145];
const ORANGE: [number, number, number] = [252, 61, 33];
const INK: [number, number, number] = [26, 32, 44];
const GREY: [number, number, number] = [110, 120, 135];
const LIGHT: [number, number, number] = [236, 240, 247];

export interface ReportOptions {
  /** Main report title, e.g. "Maize in Nakuru". */
  title: string;
  /** Small label above the title, e.g. "Planting Advisor". */
  kicker: string;
  /** Optional key/value facts rendered in a summary box. */
  facts?: { label: string; value: string }[];
  /** The advisor text (markdown-ish) to typeset. */
  body: string;
  /** File name without extension. */
  fileName: string;
}

const PAGE_W = 210;
const PAGE_H = 297;
const MARGIN = 18;
const CONTENT_W = PAGE_W - MARGIN * 2;

const stripBold = (s: string) => s.replace(/\*\*/g, "").replace(/`/g, "");

/** Generates a branded, multi-page PDF report from advisor text. */
export function downloadAdviceReport({
  title,
  kicker,
  facts = [],
  body,
  fileName,
}: ReportOptions) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const generated = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  let y = 0;
  let page = 1;

  const drawHeaderBand = (full: boolean) => {
    const h = full ? 46 : 20;
    doc.setFillColor(...NAVY);
    doc.rect(0, 0, PAGE_W, h, "F");
    doc.setFillColor(...ORANGE);
    doc.rect(0, h, PAGE_W, 1.6, "F");

    doc.setTextColor(255, 255, 255);
    if (full) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.text("NASA BIOSCIENCE KNOWLEDGE EXPLORER", MARGIN, 14);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.text(kicker.toUpperCase(), MARGIN, 20);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      const lines = doc.splitTextToSize(title, CONTENT_W);
      doc.text(lines.slice(0, 2), MARGIN, 31);
    } else {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.text("NASA BIOSCIENCE KNOWLEDGE EXPLORER", MARGIN, 12);
      doc.setFont("helvetica", "normal");
      doc.text(stripBold(title).slice(0, 60), PAGE_W - MARGIN, 12, { align: "right" });
    }
    y = full ? 58 : 32;
  };

  const drawFooter = () => {
    doc.setDrawColor(...LIGHT);
    doc.setLineWidth(0.4);
    doc.line(MARGIN, PAGE_H - 16, PAGE_W - MARGIN, PAGE_H - 16);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(...GREY);
    doc.text(
      "Generated guidance. Confirm dates, varieties and treatments with your local agricultural extension officer.",
      MARGIN,
      PAGE_H - 11
    );
    doc.text(`${generated}  |  Page ${page}`, PAGE_W - MARGIN, PAGE_H - 11, {
      align: "right",
    });
  };

  const newPage = () => {
    drawFooter();
    doc.addPage();
    page += 1;
    drawHeaderBand(false);
  };

  const need = (space: number) => {
    if (y + space > PAGE_H - 24) newPage();
  };

  drawHeaderBand(true);

  // Facts box
  if (facts.length) {
    const rows = Math.ceil(facts.length / 2);
    const boxH = 10 + rows * 8;
    doc.setFillColor(...LIGHT);
    doc.roundedRect(MARGIN, y, CONTENT_W, boxH, 2, 2, "F");
    facts.forEach((f, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const x = MARGIN + 6 + col * (CONTENT_W / 2);
      const fy = y + 9 + row * 8;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(...NAVY);
      doc.text(f.label.toUpperCase(), x, fy);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.5);
      doc.setTextColor(...INK);
      doc.text(doc.splitTextToSize(f.value, CONTENT_W / 2 - 14)[0] ?? "", x + 32, fy);
    });
    y += boxH + 8;
  }

  const writeParagraph = (text: string, indent = 0, size = 10, bold = false) => {
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setFontSize(size);
    doc.setTextColor(...INK);
    const lines: string[] = doc.splitTextToSize(text, CONTENT_W - indent);
    lines.forEach((line) => {
      need(6);
      doc.text(line, MARGIN + indent, y);
      y += size * 0.52;
    });
    y += 2;
  };

  body.split("\n").forEach((raw) => {
    const line = raw.trim();
    if (!line) {
      y += 2.5;
      return;
    }

    if (/^#{1,6}\s/.test(line)) {
      const content = stripBold(line.replace(/^#+\s*/, ""));
      need(16);
      y += 3;
      doc.setFillColor(...ORANGE);
      doc.rect(MARGIN, y - 4, 2.2, 5.5, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12.5);
      doc.setTextColor(...NAVY);
      doc.splitTextToSize(content, CONTENT_W - 6).forEach((l: string) => {
        doc.text(l, MARGIN + 6, y);
        y += 6.5;
      });
      y += 1.5;
      return;
    }

    const bullet = line.match(/^[-*•]\s+(.*)$/);
    if (bullet) {
      need(7);
      doc.setFillColor(...ORANGE);
      doc.circle(MARGIN + 2, y - 1.3, 0.9, "F");
      writeParagraph(stripBold(bullet[1]), 7);
      return;
    }

    const numbered = line.match(/^(\d+)[.)]\s+(.*)$/);
    if (numbered) {
      need(7);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(...NAVY);
      doc.text(`${numbered[1]}.`, MARGIN, y);
      writeParagraph(stripBold(numbered[2]), 8);
      return;
    }

    const isLead = /^\*\*[^*]+\*\*:?$/.test(line);
    writeParagraph(stripBold(line), 0, 10, isLead);
  });

  drawFooter();
  doc.save(`${fileName}.pdf`);
}
