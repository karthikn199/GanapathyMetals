import axios from "axios";
import { useEffect, useState } from "react";
import { RiExchangeLine } from "react-icons/ri";

const API_BASE_URL = "http://localhost:4000/api";

const SmtpTab = ({ setError }) => {
  const [smtpProvider, setSmtpProvider] = useState("custom");
  const [smtpConfig, setSmtpConfig] = useState({
    host: "",
    port: 587,
    secure: false,
    auth: {
      user: "",
      pass: "",
    },
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  // Fetch current settings when component mounts
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsLoading(true);

        const response = await axios.get(`${API_BASE_URL}/email-settings`);

        if (response.data) {
          // Map the API response to our component state
          const providerType = response.data.provider_type;
          setSmtpProvider(
            providerType === "custom_smtp"
              ? "custom"
              : providerType === "gmail"
              ? "gmail"
              : providerType === "amazon_ses"
              ? "ses"
              : "sendgrid"
          );

          setSmtpConfig({
            host: response.data.smtp_host,
            port: response.data.port,
            secure: response.data.use_ssl,
            auth: {
              user: response.data.username,
              pass: "", // We don't get the password back from the API for security
            },
          });
        }
      } catch (error) {
        if (error.response && error.response.status !== 404) {
          setError("Failed to load email settings");
          console.error("Error fetching email settings:", error);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, [setError]);

  const handleProviderChange = (provider) => {
    setSmtpProvider(provider);

    // Pre-fill config for known providers
    if (provider === "gmail") {
      setSmtpConfig({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: "",
          pass: "",
        },
      });
    } else if (provider === "ses") {
      setSmtpConfig({
        host: "email-smtp.us-east-1.amazonaws.com",
        port: 587,
        secure: false,
        auth: {
          user: "",
          pass: "",
        },
      });
    } else if (provider === "sendgrid") {
      setSmtpConfig({
        host: "smtp.sendgrid.net",
        port: 587,
        secure: false,
        auth: {
          user: "apikey",
          pass: "",
        },
      });
    } else {
      // Custom SMTP
      setSmtpConfig({
        host: "",
        port: 587,
        secure: false,
        auth: {
          user: "",
          pass: "",
        },
      });
    }
  };

  const handleSaveSettings = async () => {
    try {
      setIsLoading(true);

      // Map our component state to the API expected format
      const apiData = {
        provider_type:
          smtpProvider === "custom"
            ? "custom_smtp"
            : smtpProvider === "gmail"
            ? "gmail"
            : smtpProvider === "ses"
            ? "amazon_ses"
            : "sendgrid",
        smtp_host: smtpConfig.host,
        username: smtpConfig.auth.user,
        password: smtpConfig.auth.pass,
        port: smtpConfig.port,
        use_ssl: smtpConfig.secure,
      };

      const response = await axios.post(
        `${API_BASE_URL}/email-settings`,
        apiData
      );

      setError(null);
      alert(response.data.message || "Settings saved successfully");
    } catch (error) {
      setError("Failed to save email settings");
      console.error("Error saving email settings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestSettings = async () => {
    try {
      setIsTesting(true);

      const response = await axios.post(`${API_BASE_URL}/email-settings/test`, {
        // You might want to send test email details here
        to: "karthiknstr@gmail.com",
        subject: "SMTP Configuration Test",
      });

      alert(response.data.message || "Test email sent successfully");
    } catch (error) {
      setError("Failed to send test email");
      console.error("Error testing email settings:", error);
    } finally {
      setIsTesting(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading email settings...</div>;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Email Provider Settings
      </h2>

      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-2">
          Email Provider
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <ProviderButton
            active={smtpProvider === "custom"}
            onClick={() => handleProviderChange("custom")}
            icon={<RiExchangeLine className="text-2xl mb-2" />}
          >
            Custom SMTP
          </ProviderButton>
          <ProviderButton
            active={smtpProvider === "gmail"}
            onClick={() => handleProviderChange("gmail")}
            icon={
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/7/7e/Gmail_icon_%282020%29.svg"
                alt="Gmail"
                className="h-6 mb-2"
              />
            }
          >
            Gmail
          </ProviderButton>
          <ProviderButton
            active={smtpProvider === "ses"}
            onClick={() => handleProviderChange("ses")}
            icon={
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/AWS_Simple_Icons_AWS_Cloud.svg/1024px-AWS_Simple_Icons_AWS_Cloud.svg.png"
                alt="Amazon SES"
                className="h-6 mb-2"
              />
            }
          >
            Amazon SES
          </ProviderButton>
          <ProviderButton
            active={smtpProvider === "sendgrid"}
            onClick={() => handleProviderChange("sendgrid")}
            icon={
              <img
                src="https://sendgrid.com/wp-content/uploads/2019/10/sendgrid-logo.png"
                alt="SendGrid"
                className="h-6 mb-2"
              />
            }
          >
            SendGrid
          </ProviderButton>
        </div>
      </div>

      <SmtpConfigForm
        smtpProvider={smtpProvider}
        smtpConfig={smtpConfig}
        setSmtpConfig={setSmtpConfig}
      />

      <div className="mt-6 flex space-x-4">
        <button
          onClick={handleSaveSettings}
          disabled={isLoading}
          className={`bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isLoading ? "Saving..." : "Save SMTP Settings"}
        </button>

        <button
          onClick={handleTestSettings}
          disabled={isTesting}
          className={`bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium ${
            isTesting ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isTesting ? "Testing..." : "Test Settings"}
        </button>
      </div>

      <SmtpTips smtpProvider={smtpProvider} />
    </div>
  );
};

const ProviderButton = ({ active, onClick, icon, children }) => (
  <button
    className={`p-4 border rounded-lg flex flex-col items-center ${
      active
        ? "border-blue-500 bg-blue-50"
        : "border-gray-300 hover:border-gray-400"
    }`}
    onClick={onClick}
  >
    {icon}
    <span>{children}</span>
  </button>
);

const SmtpConfigForm = ({ smtpProvider, smtpConfig, setSmtpConfig }) => (
  <div className="bg-gray-50 p-6 rounded-lg">
    <h3 className="text-lg font-medium text-gray-800 mb-4">
      {smtpProvider === "custom"
        ? "Custom SMTP Settings"
        : smtpProvider === "gmail"
        ? "Gmail Settings"
        : smtpProvider === "ses"
        ? "Amazon SES Settings"
        : "SendGrid Settings"}
    </h3>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-gray-700 font-medium mb-2">
          SMTP Host
        </label>
        <input
          type="text"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={smtpConfig.host}
          onChange={(e) =>
            setSmtpConfig({ ...smtpConfig, host: e.target.value })
          }
          placeholder="e.g. smtp.gmail.com"
        />
      </div>
      <div>
        <label className="block text-gray-700 font-medium mb-2">Port</label>
        <input
          type="number"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={smtpConfig.port}
          onChange={(e) =>
            setSmtpConfig({
              ...smtpConfig,
              port: parseInt(e.target.value) || 587,
            })
          }
        />
      </div>
      <div>
        <label className="block text-gray-700 font-medium mb-2">Username</label>
        <input
          type="text"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={smtpConfig.auth.user}
          onChange={(e) =>
            setSmtpConfig({
              ...smtpConfig,
              auth: { ...smtpConfig.auth, user: e.target.value },
            })
          }
          placeholder={
            smtpProvider === "sendgrid" ? "apikey" : "Your email or username"
          }
        />
      </div>
      <div>
        <label className="block text-gray-700 font-medium mb-2">
          Password/API Key
        </label>
        <input
          type="password"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={smtpConfig.auth.pass}
          onChange={(e) =>
            setSmtpConfig({
              ...smtpConfig,
              auth: { ...smtpConfig.auth, pass: e.target.value },
            })
          }
          placeholder="Your password or API key"
        />
      </div>
    </div>

    <div className="mt-4">
      <label className="flex items-center">
        <input
          type="checkbox"
          className="rounded text-blue-500"
          checked={smtpConfig.secure}
          onChange={(e) =>
            setSmtpConfig({ ...smtpConfig, secure: e.target.checked })
          }
        />
        <span className="ml-2 text-gray-700">Use SSL/TLS</span>
      </label>
    </div>
  </div>
);

const SmtpTips = ({ smtpProvider }) => (
  <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400">
    <h4 className="font-medium text-yellow-800">SMTP Configuration Tips</h4>
    <ul className="list-disc pl-5 mt-2 text-yellow-700 text-sm">
      {smtpProvider === "gmail" && (
        <>
          <li>
            For Gmail, you may need to enable "Less secure app access" or create
            an App Password
          </li>
          <li>Recommended port: 587 (TLS) or 465 (SSL)</li>
        </>
      )}
      {smtpProvider === "ses" && (
        <>
          <li>You need to verify your email address in Amazon SES first</li>
          <li>SMTP credentials are different from your AWS access keys</li>
        </>
      )}
      {smtpProvider === "sendgrid" && (
        <>
          <li>Username should be "apikey"</li>
          <li>Password should be your SendGrid API key</li>
        </>
      )}
      <li>Test your settings before sending bulk emails</li>
    </ul>
  </div>
);

export default SmtpTab;
