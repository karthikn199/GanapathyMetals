import { useState } from "react";
import { FaCertificate, FaFileAlt, FaFileInvoiceDollar } from "react-icons/fa";
import {
  FiBell,
  FiDatabase,
  FiHome,
  FiLogOut,
  FiMenu,
  FiSend,
  FiSettings,
  FiUser,
} from "react-icons/fi";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function Topbar({ user }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { logout } = useAuth();

  const navItems = [
    {
      path: "/",
      icon: <FiHome size={18} className="text-indigo-500" />,
      label: "Dashboard",
      exact: true,
    },
    {
      path: "/CardListing",
      icon: <FiDatabase size={18} className="text-purple-500" />,
      label: "Masters",
    },
    {
      path: "/certificateListing",
      icon: <FaCertificate size={18} className="text-yellow-500" />,
      label: "Certificate",
    },
     {
      path: "/formsListing",
      icon: <FaFileAlt size={18} className="text-blue-500" />,
      label: "Forms",
    },
     {
      path: "/invoice",
      icon: <FaFileInvoiceDollar size={18} className="text-green-500" />,
      label: "Invoice",
    },
   
  ];

  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-gray-200/50 shadow-sm sticky top-0 z-50">
      <div className="px-4 sm:px-6">
        {/* Desktop Navigation */}
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <FiSend className="w-5 h-5 text-indigo-600 transform rotate-45" />
            <div className="ml-2">
              <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Ganapathy Metal
              </h1>
              <p className="text-xs font-medium text-gray-500">
                Powered by{" "}
                <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent font-bold">
                  EFIT
                </span>
              </p>
            </div>
          </div>

          {/* Centered Navigation */}
          <nav className="hidden md:flex mx-auto">
            <div className="flex space-x-1 bg-blue-50/80 rounded-xl p-1 backdrop-blur-sm">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.exact}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-white shadow-sm text-indigo-600 border border-gray-200/50"
                        : "text-gray-600 hover:bg-white/80 hover:text-gray-900"
                    }`
                  }
                >
                  <span className="mr-2">{item.icon}</span>
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>
          </nav>

          {/* Right side icons */}
          <div className="flex items-center space-x-3">
            <button className="p-2 rounded-full relative group transition-all duration-200 hover:bg-gray-100">
              <span className="sr-only">Notifications</span>
              <FiBell className="h-5 w-5 text-gray-500 group-hover:text-indigo-500" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
            </button>

            {/* Profile dropdown */}
            <div className="relative">
              <button
                type="button"
                className="flex items-center max-w-xs rounded-full focus:outline-none group"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <span className="sr-only">Open user menu</span>
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-medium shadow-sm group-hover:shadow-md transition-shadow">
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <span className="ml-2 hidden md:inline text-gray-700 font-medium group-hover:text-indigo-600 transition-colors">
                  {user?.name || "User"}
                </span>
              </button>

              {showDropdown && (
                <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-xl shadow-lg py-1 bg-white border border-gray-100 focus:outline-none z-50 animate-fade-in">
                  <Link
                    to="/profile"
                    className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 transition-colors"
                    onClick={() => setShowDropdown(false)}
                  >
                    <FiUser className="mr-3 text-indigo-500" />
                    <span className="text-indigo-600 font-medium">
                      Your Profile
                    </span>
                  </Link>
                  <Link
                    to="/settings"
                    className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 transition-colors"
                    onClick={() => setShowDropdown(false)}
                  >
                    <FiSettings className="mr-3 text-indigo-500" />
                    <span className="text-indigo-600 font-medium">
                      Settings
                    </span>
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setShowDropdown(false);
                    }}
                    className="w-full text-left flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 transition-colors"
                  >
                    <FiLogOut className="mr-3 text-indigo-500" />
                    <span className="text-indigo-600 font-medium">
                      Sign out
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <button
            type="button"
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 focus:outline-none transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <FiMenu className="h-6 w-6" />
          </button>

          {mobileMenuOpen && (
            <div className="pt-2 pb-4 space-y-1 bg-white/95 backdrop-blur-sm rounded-xl mt-2 shadow-lg border border-gray-100">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.exact}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-3 mx-2 rounded-lg text-base font-medium transition-colors ${
                      isActive
                        ? "bg-indigo-50 text-indigo-600 border border-indigo-100"
                        : "text-gray-600 hover:bg-gray-100"
                    }`
                  }
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="mr-3">{item.icon}</span>
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
