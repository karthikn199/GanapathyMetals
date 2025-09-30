import { useEffect, useState } from "react";
import {
  FiActivity,
  FiArrowDown,
  FiArrowUp,
  FiCalendar,
  FiDollarSign,
  FiPackage,
  FiShoppingCart,
  FiStar,
  FiUsers,
} from "react-icons/fi";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const DashboardG = () => {
  const [timeRange, setTimeRange] = useState("monthly");
  const [loading, setLoading] = useState(true);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Sample data - Replace with actual API data
  const salesData = [
    { month: "Jan", sales: 45, revenue: 125000, target: 40 },
    { month: "Feb", sales: 52, revenue: 142000, target: 45 },
    { month: "Mar", sales: 48, revenue: 138000, target: 50 },
    { month: "Apr", sales: 60, revenue: 165000, target: 55 },
    { month: "May", sales: 55, revenue: 152000, target: 52 },
    { month: "Jun", sales: 68, revenue: 185000, target: 60 },
  ];

  const inventoryData = [
    { name: "Steel Plates", value: 35, color: "#4f46e5" },
    { name: "Aluminum", value: 25, color: "#06b6d4" },
    { name: "Copper", value: 20, color: "#10b981" },
    { name: "Brass", value: 15, color: "#f59e0b" },
    { name: "Other", value: 5, color: "#ef4444" },
  ];

  const statsCards = [
    {
      title: "Total Revenue",
      value: "₹8,42,000",
      change: "+12.5%",
      trend: "up",
      icon: <FiDollarSign className="h-6 w-6" />,
      color: "from-green-500 to-emerald-600",
      bgColor: "bg-gradient-to-br from-green-50 to-emerald-100",
    },
    {
      title: "Orders Processed",
      value: "248",
      change: "+8.2%",
      trend: "up",
      icon: <FiShoppingCart className="h-6 w-6" />,
      color: "from-blue-500 to-cyan-600",
      bgColor: "bg-gradient-to-br from-blue-50 to-cyan-100",
    },
    {
      title: "Inventory Items",
      value: "1,284",
      change: "-2.1%",
      trend: "down",
      icon: <FiPackage className="h-6 w-6" />,
      color: "from-purple-500 to-pink-600",
      bgColor: "bg-gradient-to-br from-purple-50 to-pink-100",
    },
    {
      title: "Active Clients",
      value: "89",
      change: "+5.6%",
      trend: "up",
      icon: <FiUsers className="h-6 w-6" />,
      color: "from-orange-500 to-amber-600",
      bgColor: "bg-gradient-to-br from-orange-50 to-amber-100",
    },
  ];

  const recentActivities = [
    {
      id: 1,
      type: "order",
      message: "New order #ORD-2847 received",
      time: "2 min ago",
      status: "completed",
    },
    {
      id: 2,
      type: "payment",
      message: "Payment received for INV-4821",
      time: "15 min ago",
      status: "completed",
    },
    {
      id: 3,
      type: "inventory",
      message: "Low stock alert for Steel Plates",
      time: "1 hour ago",
      status: "warning",
    },
    {
      id: 4,
      type: "shipment",
      message: "Shipment #SH-8472 dispatched",
      time: "2 hours ago",
      status: "completed",
    },
  ];

  const quickActions = [
    { icon: <FiPackage />, label: "Add Inventory", color: "bg-blue-500" },
    { icon: <FiUsers />, label: "New Client", color: "bg-green-500" },
    { icon: <FiDollarSign />, label: "Create Invoice", color: "bg-purple-500" },
    { icon: <FiCalendar />, label: "Schedule", color: "bg-orange-500" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50/30 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50/50 to-blue-50/30 p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Dashboard
              </h1>
              <p className="text-gray-600 mt-2">
                Welcome back! Here's what's happening with Ganapathy Metals
                today.
              </p>
            </div>
            <div className="flex items-center space-x-4 mt-4 lg:mt-0">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 rounded-xl border border-gray-200 bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200"
              >
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="yearly">Yearly</option>
              </select>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg shadow-indigo-500/25">
                Generate Report
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((stat, index) => (
            <div
              key={index}
              className={`${stat.bgColor} rounded-2xl p-6 backdrop-blur-sm border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-800 mt-2">
                    {stat.value}
                  </p>
                  <div
                    className={`flex items-center mt-2 text-sm ${
                      stat.trend === "up" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {stat.trend === "up" ? (
                      <FiArrowUp className="mr-1" />
                    ) : (
                      <FiArrowDown className="mr-1" />
                    )}
                    {stat.change}
                  </div>
                </div>
                <div
                  className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} text-white shadow-lg`}
                >
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Sales Chart */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">
                Sales & Revenue
              </h3>
              <div className="flex items-center space-x-2 text-sm">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-indigo-500 rounded-full mr-2"></div>
                  <span className="text-gray-600">Sales</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-gray-600">Revenue</span>
                </div>
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      borderRadius: "12px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#10b981"
                    fill="url(#colorRevenue)"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="sales"
                    stroke="#4f46e5"
                    fill="url(#colorSales)"
                    strokeWidth={2}
                  />
                  <defs>
                    <linearGradient
                      id="colorRevenue"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Inventory Chart */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">
              Inventory Distribution
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={inventoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {inventoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      borderRadius: "12px",
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activities */}
          <div className="lg:col-span-2 bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">
              Recent Activities
            </h3>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center p-4 rounded-xl bg-gradient-to-r from-white to-gray-50/50 border border-gray-100 hover:border-indigo-100 transition-all duration-200 group hover:shadow-md"
                >
                  <div
                    className={`p-2 rounded-lg ${
                      activity.status === "completed"
                        ? "bg-green-100 text-green-600"
                        : "bg-amber-100 text-amber-600"
                    } group-hover:scale-110 transition-transform duration-200`}
                  >
                    <FiActivity className="h-4 w-4" />
                  </div>
                  <div className="ml-4 flex-1">
                    <p className="text-gray-800 font-medium">
                      {activity.message}
                    </p>
                    <p className="text-gray-500 text-sm">{activity.time}</p>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      activity.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {activity.status}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  className={`${action.color} p-4 rounded-xl text-white flex flex-col items-center justify-center aspect-square transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl`}
                >
                  <div className="text-2xl mb-2">{action.icon}</div>
                  <span className="text-sm font-medium text-center">
                    {action.label}
                  </span>
                </button>
              ))}
            </div>

            {/* Performance Metric */}
            <div className="mt-6 p-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Performance Score</p>
                  <p className="text-2xl font-bold">94%</p>
                </div>
                <div className="p-2 bg-white/20 rounded-lg">
                  <FiStar className="h-6 w-6" />
                </div>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2 mt-3">
                <div
                  className="bg-white rounded-full h-2 transition-all duration-1000 ease-out"
                  style={{ width: "94%" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardG;
