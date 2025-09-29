import { FiBarChart2 } from 'react-icons/fi';

const campaigns = [
  { name: 'Summer Sale', progress: 80, status: 'active' },
  { name: 'New Product', progress: 45, status: 'active' },
  { name: 'Holiday Offer', progress: 100, status: 'completed' },
];

export default function CampaignProgress() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Campaign Progress</h3>
        <button className="text-sm text-indigo-600 hover:text-indigo-800">
          View all
        </button>
      </div>

      <div className="space-y-4">
        {campaigns.map((campaign, index) => (
          <div key={index}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">
                {campaign.name}
              </span>
              <span className="text-xs text-gray-500">
                {campaign.progress}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${
                  campaign.status === 'completed'
                    ? 'bg-green-500'
                    : 'bg-indigo-500'
                }`}
                style={{ width: `${campaign.progress}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center">
          <div className="p-2 rounded-lg bg-indigo-100 text-indigo-600 mr-3">
            <FiBarChart2 className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-900">
              Campaign Analytics
            </h4>
            <p className="text-sm text-gray-500">
              View detailed performance metrics
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}