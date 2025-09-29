import { FiCheckCircle, FiAlertCircle, FiClock } from 'react-icons/fi';

const activities = [
  {
    id: 1,
    type: 'success',
    title: 'Campaign "Summer Sale" completed',
    description: '250 messages sent successfully',
    time: '2 hours ago',
    icon: FiCheckCircle,
  },
  {
    id: 2,
    type: 'warning',
    title: 'Campaign "New Product" scheduled',
    description: 'Will be sent on July 1, 2023',
    time: '1 day ago',
    icon: FiClock,
  },
  {
    id: 3,
    type: 'error',
    title: '5 messages failed to deliver',
    description: 'Check recipient phone numbers',
    time: '2 days ago',
    icon: FiAlertCircle,
  },
];

export default function RecentActivity() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-full">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex">
            <div className="flex-shrink-0 mr-3">
              <activity.icon
                className={`h-5 w-5 ${
                  activity.type === 'success'
                    ? 'text-green-500'
                    : activity.type === 'warning'
                    ? 'text-yellow-500'
                    : 'text-red-500'
                }`}
              />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{activity.title}</p>
              <p className="text-sm text-gray-500">{activity.description}</p>
              <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <button className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
          View all activity
        </button>
      </div>
    </div>
  );
}