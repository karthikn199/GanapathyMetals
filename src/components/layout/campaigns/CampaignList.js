import { useState } from 'react';
import CampaignCard from './CampaignCard';
import { FiPlus } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const mockCampaigns = [
  {
    id: '1',
    name: 'Summer Sale',
    status: 'completed',
    scheduledAt: new Date('2023-06-15'),
    stats: { total: 250, sent: 250, delivered: 230 },
  },
  {
    id: '2',
    name: 'New Product Launch',
    status: 'scheduled',
    scheduledAt: new Date('2023-07-01'),
    stats: { total: 150, sent: 0, delivered: 0 },
  },
];

export default function CampaignList() {
  const [campaigns] = useState(mockCampaigns);
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Campaigns</h2>
        <button
          onClick={() => navigate('/campaigns/new')}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <FiPlus className="mr-2" />
          New Campaign
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns.map((campaign) => (
          <CampaignCard key={campaign.id} {...campaign} />
        ))}
      </div>
    </div>
  );
}