import { useState, useEffect, useMemo, useCallback } from "react";
import { FiSend, FiChevronDown } from "react-icons/fi";
import axios from "axios";
import { FixedSizeList as List } from 'react-window';
import { debounce } from 'lodash';

const API_BASE_URL = "http://localhost:4000/api/whatsapp";

export default function SingleMessageTab({ isLoading, setIsLoading, onSuccess, onError }) {
  const [message, setMessage] = useState({
    number: "",
    message: "",
  });
  const [contacts, setContacts] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loadingContacts, setLoadingContacts] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0
  });

  // Debounced contact fetcher
  const fetchContacts = useCallback(debounce(async (search = '', page = 1) => {
    try {
      setLoadingContacts(true);
      const response = await axios.get(`${API_BASE_URL}/contacts`, {
        params: {
          page,
          limit: pagination.limit,
          search
        }
      });
      
      setContacts(prev => 
        page === 1 
          ? response.data.data || [] 
          : [...prev, ...(response.data.data || [])]
      );
      setPagination(prev => ({
        ...prev,
        total: response.data.total,
        page
      }));
    } catch (err) {
      console.error("Failed to fetch contacts:", err);
    } finally {
      setLoadingContacts(false);
    }
  }, 300), [pagination.limit]);

  // Initial load and clean-up
  useEffect(() => {
    fetchContacts();
    return () => fetchContacts.cancel();
  }, [fetchContacts]);

  // Memoized filtered contacts
  const filteredContacts = useMemo(() => {
    if (!message.number) return [];
    const searchTerm = message.number.toLowerCase();
    return contacts.filter(contact => 
      contact.number?.includes(message.number) ||
      contact.name?.toLowerCase().includes(searchTerm)
    );
  }, [contacts, message.number]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/send`, {
        number: message.number,
        message: message.message,
      });

      onSuccess(`Message sent to ${message.number}`);
      setMessage({ number: "", message: "" });
    } catch (err) {
      onError(err.response?.data?.message || "Failed to send message");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectContact = (contactNumber) => {
    setMessage({ ...message, number: contactNumber });
    setShowDropdown(false);
  };

  const handleLoadMore = () => {
    const nextPage = pagination.page + 1;
    fetchContacts(message.number, nextPage);
  };

  // Virtualized list item renderer
  const ContactRow = ({ index, style }) => {
    const contact = filteredContacts[index];
    return (
      <div
        style={style}
        className="cursor-pointer hover:bg-indigo-50 px-4 py-2"
        onClick={() => handleSelectContact(contact.number)}
      >
        <div className="font-medium">{contact.name || "No name"}</div>
        <div className="text-gray-500">{contact.number}</div>
      </div>
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
    >
      <div className="mb-4 relative">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Phone Number (with country code)
        </label>
        <div className="relative">
          <input
            type="text"
            value={message.number}
            onChange={(e) => {
              const value = e.target.value;
              setMessage({ ...message, number: value });
              setShowDropdown(value.length > 0);
              if (value.length > 2) {
                fetchContacts(value, 1);
              }
            }}
            onFocus={() => setShowDropdown(true)}
            placeholder="Search or type phone number..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
          <button
            type="button"
            onClick={() => setShowDropdown(!showDropdown)}
            className="absolute inset-y-0 right-0 flex items-center pr-3"
          >
            <FiChevronDown className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        {showDropdown && (
          <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
            {loadingContacts && pagination.page === 1 ? (
              <div className="px-4 py-2 text-gray-500">Loading contacts...</div>
            ) : filteredContacts.length > 0 ? (
              <>
                <List
                  height={Math.min(240, filteredContacts.length * 50)}
                  itemCount={filteredContacts.length}
                  itemSize={50}
                  width="100%"
                >
                  {ContactRow}
                </List>
                {pagination.page * pagination.limit < pagination.total && (
                  <button
                    type="button"
                    onClick={handleLoadMore}
                    className="w-full py-2 text-center text-indigo-600 hover:bg-indigo-50"
                    disabled={loadingContacts}
                  >
                    {loadingContacts ? (
                      'Loading more...'
                    ) : (
                      `Load More (${pagination.total - filteredContacts.length} remaining)`
                    )}
                  </button>
                )}
              </>
            ) : (
              <div className="px-4 py-2 text-gray-500">
                {message.number ? "No matching contacts" : "Start typing to search contacts"}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Message
        </label>
        <textarea
          rows={4}
          value={message.message}
          onChange={(e) => setMessage({ ...message, message: e.target.value })}
          placeholder="Type your message here..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          required
        />
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Sending...
          </>
        ) : (
          <>
            <FiSend className="mr-2" />
            Send Message
          </>
        )}
      </button>
    </form>
  );
}