import axios from "axios";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { FiPaperclip, FiPlus, FiSend, FiTrash2, FiX } from "react-icons/fi";
import MergeTagSelector from "./MergeTagSelector";

const API_BASE_URL = "http://localhost:4000/api";

const ComposeTab = ({
  contacts,
  contactHeaders,
  selectedContactList,
  setError,
  setSendSuccess,
}) => {
  const [to, setTo] = useState([]);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [files, setFiles] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [campaignName, setCampaignName] = useState("");
  const [htmlMode, setHtmlMode] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (files.length + acceptedFiles.length > 5) {
        setError("Maximum 5 attachments allowed");
        return;
      }
      setFiles([...files, ...acceptedFiles]);
    },
    maxFiles: 5 - files.length,
  });

  const saveDraft = async () => {
    setIsSavingDraft(true);
    try {
      const recipients = selectedContactList
        ? contacts.map((c) => c.email)
        : to;

      const formData = new FormData();
      formData.append("name", campaignName);
      formData.append("subject", subject);
      formData.append("message", body);
      recipients.forEach((email) => formData.append("recipients", email));

      files.forEach((file) => {
        formData.append("attachments", file);
      });

      await axios.post(`${API_BASE_URL}/campaigns`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setError(null);
      alert("Draft saved successfully");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save draft");
      console.error("Error saving draft:", err);
    } finally {
      setIsSavingDraft(false);
    }
  };

  const handleSend = async () => {
    if (!contacts.length && !to.length) {
      setError("Please add recipients or upload a contact list");
      return;
    }

    if (!subject) {
      setError("Please add a subject");
      return;
    }

    if (!body) {
      setError("Please add email content");
      return;
    }

    setIsSending(true);
    setError(null);

    try {
      // First save the campaign
      const recipients = selectedContactList
        ? contacts.map((c) => c.email)
        : to;

      const formData = new FormData();
      formData.append("name", campaignName);
      formData.append("subject", subject);
      formData.append("message", body);
      recipients.forEach((email) => formData.append("recipients", email));

      files.forEach((file) => {
        formData.append("attachments", file);
      });

      const saveResponse = await axios.post(
        `${API_BASE_URL}/campaigns`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Then send test email (in real implementation, you'd send to all recipients)
      await axios.post("/api/campaigns/test", {
        campaignId: saveResponse.data.campaign.id,
        testEmails: recipients.slice(0, 1), // Just send to first recipient for demo
      });

      setSendSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send emails");
      console.error("Error sending campaign:", err);
    } finally {
      setIsSending(false);
    }
  };

  const handleSendTest = async () => {
    if (!contacts.length && !to.length) {
      setError("Please add recipients or upload a contact list");
      return;
    }

    if (!subject) {
      setError("Please add a subject");
      return;
    }

    if (!body) {
      setError("Please add email content");
      return;
    }

    setIsSending(true);
    setError(null);

    try {
      const testEmail = prompt("Enter test email address:");
      if (!testEmail) return;

      // First save the campaign
      const recipients = selectedContactList
        ? contacts.map((c) => c.email)
        : to;

      const formData = new FormData();
      formData.append("name", campaignName);
      formData.append("subject", subject);
      formData.append("message", body);
      recipients.forEach((email) => formData.append("recipients", email));

      files.forEach((file) => {
        formData.append("attachments", file);
      });

      const saveResponse = await axios.post(
        `${API_BASE_URL}/campaigns`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Then send test email
      await axios.post(`${API_BASE_URL}/campaigns/test`, {
        campaignId: saveResponse.data.campaign.id,
        testEmails: [testEmail],
      });

      alert("Test email sent successfully");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send test email");
      console.error("Error sending test email:", err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-2">
          Campaign Name
        </label>
        <input
          type="text"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={campaignName}
          onChange={(e) => setCampaignName(e.target.value)}
          placeholder="My Email Campaign"
        />
      </div>

      <RecipientSection
        contacts={contacts}
        selectedContactList={selectedContactList}
        to={to}
        setTo={setTo}
      />

      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-2">Subject</label>
        <input
          type="text"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Your email subject"
        />
      </div>

      <EmailBodyEditor
        body={body}
        setBody={setBody}
        htmlMode={htmlMode}
        setHtmlMode={setHtmlMode}
        contactHeaders={contactHeaders}
      />

      <AttachmentSection
        getRootProps={getRootProps}
        getInputProps={getInputProps}
        files={files}
        setFiles={setFiles}
      />

      <div className="flex justify-between items-center mt-6">
        <div className="text-sm text-gray-600">
          <p>This email will include an unsubscribe link automatically.</p>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={saveDraft}
            disabled={isSavingDraft}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-medium flex items-center transition"
          >
            {isSavingDraft ? "Saving..." : "Save Draft"}
          </button>
          <button
            onClick={handleSendTest}
            disabled={isSending}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium flex items-center transition"
          >
            {isSending ? "Sending..." : "Send Test"}
          </button>
          <SendButton isSending={isSending} onClick={handleSend} />
        </div>
      </div>
    </div>
  );
};

const RecipientSection = ({ contacts, selectedContactList, to, setTo }) => (
  <div className="mb-6">
    <label className="block text-gray-700 font-medium mb-2">Recipients</label>
    {selectedContactList ? (
      <div className="flex items-center justify-between bg-gray-100 p-3 rounded-lg mb-2">
        <div className="flex items-center">
          <span>{selectedContactList}</span>
          <span className="ml-2 text-gray-600">
            ({contacts.length} contacts)
          </span>
        </div>
      </div>
    ) : null}

    <div className="mt-4">
      <p className="text-gray-600 mb-2">Or enter individual emails:</p>
      <div className="flex flex-wrap gap-2 mb-2">
        {to.map((email, index) => (
          <div
            key={index}
            className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center"
          >
            {email}
            <button
              onClick={() => setTo(to.filter((e) => e !== email))}
              className="ml-2 text-blue-600 hover:text-blue-800"
            >
              <FiX size={14} />
            </button>
          </div>
        ))}
      </div>
      <EmailInput to={to} setTo={setTo} />
    </div>
  </div>
);

const EmailInput = ({ to, setTo }) => {
  const [input, setInput] = useState("");

  const handleAddEmail = () => {
    if (input.trim() && !to.includes(input.trim())) {
      setTo([...to, input.trim()]);
      setInput("");
    }
  };

  return (
    <div className="flex">
      <input
        type="email"
        className="flex-grow px-4 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Add email address"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleAddEmail();
          }
        }}
      />
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 transition"
        onClick={handleAddEmail}
      >
        <FiPlus />
      </button>
    </div>
  );
};

const EmailBodyEditor = ({
  body,
  setBody,
  htmlMode,
  setHtmlMode,
  contactHeaders,
}) => (
  <div className="mb-6">
    <div className="flex justify-between items-center mb-2">
      <label className="block text-gray-700 font-medium">Message</label>
      <div className="flex space-x-2">
        <button
          className={`px-3 py-1 rounded ${
            !htmlMode ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setHtmlMode(false)}
        >
          Rich Text
        </button>
        <button
          className={`px-3 py-1 rounded ${
            htmlMode ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setHtmlMode(true)}
        >
          HTML
        </button>
      </div>
    </div>

    {!htmlMode ? (
      <textarea
        id="email-body"
        className="w-full px-4 py-2 border rounded-lg h-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Write your email content here..."
      />
    ) : (
      <textarea
        className="w-full px-4 py-2 border rounded-lg h-64 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Paste your HTML here..."
      />
    )}

    <MergeTagSelector contactHeaders={contactHeaders} setBody={setBody} />
  </div>
);

const AttachmentSection = ({
  getRootProps,
  getInputProps,
  files,
  setFiles,
}) => (
  <div className="mb-6">
    <label className="block text-gray-700 font-medium mb-2">Attachments</label>
    <div
      {...getRootProps()}
      className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition mb-2"
    >
      <input {...getInputProps()} />
      <FiPaperclip className="mx-auto text-2xl text-gray-400 mb-2" />
      <p className="text-gray-600">
        Drag & drop files here, or click to select
      </p>
      <p className="text-sm text-gray-500 mt-1">Max 5 files</p>
    </div>
    {files.length > 0 && (
      <div className="mt-2">
        {files.map((file, index) => (
          <div
            key={index}
            className="flex items-center justify-between bg-gray-100 p-2 rounded mb-1"
          >
            <div className="flex items-center">
              <FiPaperclip className="mr-2" />
              <span className="truncate max-w-xs">{file.name}</span>
              <span className="text-gray-500 text-sm ml-2">
                ({(file.size / 1024).toFixed(1)} KB)
              </span>
            </div>
            <button
              onClick={() => setFiles(files.filter((_, i) => i !== index))}
              className="text-red-500 hover:text-red-700"
            >
              <FiTrash2 />
            </button>
          </div>
        ))}
      </div>
    )}
  </div>
);

const SendButton = ({ isSending, onClick }) => (
  <button
    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center transition"
    onClick={onClick}
    disabled={isSending}
  >
    {isSending ? (
      <>
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
        Send Campaign
      </>
    )}
  </button>
);

export default ComposeTab;
