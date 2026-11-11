import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export function exportBudgetPdf(project, items, total) {
  const doc = new jsPDF();

  doc.setFontSize(20);
  doc.text('Budget', 14, 20);

  doc.setFontSize(12);
  doc.text(`Project: ${project.title}`, 14, 32);
  doc.text(`Client: ${project.client_name}`, 14, 40);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 48);

  autoTable(doc, {
    startY: 56,
    head: [['Description', 'Qty', 'Unit price', 'Line total']],
    body: items.map((item) => [
      item.description,
      item.quantity,
      Number(item.unit_price).toFixed(2),
      Number(item.line_total).toFixed(2),
    ]),
  });

  const y = doc.lastAutoTable.finalY + 12;
  doc.setFontSize(14);
  doc.text(`Total: ${total.toFixed(2)}`, 14, y);

  doc.save(`budget-${project.title}.pdf`);
}