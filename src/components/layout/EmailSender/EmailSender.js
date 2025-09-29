import React, { useState, useEffect } from 'react';
import ComposeTab from './ComposeTab';
import ContactsTab from './ContactsTab';
import SmtpTab from './SmtpTab';
import { FiSend, FiUsers, FiSettings } from 'react-icons/fi';

const BulkEmailSender = () => {
  const [activeTab, setActiveTab] = useState('compose');
  const [error, setError] = useState(null);
  const [sendSuccess, setSendSuccess] = useState(false);
  
  // Shared state that might be needed across tabs
  const [contacts, setContacts] = useState([]);
  const [contactHeaders, setContactHeaders] = useState([]);
  const [selectedContactList, setSelectedContactList] = useState(null);

  // Clear notifications after 3 seconds
  useEffect(() => {
    if (error || sendSuccess) {
      const timer = setTimeout(() => {
        setError(null);
        setSendSuccess(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, sendSuccess]);

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Bulk Email Sender</h1>
      
      {/* Navigation Tabs */}
      <div className="flex border-b mb-6">
        <TabButton 
          active={activeTab === 'compose'}
          onClick={() => setActiveTab('compose')}
          icon={<FiSend className="mr-2" />}
        >
          Compose
        </TabButton>
        <TabButton 
          active={activeTab === 'contacts'}
          onClick={() => setActiveTab('contacts')}
          icon={<FiUsers className="mr-2" />}
        >
          Contacts
        </TabButton>
        <TabButton 
          active={activeTab === 'smtp'}
          onClick={() => setActiveTab('smtp')}
          icon={<FiSettings className="mr-2" />}
        >
          SMTP
        </TabButton>
      </div>
      
      {/* Error/Success Messages */}
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
          <p>{error}</p>
        </div>
      )}
      
      {sendSuccess && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6">
          <p>Emails sent successfully!</p>
        </div>
      )}
      
      {/* Tab Content */}
      <div>
        {activeTab === 'compose' && (
          <ComposeTab 
            contacts={contacts}
            contactHeaders={contactHeaders}
            selectedContactList={selectedContactList}
            setError={setError}
            setSendSuccess={setSendSuccess}
          />
        )}
        
        {activeTab === 'contacts' && (
          <ContactsTab 
            contacts={contacts}
            setContacts={setContacts}
            contactHeaders={contactHeaders}
            setContactHeaders={setContactHeaders}
            selectedContactList={selectedContactList}
            setSelectedContactList={setSelectedContactList}
            setError={setError}
          />
        )}
        
        {activeTab === 'smtp' && (
          <SmtpTab setError={setError} />
        )}
      </div>
    </div>
  );
};

// Reusable Tab Button Component
const TabButton = ({ active, onClick, icon, children }) => (
  <button
    className={`py-2 px-4 font-medium flex items-center ${active ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
    onClick={onClick}
  >
    {icon}
    {children}
  </button>
);

export default BulkEmailSender;