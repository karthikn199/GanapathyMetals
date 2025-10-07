import React, { useState, useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { FiDownload, FiRotateCcw, FiSave } from "react-icons/fi";

const FormNine = () => {
    const pdfRef = useRef();

    // Main form data
    const [formData, setFormData] = useState({
        // Section 1
        exporterName: 'GANAPATHY METAL SDN BHD',
        exporterAddress: 'NO.37, PERSIARAN SEGAMBUT TENGAH, SEGAMBUT INDUSTRIAL PARK, 51200 KUALA LUMPUR, MALAYSIA.',
        contactPerson: 'MR.R. CHANDRASEGARAN',
        telephone: '603-62577481',
        fax: '603-62510086',
        wasteGenerator: 'GANAPATHY METAL SDN BHD',
        siteOfGeneration: 'NO.37, PERSIARAN SEGAMBUT TENGAH, SEGAMBUT INDUSTRIAL PARK, 51200 KUALA LUMPUR, MALAYSIA.',

        // Section 2
        importerRecycler: 'XX',
        importerContact: '',

        // Section 3
        refNo: 'SALES CONTRACT NO.: GMSB-0016/07/2023',
        movementType: 'SINGLE',

        // Section 4
        shipmentSerial: '',

        // Section 6-15
        disposer: '',
        disposerContact: '',
        disposalSite: '',
        disposerContactInfo: '',
        recoveryMethod: '',
        rCode: '',
        technology: '',
        wasteDescription: 'ALUMINIUM SCRAP TREAD AS PER ISRI',
        physicalCharacteristics: 'SOLID',
        actualQuantity: 'XXX.0KGS',
        wasteIdCode: '',
        baseNo: 'B1010',
        oecdNo: '',
        unNo: '',
        itcHs: '76020010',
        customsCode: '76020010',
        otherCode: '',
        oecdClassification: '',
        oecdNumber: '',
        packingType: '(20 PACKAGES)',
        packingDetails: 'ALUMINIUM SCRAP TREAD AS PER ISRI\n2X20DV CONTAINER\'S\nNET WT:X MT (10 PACKAGES)\nNET WT:XX MT (10 XPACKAGES)',
        unClassification: '',
        unShippingName: '',
        unIdNo: '',
        unClass: '',
        hNumber: '',
        yNumber: '',
        specialHandling: '',
        shipmentDate: '12.09.2023',

        // Exporter declaration
        declarationDate: '12.09.2023',
        declarationName: 'MS.THILAGAWATI',
    });

    // Separate state for carriers
    const [carriers, setCarriers] = useState([
        {
            id: 1,
            type: '1st Carrier',
            name: '',
            registration: '',
            contact: '',
            transport: '',
            date: '',
            signature: ''
        }
    ]);

    // Separate state for importer/recycler section
    const [importerSection, setImporterSection] = useState({
        shipmentReceived: {
            quantity: '',
            date: '',
            name: '',
            signature: ''
        },
        shipmentAtRecycler: {
            quantity: '',
            date: '',
            name: ''
        },
        recyclingDate: '',
        recyclingMethod: '',
        certificationSignature: '',
        certificationDate: '',
        specificConditions: ''
    });

    const handleInputChange = (section, field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleCarrierChange = (index, field, value) => {
        setCarriers(prev => prev.map((carrier, i) =>
            i === index ? { ...carrier, [field]: value } : carrier
        ));
    };

    const handleImporterSectionChange = (section, field, value) => {
        setImporterSection(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };

    const addCarrier = () => {
        const nextNumber = carriers.length + 1;
        const carrierTypes = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th'];
        const nextType = `${carrierTypes[nextNumber - 1] || `${nextNumber}th`} Carrier`;

        const newCarrier = {
            id: Date.now(),
            type: nextType,
            name: '',
            registration: '',
            contact: '',
            transport: '',
            date: '',
            signature: ''
        };

        setCarriers(prev => [...prev, newCarrier]);
    };

    const removeCarrier = (index) => {
        if (carriers.length > 1) {
            setCarriers(prev => prev.filter((_, i) => i !== index));
        }
    };

    const handlePDFDownload = async () => {
        const element = pdfRef.current;

        if (!element) {
            console.error('PDF reference not found');
            return;
        }

        try {
            const originalText = document.querySelector('button[onClick*="handleDownloadPDF"] span');
            if (originalText) {
                originalText.textContent = 'Generating PDF...';
            }

            // Hide buttons and interactive elements for PDF
            const buttons = element.querySelectorAll('button');
            const inputs = element.querySelectorAll('input, textarea');

            // Store original styles
            const originalStyles = {
                buttons: Array.from(buttons).map(btn => btn.style.display),
                inputs: Array.from(inputs).map(input => ({
                    border: input.style.border,
                    background: input.style.background
                }))
            };

            // Hide buttons and style inputs for PDF
            buttons.forEach(btn => {
                btn.style.display = 'none';
            });

            inputs.forEach(input => {
                input.style.border = 'none';
                input.style.background = 'transparent';
                input.style.boxShadow = 'none';
            });

            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff',
                removeContainer: true
            });

            // Restore original styles
            buttons.forEach((btn, index) => {
                btn.style.display = originalStyles.buttons[index];
            });

            inputs.forEach((input, index) => {
                input.style.border = originalStyles.inputs[index].border;
                input.style.background = originalStyles.inputs[index].background;
            });

            const imgData = canvas.toDataURL('image/png');

            // Use A4 format
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            const imgWidth = 210; // A4 width in mm
            const pageHeight = 295; // A4 height in mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            let heightLeft = imgHeight;
            let position = 0;

            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            // Add additional pages if content is too long
            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            pdf.save(`Form9-${new Date().toISOString().split('T')[0]}.pdf`);

            if (originalText) {
                originalText.textContent = 'PDF';
            }

        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Error generating PDF. Please try again.');

            const originalText = document.querySelector('button[onClick*="handleDownloadPDF"] span');
            if (originalText) {
                originalText.textContent = 'PDF';
            }
        }
    };

    // Header button handlers
    const handlePrint = () => {
        window.print();
    };

    const handleSave = () => {
        console.log('Saving form data...');
        alert('Form saved successfully!');
    };

    const handleReset = () => {
        setFormData({
            exporterName: 'GANAPATHY METAL SDN BHD',
            exporterAddress: 'NO.37, PERSIARAN SEGAMBUT TENGAH, SEGAMBUT INDUSTRIAL PARK, 51200 KUALA LUMPUR, MALAYSIA.',
            contactPerson: 'MR.R. CHANDRASEGARAN',
            telephone: '603-62577481',
            fax: '603-62510086',
            wasteGenerator: 'GANAPATHY METAL SDN BHD',
            siteOfGeneration: 'NO.37, PERSIARAN SEGAMBUT TENGAH, SEGAMBUT INDUSTRIAL PARK, 51200 KUALA LUMPUR, MALAYSIA.',
            importerRecycler: 'XX',
            importerContact: '',
            refNo: 'SALES CONTRACT NO.: GMSB-0016/07/2023',
            movementType: 'SINGLE',
            shipmentSerial: '',
            disposer: '',
            disposerContact: '',
            disposalSite: '',
            disposerContactInfo: '',
            recoveryMethod: '',
            rCode: '',
            technology: '',
            wasteDescription: 'ALUMINIUM SCRAP TREAD AS PER ISRI',
            physicalCharacteristics: 'SOLID',
            actualQuantity: 'XXX.0KGS',
            wasteIdCode: '',
            baseNo: 'B1010',
            oecdNo: '',
            unNo: '',
            itcHs: '76020010',
            customsCode: '76020010',
            otherCode: '',
            oecdClassification: '',
            oecdNumber: '',
            packingType: '(20 PACKAGES)',
            packingDetails: 'ALUMINIUM SCRAP TREAD AS PER ISRI\n2X20DV CONTAINER\'S\nNET WT:X MT (10 PACKAGES)\nNET WT:XX MT (10 XPACKAGES)',
            unClassification: '',
            unShippingName: '',
            unIdNo: '',
            unClass: '',
            hNumber: '',
            yNumber: '',
            specialHandling: '',
            shipmentDate: '12.09.2023',
            declarationDate: '12.09.2023',
            declarationName: 'MS.THILAGAWATI',
        });
        setCarriers([{
            id: 1,
            type: '1st Carrier',
            name: '',
            registration: '',
            contact: '',
            transport: '',
            date: '',
            signature: ''
        }]);
        setImporterSection({
            shipmentReceived: {
                quantity: '',
                date: '',
                name: '',
                signature: ''
            },
            shipmentAtRecycler: {
                quantity: '',
                date: '',
                name: ''
            },
            recyclingDate: '',
            recyclingMethod: '',
            certificationSignature: '',
            certificationDate: '',
            specificConditions: ''
        });
    };

    const renderTableRow = (number, description, details, fullWidth = false) => (
        <tr className="border-b border-gray-300">
            <td className="px-4 py-2 font-medium bg-gray-50 w-16 align-top">{number}</td>
            <td className="px-4 py-2 font-medium bg-gray-50 align-top w-1/3">{description}</td>
            <td className={`px-4 py-2 ${fullWidth ? 'w-full' : 'w-2/3'}`}>
                {details}
            </td>
        </tr>
    );

    const renderSubRow = (description, details) => (
        <tr className="border-b border-gray-300">
            <td className="px-4 py-2"></td>
            <td className="px-4 py-2 font-medium bg-gray-50">{description}</td>
            <td className="px-4 py-2">{details}</td>
        </tr>
    );

    const renderCarrierSection = (carrier, index) => (
        <div key={carrier.id} className="mb-1 p-4 border border-gray-300 rounded-lg bg-gray-50">
            <div className="flex justify-between items-center mb-3">
                <h4 className="font-semibold text-lg">{carrier.type} (name, address)</h4>
                <div className="flex items-center space-x-3 mt-2">
                    <button
                        type="button"
                        onClick={addCarrier}
                        className="px-4 py-1 bg-green-500 text-white text-xs font-bold rounded hover:bg-green-600 transition-colors flex items-center space-x-2"
                    >
                        <span>+</span>
                        <span>Add</span>
                    </button>

                    {carriers.length > 1 && (
                        <button
                            type="button"
                            onClick={() => removeCarrier(index)}
                            className="px-3 py-1 bg-red-500 text-white font-bold rounded hover:bg-red-600 transition-colors text-sm"
                        >
                            Remove
                        </button>
                    )}
                </div>
            </div>
            <div className="space-y-3">
                <input
                    type="text"
                    value={carrier.name}
                    onChange={(e) => handleCarrierChange(index, 'name', e.target.value)}
                    className="w-full border-b border-gray-300 focus:outline-none focus:border-blue-500 bg-transparent"
                    placeholder="Name & Address"
                />
                <input
                    type="text"
                    value={carrier.registration}
                    onChange={(e) => handleCarrierChange(index, 'registration', e.target.value)}
                    className="w-full border-b border-gray-300 focus:outline-none focus:border-blue-500 bg-transparent"
                    placeholder="Registration number"
                />
                <input
                    type="text"
                    value={carrier.contact}
                    onChange={(e) => handleCarrierChange(index, 'contact', e.target.value)}
                    className="w-full border-b border-gray-300 focus:outline-none focus:border-blue-500 bg-transparent"
                    placeholder="Tel/fax"
                />
                <input
                    type="text"
                    value={carrier.transport}
                    onChange={(e) => handleCarrierChange(index, 'transport', e.target.value)}
                    className="w-full border-b border-gray-300 focus:outline-none focus:border-blue-500 bg-transparent"
                    placeholder="Identity of Means of Transport (3)"
                />
                <input
                    type="text"
                    value={carrier.date}
                    onChange={(e) => handleCarrierChange(index, 'date', e.target.value)}
                    className="w-full border-b border-gray-300 focus:outline-none focus:border-blue-500 bg-transparent"
                    placeholder="Date of Transfer"
                />
                <input
                    type="text"
                    value={carrier.signature}
                    onChange={(e) => handleCarrierChange(index, 'signature', e.target.value)}
                    className="w-full border-b border-gray-300 focus:outline-none focus:border-blue-500 bg-transparent"
                    placeholder="Signature of Carrier's representative"
                />
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div ref={pdfRef} className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden relative">
                {/* Header with Buttons */}
                <div className="bg-blue-800 text-white p-2.5">
                    <div className="flex justify-between items-center">
                        {/* Left side - Form Title */}
                        <div className="flex-1 ml-3">
                            <div className="flex items-baseline space-x-3">
                                <h1 className="text-lg font-bold text-white-800">FORM 9</h1>
                                <p className="text-xs italic mt-1 text-white-500">
                                    [see rules 15 (5) and 16 (5)]
                                </p>
                            </div>
                            <h2 className="text-xs font-semibold text-white-700">
                                TRANSBOUNDARY MOVEMENT -- MOVEMENT DOCUMENT
                            </h2>
                        </div>

                        <div className="flex space-x-2">
                            <button className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded text-xs font-medium flex items-center hover:bg-blue-100 transition-colors">
                                <FiSave className="mr-2" /> Save
                            </button>
                            <button
                                className="px-3 py-1 bg-green-50 text-green-600 rounded text-xs font-medium flex items-center hover:bg-green-100 transition-colors"
                                onClick={handleReset}
                            >
                                <FiRotateCcw className="mr-2" /> Reset
                            </button>
                            <button
                                className="px-3 py-1 bg-purple-50 text-purple-600 rounded text-xs font-medium flex items-center hover:bg-purple-100 transition-colors"
                                onClick={handlePDFDownload}
                            >
                                <FiDownload className="mr-2" /> PDF
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Form Table */}
                <div className="p-6">
                    <table className="w-full border-collapse border border-gray-300 text-sm">
                        <tbody>
                            {/* Section 1 */}
                            {renderTableRow(
                                '1.',
                                '(i) Exporter (Name & Address)',
                                <div>
                                    <div className="font-semibold">{formData.exporterName}</div>
                                    <div className="whitespace-pre-line">{formData.exporterAddress}</div>
                                </div>
                            )}
                            {renderSubRow(
                                'Contact person',
                                <input
                                    type="text"
                                    value={formData.contactPerson}
                                    onChange={(e) => handleInputChange(null, 'contactPerson', e.target.value)}
                                    className="w-full border-b border-gray-300 focus:outline-none focus:border-blue-500 bg-transparent"
                                />
                            )}
                            {renderSubRow(
                                'Tel./Fax',
                                <div className="flex space-x-4">
                                    <input
                                        type="text"
                                        value={formData.telephone}
                                        onChange={(e) => handleInputChange(null, 'telephone', e.target.value)}
                                        className="flex-1 border-b border-gray-300 focus:outline-none focus:border-blue-500 bg-transparent"
                                        placeholder="Telephone"
                                    />
                                    <span>/</span>
                                    <input
                                        type="text"
                                        value={formData.fax}
                                        onChange={(e) => handleInputChange(null, 'fax', e.target.value)}
                                        className="flex-1 border-b border-gray-300 focus:outline-none focus:border-blue-500 bg-transparent"
                                        placeholder="Fax"
                                    />
                                </div>
                            )}
                            {renderSubRow(
                                '(ii) Waste Generator (name and address) (1)',
                                <input
                                    type="text"
                                    value={formData.wasteGenerator}
                                    onChange={(e) => handleInputChange(null, 'wasteGenerator', e.target.value)}
                                    className="w-full border-b border-gray-300 focus:outline-none focus:border-blue-500 bg-transparent"
                                />
                            )}
                            {renderSubRow(
                                'Contact person with Tel./Fax',
                                <input
                                    type="text"
                                    value={formData.contactPerson}
                                    onChange={(e) => handleInputChange(null, 'contactPerson', e.target.value)}
                                    className="w-full border-b border-gray-300 focus:outline-none focus:border-blue-500 bg-transparent"
                                />
                            )}
                            {renderSubRow(
                                'Site of generation',
                                <textarea
                                    value={formData.siteOfGeneration}
                                    onChange={(e) => handleInputChange(null, 'siteOfGeneration', e.target.value)}
                                    className="w-full border-b border-gray-300 focus:outline-none focus:border-blue-500 resize-none bg-transparent"
                                    rows="3"
                                />
                            )}

                            {/* Section 2 */}
                            {renderTableRow(
                                '2',
                                'Importer/recycler (name & address)',
                                <input
                                    type="text"
                                    value={formData.importerRecycler}
                                    onChange={(e) => handleInputChange(null, 'importerRecycler', e.target.value)}
                                    className="w-full border-b border-gray-300 focus:outline-none focus:border-blue-500 bg-transparent"
                                />
                            )}
                            {renderSubRow(
                                'Contact person with Tel./Fax',
                                <input
                                    type="text"
                                    value={formData.importerContact}
                                    onChange={(e) => handleInputChange(null, 'importerContact', e.target.value)}
                                    className="w-full border-b border-gray-300 focus:outline-none focus:border-blue-500 bg-transparent"
                                />
                            )}

                            {/* Section 3 */}
                            {renderTableRow(
                                '3.',
                                'Corresponding to applicant Ref. No.',
                                <input
                                    type="text"
                                    value={formData.refNo}
                                    onChange={(e) => handleInputChange(null, 'refNo', e.target.value)}
                                    className="w-full border-b border-gray-300 focus:outline-none focus:border-blue-500 bg-transparent"
                                />
                            )}
                            {renderSubRow(
                                'Movement subject to single /multiple',
                                <input
                                    type="text"
                                    value={formData.movementType}
                                    onChange={(e) => handleInputChange(null, 'movementType', e.target.value)}
                                    className="w-full border-b border-gray-300 focus:outline-none focus:border-blue-500 bg-transparent"
                                />
                            )}

                            {/* Section 4 */}
                            {renderTableRow(
                                '4.',
                                'Serial number of shipment',
                                <input
                                    type="text"
                                    value={formData.shipmentSerial}
                                    onChange={(e) => handleInputChange(null, 'shipmentSerial', e.target.value)}
                                    className="w-full border-b border-gray-300 focus:outline-none focus:border-blue-500 bg-transparent"
                                />
                            )}

                            {/* Section 5 - Dynamic Carriers */}
                            {renderTableRow(
                                '5',
                                'Carriers',
                                <div>
                                    {carriers.map((carrier, index) => renderCarrierSection(carrier, index))}
                                </div>
                            )}

                            {/* Section 16 */}
                            {renderTableRow(
                                '16',
                                'Actual date of shipment',
                                <input
                                    type="text"
                                    value={formData.shipmentDate}
                                    onChange={(e) => handleInputChange(null, 'shipmentDate', e.target.value)}
                                    className="w-full border-b border-gray-300 focus:outline-none focus:border-blue-500 bg-transparent"
                                />
                            )}

                            {/* Section 17 - Exporter's Declaration */}
                            {renderTableRow(
                                '17',
                                'Exporter\'s declaration:',
                                <div className="space-y-2">
                                    <p className="text-sm">
                                        I certify that the information in SI. No. 1 of 16 above is complete and correct to my best knowledge.
                                        I also certify that legally-enforceable written contractual obligation have been entered into, that
                                        any applicable insurance or other financial guarantees are in force covering the transboundary movement
                                        and that all necessary authorizations have been received from the competent authorities of the States concerned.
                                    </p>
                                    <div className="flex justify-between items-center mt-4">
                                        <span>Date: {formData.declarationDate}</span>
                                        <div className="text-right">
                                            <div className="border-t border-gray-300 mt-8 pt-2 w-48">
                                                Signature:
                                            </div>
                                            <div>Name: {formData.declarationName}</div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </tbody>
                    </table>

                    {/* Importer/Recycler Section */}
                    <div className="mt-6">
                        <div className="bg-blue-800 text-white p-2 font-bold text-sm">
                            TO BE COMPLETED BY IMPORTER/RECYCLER
                        </div>

                        <table className="w-full border-collapse border border-gray-300 text-sm mt-4">
                            <tbody>
                                {renderTableRow(
                                    '18.',
                                    'Shipment received by Importer/Recycler',
                                    <div className="space-y-1">
                                        <div className="flex items-center space-x-2">
                                            <span>Quantity received</span>
                                            <input
                                                type="text"
                                                value={importerSection.shipmentReceived.quantity}
                                                onChange={(e) => handleImporterSectionChange('shipmentReceived', 'quantity', e.target.value)}
                                                className="border-b border-gray-300 focus:outline-none focus:border-blue-500 w-24 bg-transparent"
                                                placeholder="Kg/liters"
                                            />
                                        </div>
                                        <div className="flex space-x-3">
                                            <input
                                                type="text"
                                                value={importerSection.shipmentReceived.date}
                                                onChange={(e) => handleImporterSectionChange('shipmentReceived', 'date', e.target.value)}
                                                className="border-b border-gray-300 focus:outline-none focus:border-blue-500 bg-transparent"
                                                placeholder="Date"
                                            />
                                            <input
                                                type="text"
                                                value={importerSection.shipmentReceived.name}
                                                onChange={(e) => handleImporterSectionChange('shipmentReceived', 'name', e.target.value)}
                                                className="border-b border-gray-300 focus:outline-none focus:border-blue-500 bg-transparent"
                                                placeholder="Name"
                                            />
                                            <input
                                                type="text"
                                                value={importerSection.shipmentReceived.signature}
                                                onChange={(e) => handleImporterSectionChange('shipmentReceived', 'signature', e.target.value)}
                                                className="border-b border-gray-300 focus:outline-none focus:border-blue-500 bg-transparent"
                                                placeholder="Signature"
                                            />
                                        </div>
                                    </div>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Notes Section */}
                    <div className="mt-6 text-xs text-gray-600">
                        <p><strong>Notes:</strong> (1) Attach list, if more than one; (2) Enter X in appropriate box; (3) See codes on the reverse (x) Immediately contact Competent Authority; (4) if more than three carriers, attach information as required in SL. No. 5.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FormNine;