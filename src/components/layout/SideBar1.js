import { NavLink } from 'react-router-dom';
import { FiMessageSquare, FiUsers, FiCalendar, FiSettings } from 'react-icons/fi';

const navItems = [
  { path: '/', icon: <FiMessageSquare size={20} />, label: 'Dashboard' },
  { path: '/contacts', icon: <FiUsers size={20} />, label: 'Contacts' },
  { path: '/campaigns', icon: <FiCalendar size={20} />, label: 'Campaigns' },
  { path: '/settings', icon: <FiSettings size={20} />, label: 'Settings' },
];

export default function Sidebar() {
  return (
    <div className="w-64 bg-white shadow-sm border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-indigo-600">WhatsAuto</h1>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-gray-600 hover:bg-gray-100'
              }`
            }
          >
            <span className="mr-3">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}