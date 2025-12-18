// lib/generate-pdf.ts
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export async function generatePDF(
  ref: React.RefObject<HTMLDivElement>,
  year: number
) {
  if (!ref.current) return;
  const margin = 10;
  const canvas = await html2canvas(ref.current, {
    scale: 2,
    useCORS: true,
    scrollY: -window.scrollY,
    windowWidth: 1366, // important: fakes a large screen
  });

  const imgData = canvas.toDataURL("image/jpeg", 0.7);

  const pdf = new jsPDF("p", "mm", "a4");
  const pdfWidth = 210;
  const pdfHeight = 297;

  const imgHeight = (canvas.height * pdfWidth) / canvas.width;

  let heightLeft = imgHeight;
  let position = 0;

  pdf.addImage(
    imgData,
    "PNG",
    margin,
    position,
    pdfWidth - margin * 2,
    imgHeight
  );
  heightLeft -= pdfHeight;

  while (heightLeft > 0) {
    position -= pdfHeight;
    pdf.addPage();
    pdf.addImage(
      imgData,
      "PNG",
      margin,
      position,
      pdfWidth - margin * 2,
      imgHeight
    );
    heightLeft -= pdfHeight;
  }

  pdf.save(`expenses-report-${year}.pdf`);
}
