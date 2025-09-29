import { FiUser, FiMessageSquare, FiCalendar } from 'react-icons/fi';

export default function ReviewStep({ campaign }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Review your campaign</h3>
        
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-800 mb-3">Campaign Summary</h4>
          
          <div className="space-y-4">
            <div className="flex items-start">
              <FiUser className="mt-1 mr-3 text-gray-500" />
              <div>
                <h5 className="text-sm font-medium text-gray-500">Recipients</h5>
                <p className="text-sm text-gray-800">
                  {campaign.recipients.length} contacts selected
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <FiMessageSquare className="mt-1 mr-3 text-gray-500" />
              <div>
                <h5 className="text-sm font-medium text-gray-500">Message</h5>
                <p className="text-sm text-gray-800 whitespace-pre-line">
                  {campaign.message || 'No message entered'}
                </p>
                {campaign.media && (
                  <p className="text-sm text-gray-500 mt-1">
                    Attachment: {campaign.media.name || 'File'}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-start">
              <FiCalendar className="mt-1 mr-3 text-gray-500" />
              <div>
                <h5 className="text-sm font-medium text-gray-500">Schedule</h5>
                <p className="text-sm text-gray-800">
                  {campaign.scheduledAt
                    ? new Date(campaign.scheduledAt).toLocaleString()
                    : 'Send immediately'}
                </p>
                {campaign.isRecurring && (
                  <p className="text-sm text-gray-500 mt-1">(Recurring message)</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}