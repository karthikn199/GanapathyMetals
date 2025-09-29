import {
  FiAnchor,
  FiBriefcase,
  FiGlobe,
  FiHash,
  FiNavigation,
  FiPackage,
  FiPhone,
  FiTruck,
  FiUser,
  FiUsers,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const CardListing = () => {
  const navigate = useNavigate();

  const masters = [
    {
      id: 1,
      name: "Exporters",
      icon: <FiTruck className="w-4 h-4" />,
      color: "bg-blue-50 text-blue-600",
      path: "/exporter",
    },
    {
      id: 2,
      name: "Consignee",
      icon: <FiUser className="w-4 h-4" />,
      color: "bg-purple-50 text-purple-600",
      path: "/party",
    },
    {
      id: 3,
      name: "Party",
      icon: <FiUsers className="w-4 h-4" />,
      color: "bg-green-50 text-green-600",
      path: "/party",
    },
    {
      id: 4,
      name: "Port",
      icon: <FiAnchor className="w-4 h-4" />,
      color: "bg-yellow-50 text-yellow-600",
      path: "/masters/port",
    },
    {
      id: 5,
      name: "Country",
      icon: <FiGlobe className="w-4 h-4" />,
      color: "bg-indigo-50 text-indigo-600",
      path: "/masters/country",
    },
    {
      id: 6,
      name: "Vessel",
      icon: <FiNavigation className="w-4 h-4" />,
      color: "bg-red-50 text-red-600",
      path: "/masters/vessel",
    },
    {
      id: 7,
      name: "Contact Person",
      icon: <FiPhone className="w-4 h-4" />,
      color: "bg-pink-50 text-pink-600",
      path: "/masters/contact-person",
    },
    {
      id: 8,
      name: "Recovery Abbreviation",
      icon: <FiHash className="w-4 h-4" />,
      color: "bg-gray-50 text-gray-600",
      path: "/masters/recovery-abbreviation",
    },
    {
      id: 9,
      name: "Buyer",
      icon: <FiBriefcase className="w-4 h-4" />,
      color: "bg-teal-50 text-teal-600",
      path: "/masters/buyer",
    },
    {
      id: 10,
      name: "Commodity",
      icon: <FiPackage className="w-4 h-4" />,
      color: "bg-orange-50 text-orange-600",
      path: "/masters/commodity",
    },
  ];

  const handleCardClick = (path) => {
    navigate(path);
  };

  return (
    <div className="pt-0 pb-4 px-4 max-w-7xl mx-auto">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">Masters</h2>
        <div className="relative max-w-xs w-full">
          <input
            type="text"
            placeholder="Search masters..."
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

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
        {masters.map((master) => (
          <div
            key={master.id}
            onClick={() => handleCardClick(master.path)}
            className="bg-white p-3 rounded-lg border border-gray-100 shadow-xs hover:shadow-sm transition-all cursor-pointer hover:-translate-y-0.5 flex flex-col items-center group"
          >
            <div
              className={`w-8 h-8 mb-2 rounded-full flex items-center justify-center ${master.color} group-hover:scale-110 transition-transform`}
            >
              {master.icon}
            </div>
            <h3 className="text-xs font-medium text-gray-700 text-center truncate w-full group-hover:text-blue-600 transition-colors">
              {master.name}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardListing;
