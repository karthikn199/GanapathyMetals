import axios from "axios";
import { useEffect, useState } from "react";
import { FiBriefcase, FiSearch, FiSmartphone, FiUser } from "react-icons/fi";

const API_BASE_URL = "http://localhost:4000/api/whatsapp";

export default function ContactsList() {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const contactsPerPage = 10;

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/contacts`);
        setContacts(response.data.data);
        setFilteredContacts(response.data.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch contacts");
        setLoading(false);
        console.error("Error fetching contacts:", err);
      }
    };

    fetchContacts();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredContacts(contacts);
      setCurrentPage(1);
    } else {
      const filtered = contacts.filter((contact) => {
        const nameMatch = contact.name
          ? contact.name.toLowerCase().includes(searchTerm.toLowerCase())
          : false;
        const numberMatch = contact.number
          ? contact.number.includes(searchTerm)
          : false;
        return nameMatch || numberMatch;
      });
      setFilteredContacts(filtered);
      setCurrentPage(1);
    }
  }, [searchTerm, contacts]);

  // Pagination logic
  const indexOfLastContact = currentPage * contactsPerPage;
  const indexOfFirstContact = indexOfLastContact - contactsPerPage;
  const currentContacts = filteredContacts.slice(
    indexOfFirstContact,
    indexOfLastContact
  );
  const totalPages = Math.ceil(filteredContacts.length / contactsPerPage);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-red-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          WhatsApp Contacts
        </h2>
        <p className="text-gray-600">
          Total contacts: {filteredContacts.length}
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FiSearch className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="Search by name or number..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      {/* Contacts Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Contact
              </th>
              <th
                scope="col"
                className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Number
              </th>
              <th
                scope="col"
                className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Type
              </th>
              <th
                scope="col"
                className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentContacts.length > 0 ? (
              currentContacts.map((contact) => (
                <tr key={contact.id} className="hover:bg-gray-50">
                  <td className="px-3 py-2 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                        <FiUser className="h-5 w-5 text-indigo-500" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {contact.name || "No name"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {contact.number}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {contact.isBusiness ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        <FiBriefcase className="mr-1" /> Business
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <FiSmartphone className="mr-1" /> Personal
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {contact.isMyContact ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Saved Contact
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        Not Saved
                      </span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="4"
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  No contacts found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium ${
              currentPage === 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Previous
          </button>
          <div className="text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </div>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className={`px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium ${
              currentPage === totalPages
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
