import jsPDF from 'jspdf';

export default function generatePdf({ data, headers, filename, additionalInfo }) {
  return new Promise((resolve, reject) => {
    const doc = new jsPDF({
      orientation: 'p', // Portrait orientation
      unit: 'pt',
      format: 'a4',
    });

    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const pageMargin = 50;
    const padding = 10; // Padding for the cells

    doc.setFontSize(12); // Default font size

    // Calculate column widths based on the number of columns
    const columnWidth = (pageWidth - 2 * pageMargin) / headers.length;

    // Define hospital name and address
    const hospitalName = 'Dev Clinic';
    const hospitalAddress = 'Sr No 145/4, Alandi Road, Pune, Maharashtra, India';

    // Draw hospital name and address
    doc.setFont('helvetica', 'bold');
    doc.text(hospitalName, pageMargin, pageMargin);
    doc.setFont('helvetica', 'normal');
    doc.text(hospitalAddress, pageMargin, pageMargin + 20);

    // Calculate position for IPD Billing Summary
    const ipdSummaryX = pageWidth / 2;
    const ipdSummaryY = pageMargin + 60; // Adjust based on hospital name and address

    // Draw IPD Billing Summary heading at the top of the page
    doc.setFont('helvetica', 'bold');
    doc.text('IPD Billing Summary', ipdSummaryX, ipdSummaryY, { align: 'center' }); // Align center
    doc.setLineWidth(0.5); // Set line width for the underline
    doc.line(pageMargin, ipdSummaryY + 5, pageWidth - pageMargin, ipdSummaryY + 5); // Draw underline

    // Draw additional information in dynamic layout
    let additionalInfoY = ipdSummaryY + 30;
    const additionalInfoPadding = 20;
    doc.setFont('helvetica', 'bold'); // Set font style to bold for additional information

    // Define additional information content
    const infoContent = [
      { label: 'Name', value: 'Rishabh Sahu' },
      { label: 'Bill No', value: '1231' },
      { label: 'IPD No', value: '3432535' },
      { label: 'DOA', value: '10/02/2024 at 10:10' },
      { label: 'DOD', value: '10/02/2024 at 10:10' }
    ];

    // Draw additional information
    infoContent.forEach(info => {
      const { label, value } = info;
      doc.text(`${label}: ${value}`, pageMargin, additionalInfoY);
      additionalInfoY += additionalInfoPadding;
    });

    // Reset font style to normal
    doc.setFont('helvetica', 'normal');

    // Adjust the position of the table
    const tableStartY = additionalInfoY + additionalInfoPadding;

    // Draw headers and lines
    const headerY = tableStartY + 20; // Adjust the header position
    headers.forEach((header, index) => {
      const xPosition = pageMargin + index * columnWidth;
      doc.setFillColor(200, 200, 200); // Set header background color
      doc.rect(xPosition, headerY, columnWidth, 20, 'F'); // Draw filled rectangle for header
      doc.text(header.label, xPosition + padding, headerY + 15); // Add padding for better alignment
      doc.setTextColor(0); // Reset text color

      // Draw borders for header cell
      doc.setLineWidth(0.5); // Set line width for the borders
      doc.line(xPosition, headerY, xPosition + columnWidth, headerY); // Top border
      doc.line(xPosition, headerY, xPosition, headerY + 20); // Left border
      doc.line(xPosition + columnWidth, headerY, xPosition + columnWidth, headerY + 20); // Right border
      doc.line(xPosition, headerY + 20, xPosition + columnWidth, headerY + 20); // Bottom border
    });

    // Draw table content and lines
    data.forEach((row, rowIndex) => {
      const yPosition = tableStartY + 40 + rowIndex * 20; // Adjust the row position
      headers.forEach((header, colIndex) => {
        const xPosition = pageMargin + colIndex * columnWidth;
        const cellContent = String(row[header.label]); // Convert cell content to string
        doc.rect(xPosition, yPosition, columnWidth, 20); // Draw cell border
        doc.text(cellContent, xPosition + padding, yPosition + 15); // Add padding for better alignment
        // Draw vertical line between cells
        if (colIndex > 0) {
          doc.line(xPosition, yPosition, xPosition, yPosition + 20);
        }
      });
      // Draw horizontal line at the bottom of the row
      doc.line(pageMargin, yPosition + 20, pageWidth - pageMargin, yPosition + 20);
    });

    // Draw total row
    const totalRowY = tableStartY + (data.length + 1) * 20; // Additional row for headers
    const totalRowHeight = 20;
    doc.setFillColor(200, 200, 200); // Set background color for total row
    doc.rect(pageMargin, totalRowY, pageWidth - 2 * pageMargin, totalRowHeight, 'F'); // Draw filled rectangle for total row
    doc.setTextColor(0); // Reset text color
    doc.setFont('helvetica', 'bold'); // Set font style to bold
    doc.text('Total', pageMargin + padding, totalRowY + totalRowHeight / 2 + 5); // Align total text to the left
    const totalValue = data.reduce((acc, curr) => acc + parseFloat(curr['Total']), 0).toFixed(2); // Assuming 'Total' is a field in the data
    doc.text(totalValue, pageWidth - pageMargin - padding - doc.getStringUnitWidth(totalValue) * doc.internal.getFontSize(), totalRowY + totalRowHeight / 2 + 5); // Align total value to the right

    // Generate blob directly
    try {
      const pdfBlob = doc.output('blob');
      resolve(pdfBlob);
    } catch (error) {
      reject(error);
    }
  });
}
