import { useState } from "react";
import { FiDownload, FiPrinter, FiSave } from "react-icons/fi";

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

  return (
    <div className="p-4 max-w-4xl mx-auto bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          CERTIFICATE OF ORIGIN MALAYSIA
        </h1>
        <div className="text-right">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            DATE:
          </label>
          <input
            type="text"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="text-sm border-none bg-transparent text-right focus:ring-0 focus:outline-none"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-2 mb-4">
        <button className="px-3 py-1 bg-blue-50 text-blue-600 rounded text-sm font-medium flex items-center">
          <FiSave className="mr-1" /> Save
        </button>
        <button className="px-3 py-1 bg-green-50 text-green-600 rounded text-sm font-medium flex items-center">
          <FiPrinter className="mr-1" /> Print
        </button>
        <button className="px-3 py-1 bg-purple-50 text-purple-600 rounded text-sm font-medium flex items-center">
          <FiDownload className="mr-1" /> PDF
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Document-style table layout */}
        <div className="border border-gray-300 rounded">
          {/* Exporter */}
          <div className="flex border-b border-gray-300">
            <div className="w-1/4 bg-gray-100 p-2 font-medium border-r border-gray-300">
              EXPORTER (NAME & ADDRESS)
            </div>
            <div className="w-3/4 p-2">
              <span className="mr-2">:</span>
              <textarea
                name="exporter"
                value={formData.exporter}
                onChange={handleChange}
                rows={3}
                className="w-full border-none focus:ring-0 focus:outline-none resize-none"
              />
            </div>
          </div>

          {/* Consignee */}
          <div className="flex border-b border-gray-300">
            <div className="w-1/4 bg-gray-100 p-2 font-medium border-r border-gray-300">
              CONSIGNEE (NAME & ADDRESS)
            </div>
            <div className="w-3/4 p-2">
              <span className="mr-2">:</span>
              <textarea
                name="consignee"
                value={formData.consignee}
                onChange={handleChange}
                rows={2}
                className="w-full border-none focus:ring-0 focus:outline-none resize-none"
                placeholder="Enter consignee details"
              />
            </div>
          </div>

          {/* Notify Party */}
          <div className="flex border-b border-gray-300">
            <div className="w-1/4 bg-gray-100 p-2 font-medium border-r border-gray-300">
              NOTIFY PARTY (NAME & ADDRESS)
            </div>
            <div className="w-3/4 p-2">
              <span className="mr-2">:</span>
              <textarea
                name="notifyParty"
                value={formData.notifyParty}
                onChange={handleChange}
                rows={2}
                className="w-full border-none focus:ring-0 focus:outline-none resize-none"
                placeholder="Enter notify party details"
              />
            </div>
          </div>

          {/* Vessel */}
          <div className="flex border-b border-gray-300">
            <div className="w-1/4 bg-gray-100 p-2 font-medium border-r border-gray-300">
              VESSEL
            </div>
            <div className="w-3/4 p-2">
              <span className="mr-2">:</span>
              <input
                type="text"
                name="vessel"
                value={formData.vessel}
                onChange={handleChange}
                className="w-full border-none focus:ring-0 focus:outline-none"
                placeholder="Enter vessel name"
              />
            </div>
          </div>

          {/* B/L No */}
          <div className="flex border-b border-gray-300">
            <div className="w-1/4 bg-gray-100 p-2 font-medium border-r border-gray-300">
              B/L NO
            </div>
            <div className="w-3/4 p-2">
              <span className="mr-2">:</span>
              <input
                type="text"
                name="blNo"
                value={formData.blNo}
                onChange={handleChange}
                className="w-full border-none focus:ring-0 focus:outline-none"
                placeholder="Enter B/L number"
              />
            </div>
          </div>

          {/* Port of Loading */}
          <div className="flex border-b border-gray-300">
            <div className="w-1/4 bg-gray-100 p-2 font-medium border-r border-gray-300">
              PORT OF LOADING
            </div>
            <div className="w-3/4 p-2">
              <span className="mr-2">:</span>
              <input
                type="text"
                name="portOfLoading"
                value={formData.portOfLoading}
                onChange={handleChange}
                className="w-full border-none focus:ring-0 focus:outline-none"
              />
            </div>
          </div>

          {/* Date of Departure */}
          <div className="flex border-b border-gray-300">
            <div className="w-1/4 bg-gray-100 p-2 font-medium border-r border-gray-300">
              DATE OF DEPARTURE
            </div>
            <div className="w-3/4 p-2">
              <span className="mr-2">:</span>
              <input
                type="text"
                name="dateOfDeparture"
                value={formData.dateOfDeparture}
                onChange={handleChange}
                className="w-full border-none focus:ring-0 focus:outline-none"
                placeholder="Enter departure date"
              />
            </div>
          </div>

          {/* Final Destination */}
          <div className="flex border-b border-gray-300">
            <div className="w-1/4 bg-gray-100 p-2 font-medium border-r border-gray-300">
              FINAL DESTINATION
            </div>
            <div className="w-3/4 p-2">
              <span className="mr-2">:</span>
              <input
                type="text"
                name="finalDestination"
                value={formData.finalDestination}
                onChange={handleChange}
                className="w-full border-none focus:ring-0 focus:outline-none"
              />
            </div>
          </div>

          {/* Country of Origin */}
          <div className="flex border-b border-gray-300">
            <div className="w-1/4 bg-gray-100 p-2 font-medium border-r border-gray-300">
              COUNTRY OF ORIGIN OF GOODS
            </div>
            <div className="w-3/4 p-2">
              <span className="mr-2">:</span>
              <input
                type="text"
                name="countryOfOrigin"
                value={formData.countryOfOrigin}
                onChange={handleChange}
                className="w-full border-none focus:ring-0 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Goods Table */}
        <div className="border border-gray-300 rounded">
          {/* Table Header */}
          <div className="flex bg-gray-100 border-b border-gray-300">
            <div className="w-1/4 p-2 font-medium border-r border-gray-300 text-center">
              MARKS & NUMBERS
            </div>
            <div className="w-1/4 p-2 font-medium border-r border-gray-300 text-center">
              NUMBER OF PACKAGES & QUANTITY
            </div>
            <div className="w-1/4 p-2 font-medium border-r border-gray-300 text-center">
              DESCRIPTION OF GOODS
            </div>
            <div className="w-1/4 p-2 font-medium text-center">
              NET WEIGHT
            </div>
          </div>

          {/* Table Content */}
          <div className="flex border-b border-gray-300">
            <div className="w-1/4 p-2 border-r border-gray-300">
              <input
                type="text"
                name="marksNumbers"
                value={formData.marksNumbers}
                onChange={handleChange}
                className="w-full border-none focus:ring-0 focus:outline-none text-center"
              />
            </div>
            <div className="w-1/4 p-2 border-r border-gray-300">
              <input
                type="text"
                name="packagesQuantity"
                value={formData.packagesQuantity}
                onChange={handleChange}
                className="w-full border-none focus:ring-0 focus:outline-none text-center"
                placeholder="Enter packages & quantity"
              />
            </div>
            <div className="w-1/4 p-2 border-r border-gray-300">
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full border-none focus:ring-0 focus:outline-none text-center"
              />
            </div>
            <div className="w-1/4 p-2">
              <input
                type="text"
                name="netWeight"
                value={formData.netWeight}
                onChange={handleChange}
                className="w-full border-none focus:ring-0 focus:outline-none text-center"
                placeholder="Enter net weight"
              />
            </div>
          </div>

          {/* Invoice No */}
          <div className="flex border-b border-gray-300">
            <div className="w-3/4 p-2 border-r border-gray-300">
              <div className="flex items-center">
                <span className="font-medium mr-2">INVOICE NO:</span>
                <input
                  type="text"
                  name="invoiceNo"
                  value={formData.invoiceNo}
                  onChange={handleChange}
                  className="flex-1 border-none focus:ring-0 focus:outline-none"
                />
              </div>
            </div>
            <div className="w-1/4 p-2"></div>
          </div>

          {/* Sales Contract No */}
          <div className="flex border-b border-gray-300">
            <div className="w-3/4 p-2 border-r border-gray-300">
              <div className="flex items-center">
                <span className="font-medium mr-2">OUR SALES CONTRACT NO:</span>
                <input
                  type="text"
                  name="salesContractNo"
                  value={formData.salesContractNo}
                  onChange={handleChange}
                  className="flex-1 border-none focus:ring-0 focus:outline-none"
                  placeholder="Enter sales contract number"
                />
              </div>
            </div>
            <div className="w-1/4 p-2"></div>
          </div>

          {/* Container Details */}
          <div className="flex">
            <div className="w-3/4 p-2 border-r border-gray-300">
              <div className="font-medium mb-2">CONTAINER NO. / SEAL NO.</div>
              <div className="space-y-2">
                {formData.containerDetails.map((container, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={container.containerNo}
                      readOnly
                      className="px-2 py-1 border border-gray-300 rounded text-sm bg-gray-50"
                    />
                    <span>/</span>
                    <input
                      type="text"
                      value={container.sealNo}
                      readOnly
                      className="px-2 py-1 border border-gray-300 rounded text-sm bg-gray-50"
                    />
                    <button
                      type="button"
                      onClick={() => removeContainer(index)}
                      className="text-red-500 hover:text-red-700 text-sm"
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
                    className="px-2 py-1 border border-gray-300 rounded text-sm"
                    placeholder="Container No"
                  />
                  <span>/</span>
                  <input
                    type="text"
                    name="sealNo"
                    value={newContainer.sealNo}
                    onChange={handleContainerChange}
                    className="px-2 py-1 border border-gray-300 rounded text-sm"
                    placeholder="Seal No"
                  />
                  <button
                    type="button"
                    onClick={addContainer}
                    className="px-2 py-1 bg-blue-100 text-blue-600 rounded text-sm"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
            <div className="w-1/4 p-2"></div>
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