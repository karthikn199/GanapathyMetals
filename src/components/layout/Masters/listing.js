import { useState } from "react";
import {
  FiAnchor,
  FiBriefcase,
  FiGlobe,
  FiGrid,
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
  const [searchTerm, setSearchTerm] = useState("");

  const masters = [
    {
      id: 1,
      name: "Exporters",
      icon: <FiTruck className="w-4 h-4" />,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50",
      path: "/exporter",
      count: 24,
    },
    {
      id: 2,
      name: "Consignee",
      icon: <FiUser className="w-4 h-4" />,
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-50",
      path: "/party",
      count: 18,
    },
    {
      id: 3,
      name: "Party",
      icon: <FiUsers className="w-4 h-4" />,
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50",
      path: "/party",
      count: 42,
    },
    {
      id: 4,
      name: "Port",
      icon: <FiAnchor className="w-4 h-4" />,
      color: "from-amber-500 to-orange-500",
      bgColor: "bg-amber-50",
      path: "/masters/port",
      count: 36,
    },
    {
      id: 5,
      name: "Country",
      icon: <FiGlobe className="w-4 h-4" />,
      color: "from-indigo-500 to-blue-500",
      bgColor: "bg-indigo-50",
      path: "/masters/country",
      count: 156,
    },
    {
      id: 6,
      name: "Vessel",
      icon: <FiNavigation className="w-4 h-4" />,
      color: "from-red-500 to-rose-500",
      bgColor: "bg-red-50",
      path: "/masters/vessel",
      count: 29,
    },
    {
      id: 7,
      name: "Contact Person",
      icon: <FiPhone className="w-4 h-4" />,
      color: "from-pink-500 to-rose-500",
      bgColor: "bg-pink-50",
      path: "/masters/contact-person",
      count: 67,
    },
    {
      id: 8,
      name: "Recovery Abbreviation",
      icon: <FiHash className="w-4 h-4" />,
      color: "from-gray-500 to-slate-500",
      bgColor: "bg-gray-50",
      path: "/masters/recovery-abbreviation",
      count: 12,
    },
    {
      id: 9,
      name: "Buyer",
      icon: <FiBriefcase className="w-4 h-4" />,
      color: "from-teal-500 to-cyan-500",
      bgColor: "bg-teal-50",
      path: "/masters/buyer",
      count: 31,
    },
    {
      id: 10,
      name: "Commodity",
      icon: <FiPackage className="w-4 h-4" />,
      color: "from-orange-500 to-amber-500",
      bgColor: "bg-orange-50",
      path: "/masters/commodity",
      count: 58,
    },
  ];

  const filteredMasters = masters.filter((master) =>
    master.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCardClick = (path) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 py-6 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {filteredMasters.map((master) => (
            <div
              key={master.id}
              onClick={() => handleCardClick(master.path)}
              className="group cursor-pointer"
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/80 p-4 transition-all duration-300 hover:shadow-md hover:scale-[1.02] hover:border-gray-300 group-hover:bg-white h-full">
                {/* Icon with Gradient Background */}
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`p-2 rounded-lg bg-gradient-to-br ${master.color} shadow-xs`}
                  >
                    <div className="text-white filter drop-shadow-sm">
                      {master.icon}
                    </div>
                  </div>
                  <div className="text-xs font-semibold px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-600 min-w-[20px] text-center">
                    {master.count}
                  </div>
                </div>

                {/* Content */}
                <h3 className="font-semibold text-gray-900 text-sm mb-1 group-hover:text-gray-700 transition-colors line-clamp-1">
                  {master.name}
                </h3>
                {/* <p className="text-xs text-gray-500 mb-3 line-clamp-2 leading-relaxed">
                  Manage {master.name.toLowerCase()} data and configurations
                </p> */}

                {/* Action Button */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-blue-600 group-hover:text-blue-700 transition-colors">
                    View details
                  </span>
                  <div className="w-5 h-5 rounded-full bg-blue-50 group-hover:bg-blue-100 transition-colors flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 group-hover:bg-blue-600 transition-colors" />
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

export default CardListing;
