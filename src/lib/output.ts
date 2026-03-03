import { jsPDF } from "jspdf";

export function generatePDF(text: string): Buffer {
  const doc = new jsPDF();
  const lines = doc.splitTextToSize(text, 180);
  let y = 20;
  const lineHeight = 7;

  for (const line of lines) {
    if (y > 275) {
      doc.addPage();
      y = 20;
    }
    doc.text(line, 15, y);
    y += lineHeight;
  }

  const arr = doc.output("arraybuffer") as ArrayBuffer;
  return Buffer.from(arr);
}

export function generateTextFile(text: string): Buffer {
  return Buffer.from(text, "utf-8");
}
