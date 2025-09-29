import { useState } from 'react';
import { FiChevronRight, FiChevronLeft } from 'react-icons/fi';
import RecipientStep from './RecipientStep';
import MessageStep from './MessageStep';  // Add this import

import ReviewStep from './ReviewStep';  // Add this import
import ScheduleStep from './ScheduleStep';

const steps = [
  { id: 'recipients', name: 'Recipients' },
  { id: 'message', name: 'Message' },
  { id: 'schedule', name: 'Schedule' },
  { id: 'review', name: 'Review' },
];

export default function CampaignBuilder() {
  const [currentStep, setCurrentStep] = useState(0);
  const [campaign, setCampaign] = useState({
    name: '',
    recipients: [],
    message: '',
    media: null,
    scheduledAt: null,
    isRecurring: false,
  });

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateCampaign = (data) => {
    setCampaign({ ...campaign, ...data });
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <RecipientStep
            campaign={campaign}
            updateCampaign={updateCampaign}
          />
        );
      case 1:
        return (
          <MessageStep campaign={campaign} updateCampaign={updateCampaign} />
        );
      case 2:
        return (
          <ScheduleStep
            campaign={campaign}
            updateCampaign={updateCampaign}
          />
        );
      case 3:
        return <ReviewStep campaign={campaign} />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">New Campaign</h2>
        <p className="text-gray-600">
          Create a new WhatsApp message campaign
        </p>
      </div>

      <nav className="flex items-center mb-8">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <button
              onClick={() => setCurrentStep(index)}
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                currentStep === index
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {step.name}
            </button>
            {index < steps.length - 1 && (
              <FiChevronRight className="mx-1 text-gray-400" />
            )}
          </div>
        ))}
      </nav>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        {renderStep()}
      </div>

      <div className="flex justify-between">
        <button
          onClick={prevStep}
          disabled={currentStep === 0}
          className="btn-primary bg-gray-500 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          <FiChevronLeft className="mr-1" />
          Previous
        </button>
        {currentStep < steps.length - 1 ? (
          <button
            onClick={nextStep}
            className="btn-primary flex items-center"
          >
            Next
            <FiChevronRight className="ml-1" />
          </button>
        ) : (
          <button
            onClick={() => alert('Campaign submitted!')}
            className="btn-primary bg-green-600 hover:bg-green-700"
          >
            Launch Campaign
          </button>
        )}
      </div>
    </div>
  );
}