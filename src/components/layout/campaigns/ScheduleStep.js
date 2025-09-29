import { useState } from 'react';
import { FiCalendar, FiClock } from 'react-icons/fi';

export default function ScheduleStep({ campaign, updateCampaign }) {
  const [scheduledAt, setScheduledAt] = useState(campaign.scheduledAt || '');
  const [isRecurring, setIsRecurring] = useState(campaign.isRecurring || false);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Schedule your campaign</h3>
        
        <div className="space-y-4">
          <div>
            <label className="flex items-center">
              <input
                type="radio"
                name="schedule"
                className="h-4 w-4 text-indigo-600"
                checked={!scheduledAt}
                onChange={() => {
                  setScheduledAt(null);
                  updateCampaign({ scheduledAt: null });
                }}
              />
              <span className="ml-2 text-gray-700">Send immediately</span>
            </label>
          </div>

          <div>
            <label className="flex items-start">
              <input
                type="radio"
                name="schedule"
                className="h-4 w-4 text-indigo-600 mt-1"
                checked={!!scheduledAt}
                onChange={() => {
                  const now = new Date();
                  now.setHours(now.getHours() + 1);
                  setScheduledAt(now.toISOString().slice(0, 16));
                  updateCampaign({ scheduledAt: now.toISOString().slice(0, 16) });
                }}
              />
              <div className="ml-2">
                <span className="text-gray-700">Schedule for later</span>
                {!!scheduledAt && (
                  <div className="mt-2 flex items-center">
                    <input
                      type="datetime-local"
                      className="input-field"
                      value={scheduledAt}
                      onChange={(e) => {
                        setScheduledAt(e.target.value);
                        updateCampaign({ scheduledAt: e.target.value });
                      }}
                    />
                  </div>
                )}
              </div>
            </label>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-200">
        <label className="flex items-center">
          <input
            type="checkbox"
            className="h-4 w-4 text-indigo-600"
            checked={isRecurring}
            onChange={(e) => {
              setIsRecurring(e.target.checked);
              updateCampaign({ isRecurring: e.target.checked });
            }}
          />
          <span className="ml-2 text-gray-700">Make this a recurring message</span>
        </label>
      </div>
    </div>
  );
}