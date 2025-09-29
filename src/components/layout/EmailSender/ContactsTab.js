import React from 'react';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';
import { FiUpload, FiFileText, FiX, FiTrash2 } from 'react-icons/fi';

const ContactsTab = ({ 
  contacts, 
  setContacts, 
  contactHeaders, 
  setContactHeaders, 
  selectedContactList, 
  setSelectedContactList,
  setError
}) => {
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          setContacts(results.data);
          setContactHeaders(Object.keys(results.data[0] || {}));
          setSelectedContactList(file.name);
        },
        error: (error) => {
          setError('Failed to parse CSV file: ' + error.message);
        }
      });
    },
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    },
    maxFiles: 1
  });

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Contact Lists</h2>
      
      <div className="mb-6">
        <div 
          {...getRootProps()} 
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition mb-4"
        >
          <input {...getInputProps()} />
          <FiUpload className="mx-auto text-2xl text-gray-400 mb-2" />
          <p className="text-gray-600">Upload new contact list (CSV or Excel)</p>
          <p className="text-sm text-gray-500 mt-1">First row should contain headers</p>
        </div>
      </div>
      
      {contacts.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-3">Current Contact List: {selectedContactList}</h3>
          <ContactTable 
            contacts={contacts}
            contactHeaders={contactHeaders}
          />
          <div className="mt-4 text-sm text-gray-600">
            <p>{contacts.length} total contacts</p>
          </div>
        </div>
      )}
    </div>
  );
};

const ContactTable = ({ contacts, contactHeaders }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full bg-white border rounded-lg overflow-hidden">
      <thead className="bg-gray-100">
        <tr>
          {contactHeaders.map((header, index) => (
            <th key={index} className="py-2 px-4 text-left text-gray-700 font-medium">
              {header}
            </th>
          ))}
          <th className="py-2 px-4"></th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {contacts.slice(0, 5).map((contact, rowIndex) => (
          <tr key={rowIndex}>
            {contactHeaders.map((header, colIndex) => (
              <td key={colIndex} className="py-2 px-4 text-gray-600">
                {contact[header]}
              </td>
            ))}
            <td className="py-2 px-4">
              <button className="text-red-500 hover:text-red-700">
                <FiTrash2 />
              </button>
            </td>
          </tr>
        ))}
        {contacts.length > 5 && (
          <tr>
            <td colSpan={contactHeaders.length + 1} className="py-2 px-4 text-center text-gray-500">
              + {contacts.length - 5} more contacts
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);

export default ContactsTab;