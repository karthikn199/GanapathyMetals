import {
  FiFileText,
  FiTruck,
  FiDownload,
  FiPrinter,
  FiShare2,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const InvoiceListing = () => {
  const navigate = useNavigate();

  const certificates = [
    {
      id: 1,
      name: "Invoice",
      icon: <FiFileText className="w-4 h-4" />, // ✅ Changed from FiGlobe to FiFileText
      color: "from-amber-500 to-orange-500",
      bgColor: "bg-amber-50",
      path: "/invoice",
      count: 15,
    },
  ];

  const handleCardClick = (path) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 py-6 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              onClick={() => handleCardClick(cert.path)}
              className="group cursor-pointer"
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/80 p-4 transition-all duration-300 hover:shadow-md hover:scale-[1.02] hover:border-gray-300 group-hover:bg-white h-full">
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`p-2 rounded-lg bg-gradient-to-br ${cert.color} shadow-xs`}
                  >
                    <div className="text-white filter drop-shadow-sm">
                      {cert.icon}
                    </div>
                  </div>
                  <div className="text-xs font-semibold px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-600 min-w-[20px] text-center">
                    {cert.count}
                  </div>
                </div>

                <h3 className="font-semibold text-gray-900 text-sm mb-1 group-hover:text-gray-700 transition-colors line-clamp-1">
                  {cert.name}
                </h3>

                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-blue-600 group-hover:text-blue-700 transition-colors">
                    View details
                  </span>
                  <div className="flex space-x-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log("Download clicked");
                      }}
                      className="p-1 text-gray-400 hover:text-blue-500 rounded-full hover:bg-blue-50 transition-colors"
                    >
                      <FiDownload className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log("Print clicked");
                      }}
                      className="p-1 text-gray-400 hover:text-green-500 rounded-full hover:bg-green-50 transition-colors"
                    >
                      <FiPrinter className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log("Share clicked");
                      }}
                      className="p-1 text-gray-400 hover:text-purple-500 rounded-full hover:bg-purple-50 transition-colors"
                    >
                      <FiShare2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InvoiceListing;
