import { useState } from "react";
import { FiDownload, FiPrinter, FiSave } from "react-icons/fi";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import html2canvas from "html2canvas";
import logo from '../../../assets/images/Ganapathy_metals_logo.png'

const CertificateOfOriginInput = () => {
  const [formData, setFormData] = useState({
    date: "12.09.2023",
    exporter:
      "GANAPATHY METAL SDN BHD, NO: 37, PERSIARAN SEGAMBUT TENGAH, SEGAMBUT INDUSTRIAL PARK, 51200 KUALA LUMPUR, MALAYSIA.",
    consignee: "",
    notifyParty: "",
    vessel: "",
    blNo: "",
    portOfLoading: "PORT KLANG, MALAYSIA",
    dateOfDeparture: "",
    finalDestination: "NHAVA SHEVA",
    countryOfOrigin: "MALAYSIA",
    marksNumbers: "NIL",
    packagesQuantity: "",
    description: "ALUMINIUM SCRAP TREAD AS PER ISRI",
    netWeight: "",
    invoiceNo: "GMSB/FGN/2023/09/213",
    salesContractNo: "",
    containerDetails: [],
  });

  const [newContainer, setNewContainer] = useState({
    containerNo: "",
    sealNo: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleContainerChange = (e) => {
    const { name, value } = e.target;
    setNewContainer((prev) => ({ ...prev, [name]: value }));
  };

  const addContainer = () => {
    if (newContainer.containerNo && newContainer.sealNo) {
      setFormData((prev) => ({
        ...prev,
        containerDetails: [...prev.containerDetails, newContainer],
      }));
      setNewContainer({ containerNo: "", sealNo: "" });
    }
  };

  const removeContainer = (index) => {
    setFormData((prev) => ({
      ...prev,
      containerDetails: prev.containerDetails.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  const handlePdfDownload = () => {
    const doc = new jsPDF("p", "pt", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 40;
    const contentWidth = pageWidth - 2 * margin;

    // --- GOLD TOP LINE ---
    doc.setFillColor(255, 215, 0);
    doc.rect(0, 0, pageWidth, 8, "F");

    // --- LOGO AT TOP LEFT (with proper spacing) ---
    const logoWidth = 60; // Reduced width for better fit
    const logoHeight = 50; // Reduced height for better fit
    const logoX = margin;
    const logoY = 15; // Increased Y position to avoid overlap

    // Add the logo
    try {
      doc.addImage(logo, 'PNG', logoX, logoY, logoWidth, logoHeight);
    } catch (error) {
      console.warn('Logo could not be added to PDF:', error);
      // Fallback: Add company name text
      doc.setFont("times", "bold");
      doc.setFontSize(12);
      doc.setTextColor(0, 40, 80);
      doc.text("GANAPATHY METALS", logoX, logoY + 15);
    }

    // --- TITLE (adjusted position to account for logo) ---
    doc.setFont("times", "bold");
    doc.setFontSize(16);
    doc.setTextColor(0, 40, 80);

    // Calculate title position - center it but ensure it doesn't overlap with logo
    const titleY = Math.max(50, logoY + logoHeight / 2); // Ensure title is below logo
    doc.text("CERTIFICATE OF ORIGIN - MALAYSIA", pageWidth / 2, titleY, { align: "center" });

    // --- Horizontal line (adjusted position) ---
    const lineY = titleY + 20; // Increased space after title
    doc.setDrawColor(0, 40, 80);
    doc.setLineWidth(1);
    doc.line(margin, lineY, pageWidth - margin, lineY);

    // --- Form Sections: Exporter, Consignee, Notify Party ---
    const sectionRows = [
      ["EXPORTER (NAME & ADDRESS)", formData.exporter || "-"],
      ["CONSIGNEE (NAME & ADDRESS)", formData.consignee || "-"],
      ["NOTIFY PARTY (NAME & ADDRESS)", formData.notifyParty || "-"],
      ["VESSEL", formData.vessel || "-"],
      ["B/L NO", formData.blNo || "-"],
      ["PORT OF LOADING", formData.portOfLoading || "-"],
      ["DATE OF DEPARTURE", formData.dateOfDeparture || "-"],
      ["FINAL DESTINATION", formData.finalDestination || "-"],
      ["COUNTRY OF ORIGIN OF GOODS", formData.countryOfOrigin || "-"]
    ];

    // Start table further down to avoid logo area
    autoTable(doc, {
      startY: lineY + 20, // Increased space after horizontal line
      theme: "grid",
      styles: {
        fontSize: 10,
        valign: "top",
        cellPadding: 6,
        lineColor: [0, 0, 0],
        lineWidth: 0.1
      },
      columnStyles: {
        0: {
          cellWidth: 150,
          fontStyle: "bold",
          textColor: [0, 0, 0],
          fillColor: [240, 240, 240],
          halign: "left"
        },
        1: {
          cellWidth: contentWidth - 150,
          halign: "left"
        }
      },
      body: sectionRows
    });

    // --- Goods Table ---
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 20,
      theme: "grid",
      styles: {
        fontSize: 9,
        halign: "center",
        valign: "middle",
        lineColor: [150, 150, 150],
        lineWidth: 0.1
      },
      headStyles: {
        fillColor: [0, 102, 204],
        textColor: 255,
        fontStyle: "bold",
        halign: "center",
        lineWidth: 0.1
      },
      head: [["MARKS & NUMBERS", "NUMBER OF PACKAGES & QUANTITY", "DESCRIPTION OF GOODS", "NET WEIGHT", "INVOICE NO."]],
      body: [[
        formData.marksNumbers || "-",
        formData.packagesQuantity || "-",
        formData.description || "-",
        formData.netWeight || "-",
        formData.invoiceNo || "-"
      ]],
      columnStyles: {
        0: { cellWidth: 100 },
        1: { cellWidth: 100 },
        2: { cellWidth: 160, halign: "left" },
        3: { cellWidth: 80 },
        4: { cellWidth: 100 },
      }
    });

    // --- Sales Contract & Container Section ---
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 15,
      theme: "plain",
      styles: {
        fontSize: 10,
        cellPadding: 4,
        lineWidth: 0.1
      },
      body: [
        [
          {
            content: "OUR SALES CONTRACT NO:",
            styles: {
              fontStyle: "bold",
              fillColor: [240, 240, 240]
            }
          },
          formData.salesContractNo || "-"
        ],
        [
          {
            content: "CONTAINER NO. / SEAL NO:",
            styles: {
              fontStyle: "bold",
              fillColor: [240, 240, 240]
            }
          },
          formData.containerDetails.length > 0
            ? formData.containerDetails.map(c => `${c.containerNo} / ${c.sealNo}`).join(", ")
            : "-"
        ]
      ],
      columnStyles: {
        0: {
          cellWidth: 150,
          fontStyle: "bold",
          fillColor: [240, 240, 240],
          halign: "left"
        },
        1: {
          cellWidth: contentWidth - 150,
          halign: "left"
        }
      }
    });

    // --- Signature Section (Yours Faithfully) ---
    const signY = doc.lastAutoTable.finalY + 60;
    doc.setFont("times", "normal");
    doc.setFontSize(11);
    doc.text("YOURS FAITHFULLY,", margin, signY);

    doc.setFont("times", "bold");
    doc.setFontSize(12);
    doc.text("GANAPATHY METAL SDN BHD", margin, signY + 15);

    doc.setDrawColor(0, 102, 204);
    doc.setLineWidth(1);
    doc.line(margin, signY + 40, margin + 200, signY + 40);

    doc.setFont("times", "italic");
    doc.setFontSize(9);
    doc.text("MANAGING DIRECTOR", margin, signY + 55);

    // --- Footer (Right Aligned) ---
    doc.setFont("times", "italic");
    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.text(
      "This is a system-generated Certificate of Origin | Ganapathy Metal Sdn Bhd",
      pageWidth - margin,
      pageHeight - 30,
      { align: "right" }
    );

    doc.save("Certificate-of-Origin.pdf");
  };

  return (
    <div className="p-4 max-w-6xl mx-auto bg-white rounded-lg shadow-sm">
      {/* Header with Logo */}
      <div className="flex items-center justify-between mb-6 border-b pb-4">
        {/* Logo and Company Name */}
        <div className="flex items-center justify-between w-full">
          <img
            src={logo}
            alt="Ganapathy Metals Logo"
            className="h-16 w-auto ml-8"
          />
          <h1 className="text-2xl font-bold text-gray-800 text-center flex-1">
            CERTIFICATE OF ORIGIN - MALAYSIA
          </h1>
        </div>

        {/* Date */}
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700">
            DATE:
          </label>
          <span className="text-sm text-gray-800 font-medium">
            {formData.date}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-2 mb-6">
        <button className="px-4 py-2 bg-blue-50 text-blue-600 rounded text-sm font-medium flex items-center hover:bg-blue-100 transition-colors">
          <FiSave className="mr-2" /> Save
        </button>
        <button className="px-4 py-2 bg-green-50 text-green-600 rounded text-sm font-medium flex items-center hover:bg-green-100 transition-colors">
          <FiPrinter className="mr-2" /> Print
        </button>
        <button
          className="px-4 py-2 bg-purple-50 text-purple-600 rounded text-sm font-medium flex items-center hover:bg-purple-100 transition-colors"
          onClick={handlePdfDownload}
        >
          <FiDownload className="mr-2" /> PDF
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Rest of your form remains exactly the same */}
        <div className="border border-gray-300 rounded overflow-hidden">
          {/* Exporter */}
          <div className="flex border-b border-gray-300">
            <div className="w-1/4 bg-gray-100 p-3 font-medium border-r border-gray-300 flex items-start">
              EXPORTER (NAME & ADDRESS)
            </div>
            <div className="w-3/4 p-3 flex items-start">
              <span className="mr-2 mt-1">:</span>
              <textarea
                name="exporter"
                value={formData.exporter}
                onChange={handleChange}
                rows={3}
                className="w-full border-none focus:ring-0 focus:outline-none resize-none bg-transparent"
              />
            </div>
          </div>

          {/* Consignee */}
          <div className="flex border-b border-gray-300">
            <div className="w-1/4 bg-gray-100 p-3 font-medium border-r border-gray-300 flex items-start">
              CONSIGNEE (NAME & ADDRESS)
            </div>
            <div className="w-3/4 p-3 flex items-start">
              <span className="mr-2 mt-1">:</span>
              <textarea
                name="consignee"
                value={formData.consignee}
                onChange={handleChange}
                rows={2}
                className="w-full border-none focus:ring-0 focus:outline-none resize-none bg-transparent"
                placeholder="Enter consignee details"
              />
            </div>
          </div>

          {/* Notify Party */}
          <div className="flex border-b border-gray-300">
            <div className="w-1/4 bg-gray-100 p-3 font-medium border-r border-gray-300 flex items-start">
              NOTIFY PARTY (NAME & ADDRESS)
            </div>
            <div className="w-3/4 p-3 flex items-start">
              <span className="mr-2 mt-1">:</span>
              <textarea
                name="notifyParty"
                value={formData.notifyParty}
                onChange={handleChange}
                rows={2}
                className="w-full border-none focus:ring-0 focus:outline-none resize-none bg-transparent"
                placeholder="Enter notify party details"
              />
            </div>
          </div>

          {/* Vessel */}
          <div className="flex border-b border-gray-300">
            <div className="w-1/4 bg-gray-100 p-3 font-medium border-r border-gray-300 flex items-center">
              VESSEL
            </div>
            <div className="w-3/4 p-3 flex items-center">
              <span className="mr-2">:</span>
              <input
                type="text"
                name="vessel"
                value={formData.vessel}
                onChange={handleChange}
                className="w-full border-none focus:ring-0 focus:outline-none bg-transparent"
                placeholder="Enter vessel name"
              />
            </div>
          </div>

          {/* B/L No */}
          <div className="flex border-b border-gray-300">
            <div className="w-1/4 bg-gray-100 p-3 font-medium border-r border-gray-300 flex items-center">
              B/L NO
            </div>
            <div className="w-3/4 p-3 flex items-center">
              <span className="mr-2">:</span>
              <input
                type="text"
                name="blNo"
                value={formData.blNo}
                onChange={handleChange}
                className="w-full border-none focus:ring-0 focus:outline-none bg-transparent"
                placeholder="Enter B/L number"
              />
            </div>
          </div>

          {/* Port of Loading */}
          <div className="flex border-b border-gray-300">
            <div className="w-1/4 bg-gray-100 p-3 font-medium border-r border-gray-300 flex items-center">
              PORT OF LOADING
            </div>
            <div className="w-3/4 p-3 flex items-center">
              <span className="mr-2">:</span>
              <input
                type="text"
                name="portOfLoading"
                value={formData.portOfLoading}
                onChange={handleChange}
                className="w-full border-none focus:ring-0 focus:outline-none bg-transparent"
              />
            </div>
          </div>

          {/* Date of Departure */}
          <div className="flex border-b border-gray-300">
            <div className="w-1/4 bg-gray-100 p-3 font-medium border-r border-gray-300 flex items-center">
              DATE OF DEPARTURE
            </div>
            <div className="w-3/4 p-3 flex items-center">
              <span className="mr-2">:</span>
              <input
                type="text"
                name="dateOfDeparture"
                value={formData.dateOfDeparture}
                onChange={handleChange}
                className="w-full border-none focus:ring-0 focus:outline-none bg-transparent"
                placeholder="Enter departure date"
              />
            </div>
          </div>

          {/* Final Destination */}
          <div className="flex border-b border-gray-300">
            <div className="w-1/4 bg-gray-100 p-3 font-medium border-r border-gray-300 flex items-center">
              FINAL DESTINATION
            </div>
            <div className="w-3/4 p-3 flex items-center">
              <span className="mr-2">:</span>
              <input
                type="text"
                name="finalDestination"
                value={formData.finalDestination}
                onChange={handleChange}
                className="w-full border-none focus:ring-0 focus:outline-none bg-transparent"
              />
            </div>
          </div>

          {/* Country of Origin */}
          <div className="flex">
            <div className="w-1/4 bg-gray-100 p-3 font-medium border-r border-gray-300 flex items-center">
              COUNTRY OF ORIGIN OF GOODS
            </div>
            <div className="w-3/4 p-3 flex items-center">
              <span className="mr-2">:</span>
              <input
                type="text"
                name="countryOfOrigin"
                value={formData.countryOfOrigin}
                onChange={handleChange}
                className="w-full border-none focus:ring-0 focus:outline-none bg-transparent"
              />
            </div>
          </div>
        </div>

        {/* Goods Table */}
        <div className="border border-gray-300 rounded">
          {/* Table Header */}
          <div className="flex bg-gray-100 border-b border-gray-300">
            <div className="w-1/5 p-2 font-medium border-r border-gray-300 text-center text-sm">
              MARKS & NUMBERS
            </div>
            <div className="w-1/5 p-2 font-medium border-r border-gray-300 text-center text-sm">
              NUMBER OF PACKAGES & QUANTITY
            </div>
            <div className="w-2/5 p-2 font-medium border-r border-gray-300 text-center text-sm">
              DESCRIPTION OF GOODS
            </div>
            <div className="w-1/5 p-2 font-medium border-r border-gray-300 text-center text-sm">
              NET WEIGHT
            </div>
            <div className="w-1/5 p-2 font-medium text-center text-sm">
              INVOICE NO:
            </div>
          </div>

          {/* Main Row */}
          <div className="flex border-b border-gray-300">
            {/* Marks & Numbers */}
            <div className="w-1/5 p-2 border-r border-gray-300 flex items-center justify-center">
              <input
                type="text"
                name="marksNumbers"
                value={formData.marksNumbers}
                onChange={handleChange}
                className="w-full border-none focus:ring-0 focus:outline-none text-center text-sm"
              />
            </div>

            {/* Packages & Quantity */}
            <div className="w-1/5 p-2 border-r border-gray-300 flex items-center justify-center">
              <input
                type="text"
                name="packagesQuantity"
                value={formData.packagesQuantity}
                onChange={handleChange}
                className="w-full border-none focus:ring-0 focus:outline-none text-center text-sm"
                placeholder="Enter packages & quantity"
              />
            </div>

            {/* Description of Goods */}
            <div className="w-2/5 p-2 border-r border-gray-300 flex items-center justify-center">
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full border-none focus:ring-0 focus:outline-none text-center text-sm"
              />
            </div>

            {/* Net Weight */}
            <div className="w-1/5 p-2 border-r border-gray-300 flex items-center justify-center">
              <input
                type="text"
                name="netWeight"
                value={formData.netWeight}
                onChange={handleChange}
                className="w-full border-none focus:ring-0 focus:outline-none text-center text-sm"
                placeholder="Enter net weight"
              />
            </div>

            {/* Invoice No */}
            <div className="w-1/5 p-2 flex items-center justify-center">
              <input
                type="text"
                name="invoiceNo"
                value={formData.invoiceNo}
                onChange={handleChange}
                className="w-full border-none focus:ring-0 focus:outline-none text-center text-sm"
              />
            </div>
          </div>

          {/* Sales Contract Row */}
          <div className="flex border-b border-gray-300">
            <div className="w-1/5 p-2 border-r border-gray-300"></div>
            <div className="w-1/5 p-2 border-r border-gray-300"></div>
            <div className="w-2/5 p-2 border-r border-gray-300">
              <div className="flex items-center">
                <span className="font-medium mr-2 whitespace-nowrap text-xs">OUR SALES CONTRACT NO:</span>
                <input
                  type="text"
                  name="salesContractNo"
                  value={formData.salesContractNo}
                  onChange={handleChange}
                  className="flex-1 border-none focus:ring-0 focus:outline-none text-sm"
                  placeholder="Enter sales contract number"
                />
              </div>
            </div>
            <div className="w-1/5 p-2 border-r border-gray-300"></div>
            <div className="w-1/5 p-2"></div>
          </div>

          {/* Container Details Row */}
          <div className="flex">
            <div className="w-1/5 p-2 border-r border-gray-300"></div>
            <div className="w-1/5 p-2 border-r border-gray-300"></div>
            <div className="w-2/5 p-2 border-r border-gray-300">
              <div className="font-medium mb-1 text-sm">CONTAINER NO. / SEAL NO.</div>
              <div className="space-y-1">
                {formData.containerDetails.map((container, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={container.containerNo}
                      readOnly
                      className="px-2 py-1 border border-gray-300 rounded text-xs bg-gray-50 w-28"
                    />
                    <span className="text-sm">/</span>
                    <input
                      type="text"
                      value={container.sealNo}
                      readOnly
                      className="px-2 py-1 border border-gray-300 rounded text-xs bg-gray-50 w-28"
                    />
                    <button
                      type="button"
                      onClick={() => removeContainer(index)}
                      className="text-red-500 hover:text-red-700 text-xs"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    name="containerNo"
                    value={newContainer.containerNo}
                    onChange={handleContainerChange}
                    className="px-2 py-1 border border-gray-300 rounded text-xs w-28"
                    placeholder="Container No"
                  />
                  <span className="text-sm">/</span>
                  <input
                    type="text"
                    name="sealNo"
                    value={newContainer.sealNo}
                    onChange={handleContainerChange}
                    className="px-2 py-1 border border-gray-300 rounded text-xs w-28"
                    placeholder="Seal No"
                  />
                  <button
                    type="button"
                    onClick={addContainer}
                    className="px-2 py-1 bg-blue-100 text-blue-600 rounded text-xs"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
            <div className="w-1/5 p-2 border-r border-gray-300"></div>
            <div className="w-1/5 p-2"></div>
          </div>
        </div>

        {/* Signature Section */}
        <div className="text-right mt-8">
          <div className="mb-4">
            <div className="text-sm font-medium mb-2">YOURS FAITHFULLY,</div>
            <div className="text-sm font-bold">GANAPATHY METAL SDN BHD</div>
          </div>
          <div className="border-t border-gray-400 pt-8 w-48 ml-auto">
            <div className="text-sm font-medium">MANAGING DIRECTOR</div>
          </div>
        </div>

        <div className="flex justify-center space-x-3 pt-4">
          <button
            type="button"
            className="px-4 py-2 border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700"
          >
            Submit Certificate
          </button>
        </div>
      </form>
    </div>
  );
};

export default CertificateOfOriginInput;