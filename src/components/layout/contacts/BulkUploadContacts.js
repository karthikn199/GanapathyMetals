import { useState, useRef } from 'react';
import { FiUpload, FiX, FiFileText, FiCheck } from 'react-icons/fi';
import * as XLSX from 'xlsx'; // Install with: npm install xlsx
import { bulkUploadContacts } from '../../../services/contactService';

const BulkContactUpload = ({ onClose, onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [previewData, setPreviewData] = useState([]);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    // Validate file type
    const validTypes = ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv'];
    if (!validTypes.includes(selectedFile.type) && !selectedFile.name.match(/\.(csv|xlsx|xls)$/i)) {
      setError('Please select a valid Excel or CSV file');
      return;
    }

    setError(null);
    setFile(selectedFile);
    parseFile(selectedFile);
  };

  const parseFile = (file) => {
    setIsProcessing(true);
    setUploadProgress(30);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        setUploadProgress(70);

        // Validate data structure
        if (jsonData.length === 0) {
          throw new Error('File is empty');
        }

        const sampleRow = jsonData[0];
        if (!sampleRow.hasOwnProperty('Name') || !sampleRow.hasOwnProperty('Phone')) {
          throw new Error('File must contain at least "Name" and "Phone" columns');
        }

        // Format data for preview
        const formattedData = jsonData.map((row, index) => ({
          id: index,
          name: row.Name || '',
          phone: row.Phone || '',
          email: row.Email || '',
          tags: row.Tags ? row.Tags.split(',').map(tag => tag.trim()) : []
        }));

        setPreviewData(formattedData.slice(0, 5)); // Show first 5 rows as preview
        setUploadProgress(100);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsProcessing(false);
      }
    };
    reader.readAsArrayBuffer(file);
  };

 const handleUpload = async () => {
    if (!file) return;
    
    setIsProcessing(true);
    setError(null);
    
    try {
      const result = await bulkUploadContacts(file);
      
      onUploadSuccess({
        success: true,
        count: result.count,
        message: result.message,
        data: previewData // optional: pass the parsed data if needed
      });
      
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to upload contacts. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadSampleFile = () => {
    const sampleData = [
      { Name: 'John Doe', Phone: '+1234567890', Email: 'john@example.com', Tags: 'VIP,Customer' },
      { Name: 'Jane Smith', Phone: '+1987654321', Email: 'jane@example.com', Tags: 'Prospect' }
    ];
    
    const worksheet = XLSX.utils.json_to_sheet(sampleData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Contacts');
    XLSX.writeFile(workbook, 'contacts_sample.xlsx');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Bulk Upload Contacts</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
            disabled={isProcessing}
          >
            <FiX className="h-6 w-6" />
          </button>
        </div>
        
        <div className="space-y-4">
          {!file ? (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <div className="flex flex-col items-center justify-center">
                <FiUpload className="h-10 w-10 text-gray-400 mb-3" />
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-medium text-indigo-600 hover:text-indigo-500 cursor-pointer"
                    onClick={() => fileInputRef.current.click()}
                  >
                    Click to upload
                  </span>{' '}
                  or drag and drop
                </p>
                <p className="text-xs text-gray-500">
                  Excel or CSV files (with Name, Phone, Email, and Tags columns)
                </p>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleFileChange}
                  accept=".csv,.xlsx,.xls"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FiFileText className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-sm font-medium text-gray-700 truncate max-w-xs">
                    {file.name}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setFile(null);
                    setPreviewData([]);
                    setUploadProgress(0);
                  }}
                  className="text-sm text-red-600 hover:text-red-800"
                  disabled={isProcessing}
                >
                  Remove
                </button>
              </div>

              {isProcessing && uploadProgress < 100 && (
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-indigo-600 h-2.5 rounded-full" 
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              )}

              {previewData.length > 0 && (
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tags</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {previewData.map((row) => (
                          <tr key={row.id}>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{row.name}</td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{row.phone}</td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{row.email}</td>
                            <td className="px-4 py-2 whitespace-nowrap">
                              <div className="flex flex-wrap gap-1">
                                {row.tags.map(tag => (
                                  <span key={tag} className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-800">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="bg-gray-50 px-4 py-2 text-xs text-gray-500">
                    Showing {previewData.length} of {previewData.length} rows (sample preview)
                  </div>
                </div>
              )}
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-50 text-red-600 rounded-md text-sm">
              {error}
            </div>
          )}

          <div className="border border-gray-200 rounded-md p-4 bg-gray-50">
            <h4 className="text-sm font-medium text-gray-700 mb-2">File Requirements</h4>
            <ul className="text-sm text-gray-600 list-disc pl-5 space-y-1">
              <li>First row should contain column headers (Name, Phone, Email, Tags)</li>
              <li>Supported formats: .xlsx, .xls, .csv</li>
              <li>Maximum file size: 5MB</li>
              <li>Tags should be comma-separated in the Tags column</li>
            </ul>
            <button
              onClick={downloadSampleFile}
              className="mt-2 flex items-center text-sm text-indigo-600 hover:text-indigo-800"
            >
              <FiFileText className="mr-2" />
              Download sample file
            </button>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            disabled={isProcessing}
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center"
            disabled={!file || isProcessing}
          >
            {isProcessing ? (
              'Uploading...'
            ) : (
              <>
                <FiUpload className="mr-2" />
                Upload Contacts
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkContactUpload;