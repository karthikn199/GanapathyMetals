import axios from "axios";
import { debounce } from "lodash";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FiChevronDown, FiUpload, FiX } from "react-icons/fi";
import { FixedSizeList as List } from "react-window";

const API_BASE_URL = "http://localhost:4000/api/whatsapp";

export default function FileMessageTab({
  isLoading,
  setIsLoading,
  onSuccess,
  onError,
}) {
  const [message, setMessage] = useState({
    number: "",
    caption: "",
    file: null,
  });
  const [contacts, setContacts] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loadingContacts, setLoadingContacts] = useState(false);
  const [filePreview, setFilePreview] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
  });

  // Debounced contact fetcher
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

        setContacts((prev) =>
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
    if (!message.number) return [];
    const searchTerm = message.number.toLowerCase();
    return contacts
      .filter(
        (contact) =>
          contact.number?.includes(message.number) ||
          contact.name?.toLowerCase().includes(searchTerm)
      )
      .slice(0, 100); // Limit to first 100 matches
  }, [contacts, message.number]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (e.g., 10MB limit)
    const MAX_SIZE = 10 * 1024 * 1024; // 10MB
    if (file.size > MAX_SIZE) {
      onError("File size exceeds 10MB limit");
      return;
    }

    setMessage({ ...message, file });

    // Create preview for images
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => setFilePreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setFilePreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("number", message.number);
      formData.append("caption", message.caption);
      formData.append("file", message.file);

      // Add progress tracking for large files
      const config = {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          console.log(`Upload progress: ${percentCompleted}%`);
        },
      };

      const response = await axios.post(
        `${API_BASE_URL}/send-file`,
        formData,
        config
      );

      onSuccess(`File sent to ${message.number}`);
      setMessage({ number: "", caption: "", file: null });
      setFilePreview(null);
    } catch (err) {
      onError(err.response?.data?.message || "Failed to send file");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectContact = (contactNumber) => {
    setMessage({ ...message, number: contactNumber });
    setShowDropdown(false);
  };

  const removeFile = () => {
    setMessage({ ...message, file: null });
    setFilePreview(null);
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
                {message.number
                  ? "No matching contacts"
                  : "Start typing to search contacts"}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Caption (optional)
        </label>
        <input
          type="text"
          value={message.caption}
          onChange={(e) => setMessage({ ...message, caption: e.target.value })}
          placeholder="Add a caption..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          File (Image, PDF, etc.)
        </label>

        {filePreview ? (
          <div className="mt-2 relative">
            <img
              src={filePreview}
              alt="Preview"
              className="h-32 object-contain border rounded-md"
            />
            <button
              type="button"
              onClick={removeFile}
              className="absolute top-1 right-1 bg-gray-800 bg-opacity-75 text-white rounded-full p-1"
            >
              <FiX className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="mt-1 flex items-center">
            <label className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <FiUpload className="inline mr-2" />
              Choose File
              <input
                type="file"
                className="sr-only"
                onChange={handleFileChange}
                accept="image/*, .pdf, .doc, .docx, .xls, .xlsx, .ppt, .pptx, .txt"
                required
              />
            </label>
            <span className="ml-2 text-sm text-gray-500">
              {message.file ? message.file.name : "No file chosen"}
            </span>
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading || !message.file}
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
            Uploading...
          </>
        ) : (
          <>
            <FiUpload className="mr-2" />
            Send File
          </>
        )}
      </button>
    </form>
  );
}
