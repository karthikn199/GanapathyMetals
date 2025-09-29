import { useState, useEffect } from "react";
import {
  FiDownload,
  FiEdit,
  FiPlus,
  FiSearch,
  FiTrash2,
  FiUpload,
  FiX,
} from "react-icons/fi";

// Mock API Service
const createMockApiService = (resourceName, initialData = []) => {
  // Simulate network delay
  const delay = () => new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 400));
  
  let data = [...initialData];
  let nextId = Math.max(0, ...initialData.map(item => item.id)) + 1;
  
  return {
    getAll: async () => {
      await delay();
      return [...data];
    },
    
    get: async (id) => {
      await delay();
      const item = data.find(item => item.id === id);
      if (!item) throw new Error(`${resourceName} not found`);
      return {...item};
    },
    
    create: async (itemData) => {
      await delay();
      const newItem = { ...itemData, id: nextId++ };
      data.push(newItem);
      return {...newItem};
    },
    
    update: async (id, itemData) => {
      await delay();
      const index = data.findIndex(item => item.id === id);
      if (index === -1) throw new Error(`${resourceName} not found`);
      data[index] = { ...data[index], ...itemData };
      return {...data[index]};
    },
    
    delete: async (id) => {
      await delay();
      const index = data.findIndex(item => item.id === id);
      if (index === -1) throw new Error(`${resourceName} not found`);
      data.splice(index, 1);
      return { success: true };
    },
    
    search: async (query) => {
      await delay();
      const lowercaseQuery = query.toLowerCase();
      return data.filter(item => 
        Object.values(item).some(value => 
          String(value).toLowerCase().includes(lowercaseQuery)
        )
      );
    }
  };
};

// Reusable MasterData Component
const MasterData = ({
  title,
  initialData = [],
  fields,
  searchableFields = [],
  formLayout = 'grid-cols-1 md:grid-cols-2',
  onExport,
  onImport
}) => {
  const [data, setData] = useState(initialData);
  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [currentItem, setCurrentItem] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Initialize API service
  const apiService = createMockApiService(title.toLowerCase(), initialData);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const result = await apiService.getAll();
      setData(result);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredData = searchTerm
    ? data.filter(item =>
        searchableFields.some(field => 
          String(item[field] || '').toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    : data;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (isEditing) {
        await apiService.update(currentItem.id, currentItem);
      } else {
        await apiService.create(currentItem);
      }
      
      await loadData(); // Reload data after operation
      resetForm();
    } catch (error) {
      console.error("Error saving data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (item) => {
    setCurrentItem({...item});
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    
    setIsLoading(true);
    try {
      await apiService.delete(id);
      await loadData();
    } catch (error) {
      console.error("Error deleting item:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setCurrentItem({});
    setIsEditing(false);
    setShowForm(false);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleInputChange = (field, value) => {
    setCurrentItem(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="pt-0 pb-2 px-2 max-w-6xl mx-auto">
      {/* Header with Search and Actions */}
      <div className="flex items-center justify-between gap-4 mb-4 p-2 bg-white rounded-lg border border-gray-100 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 min-w-max">
          {title}
        </h2>
        
        <div className="flex-1 max-w-md">
          <div className="relative">
            <input
              type="text"
              placeholder={`Search ${title.toLowerCase()}...`}
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-3 pr-8 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
            <FiSearch className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>
        </div>

        <div className="flex items-center space-x-2 min-w-max">
          {onExport && (
            <button
              onClick={onExport}
              className="px-3 py-2 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-600 rounded-lg text-sm font-medium flex items-center hover:from-blue-100 hover:to-blue-200 transition-all shadow-xs"
              title="Export"
            >
              <FiDownload className="w-4 h-4 mr-1" />
            </button>
          )}
          
          {onImport && (
            <button
              onClick={onImport}
              className="px-3 py-2 bg-gradient-to-r from-green-50 to-green-100 text-green-600 rounded-lg text-sm font-medium flex items-center hover:from-green-100 hover:to-green-200 transition-all shadow-xs"
              title="Import"
            >
              <FiUpload className="w-4 h-4 mr-1" />
            </button>
          )}
          
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-3 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg text-sm font-medium flex items-center hover:from-blue-700 hover:to-blue-800 transition-all shadow-md"
            title={showForm ? "Close Form" : "Add New"}
          >
            {showForm ? (
              <FiX className="w-4 h-4" />
            ) : (
              <FiPlus className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {/* Form */}
        {showForm && (
          <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-gray-800">
                {isEditing ? `Edit ${title.slice(0, -1)}` : `Add New ${title.slice(0, -1)}`}
              </h3>
              <button
                onClick={resetForm}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className={`grid ${formLayout} gap-3`}>
                {fields.map(field => (
                  <div key={field.name} className={field.fullWidth ? 'col-span-1 md:col-span-2' : ''}>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">
                      {field.label} {field.required && '*'}
                    </label>
                    {field.type === 'select' ? (
                      <select
                        required={field.required}
                        value={currentItem[field.name] || ''}
                        onChange={(e) => handleInputChange(field.name, e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      >
                        {field.options?.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={field.type || 'text'}
                        required={field.required}
                        value={currentItem[field.name] || ''}
                        onChange={(e) => handleInputChange(field.name, e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder={field.placeholder}
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg text-sm font-medium hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 transition-all shadow-md"
                >
                  {isLoading ? 'Processing...' : isEditing ? `Update ${title.slice(0, -1)}` : `Add ${title.slice(0, -1)}`}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Data Table */}
        {!showForm && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="grid grid-cols-12 bg-gradient-to-r from-gray-50 to-gray-100 px-3 py-2 text-xs font-semibold text-gray-700 uppercase tracking-wider">
              {fields.slice(0, 4).map(field => (
                <div key={field.name} className={`col-span-${field.colSpan || 2}`}>
                  {field.label}
                </div>
              ))}
              <div className="col-span-2 text-center">Actions</div>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {isLoading ? (
                <div className="p-6 text-center text-gray-400 text-sm">
                  Loading...
                </div>
              ) : filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-12 px-4 py-3 border-b border-gray-100 hover:bg-blue-50/30 transition-colors group"
                  >
                    {fields.slice(0, 4).map(field => (
                      <div key={field.name} className={`col-span-${field.colSpan || 3}`}>
                        <div className="text-sm text-gray-800 truncate">
                          {item[field.name]}
                        </div>
                        {field.subField && item[field.subField] && (
                          <div className="text-xs text-gray-500 truncate mt-0.5">
                            {item[field.subField]}
                          </div>
                        )}
                      </div>
                    ))}
                    <div className="col-span-3 flex items-center justify-center space-x-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="p-1.5 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 hover:text-blue-800 transition-colors shadow-xs"
                        title="Edit"
                      >
                        <FiEdit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 hover:text-red-800 transition-colors shadow-xs"
                        title="Delete"
                      >
                        <FiTrash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-gray-400 text-sm">
                  {searchTerm
                    ? "No matching items found"
                    : `No ${title.toLowerCase()} added yet. Click the + button to add your first item.`}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MasterData;