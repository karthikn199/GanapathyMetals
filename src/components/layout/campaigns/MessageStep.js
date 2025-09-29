import { useState } from 'react';
import { FiPaperclip } from 'react-icons/fi';

export default function MessageStep({ campaign, updateCampaign }) {
  const [message, setMessage] = useState(campaign.message || '');

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Compose your message</h3>
        <textarea
          className="input-field w-full h-40"
          placeholder="Type your WhatsApp message here..."
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            updateCampaign({ message: e.target.value });
          }}
        />
      </div>

      <div>
        <h4 className="font-medium text-gray-700 mb-2">Attachments</h4>
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="file"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                updateCampaign({ media: file });
              }
            }}
          />
          <div className="p-2 rounded-lg bg-gray-100 text-gray-600">
            <FiPaperclip className="h-5 w-5" />
          </div>
          <span className="text-sm text-gray-600">
            {campaign.media ? campaign.media.name : 'Add image or document'}
          </span>
        </label>
      </div>
    </div>
  );
}