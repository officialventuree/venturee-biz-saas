import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { FaSignOutAlt } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';

const DashboardLayout = ({ 
  children, 
  navigation, 
  title = 'Dashboard', 
  subtitle = 'Manage your business operations',
  showSidebar = true,
  sidebarOpen: propSidebarOpen,
  setSidebarOpen: propSetSidebarOpen
}) => {
  const { currentUser, currentCompany, logout } = useAuth();
  const { theme } = useTheme();
  const location = useLocation();
  
  // Use prop values if provided, otherwise manage internally
  const sidebarOpen = propSidebarOpen !== undefined ? propSidebarOpen : true;
  const setSidebarOpen = propSetSidebarOpen || (() => {});

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  if (!showSidebar) {
    return (
      <div className={`flex h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
        {/* Main Content Only */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Bar */}
          <header className={`p-4 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex items-center justify-between">
              <div>
                <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {title}
                </h2>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  {subtitle}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className={`px-3 py-1 rounded-full text-sm ${theme === 'dark' ? 'bg-gray-700 text-yellow-400' : 'bg-yellow-100 text-yellow-800'}`}>
                  {currentUser?.role || 'Role'}
                </div>
                <button
                  onClick={handleLogout}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${theme === 'dark' ? 'text-red-400 hover:bg-gray-700' : 'text-red-600 hover:bg-gray-100'}`}
                >
                  <FaSignOutAlt />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </header>

          {/* Content Area */}
          <main className="flex-1 overflow-y-auto p-6">
            {children}
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg transition-all duration-300 flex flex-col`}>
        {/* Sidebar Header */}
        <div className={`p-4 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <div className="flex items-center space-x-3">
                <span className="text-yellow-500 text-xl">💼</span>
                <h1 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Venturee Biz
                </h1>
              </div>
            )}
          </div>
          {sidebarOpen && (
            <div className="mt-4">
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {title}
              </p>
              <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                {currentCompany?.name || 'Company'}
              </p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navigation.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${isActive(item.path)
                    ? 'bg-yellow-500 text-white'
                    : `${theme === 'dark' ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}`}
                >
                  <span className="text-lg">{item.icon}</span>
                  {sidebarOpen && <span>{item.name}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Info and Logout */}
        <div className={`p-4 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
          {sidebarOpen && (
            <div className="mb-4">
              <p className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {currentUser?.name || 'User'}
              </p>
              <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                {currentUser?.role || 'Role'}
              </p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className={`flex items-center space-x-3 w-full px-3 py-2 rounded-lg transition-colors ${theme === 'dark' ? 'text-red-400 hover:bg-gray-700' : 'text-red-600 hover:bg-gray-100'}`}
          >
            <FaSignOutAlt className="text-lg" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className={`p-4 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {title}
              </h2>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {subtitle}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className={`px-3 py-1 rounded-full text-sm ${theme === 'dark' ? 'bg-gray-700 text-yellow-400' : 'bg-yellow-100 text-yellow-800'}`}>
                {currentUser?.role || 'Role'}
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;