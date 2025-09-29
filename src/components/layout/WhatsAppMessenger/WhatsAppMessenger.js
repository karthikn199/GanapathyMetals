import axios from "axios";
import { useEffect, useState } from "react";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";
import BulkMessageTab from "./BulkMessageTab";
import ContactsList from "./ContactList";
import FileMessageTab from "./FileMessageTab";
import RecentMessagesTable from "./RecentMessagesTable";
import SingleMessageTab from "./SingleMessageTab";

const API_BASE_URL = "http://localhost:4000/api/whatsapp";

export default function WhatsAppMessenger() {
  const [activeTab, setActiveTab] = useState("single");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");
  const [messageStats, setMessageStats] = useState({
    sent: 0,
    failed: 0,
    pending: 0,
  });
  const [recentMessages, setRecentMessages] = useState([]);

  useEffect(() => {
    fetchMessageStats();
    fetchRecentMessages();
  }, []);

  const fetchMessageStats = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/message-stats`);
      setMessageStats(res?.data);

      console.log("Test==>", res.data);
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    }
  };

  const fetchRecentMessages = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/recent-messages`);
      setRecentMessages(res.data);
    } catch (err) {
      console.error("Failed to fetch recent messages:", err);
    }
  };

  const handleSuccess = (message) => {
    setSuccessMessage(message);
    setError("");
    fetchMessageStats();
    fetchRecentMessages();

    // Clear success message after 3 seconds
    const timer = setTimeout(() => {
      setSuccessMessage("");
    }, 3000);

    // Clean up the timer when component unmounts or when a new message appears
    return () => clearTimeout(timer);
  };

  const handleError = (errorMessage) => {
    setError(errorMessage);
    setSuccessMessage("");
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 rounded-xl">
      {/* Stats Cards */}
      {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
              <FiCheckCircle size={24} />
            </div>
            <div>
              <h3 className="text-gray-500 text-sm font-medium">Sent</h3>
              <p className="text-2xl font-bold">{messageStats.sent}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
              <FiMessageSquare size={24} />
            </div>
            <div>
              <h3 className="text-gray-500 text-sm font-medium">Pending</h3>
              <p className="text-2xl font-bold">{messageStats.pending}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 text-red-600 mr-4">
              <FiXCircle size={24} />
            </div>
            <div>
              <h3 className="text-gray-500 text-sm font-medium">Failed</h3>
              <p className="text-2xl font-bold">{messageStats.failed}</p>
            </div>
          </div>
        </div>
      </div> */}

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("single")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "single"
                ? "border-indigo-500 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Single Message
          </button>
          <button
            onClick={() => setActiveTab("bulk")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "bulk"
                ? "border-indigo-500 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Bulk Message
          </button>
          <button
            onClick={() => setActiveTab("file")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "file"
                ? "border-indigo-500 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Send File
          </button>

          <button
            onClick={() => setActiveTab("recent")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "recent"
                ? "border-indigo-500 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Recent Messages
          </button>

          <button
            onClick={() => setActiveTab("contact")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "contact"
                ? "border-indigo-500 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Contacts
          </button>
        </nav>
      </div>

      {/* Messages */}
      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <FiXCircle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {successMessage && (
        <div className="mb-6 bg-green-50 border-l-4 border-green-400 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <FiCheckCircle className="h-5 w-5 text-green-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">{successMessage}</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content */}

      {activeTab === "contact" && <ContactsList />}

      {activeTab === "single" && (
        <SingleMessageTab
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          onSuccess={handleSuccess}
          onError={handleError}
        />
      )}

      {activeTab === "bulk" && (
        <BulkMessageTab
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          onSuccess={handleSuccess}
          onError={handleError}
        />
      )}

      {activeTab === "file" && (
        <FileMessageTab
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          onSuccess={handleSuccess}
          onError={handleError}
        />
      )}

      {activeTab === "recent" && (
        <RecentMessagesTable messages={recentMessages} />
      )}
    </div>
  );
}
