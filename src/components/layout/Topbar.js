import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
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
  FiX,
} from "react-icons/fi";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import logo from '../../assets/images/Ganapathy_metals_logo.png';

export default function Topbar({ user }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeHover, setActiveHover] = useState(null);
  const dropdownRef = useRef(null);
  const { logout } = useAuth();
  const location = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navItems = [
    {
      path: "/dashboardG",
      icon: <FiHome size={18} />,
      label: "Dashboard",
      exact: true,
      color: "from-blue-500 to-cyan-500",
    },
    {
      path: "/CardListing",
      icon: <FiDatabase size={18} />,
      label: "Masters",
      color: "from-purple-500 to-pink-500",
    },
    {
      path: "/certificateListing",
      icon: <FaCertificate size={18} />,
      label: "Certificate",
      color: "from-amber-500 to-orange-500",
    },
    {
      path: "/formsListing",
      icon: <FaFileAlt size={18} />,
      label: "Forms",
      color: "from-green-500 to-emerald-500",
    },
    {
      path: "/invoice",
      icon: <FaFileInvoiceDollar size={18} />,
      label: "Invoice",
      color: "from-indigo-500 to-blue-500",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
      },
    },
  };

  const dropdownVariants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
      y: -10,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.2,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: -10,
      transition: {
        duration: 0.15,
      },
    },
  };

  return (
    <motion.header
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className={`bg-white/90 backdrop-blur-xl border-b transition-all duration-300 sticky top-0 z-50 ${scrolled
        ? "border-gray-200/70 shadow-lg"
        : "border-gray-200/30 shadow-sm"
        }`}
    >
      <div className="px-4 sm:px-6 lg:px-8">
        {/* Desktop Navigation */}
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center cursor-pointer">
            <div className="relative">
              <img
                src={logo}
                alt="Ganapathy Metal Logo"
                className="w-12 h-12 object-contain" // adjust size as needed
              />
            </div>
            <div className="ml-3">
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
            <div className="flex space-x-1 bg-white/50 rounded-2xl p-1.5 backdrop-blur-sm border border-gray-200/50 shadow-sm">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.path}
                  whileHover={{ y: -2 }}
                  whileTap={{ y: 0 }}
                  className="relative"
                  onMouseEnter={() => setActiveHover(index)}
                  onMouseLeave={() => setActiveHover(null)}
                >
                  <NavLink
                    to={item.path}
                    end={item.exact}
                    className={({ isActive }) =>
                      `relative flex items-center px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 z-10 ${isActive
                        ? "text-white"
                        : "text-gray-600 hover:text-gray-900"
                      }`
                    }
                  >
                    <motion.span className="mr-2" whileHover={{ scale: 1.1 }}>
                      {item.icon}
                    </motion.span>
                    <span>{item.label}</span>

                    {/* Animated background */}
                    <motion.div
                      className={`absolute inset-0 rounded-xl bg-gradient-to-r ${item.color} z-[-1]`}
                      initial={false}
                      animate={{
                        scale:
                          location.pathname === item.path
                            ? 1
                            : activeHover === index
                              ? 1
                              : 0,
                        opacity:
                          location.pathname === item.path
                            ? 1
                            : activeHover === index
                              ? 0.8
                              : 0,
                      }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                    />
                  </NavLink>
                </motion.div>
              ))}
            </div>
          </nav>

          {/* Right side icons */}
          <div className="flex items-center space-x-2">
            {/* Notifications */}
            <motion.button
              className="p-2.5 rounded-xl relative group transition-all duration-200 bg-white/50 hover:bg-white border border-transparent hover:border-gray-200/50 shadow-sm"
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="sr-only">Notifications</span>
              <FiBell className="h-5 w-5 text-gray-600 group-hover:text-indigo-500 transition-colors" />
              <motion.span
                className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              ></motion.span>
            </motion.button>

            {/* Profile dropdown */}
            <div className="relative" ref={dropdownRef}>
              <motion.button
                type="button"
                className="flex items-center max-w-xs rounded-2xl p-1.5 focus:outline-none group bg-white/50 hover:bg-white border border-transparent hover:border-gray-200/50 shadow-sm transition-all duration-200"
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <span className="sr-only">Open user menu</span>
                <motion.div
                  className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-medium shadow-sm"
                  whileHover={{ scale: 1.1 }}
                >
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </motion.div>
                <span className="ml-2 hidden lg:inline text-gray-700 font-medium group-hover:text-indigo-600 transition-colors">
                  {user?.name || "User"}
                </span>
              </motion.button>

              <AnimatePresence>
                {showDropdown && (
                  <motion.div
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="origin-top-right absolute right-0 mt-2 w-56 rounded-2xl shadow-xl py-2 bg-white/95 backdrop-blur-xl border border-gray-200/50 focus:outline-none z-50"
                  >
                    <motion.div variants={itemVariants}>
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-200 group"
                        onClick={() => setShowDropdown(false)}
                      >
                        <FiUser className="mr-3 text-indigo-500 group-hover:scale-110 transition-transform" />
                        <span className="text-gray-800 font-medium group-hover:text-indigo-600">
                          Your Profile
                        </span>
                      </Link>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <Link
                        to="/settings"
                        className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-200 group"
                        onClick={() => setShowDropdown(false)}
                      >
                        <FiSettings className="mr-3 text-indigo-500 group-hover:scale-110 transition-transform" />
                        <span className="text-gray-800 font-medium group-hover:text-indigo-600">
                          Settings
                        </span>
                      </Link>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <button
                        onClick={() => {
                          logout();
                          setShowDropdown(false);
                        }}
                        className="w-full text-left flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-orange-50 transition-all duration-200 group"
                      >
                        <FiLogOut className="mr-3 text-red-500 group-hover:scale-110 transition-transform" />
                        <span className="text-gray-800 font-medium group-hover:text-red-600">
                          Sign out
                        </span>
                      </button>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <motion.button
            type="button"
            className="p-2.5 rounded-xl text-gray-500 hover:bg-white border border-transparent hover:border-gray-200/50 focus:outline-none transition-all duration-200 shadow-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <FiX className="h-6 w-6" />
            ) : (
              <FiMenu className="h-6 w-6" />
            )}
          </motion.button>

          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="overflow-hidden"
              >
                <div className="pt-3 pb-4 space-y-2 bg-white/95 backdrop-blur-xl rounded-2xl mt-3 shadow-xl border border-gray-200/50">
                  {navItems.map((item, index) => (
                    <motion.div
                      key={item.path}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <NavLink
                        to={item.path}
                        end={item.exact}
                        className={({ isActive }) =>
                          `flex items-center px-4 py-3 mx-2 rounded-xl text-base font-medium transition-all duration-300 ${isActive
                            ? "text-white shadow-lg"
                            : "text-gray-600 hover:text-gray-900"
                          }`
                        }
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <div className="relative w-full">
                          <div className="flex items-center">
                            <span className="mr-3">{item.icon}</span>
                            <span>{item.label}</span>
                          </div>
                          {location.pathname === item.path && (
                            <motion.div
                              className={`absolute inset-0 rounded-xl bg-gradient-to-r ${item.color} z-[-1]`}
                              layoutId="mobileActiveBg"
                              transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 30,
                              }}
                            />
                          )}
                        </div>
                      </NavLink>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.header>
  );
}
