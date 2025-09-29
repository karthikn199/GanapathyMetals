import { useEffect, useState } from "react";
import { FiPlus, FiUpload, FiUsers } from "react-icons/fi";
import { getContacts } from "../../../services/contactService";
import BulkContactUpload from "../contacts/BulkUploadContacts";

export default function RecipientStep({ campaign, updateCampaign }) {
  const [selectedOption, setSelectedOption] = useState("existing");
  const [searchTerm, setSearchTerm] = useState("");
  const [contacts, setContacts] = useState([]);
  const [contactGroups, setContactGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Fetch contacts and groups
  const fetchContacts = async () => {

    setError(null);
    try {
      // Use the exact same API call as your working contact screen
      const response = await fetch("http://localhost:4000/api/contacts", {
        headers: {
          Accept: "application/json",
          // Add auth header if needed
          // 'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
      });

      // Debugging log
      console.log("Response status:", response.status);

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Failed to fetch");
      }

      const data = await response.json();
      setContacts(data);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message);
    } finally {
     
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  // Filter contacts based on search term
  const filteredContacts = contacts.filter((contact) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      contact.full_name?.toLowerCase().includes(searchLower) ||
      contact.phone_number?.includes(searchTerm) ||
      contact.email?.toLowerCase().includes(searchLower)
    );
  });

  // Handle contact selection
  const handleContactSelect = (contact) => {
    const isSelected = campaign.recipients.some((r) => r.id === contact.id);
    const newRecipients = isSelected
      ? campaign.recipients.filter((r) => r.id !== contact.id)
      : [
          ...campaign.recipients,
          {
            id: contact.id,
            name: contact.full_name,
            phone: contact.phone_number,
            email: contact.email,
          },
        ];

    updateCampaign({ recipients: newRecipients });
  };

  // Handle successful upload
  const handleUploadSuccess = (result) => {
    setShowUploadModal(false);
    // Refresh contacts list
    getContacts().then((data) => setContacts(data));
    // Add new contacts to recipients
    updateCampaign({
      recipients: [
        ...campaign.recipients,
        ...result.data.map((contact) => ({
          id: contact.id,
          name: contact.full_name,
          phone: contact.phone_number,
          email: contact.email,
        })),
      ],
    });
  };

  if (isLoading)
    return <div className="text-center py-8">Loading contacts...</div>;
  if (error)
    return <div className="text-red-500 text-center py-8">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Select recipients
        </h3>
        <div className="flex space-x-4">
          <button
            onClick={() => setSelectedOption("existing")}
            className={`px-4 py-2 rounded-md ${
              selectedOption === "existing"
                ? "bg-indigo-100 text-indigo-700"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            Existing Contacts
          </button>
          <button
            onClick={() => setSelectedOption("new")}
            className={`px-4 py-2 rounded-md ${
              selectedOption === "new"
                ? "bg-indigo-100 text-indigo-700"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            New Contacts
          </button>
        </div>
      </div>

      {selectedOption === "existing" ? (
        <>
          <div className="relative">
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Search contacts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FiUsers className="absolute left-3 top-3 text-gray-400" />
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-700 mb-3">Contact Groups</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {contactGroups.map((group) => (
                  <div
                    key={group.id}
                    className="border rounded-lg p-3 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => {
                      // Implement group selection logic if needed
                    }}
                  >
                    <div className="font-medium">{group.name}</div>
                    <div className="text-sm text-gray-500">
                      {group.count || 0} contacts
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-700 mb-3">
                Individual Contacts
              </h4>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredContacts.map((contact) => (
                  <div
                    key={contact.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="min-w-0">
                      <p className="font-medium truncate">
                        {contact.full_name}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {contact.phone_number}
                      </p>
                      {contact.email && (
                        <p className="text-xs text-gray-400 truncate">
                          {contact.email}
                        </p>
                      )}
                    </div>
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-indigo-600 rounded"
                      checked={campaign.recipients.some(
                        (r) => r.id === contact.id
                      )}
                      onChange={() => handleContactSelect(contact)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <FiPlus className="mx-auto h-12 w-12 text-gray-400" />
          <h4 className="mt-2 text-sm font-medium text-gray-700">
            Add new contacts
          </h4>
          <p className="mt-1 text-sm text-gray-500">
            Import contacts via CSV or Excel
          </p>
          <button
            onClick={() => setShowUploadModal(true)}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            <FiUpload className="inline mr-2" />
            Import Contacts
          </button>
        </div>
      )}

      {/* Bulk Upload Modal */}
      {showUploadModal && (
        <BulkContactUpload
          onClose={() => setShowUploadModal(false)}
          onUploadSuccess={handleUploadSuccess}
        />
      )}
    </div>
  );
}
