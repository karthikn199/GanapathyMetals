import {
  FiActivity,
  FiBox,
  FiDownload,
  FiGlobe,
  FiPrinter,
  FiShare2,
  FiTruck,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom"; // ✅ Import navigate

const CertificateListing = () => {
  const navigate = useNavigate(); // ✅ Initialize navigate

  const certificates = [
      {
      id: 1,
      name: "Origin Malaysia",
      icon: <FiGlobe className="w-4 h-4" />,
      color: "bg-yellow-50 text-yellow-600",
      path: "/orgin",
    },
    {
      id: 2,
      name: "Freight",
      icon: <FiTruck className="w-4 h-4" />,
      color: "bg-blue-50 text-blue-600",
      path: "/certificates/freight", // ✅ define route
    },
    {
      id: 3,
      name: "Packing List",
      icon: <FiBox className="w-4 h-4" />,
      color: "bg-purple-50 text-purple-600",
      path: "/certificates/packing-list",
    },
    {
      id: 4,
      name: "Chemicals Analysis",
      icon: <FiActivity className="w-4 h-4" />,
      color: "bg-green-50 text-green-600",
      path: "/certificates/chemicals-analysis",
    },
  
  ];

  return (
    <div className="pt-2 pb-4 px-4 max-w-7xl mx-auto">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">Certificates</h2>
        <div className="relative max-w-xs w-full">
          <input
            type="text"
            placeholder="Search certificates..."
            className="w-full pl-3 pr-8 py-1.5 text-sm border border-gray-200 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          />
          <svg
            className="absolute right-2 top-1.5 h-4 w-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
        {certificates.map((cert) => (
          <div
            key={cert.id}
            onClick={() => navigate(cert.path)} // ✅ navigate on card click
            className="bg-white p-3 rounded-lg border border-gray-100 shadow-xs hover:shadow-sm transition-all cursor-pointer hover:-translate-y-0.5 flex flex-col items-center relative group"
          >
            <div
              className={`w-8 h-8 mb-2 rounded-full flex items-center justify-center ${cert.color}`}
            >
              {cert.icon}
            </div>
            <h3 className="text-xs font-medium text-gray-700 text-center truncate w-full">
              {cert.name}
            </h3>

            <div className="flex mt-2 space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => {
                  e.stopPropagation(); // ⛔ prevent card click navigation
                  console.log("Download clicked");
                }}
                className="p-1 text-gray-400 hover:text-blue-500 rounded-full hover:bg-blue-50"
              >
                <FiDownload className="w-3 h-3" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  console.log("Print clicked");
                }}
                className="p-1 text-gray-400 hover:text-green-500 rounded-full hover:bg-green-50"
              >
                <FiPrinter className="w-3 h-3" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  console.log("Share clicked");
                }}
                className="p-1 text-gray-400 hover:text-purple-500 rounded-full hover:bg-purple-50"
              >
                <FiShare2 className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CertificateListing;
