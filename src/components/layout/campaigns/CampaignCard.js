import { FiCalendar, FiCheck, FiSend, FiClock } from 'react-icons/fi';

const statusConfig = {
  draft: { color: 'bg-gray-200 text-gray-800', icon: <FiClock className="mr-1" /> },
  scheduled: { color: 'bg-blue-100 text-blue-800', icon: <FiCalendar className="mr-1" /> },
  sending: { color: 'bg-yellow-100 text-yellow-800', icon: <FiSend className="mr-1" /> },
  completed: { color: 'bg-green-100 text-green-800', icon: <FiCheck className="mr-1" /> },
  failed: { color: 'bg-red-100 text-red-800', icon: <FiClock className="mr-1" /> },
};

export default function CampaignCard({ id, name, status, scheduledAt, stats }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-5">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusConfig[status].color}`}>
            {statusConfig[status].icon}
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        </div>

        {scheduledAt && (
          <div className="mt-3 flex items-center text-gray-500">
            <FiCalendar className="mr-2" />
            <span>{new Date(scheduledAt).toLocaleDateString()}</span>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-gray-100">
          <div className="flex justify-between text-sm">
            <div className="text-center">
              <div className="text-gray-800 font-medium">{stats.total}</div>
              <div className="text-gray-500">Total</div>
            </div>
            <div className="text-center">
              <div className="text-gray-800 font-medium">{stats.sent}</div>
              <div className="text-gray-500">Sent</div>
            </div>
            <div className="text-center">
              <div className="text-gray-800 font-medium">{stats.delivered}</div>
              <div className="text-gray-500">Delivered</div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 px-5 py-3 flex justify-end space-x-3">
        <button className="text-gray-500 hover:text-gray-700">Edit</button>
        <button className="text-indigo-600 hover:text-indigo-800 font-medium">View Details</button>
      </div>
    </div>
  );
}