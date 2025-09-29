import { Outlet } from "react-router-dom";

import { useAuth } from "../../contexts/AuthContext";
import Topbar from "./Topbar";

export default function DashboardLayout() {
  const { user } = useAuth();

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar user={user} />
        <main className="flex-1 overflow-y-auto px-24 py-3 bg-gray-100">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
