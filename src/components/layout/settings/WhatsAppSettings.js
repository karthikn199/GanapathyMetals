import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { FaQrcode, FaSpinner } from "react-icons/fa";
import { FiCheckCircle } from "react-icons/fi";

const API_BASE_URL = "http://localhost:4000/api/whatsapp";

export default function WhatsAppSettings() {
  const [sessionStatus, setSessionStatus] = useState("disconnected");
  const [qrCode, setQrCode] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const pollIntervalRef = useRef(null);

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, []);

  // Check initial connection status
  useEffect(() => {
    checkConnectionStatus();
  }, []);

  const checkConnectionStatus = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_BASE_URL}/connection-status`);
      const { connected, connecting } = response.data;

      if (connected) {
        setSessionStatus("connected");
      } else if (connecting) {
        setSessionStatus("connecting");
        await fetchQRCode();
      } else {
        setSessionStatus("disconnected");
      }
    } catch (err) {
      console.error("Error checking connection status:", err);
      setError("Failed to check connection status");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchQRCode = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_BASE_URL}/qr-code`);
      setQrCode(response.data.qrCode);
    } catch (err) {
      console.error("Error fetching QR code:", err);
      setError("Failed to get QR code");
    } finally {
      setIsLoading(false);
    }
  };

  const initiateSession = async () => {
    try {
      setSessionStatus("connecting");
      setError(null);
      setIsLoading(true);

      // First check if we're already connected
      const statusResponse = await axios.get(
        `${API_BASE_URL}/connection-status`
      );

      if (statusResponse.data.connected) {
        setSessionStatus("connected");
        setIsLoading(false);
        return;
      }

      // If not connected but QR exists
      if (statusResponse.data.connecting) {
        await fetchQRCode();
        setIsLoading(false);
        return;
      }

      // If completely disconnected, initialize new session
      await axios.post(`${API_BASE_URL}/connect`);

      // Start polling for QR code
      pollIntervalRef.current = setInterval(async () => {
        try {
          const { data } = await axios.get(`${API_BASE_URL}/connection-status`);

          if (data.connected) {
            clearInterval(pollIntervalRef.current);
            setSessionStatus("connected");
            setQrCode(null);
            setIsLoading(false);
          } else if (data.connecting && !qrCode) {
            await fetchQRCode();
          }
        } catch (err) {
          console.error("Polling error:", err);
          clearInterval(pollIntervalRef.current);
          setError("Connection error occurred");
          setIsLoading(false);
        }
      }, 2000);
    } catch (err) {
      console.error("Error initiating session:", err);
      setError("Failed to connect to WhatsApp");
      setSessionStatus("disconnected");
      setIsLoading(false);
    }
  };

  const disconnectSession = async () => {
    try {
      setIsLoading(true);
      await axios.post(`${API_BASE_URL}/disconnect`);
      setSessionStatus("disconnected");
      setQrCode(null);
      setError(null);
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    } catch (err) {
      console.error("Error disconnecting:", err);
      setError("Failed to disconnect");
    } finally {
      setIsLoading(false);
    }
  };

  const handleWebhookSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const webhookUrl = formData.get("webhook-url");
    const events = Array.from(formData.getAll("webhook-events"));

    try {
      setIsLoading(true);
      await axios.post(`${API_BASE_URL}/webhook`, {
        url: webhookUrl,
        events,
      });
      // Show success message or update UI
    } catch (err) {
      console.error("Error configuring webhook:", err);
      setError("Failed to configure webhook");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">
          WhatsApp Connection
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Connect your WhatsApp account to start sending messages
        </p>
      </div>

      {error && (
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
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-gray-900">Session Status</h4>
            <div className="flex items-center mt-1">
              <span
                className={`h-2 w-2 rounded-full mr-2 ${
                  sessionStatus === "connected"
                    ? "bg-green-500"
                    : sessionStatus === "connecting"
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }`}
              ></span>
              <span className="text-sm text-gray-600 capitalize">
                {sessionStatus}
              </span>
            </div>
          </div>

          {sessionStatus === "disconnected" ? (
            <button
              onClick={initiateSession}
              disabled={isLoading}
              className="btn-primary flex items-center"
            >
              {isLoading ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  Connecting...
                </>
              ) : (
                <>
                  <FaQrcode className="mr-2" />
                  Connect WhatsApp
                </>
              )}
            </button>
          ) : (
            <button
              onClick={disconnectSession}
              disabled={isLoading}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              {isLoading ? "Disconnecting..." : "Disconnect"}
            </button>
          )}
        </div>

        {sessionStatus === "connecting" && (
          <div className="mt-6 text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100">
              {isLoading ? (
                <FaSpinner className="h-6 w-6 text-indigo-600 animate-spin" />
              ) : (
                <FaQrcode className="h-6 w-6 text-indigo-600" />
              )}
            </div>
            <h4 className="mt-3 text-lg font-medium text-gray-900">
              Waiting for QR Scan
            </h4>
            <p className="mt-1 text-sm text-gray-500">
              Scan the QR code below with your WhatsApp mobile app
            </p>
            {qrCode && (
              <div className="mt-4 flex justify-center">
                <img
                  src={qrCode}
                  alt="WhatsApp QR Code"
                  className="h-68 w-68"
                />
              </div>
            )}
            {!qrCode && isLoading && (
              <p className="mt-4 text-sm text-gray-500">
                Generating QR code...
              </p>
            )}
          </div>
        )}

        {sessionStatus === "connected" && (
          <div className="mt-6 p-4 bg-green-50 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <FiCheckCircle className="h-5 w-5 text-green-500" />
              </div>
              <div className="ml-3">
                <h4 className="text-sm font-medium text-green-800">
                  WhatsApp successfully connected!
                </h4>
                <p className="mt-1 text-sm text-green-700">
                  You can now send messages through your campaigns.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h4 className="font-medium text-gray-900 mb-4">
          Webhook Configuration
        </h4>
        <form onSubmit={handleWebhookSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="webhook-url"
              className="block text-sm font-medium text-gray-700"
            >
              Webhook URL
            </label>
            <input
              type="url"
              id="webhook-url"
              name="webhook-url"
              className="input-field mt-1"
              placeholder="https://yourdomain.com/webhook"
              required
            />
          </div>
          <div>
            <label
              htmlFor="webhook-events"
              className="block text-sm font-medium text-gray-700"
            >
              Events to Receive
            </label>
            <select
              id="webhook-events"
              name="webhook-events"
              className="input-field mt-1"
              multiple
              required
            >
              <option value="message_received">Message Received</option>
              <option value="message_status_update">
                Message Status Updates
              </option>
            </select>
          </div>
          <button type="submit" className="btn-primary" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Settings"}
          </button>
        </form>
      </div>
    </div>
  );
}
