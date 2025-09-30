import React, { useState } from 'react';
import logo from '../../../assets/images/Ganapathy_metals_logo.png';

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
        amountInWords: 'TOTAL US DOLLARS EIGHTY THOUSAND SEVEN HUNDRED TWENTY SIX AND CENTS FIVE ONLY',
        accountNo: '6179015118',
        bank: 'UNITED OVERSEAS BANK MALAYSIA BERHAD',
        swiftCode: 'UOVBMYKL',
        containerNo1: '',
        containerNo2: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInvoiceData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="max-w-7xl mx-auto p-6 bg-white shadow-md">
            {/* Company Header - Matches screenshot layout */}
            <div className="mb-8">
                <div className="flex items-start justify-between w-full">
                    {/* Left Section - Logo & Company Info */}
                    <div className="flex-1">
                        <div className="flex items-center mb-2">
                            <img
                                src={logo}
                                alt="Ganapathy Metals Logo"
                                className="h-20 mr-4"
                            />
                            <div>
                                <h1 className="text-2xl font-bold text-red-600">
                                    GANAPATHY METAL SDN.BHD
                                </h1>
                                <p className="text-sm text-black font-semibold">(245597-U)</p>
                            </div>
                        </div>

                        <p className="text-green-600 font-semibold text-sm mb-1">
                            Importers / Exporters Of Non-Ferrous Metal Scrap
                        </p>

                        <div className="text-sm text-gray-800">
                            <p>
                                <span className="font-bold">Corporate Office :</span> 37, Persiaran Segambut Tengah,
                                Segambut Industrial Park, 51200 Kuala Lumpur.
                            </p>
                        </div>
                    </div>

                    {/* Right Section - Contact Info */}
                    <div className="flex-1 text-right text-sm text-gray-800">
                        <p>
                            <span className="font-bold">Tel:</span> +603-6257 7481
                        </p>
                        <p>
                            <span className="font-bold">Fax:</span> +603-6251 0086
                        </p>
                        <p>
                            <span className="font-bold">E-Mail:</span> gmetals@po.jaring.asia
                        </p>
                        <p>
                            <span className="font-bold">Web:</span> www.ganapathy.com.my
                        </p>
                    </div>
                </div>
            </div>

            {/* Invoice Title and Date */}
            <div className="flex justify-between items-center mb-8 border-b-2 border-gray-800 pb-4">
                <div className="text-center flex-1">
                    <h2 className="text-3xl font-bold">INVOICE</h2>
                </div>
                <div className="flex-1 text-right">
                    <div className="inline-block">
                        <label className="block text-sm font-medium mb-1">Date:</label>
                        <input
                            type="text"
                            name="date"
                            value={invoiceData.date}
                            onChange={handleInputChange}
                            className="w-48 p-2 border border-gray-300 rounded text-center font-semibold"
                        />
                    </div>
                </div>
            </div>

            {/* The rest of your component remains exactly the same */}
            {/* Statement */}
            <div className="mb-6">
                <div className="flex">
                    <div className="w-1/4 font-medium">Statement of</div>
                    <div className="w-3/4">
                        <input
                            type="text"
                            name="description"
                            value={invoiceData.description}
                            onChange={handleInputChange}
                            className="w-full p-1 border border-gray-300 rounded"
                        />
                    </div>
                </div>
            </div>

            {/* Vessel Details */}
            <div className="mb-6">
                <div className="flex">
                    <div className="w-1/4 font-medium">Vessel Details :</div>
                    <div className="w-1/4">
                        <input
                            type="text"
                            name="vessel"
                            value={invoiceData.vessel}
                            onChange={handleInputChange}
                            className="w-full p-1 border border-gray-300 rounded"
                        />
                    </div>
                    <div className="w-1/4 pl-4">
                        <div className="mb-1">
                            <span className="font-medium">P.O.L :</span>
                            <input
                                type="text"
                                name="pol"
                                value={invoiceData.pol}
                                onChange={handleInputChange}
                                className="w-3/4 p-1 border border-gray-300 rounded ml-2"
                            />
                        </div>
                        <div>
                            <span className="font-medium">P.O.D :</span>
                            <input
                                type="text"
                                name="pod"
                                value={invoiceData.pod}
                                onChange={handleInputChange}
                                className="w-3/4 p-1 border border-gray-300 rounded ml-2"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Buyer Details */}
            <div className="mb-6">
                <div className="flex">
                    <div className="w-1/4 font-medium">Buyer Details :</div>
                    <div className="w-3/4">
                        <input
                            type="text"
                            name="buyer"
                            value={invoiceData.buyer}
                            onChange={handleInputChange}
                            placeholder="Enter buyer details"
                            className="w-full p-1 border border-gray-300 rounded"
                        />
                    </div>
                </div>
            </div>

            {/* Contract and Invoice Numbers */}
            <div className="mb-6">
                <div className="flex">
                    <div className="w-1/4 font-medium">Our Contract No :</div>
                    <div className="w-1/4">
                        <input
                            type="text"
                            name="contractNo"
                            value={invoiceData.contractNo}
                            onChange={handleInputChange}
                            className="w-full p-1 border border-gray-300 rounded"
                        />
                    </div>
                    <div className="w-1/2 pl-4">
                        <span className="font-medium">INVOICE NO :</span>
                        <input
                            type="text"
                            name="invoiceNo"
                            value={invoiceData.invoiceNo}
                            onChange={handleInputChange}
                            className="w-3/4 p-1 border border-gray-300 rounded ml-2"
                        />
                    </div>
                </div>
            </div>

            {/* Table Section */}
            <div className="mb-6 border border-gray-300">
                <div className="flex border-b border-gray-300">
                    <div className="w-1/4 p-2 font-medium border-r border-gray-300">MARKS</div>
                    <div className="w-1/4 p-2 font-medium border-r border-gray-300">PACKAGES</div>
                    <div className="w-2/4 p-2 font-medium">PARTICULARS</div>
                    <div className="w-1/4 p-2 font-medium border-l border-gray-300">AMOUNT</div>
                </div>

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
                        <div className="mb-2">
                            <span className="mr-2">IN</span>
                            <input
                                type="text"
                                name="packages"
                                value={invoiceData.packages}
                                onChange={handleInputChange}
                                className="w-3/4 p-1 border border-gray-300 rounded"
                            />
                        </div>
                        <div>PACKAGES</div>
                    </div>
                    <div className="w-2/4 p-2 border-r border-gray-300">
                        <div className="mb-2">
                            <input
                                type="text"
                                name="description"
                                value={invoiceData.description}
                                onChange={handleInputChange}
                                className="w-full p-1 border border-gray-300 rounded"
                            />
                        </div>
                        <div className="mb-2">
                            <span className="font-medium">H.S CODE:</span>
                            <input
                                type="text"
                                name="hsCode"
                                value={invoiceData.hsCode}
                                onChange={handleInputChange}
                                className="w-3/4 p-1 border border-gray-300 rounded ml-2"
                            />
                        </div>
                        <div className="mb-2">
                            <span className="font-medium">PRICED AT USD</span>
                            <input
                                type="text"
                                name="price"
                                value={invoiceData.price}
                                onChange={handleInputChange}
                                placeholder="XXX"
                                className="w-1/4 p-1 border border-gray-300 rounded mx-2"
                            />
                            <span>/MT</span>
                        </div>
                        <div className="mb-2">
                            <input
                                type="text"
                                name="pod"
                                value={invoiceData.pod}
                                onChange={handleInputChange}
                                className="w-full p-1 border border-gray-300 rounded"
                            />
                        </div>
                        <div className="mb-2">
                            <span className="font-medium">TOTAL NET WEIGHT:</span>
                            <input
                                type="text"
                                name="totalWeight"
                                value={invoiceData.totalWeight}
                                onChange={handleInputChange}
                                placeholder="XXXX"
                                className="w-1/4 p-1 border border-gray-300 rounded mx-2"
                            />
                            <span>METRIC TONS</span>
                        </div>
                    </div>
                    <div className="w-1/4 p-2">
                        <div className="mb-4">
                            <span className="font-medium">USD</span>
                            <input
                                type="text"
                                name="amount"
                                value={invoiceData.amount}
                                onChange={handleInputChange}
                                placeholder="XXX"
                                className="w-3/4 p-1 border border-gray-300 rounded ml-2"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Amount in Words */}
            <div className="mb-6">
                <div className="flex">
                    <div className="w-1/4"></div>
                    <div className="w-3/4">
                        <textarea
                            name="amountInWords"
                            value={invoiceData.amountInWords}
                            onChange={handleInputChange}
                            rows="2"
                            className="w-full p-1 border border-gray-300 rounded"
                        />
                    </div>
                </div>
            </div>

            {/* Payment Details */}
            <div className="mb-6">
                <div className="flex">
                    <div className="w-1/4"></div>
                    <div className="w-3/4">
                        <div className="mb-2">
                            <span>DRAWN OUR INVOICE NO:</span>
                            <input
                                type="text"
                                name="invoiceNo"
                                value={invoiceData.invoiceNo}
                                onChange={handleInputChange}
                                className="w-1/2 p-1 border border-gray-300 rounded ml-2"
                            />
                        </div>
                        <div className="mb-2">
                            BY 100% CAD AGAINST ORIGINAL SHIPMENT DOCUMENTS
                        </div>
                        <div className="mb-2">
                            FOR 100% INVOICE VALUE THRU YOUR BANK UPON ARRIVAL OF CONTAINER AT FINAL DESTINATION
                        </div>
                        <div className="mb-2">
                            ESTABLISHED IN FAVOUR OF:-
                        </div>
                        <div className="mb-2 font-medium">
                            GANAPATHY METAL SDN.BHD
                        </div>
                        <div className="mb-2">
                            <span className="font-medium">USD A/C NO :</span>
                            <input
                                type="text"
                                name="accountNo"
                                value={invoiceData.accountNo}
                                onChange={handleInputChange}
                                className="w-1/2 p-1 border border-gray-300 rounded ml-2"
                            />
                        </div>
                        <div className="mb-2">
                            <span className="font-medium">BANK :</span>
                            <input
                                type="text"
                                name="bank"
                                value={invoiceData.bank}
                                onChange={handleInputChange}
                                className="w-3/4 p-1 border border-gray-300 rounded ml-2"
                            />
                        </div>
                        <div className="mb-2">
                            <span className="font-medium">SWIFT CODE :</span>
                            <input
                                type="text"
                                name="swiftCode"
                                value={invoiceData.swiftCode}
                                onChange={handleInputChange}
                                className="w-1/2 p-1 border border-gray-300 rounded ml-2"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Container Details */}
            <div className="mb-6">
                <div className="flex">
                    <div className="w-1/4"></div>
                    <div className="w-3/4">
                        <div className="mb-2">
                            SHIPMENT EFFECTED BY TWO 20DV CONTAINER'S
                        </div>
                        <div className="mb-1">
                            <span className="font-medium">NO:</span>
                            <input
                                type="text"
                                name="containerNo1"
                                value={invoiceData.containerNo1}
                                onChange={handleInputChange}
                                placeholder="XXX"
                                className="w-1/4 p-1 border border-gray-300 rounded ml-2"
                            />
                        </div>
                        <div className="mb-1">
                            <input
                                type="text"
                                name="containerNo2"
                                value={invoiceData.containerNo2}
                                onChange={handleInputChange}
                                placeholder="XXX"
                                className="w-1/4 p-1 border border-gray-300 rounded"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Final Amount */}
            <div className="mb-6">
                <div className="flex justify-end">
                    <div className="w-1/4 text-right">
                        <div className="inline-block text-right">
                            <span className="font-medium">USD</span>
                            <input
                                type="text"
                                name="amount"
                                value={invoiceData.amount}
                                onChange={handleInputChange}
                                placeholder="XXX"
                                className="w-3/4 p-1 border border-gray-300 rounded ml-2"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Signature Section */}
            <div className="flex justify-between items-end mt-12">
                <div className="w-1/3 text-center">
                    <div>for GANAPATHY METAL SDN.BHD.</div>
                </div>
                <div className="w-1/3 text-center">
                    <div className="border-t border-gray-400 pt-8 w-48 mx-auto">MANAGING DIRECTOR</div>
                </div>
            </div>
        </div>
    );
};

export default Invoice;