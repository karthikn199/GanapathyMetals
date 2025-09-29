import {
  FiDownload,
  FiFile,
  FiFilePlus,
  FiFileText,
  FiPrinter,
  FiShare2,
} from "react-icons/fi";

const FormsListing = () => {
  const forms = [
    {
      id: 1,
      name: "Form 1",
      icon: <FiFileText className="w-4 h-4" />,
      color: "bg-blue-50 text-blue-600",
     
    },
    {
      id: 2,
      name: "Form 6",
      icon: <FiFile className="w-4 h-4" />,
      color: "bg-purple-50 text-purple-600",
    
    },
    {
      id: 3,
      name: "Form 9",
      icon: <FiFilePlus className="w-4 h-4" />,
      color: "bg-green-50 text-green-600",
   
    },
  ];

  return (
    <div className="pt-2 pb-4 px-4 max-w-7xl mx-auto">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">Forms</h2>
        <div className="relative max-w-xs w-full">
          <input
            type="text"
            placeholder="Search forms..."
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

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {forms.map((form) => (
          <div
            key={form.id}
            className="bg-white p-3 rounded-lg border border-gray-100 shadow-xs hover:shadow-sm transition-all cursor-pointer hover:-translate-y-0.5 flex flex-col items-center relative group"
          >
            <div
              className={`w-8 h-8 mb-2 rounded-full flex items-center justify-center ${form.color}`}
            >
              {form.icon}
            </div>
            <h3 className="text-xs font-medium text-gray-700 text-center truncate w-full">
              {form.name}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FormsListing;
