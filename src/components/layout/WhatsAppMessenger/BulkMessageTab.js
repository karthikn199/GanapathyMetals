import axios from "axios";
import { debounce } from "lodash";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FiChevronDown, FiUsers, FiX } from "react-icons/fi";
import { FixedSizeList as List } from "react-window";

const API_BASE_URL = "http://localhost:4000/api/whatsapp";

export default function BulkMessageTab({
  isLoading,
  setIsLoading,
  onSuccess,
  onError,
}) {
  const [message, setMessage] = useState({
    contacts: "",
    messageTemplate: "",
  });
  const [contactsList, setContactsList] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingContacts, setLoadingContacts] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
  });

  // Debounced contact fetcher with pagination
  const fetchContacts = useCallback(
    debounce(async (search = "", page = 1) => {
      try {
        setLoadingContacts(true);
        const response = await axios.get(`${API_BASE_URL}/contacts`, {
          params: {
            page,
            limit: pagination.limit,
            search,
          },
        });

        setContactsList((prev) =>
          page === 1
            ? response.data.data || []
            : [...prev, ...(response.data.data || [])]
        );
        setPagination((prev) => ({
          ...prev,
          total: response.data.total,
          page,
        }));
      } catch (err) {
        console.error("Failed to fetch contacts:", err);
      } finally {
        setLoadingContacts(false);
      }
    }, 300),
    [pagination.limit]
  );

  // Initial load and clean-up
  useEffect(() => {
    fetchContacts();
    return () => fetchContacts.cancel();
  }, [fetchContacts]);

  // Memoized filtered contacts
  const filteredContacts = useMemo(() => {
    if (!searchTerm) return [];
    return contactsList
      .filter(
        (contact) =>
          !selectedContacts.some((c) => c.id === contact.id) &&
          (contact.number?.includes(searchTerm) ||
            contact.name?.toLowerCase().includes(searchTerm.toLowerCase()))
      )
      .slice(0, 100); // Limit to first 100 matches for performance
  }, [contactsList, selectedContacts, searchTerm]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Combine manually entered numbers with selected contacts
      const manualNumbers = message.contacts
        .split("\n")
        .filter((num) => num.trim() !== "")
        .map((num) => ({ phone: num.trim() }));

      const selectedNumbers = selectedContacts.map((contact) => ({
        phone: contact.number,
        name: contact.name,
      }));

      const allContacts = [...manualNumbers, ...selectedNumbers];

      // Batch processing for large contact lists
      const batchSize = 100;
      const batches = [];
      for (let i = 0; i < allContacts.length; i += batchSize) {
        batches.push(allContacts.slice(i, i + batchSize));
      }

      const results = [];
      for (const batch of batches) {
        const response = await axios.post(`${API_BASE_URL}/send-bulk`, {
          contacts: batch,
          messageTemplate: message.messageTemplate,
        });
        results.push(...response.data);
      }

      const successCount = results.filter((r) => r.status === "success").length;
      onSuccess(
        `Sent ${successCount}/${allContacts.length} messages successfully`
      );
      setMessage({ contacts: "", messageTemplate: "" });
      setSelectedContacts([]);
    } catch (err) {
      onError(err.response?.data?.message || "Failed to send bulk messages");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectContact = (contact) => {
    if (!selectedContacts.some((c) => c.id === contact.id)) {
      setSelectedContacts([...selectedContacts, contact]);
    }
    setSearchTerm("");
    setShowDropdown(false);
  };

  const removeContact = (contactId) => {
    setSelectedContacts(selectedContacts.filter((c) => c.id !== contactId));
  };

  const handleLoadMore = () => {
    const nextPage = pagination.page + 1;
    fetchContacts(searchTerm, nextPage);
  };

  // Virtualized list item renderer
  const ContactRow = ({ index, style }) => {
    const contact = filteredContacts[index];
    return (
      <div
        style={style}
        className="cursor-pointer hover:bg-indigo-50 px-4 py-2"
        onClick={() => handleSelectContact(contact)}
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
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Recipients
        </label>

        {/* Selected contacts chips */}
        <div className="flex flex-wrap gap-2 mb-2">
          {selectedContacts.map((contact) => (
            <div
              key={contact.id}
              className="flex items-center bg-indigo-100 text-indigo-800 rounded-full px-3 py-1 text-sm"
            >
              {contact.name || contact.number}
              <button
                type="button"
                onClick={() => removeContact(contact.id)}
                className="ml-1 text-indigo-600 hover:text-indigo-900"
              >
                <FiX size={14} />
              </button>
            </div>
          ))}
        </div>

        {/* Contact search and selection */}
        <div className="relative mb-2">
          <div className="flex">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                const value = e.target.value;
                setSearchTerm(value);
                setShowDropdown(true);
                if (value.length > 2) {
                  fetchContacts(value, 1);
                }
              }}
              onFocus={() => setShowDropdown(true)}
              placeholder="Search contacts to add..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            <button
              type="button"
              onClick={() => setShowDropdown(!showDropdown)}
              className="px-3 border border-l-0 border-gray-300 rounded-r-md bg-gray-50"
            >
              <FiChevronDown className="h-5 w-5 text-gray-400" />
            </button>
          </div>

          {showDropdown && (
            <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
              {loadingContacts && pagination.page === 1 ? (
                <div className="px-4 py-2 text-gray-500">
                  Loading contacts...
                </div>
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
                      {loadingContacts
                        ? "Loading more..."
                        : `Load More (${
                            pagination.total - filteredContacts.length
                          } remaining)`}
                    </button>
                  )}
                </>
              ) : (
                <div className="px-4 py-2 text-gray-500">
                  {searchTerm
                    ? "No matching contacts"
                    : "Start typing to search contacts"}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Manual input for numbers */}
        <textarea
          rows={3}
          value={message.contacts}
          onChange={(e) => setMessage({ ...message, contacts: e.target.value })}
          placeholder="Or enter numbers manually (one per line)\ne.g. 919876543210\n919876543211"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Message Template
        </label>
        <textarea
          rows={6}
          value={message.messageTemplate}
          onChange={(e) =>
            setMessage({
              ...message,
              messageTemplate: e.target.value,
            })
          }
          placeholder="Hello {{name}}, your order {{orderId}} is ready!"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          required
        />
      </div>

      <button
        type="submit"
        disabled={
          isLoading ||
          (message.contacts.trim() === "" && selectedContacts.length === 0)
        }
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
            Sending Bulk...
          </>
        ) : (
          <>
            <FiUsers className="mr-2" />
            Send to{" "}
            {selectedContacts.length +
              (message.contacts.trim() !== ""
                ? message.contacts.split("\n").filter((n) => n.trim() !== "")
                    .length
                : 0)}{" "}
            recipients
          </>
        )}
      </button>
    </form>
  );
}
