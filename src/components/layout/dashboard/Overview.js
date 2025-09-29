import { useEffect, useState } from "react";
import { FiCheck, FiMessageSquare, FiSend, FiUsers } from "react-icons/fi";
import { getContacts } from "../../../services/contactService";

import CampaignProgress from "./CampaignProgress";
import RecentActivity from "./RecentActivity";

export default function Overview() {
  const [totalContacts, setTotalContacts] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const contacts = await getContacts();
        setTotalContacts(contacts.length);
      } catch (error) {
        console.error("Error fetching contacts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContacts();
  }, []);

  const stats = [
    {
      name: "Total Messages",
      value: "1,234",
      icon: FiMessageSquare,
      change: "+12%",
      changeType: "positive",
      bgGradient: "from-purple-500 to-indigo-500",
      iconColor: "text-purple-100",
    },
    {
      name: "Total Contacts",
      value: isLoading ? "Loading..." : totalContacts.toLocaleString(),
      icon: FiUsers,
      change: "+5%",
      changeType: "positive",
      bgGradient: "from-blue-500 to-cyan-500",
      iconColor: "text-blue-100",
    },
    {
      name: "Delivery Rate",
      value: "92%",
      icon: FiCheck,
      change: "+2%",
      changeType: "positive",
      bgGradient: "from-green-500 to-emerald-500",
      iconColor: "text-green-100",
    },
    {
      name: "Response Rate",
      value: "34%",
      icon: FiSend,
      change: "-3%",
      changeType: "negative",
      bgGradient: "from-amber-500 to-orange-500",
      iconColor: "text-amber-100",
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
        Dashboard
      </h2>

      {/* Modern Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className={`bg-gradient-to-br ${stat.bgGradient} rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}
          >
            <div className="p-5 text-white">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium opacity-90">{stat.name}</p>
                  <p className="mt-1 text-3xl font-bold">{stat.value}</p>
                </div>
                <div
                  className={`p-2 rounded-lg bg-white/20 backdrop-blur-sm ${stat.iconColor}`}
                >
                  <stat.icon className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span
                  className={`inline-flex items-center text-sm font-semibold ${
                    stat.changeType === "positive"
                      ? "text-white"
                      : "text-amber-200"
                  }`}
                >
                  {stat.change}
                  <span className="ml-1 text-xs font-normal opacity-80">
                    vs last week
                  </span>
                </span>
              </div>
            </div>
            <div className="h-1 bg-white/20"></div> {/* Progress indicator */}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <CampaignProgress />
        </div>
        <div>
          <RecentActivity />
        </div>
      </div>
    </div>
  );
}
