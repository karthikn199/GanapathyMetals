import React, { useState, useRef } from 'react';
import logo from '../../../assets/images/Ganapathy_metals_logo.png';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const Invoice = () => {
    // State for form fields
    const [invoiceData, setInvoiceData] = useState({
        date: '12TH SEPTEMBER 2023',
        vessel: 'UAFL LIBERTY V.6102',
        pol: 'PORT KLANG, MALAYSIA',
        pod: 'CIF NHAVASHEVA, INDIA',
        buyer: '',
        contractNo: 'GMSB-0016/07/2023',
        invoiceNo: 'GMSB/FGN/2023/09/213',
        marks: 'NIL',
        packages: '20',
        description: 'XXX METRIC TONS OF ALUMINIUM SCRAP TREAD AS PER ISRI',
        hsCode: '76020010',
        price: '',
        totalWeight: '',
        amount: '',
        amountInWords: 'TOTAL US DOLLARS EIGHTY THOUSAND SEVEN HUNDRED TWENTY SIX AND CENTS FIVE ONLY.',
        accountNo: '6179015118',
        bank: 'UNITED OVERSEAS BANK MALAYSIA BERHAD',
        swiftCode: 'UOVBMYKL',
        containerNo1: '',
        containerNo2: '',
    });

    const invoiceRef = useRef();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInvoiceData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePdfDownload = async () => {
        const input = invoiceRef.current;

        // Hide the PDF button during capture
        const pdfButton = document.querySelector('.pdf-button');
        if (pdfButton) pdfButton.style.display = 'none';

        try {
            // Capture the invoice as canvas without touching original DOM
            const canvas = await html2canvas(input, {
                scale: 2,
                useCORS: true,
                logging: false,
                scrollX: 0,
                scrollY: 0,
                backgroundColor: '#ffffff',
                onclone: (clonedDoc) => {
                    // Apply style adjustments only to the cloned copy
                    const clonedInput = clonedDoc.querySelector('.invoice-content');

                    if (clonedInput) {
                        clonedInput.style.width = '210mm';
                        clonedInput.style.margin = '0 auto';
                        clonedInput.style.padding = '10px';
                        clonedInput.style.maxWidth = 'none';
                        clonedInput.style.boxSizing = 'border-box';
                    }

                    // Fix containers
                    const containers = clonedDoc.querySelectorAll('.max-w-4xl, .invoice-content');
                    containers.forEach(container => {
                        container.style.width = '100%';
                        container.style.margin = '0';
                        container.style.padding = '10px';
                        container.style.maxWidth = 'none';
                        container.style.boxSizing = 'border-box';
                    });

                    // Make inputs/textarea render as plain text
                    const fields = clonedDoc.querySelectorAll('input, textarea');
                    fields.forEach(f => {
                        f.style.border = 'none';
                        f.style.background = 'transparent';
                        f.style.boxShadow = 'none';
                        f.style.padding = '0';
                        f.style.margin = '0';
                        f.style.outline = 'none';
                        f.style.width = 'auto';
                        f.style.display = 'inline-block';
                    });

                    // Hide PDF button in clone
                    const clonedPdfButton = clonedDoc.querySelector('.pdf-button');
                    if (clonedPdfButton) clonedPdfButton.style.display = 'none';
                }
            });

            // Restore PDF button
            if (pdfButton) pdfButton.style.display = 'flex';

            const imgData = canvas.toDataURL('image/png', 1.0);

            // Create PDF with proper alignment
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pageWidth = pdf.internal.pageSize.getWidth();
            const margin = 5;
            const imgWidth = pageWidth - (margin * 2);
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', margin, margin, imgWidth, imgHeight);
            pdf.save(`invoice-${invoiceData.invoiceNo || 'document'}.pdf`);
        } catch (error) {
            console.error('Error generating PDF:', error);
            if (pdfButton) pdfButton.style.display = 'flex';
        }
    };

    return (
        <div className="max-w-5xl mx-auto p-6 bg-white shadow-md">
            {/* PDF Download Button */}
            <div className="flex justify-end mb-4">
                <button
                    onClick={handlePdfDownload}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1 px-4 rounded-lg shadow-md transition duration-200 flex items-center"
                >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    PDF
                </button>
            </div>

            {/* Invoice Content */}
            <div ref={invoiceRef} className="invoice-content">
                {/* Company Header - Matches screenshot layout */}
                <div className="mb-8 w-full">
                    {/* Header Row */}
                    <div className="flex items-center justify-center relative">
                        {/* Logo on Left */}
                        <img
                            src={logo}
                            alt="Ganapathy Metals Logo"
                            className="h-32 w-32 absolute left-0"
                        />
                        {/* Company Info Centered */}
                        <div className="text-center">
                            <h1 className="text-2xl font-bold text-red-600 inline-block">
                                GANAPATHY METAL SDN.BHD
                            </h1>
                            <span className="text-sm text-black font-semibold ml-2">(245597-U)</span>

                            <p className="text-green-600 font-semibold text-sm mt-1">
                                Importers / Exporters Of Non-Ferrous Metal Scrap
                            </p>

                            <p className="text-sm text-gray-800 mt-1">
                                <span className="font-bold">Corporate Office :</span> 37, Persiaran Segambut Tengah, Segambut
                                Industrial Park, 51200 Kuala Lumpur.
                            </p>

                            <p className="text-sm text-gray-800 mt-1">
                                <span className="font-bold">Tel:</span> +603-6257 7481{" "}
                                <span className="font-bold ml-3">Fax:</span> +603-6251 0086{" "}
                                <span className="font-bold ml-3">E-Mail:</span> gmetals@po.jaring.asia{" "}
                                <span className="font-bold ml-3">Web:</span> www.ganapathy.com.my
                            </p>
                        </div>
                    </div>
                </div>

                {/* Invoice Title and Date */}
                <div className="relative flex items-center mb-8 border-b-2 border-gray-800 pb-4">
                    {/* INVOICE Centered */}
                    <div className="w-full text-center">
                        <h2 className="text-2xl font-bold text-blue-900">INVOICE</h2>
                    </div>

                    <div className="absolute right-0">
                        <div className="flex items-center space-x-2">
                            <label className="text-sm font-semibold">Date:</label>
                            <input
                                type="text"
                                name="date"
                                value={invoiceData.date}
                                onChange={handleInputChange}
                                className="w-44 p-2 border border-gray-300 rounded text-center font-semibold text-sm"
                            />
                        </div>
                    </div>
                </div>

                {/* Statement */}
                <div className="mb-4 flex items-center">
                    <div className="w-40 font-medium whitespace-nowrap">Statement of :</div>
                    <input
                        type="text"
                        name="description"
                        value={invoiceData.description}
                        onChange={handleInputChange}
                        className="flex-1 p-2 border border-gray-300 rounded"
                    />
                </div>

                {/* Vessel Details */}
                <div className="mb-4 flex items-center">
                    <div className="w-56 font-medium whitespace-nowrap">Vessel Details :</div>
                    <input
                        type="text"
                        name="vessel"
                        value={invoiceData.vessel}
                        onChange={handleInputChange}
                        className="w-80 p-2 border border-gray-300 rounded mr-8"
                    />
                    <div className="flex-1 flex space-x-8">
                        <div className="flex items-center">
                            <span className="w-16 font-medium whitespace-nowrap">P.O.L :</span>
                            <input
                                type="text"
                                name="pol"
                                value={invoiceData.pol}
                                onChange={handleInputChange}
                                className="flex-1 p-2 border border-gray-300 rounded"
                            />
                        </div>
                        <div className="flex items-center">
                            <span className="w-16 font-medium whitespace-nowrap">P.O.D :</span>
                            <input
                                type="text"
                                name="pod"
                                value={invoiceData.pod}
                                onChange={handleInputChange}
                                className="flex-1 p-2 border border-gray-300 rounded"
                            />
                        </div>
                    </div>
                </div>

                {/* Buyer Details */}
                <div className="mb-4 flex items-center">
                    <div className="w-40 font-medium whitespace-nowrap">Buyer Details :</div>
                    <input
                        type="text"
                        name="buyer"
                        value={invoiceData.buyer}
                        onChange={handleInputChange}
                        placeholder="Enter buyer details"
                        className="flex-1 p-2 border border-gray-300 rounded"
                    />
                </div>

                {/* Contract and Invoice Numbers */}
                <div className="mb-6 flex items-center">
                    <div className="w-40 font-medium whitespace-nowrap">Our Contract No :</div>
                    <input
                        type="text"
                        name="contractNo"
                        value={invoiceData.contractNo}
                        onChange={handleInputChange}
                        className="w-80 p-2 border border-gray-300 rounded mr-8"
                    />
                    <div className="flex-1 flex items-center">
                        <span className="w-32 font-medium whitespace-nowrap">INVOICE NO :</span>
                        <input
                            type="text"
                            name="invoiceNo"
                            value={invoiceData.invoiceNo}
                            onChange={handleInputChange}
                            className="flex-1 p-2 border border-gray-300 rounded"
                        />
                    </div>
                </div>

                {/* Table Section */}
                <div className="mb-6 border border-gray-300">
                    {/* Table Header */}
                    <div className="flex border-b border-gray-300">
                        <div className="w-1/4 p-2 font-medium border-r border-gray-300">MARKS</div>
                        <div className="w-1/4 p-2 font-medium border-r border-gray-300">PACKAGES</div>
                        <div className="w-2/4 p-2 font-medium border-r border-gray-300">PARTICULARS</div>
                        <div className="w-1/4 p-2 font-medium">AMOUNT</div>
                    </div>

                    {/* Table Row 1 */}
                    <div className="flex border-b border-gray-300">
                        <div className="w-1/4 p-2 border-r border-gray-300">
                            <input
                                type="text"
                                name="marks"
                                value={invoiceData.marks}
                                onChange={handleInputChange}
                                className="w-full p-1 border border-gray-300 rounded"
                            />
                        </div>
                        <div className="w-1/4 p-2 border-r border-gray-300">
                            <div className="flex items-center mb-1">
                                <span className="mr-2">IN</span>
                                <input
                                    type="text"
                                    name="packages"
                                    value={invoiceData.packages}
                                    onChange={handleInputChange}
                                    className="w-16 p-1 border border-gray-300 rounded"
                                />
                            </div>
                            <div className="text-sm">PACKAGES</div>
                        </div>
                        <div className="w-2/4 p-2 border-r border-gray-300">
                            <input
                                type="text"
                                name="description"
                                value={invoiceData.description}
                                onChange={handleInputChange}
                                className="w-full p-1 border border-gray-300 rounded mb-2"
                            />
                        </div>
                        <div className="w-1/4 p-2">
                            <div className="flex items-center">
                                <span className="font-medium mr-1">USD</span>
                                <input
                                    type="text"
                                    name="amount"
                                    value={invoiceData.amount}
                                    onChange={handleInputChange}
                                    placeholder="XXX"
                                    className="w-20 p-1 border border-gray-300 rounded"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Table Row 2 */}
                    <div className="flex border-b border-gray-300">
                        <div className="w-1/4 p-2 border-r border-gray-300"></div>
                        <div className="w-1/4 p-2 border-r border-gray-300"></div>
                        <div className="w-2/4 p-2 border-r border-gray-300">
                            <div className="mb-1">
                                <span className="font-medium">H.S CODE:</span>
                                <input
                                    type="text"
                                    name="hsCode"
                                    value={invoiceData.hsCode}
                                    onChange={handleInputChange}
                                    className="w-32 p-1 border border-gray-300 rounded ml-2"
                                />
                            </div>
                            <div className="mb-1">
                                <span className="font-medium">PRICED AT USD</span>
                                <input
                                    type="text"
                                    name="price"
                                    value={invoiceData.price}
                                    onChange={handleInputChange}
                                    placeholder="XXX"
                                    className="w-16 p-1 border border-gray-300 rounded mx-1"
                                />
                                <span>/MT</span>
                            </div>
                            <div className="mb-1">
                                <input
                                    type="text"
                                    name="pod"
                                    value={invoiceData.pod}
                                    onChange={handleInputChange}
                                    className="w-full p-1 border border-gray-300 rounded"
                                />
                            </div>
                        </div>
                        <div className="w-1/4 p-2"></div>
                    </div>

                    {/* Table Row 3 */}
                    <div className="flex border-b border-gray-300">
                        <div className="w-1/4 p-2 border-r border-gray-300"></div>
                        <div className="w-1/4 p-2 border-r border-gray-300"></div>
                        <div className="w-2/4 p-2 border-r border-gray-300">
                            <div className="mb-1">
                                <span className="font-medium">TOTAL NET WEIGHT:</span>
                                <input
                                    type="text"
                                    name="totalWeight"
                                    value={invoiceData.totalWeight}
                                    onChange={handleInputChange}
                                    placeholder="XXXX"
                                    className="w-20 p-1 border border-gray-300 rounded mx-2"
                                />
                                <span>METRIC TONS</span>
                            </div>
                        </div>
                        <div className="w-1/4 p-2"></div>
                    </div>

                    {/* Table Row 4 - Amount in Words */}
                    <div className="flex border-b border-gray-300">
                        <div className="w-1/4 p-2 border-r border-gray-300"></div>
                        <div className="w-1/4 p-2 border-r border-gray-300"></div>
                        <div className="w-2/4 p-2 border-r border-gray-300">
                            <textarea
                                name="amountInWords"
                                value={invoiceData.amountInWords}
                                onChange={handleInputChange}
                                rows="2"
                                className="w-full p-1 border border-gray-300 rounded text-sm"
                            />
                        </div>
                        <div className="w-1/4 p-2"></div>
                    </div>

                    {/* Table Row 5 - Payment Details */}
                    <div className="flex border-b border-gray-300">
                        <div className="w-1/4 p-2 border-r border-gray-300"></div>
                        <div className="w-1/4 p-2 border-r border-gray-300"></div>
                        <div className="w-2/4 p-2 border-r border-gray-300">
                            <div className="mb-1 text-sm">
                                <span className="font-medium">DRAWN OUR INVOICE NO:</span>
                                <input
                                    type="text"
                                    name="invoiceNo"
                                    value={invoiceData.invoiceNo}
                                    onChange={handleInputChange}
                                    className="w-44 p-1 border border-gray-300 rounded ml-2"
                                />
                            </div>
                            <div className="mb-1 text-sm">
                                BY 100% CAD AGAINST ORIGINAL SHIPMENT DOCUMENTS
                            </div>
                            <div className="mb-1 text-sm">
                                FOR 100% INVOICE VALUE THRU YOUR BANK UPON ARRIVAL OF CONTAINER AT FINAL DESTINATION
                            </div>
                            <div className="mb-1 text-sm">
                                ESTABLISHED IN FAVOUR OF:-
                            </div>
                            <div className="mb-1 font-medium text-sm">
                                GANAPATHY METAL SDN.BHD
                            </div>
                            <div className="mb-1 text-sm">
                                <span className="font-medium">USD A/C NO :</span>
                                <input
                                    type="text"
                                    name="accountNo"
                                    value={invoiceData.accountNo}
                                    onChange={handleInputChange}
                                    className="w-32 p-1 border border-gray-300 rounded ml-4"
                                />
                            </div>
                            <div className="mb-1 text-sm">
                                <span className="font-medium">BANK : </span>
                                <input
                                    type="text"
                                    name="bank"
                                    value={invoiceData.bank}
                                    onChange={handleInputChange}
                                    className="w-64 p-1 border border-gray-300 rounded ml-14"
                                />
                            </div>
                            <div className="mb-1 text-xs">
                                <span className="font-medium text-sm">SWIFT CODE :</span>
                                <input
                                    type="text"
                                    name="swiftCode"
                                    value={invoiceData.swiftCode}
                                    onChange={handleInputChange}
                                    className="w-24 p-0.5 border border-gray-300 rounded ml-4"
                                />
                            </div>
                        </div>
                        <div className="w-1/4 p-2"></div>
                    </div>

                    {/* Table Row 6 - Container Details */}
                    <div className="flex">
                        <div className="w-1/4 p-2 border-r border-gray-300"></div>
                        <div className="w-1/4 p-2 border-r border-gray-300"></div>
                        <div className="w-2/4 p-2 border-r border-gray-300">
                            <div className="mb-1 text-sm">
                                SHIPMENT EFFECTED BY TWO 20DV CONTAINER'S
                            </div>
                            <div className="mb-1 text-sm">
                                <span className="font-medium text-sm">NO:</span>
                                <input
                                    type="text"
                                    name="containerNo1"
                                    value={invoiceData.containerNo1}
                                    onChange={handleInputChange}
                                    placeholder="XXX"
                                    className="w-20 p-1 text-sm border border-gray-300 rounded ml-2"
                                />
                            </div>
                            <div className="mb-1 text-sm ml-8">
                                <input
                                    type="text"
                                    name="containerNo2"
                                    value={invoiceData.containerNo2}
                                    onChange={handleInputChange}
                                    placeholder="XXX"
                                    className="w-20 p-1 text-sm border border-gray-300 rounded"
                                />
                            </div>
                        </div>
                        <div className="w-1/4 p-2"></div>
                    </div>
                    <div className="flex">
                        <div className="w-1/4 p-2 border-r border-gray-300"></div>
                        <div className="w-1/4 p-2 border-r border-gray-300"></div>
                        <div className="w-2/4 p-2 border-r border-gray-300"></div>
                        <div className="w-1/4 p-2">
                            <div className="mb-2 flex justify-end">
                                <div className="flex items-center">
                                    <span className="font-medium text-sm mr-2">USD</span>
                                    <input
                                        type="text"
                                        name="amount"
                                        value={invoiceData.amount}
                                        onChange={handleInputChange}
                                        placeholder="XXX"
                                        className="w-24 p-1 text-sm border border-gray-300 rounded"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Signature Section */}
                <div className="flex justify-end mt-12">
                    <div className="text-right">
                        <div className="mb-12">for GANAPATHY METAL SDN.BHD.</div>
                        <div className="w-48 ml-auto border-t border-gray-400 mt-2">
                            MANAGING DIRECTOR
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Invoice;