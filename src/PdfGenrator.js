import React, { useState } from "react";
import generatePdf from "./generatePdf"; // Assuming you've placed the generatePdf function in a separate file

const PdfGenerator = ({ tableData }) => {
  const [pdfDataUri, setPdfDataUri] = useState("");

  const generatePdf1 = () => {
    console.log("Runned");
    const data = [
      { Name: "John Doe", Age: 30, Country: "USA" },
      { Name: "Jane Smith", Age: 25, Country: "Canada" },
      { Name: "Bob Johnson", Age: 40, Country: "UK" },
    ];

    const headers = [{ label: "Name" }, { label: "Age" }, { label: "Country" }];
    const filename = "generated.pdf";

    generatePdf({ data, headers, filename })
      .then((pdfBlob) => {
        console.log('ggg',pdfBlob);
        setPdfDataUri(URL.createObjectURL(pdfBlob));
        sendPdfToServer(pdfBlob);
      })
      .catch((error) => {
        console.error("Error generating PDF:", error);
      });
  };

  const sendPdfToServer = (pdfBlob) => {

    const formData = new FormData();
    formData.append("pdfFile", pdfBlob, "generated.pdf");

    fetch("https://testap.com/files", {
      headers: {
        Authorization:
          "Bearer eyJWF0IjIn0.UZCi-gRx2UF3etQRcvZ8MrZB5m7Fmv8qKHW40l34CHo",
      },
      method: "POST",
      body: formData,
    })
      .then((response) => {
        console.log("PDF sent to server:", response);
      })
      .catch((error) => {
        console.error("Error sending PDF to server:", error);
      });
  };

  return (
    <div>
      <button onClick={generatePdf1}>Generate PDF</button>
      {pdfDataUri && (
        <a href={pdfDataUri} download="generated.pdf">
          Download PDF
        </a>
      )}
    </div>
  );
};

export default PdfGenerator;
