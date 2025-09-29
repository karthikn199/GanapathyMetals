import { useEffect, useState } from "react";
import {
  FiDownload,
  FiEdit2,
  FiFilter,
  FiSearch,
  FiTrash2,
  FiUpload,
  FiUserPlus,
  FiX,
} from "react-icons/fi";
import {
  bulkDeleteContacts,
  createContact,
  deleteContact,
  getContacts,
  updateContact,
} from "../../../services/contactService";
import BulkContactUpload from "./BulkUploadContacts";

export default function ContactList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [file, setFile] = useState(null);
  const [editContact, setEditContact] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newContact, setNewContact] = useState({
    name: "",
    phone: "",
    email: "",
    tags: [],
  });

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        setIsLoading(true);
        const data = await getContacts();
        setContacts(data);
        setError(null);
      } catch (err) {
        setError("Failed to load contacts. Please try again later.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContacts();
  }, []);

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.phone_number.includes(searchTerm) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id) => {
    try {
      await deleteContact(id);
      setContacts((prev) => prev.filter((contact) => contact.id !== id));
      setSelectedContacts((prev) =>
        prev.filter((contactId) => contactId !== id)
      );
    } catch (error) {
      console.error("Error deleting contact:", error);
      alert("Failed to delete contact");
    }
  };

  const handleBulkDelete = async () => {
    try {
      await bulkDeleteContacts(selectedContacts);
      setContacts((prev) =>
        prev.filter((contact) => !selectedContacts.includes(contact.id))
      );
      setSelectedContacts([]);
    } catch (error) {
      console.error("Error bulk deleting contacts:", error);
      alert("Failed to delete selected contacts");
    }
  };

  const handleImport = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setShowImportModal(true);
    }
  };

  const handleUploadSuccess = (result) => {
    console.log("Upload result:", result);
      const fetchContacts = async () => {
      try {
        setIsLoading(true);
        const data = await getContacts();
        setContacts(data);
        setError(null);
      } catch (err) {
        setError("Failed to load contacts. Please try again later.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContacts();
    // Refresh your contacts list or show success message
  };

  const confirmImport = () => {
    // Process the file here (CSV/Excel parsing)
    console.log("Importing file:", file);
    setShowImportModal(false);
    setFile(null);
  };

  const handleAddContact = async () => {
    try {
      const createdContact = await createContact(newContact);
      setContacts((prev) => [
        ...prev,
        {
          id: createdContact.id,
          full_name: createdContact.full_name,
          phone_number: createdContact.phone_number,
          email: createdContact.email,
          tags: createdContact.tags
            ? createdContact.tags.split(",").map((tag) => tag.trim())
            : [],
        },
      ]);
      setShowAddModal(false);
      setNewContact({
        name: "",
        phone: "",
        email: "",
        tags: [],
      });
    } catch (error) {
      console.error("Error adding contact:", error);
      alert("Failed to add contact");
    }
  };

  const handleUpdateContact = async () => {
    try {
      const updatedContact = await updateContact(editContact.id, editContact);
      setContacts((prev) =>
        prev.map((contact) =>
          contact.id === editContact.id
            ? {
                ...contact,
                full_name: updatedContact.full_name,
                phone_number: updatedContact.phone_number,
                email: updatedContact.email,
                tags: updatedContact.tags
                  ? updatedContact.tags.split(",").map((tag) => tag.trim())
                  : [],
              }
            : contact
        )
      );
      setEditContact(null);
    } catch (error) {
      console.error("Error updating contact:", error);
      alert("Failed to update contact");
    }
  };

  const downloadSampleFile = () => {
    const csvContent =
      "data:text/csv;charset=utf-8,full_name,phone_number,email,tags\nJohn Doe,+1234567890,john@example.com,VIP, Customer\nJane Smith,+1987654321,jane@example.com,Prospect";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "contacts_sample.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        Loading contacts...
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  return (
    <div className="space-y-4">
      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Contacts</h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center justify-center px-4 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <FiUserPlus className="mr-2" />
            Add Contact
          </button>

          <div>
            <button className="flex items-center justify-center px-4 py-1 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50" onClick={() => setShowUploadModal(true)}>
               <FiUpload className="mr-2" />
              Upload
            </button>

            {showUploadModal && (
              <BulkContactUpload
                onClose={() => setShowUploadModal(false)}
                onUploadSuccess={handleUploadSuccess}
              />
            )}
          </div>

          <button className="flex items-center justify-center px-4 py-1 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50">
            <FiDownload className="mr-2" />
            Export
          </button>

          {selectedContacts.length > 0 && (
            <button
              onClick={handleBulkDelete}
              className="flex items-center justify-center px-4 py-2 border border-red-300 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
            >
              <FiTrash2 className="mr-2" />
              Delete Selected
            </button>
          )}
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-3 flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Search contacts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50">
            <FiFilter className="mr-2" />
            Filters
          </button>
        </div>

       {/* Contacts Table */}
<div className="overflow-x-auto rounded-lg border border-gray-200">
  <table className="min-w-full divide-y divide-gray-200">
    <thead className="bg-gradient-to-r from-indigo-500 to-purple-600">
      <tr>
        <th
          scope="col"
          className="px-3 py-2 text-left text-xs font-semibold text-white uppercase tracking-wider"
        >
          <input
            type="checkbox"
            className="h-4 w-4 text-white border-white rounded focus:ring-white"
            checked={
              selectedContacts.length === filteredContacts.length &&
              filteredContacts.length > 0
            }
            onChange={() => {
              if (selectedContacts.length === filteredContacts.length) {
                setSelectedContacts([]);
              } else {
                setSelectedContacts(
                  filteredContacts.map((contact) => contact.id)
                );
              }
            }}
          />
        </th>
        <th
          scope="col"
          className="px-3 py-2 text-left text-xs font-semibold text-white uppercase tracking-wider"
        >
          Contact
        </th>
        <th
          scope="col"
          className="px-3 py-2 text-left text-xs font-semibold text-white uppercase tracking-wider"
        >
          Phone
        </th>
        <th
          scope="col"
          className="px-3 py-2 text-left text-xs font-semibold text-white uppercase tracking-wider"
        >
          Email
        </th>
        <th
          scope="col"
          className="px-3 py-2 text-left text-xs font-semibold text-white uppercase tracking-wider"
        >
          Tags
        </th>
        <th
          scope="col"
          className="px-3 py-2 text-right text-xs font-semibold text-white uppercase tracking-wider"
        >
          Actions
        </th>
      </tr>
    </thead>
    <tbody className="bg-white divide-y divide-gray-200">
      {filteredContacts.map((contact) => (
        <tr key={contact.id} className="hover:bg-gray-50 transition-colors">
          <td className="px-3 py-2 whitespace-nowrap">
            <input
              type="checkbox"
              className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              checked={selectedContacts.includes(contact.id)}
              onChange={() =>
                setSelectedContacts((prev) =>
                  prev.includes(contact.id)
                    ? prev.filter((id) => id !== contact.id)
                    : [...prev, contact.id]
                )
              }
            />
          </td>
          <td className="px-3 py-2">
            <div className="flex items-center">
              <div className="flex-shrink-0 h-7 w-7 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-600 font-medium">
                {contact.full_name.charAt(0)}
              </div>
              <div className="ml-2">
                <div className="text-sm font-medium text-gray-900">
                  {contact.full_name}
                </div>
              </div>
            </div>
          </td>
          <td className="px-3 py-2 text-sm text-gray-700">
            {contact.phone_number}
          </td>
          <td className="px-3 py-2 text-sm text-gray-700">
            {contact.email}
          </td>
          <td className="px-3 py-2">
            <div className="flex flex-wrap gap-1">
              {contact.tags && typeof contact.tags === "string"
                ? contact.tags.split(",").map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 text-xs rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-100"
                    >
                      {tag.trim()}
                    </span>
                  ))
                : Array.isArray(contact.tags)
                ? contact.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 text-xs rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-100"
                    >
                      {tag}
                    </span>
                  ))
                : null}
            </div>
          </td>
          <td className="px-3 py-2 whitespace-nowrap text-right text-sm font-medium space-x-2">
            <button
              onClick={() =>
                setEditContact({
                  id: contact.id,
                  name: contact.full_name,
                  phone: contact.phone_number,
                  email: contact.email,
                  tags: contact.tags
                    ? typeof contact.tags === "string"
                      ? contact.tags.split(",").map((tag) => tag.trim())
                      : contact.tags
                    : [],
                })
              }
              className="text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              <FiEdit2 className="inline" />
            </button>
            <button
              onClick={() => handleDelete(contact.id)}
              className="text-red-600 hover:text-red-800 transition-colors"
            >
              <FiTrash2 className="inline" />
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
      </div>

      {/* Add Contact Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Add New Contact
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <FiX className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  value={newContact.name}
                  onChange={(e) =>
                    setNewContact({ ...newContact, name: e.target.value })
                  }
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  value={newContact.phone}
                  onChange={(e) =>
                    setNewContact({ ...newContact, phone: e.target.value })
                  }
                  placeholder="+1234567890"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  value={newContact.email}
                  onChange={(e) =>
                    setNewContact({ ...newContact, email: e.target.value })
                  }
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  value={newContact.tags.join(", ")}
                  onChange={(e) =>
                    setNewContact({
                      ...newContact,
                      tags: e.target.value.split(",").map((tag) => tag.trim()),
                    })
                  }
                  placeholder="VIP, Customer, Prospect"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddContact}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Add Contact
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Edit Contact
              </h3>
              <button
                onClick={() => setEditContact(null)}
                className="text-gray-400 hover:text-gray-500"
              >
                <FiX className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  value={editContact.name}
                  onChange={(e) =>
                    setEditContact({ ...editContact, name: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  value={editContact.phone}
                  onChange={(e) =>
                    setEditContact({ ...editContact, phone: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  value={editContact.email}
                  onChange={(e) =>
                    setEditContact({ ...editContact, email: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  value={editContact.tags.join(", ")}
                  onChange={(e) =>
                    setEditContact({
                      ...editContact,
                      tags: e.target.value.split(",").map((tag) => tag.trim()),
                    })
                  }
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setEditContact(null)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateContact}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
