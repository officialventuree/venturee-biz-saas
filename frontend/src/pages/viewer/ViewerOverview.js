import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import './../../../node_modules/react-grid-layout/css/styles.css';
import './../../../node_modules/react-resizable/css/styles.css';

const ViewerOverview = () => {
  const { currentUser, currentCompany } = useAuth();
  const { theme } = useTheme();
  const [stats, setStats] = useState({
    totalSales: 0,
    totalTransactions: 0,
    totalCustomers: 0,
    inventoryValue: 0,
    activeServices: 0,
    pendingOrders: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock data - in a real app, this would come from an API
  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setStats({
        totalSales: 12500.75,
        totalTransactions: 142,
        totalCustomers: 89,
        inventoryValue: 8750.30,
        activeServices: 12,
        pendingOrders: 7
      });
      
      setRecentActivity([
        { id: 1, action: 'POS Transaction', description: 'New sale of RM 125.50', time: '2 minutes ago', amount: 'RM 125.50' },
        { id: 2, action: 'Service Completed', description: 'Haircut service completed', time: '15 minutes ago', amount: 'RM 45.00' },
        { id: 3, action: 'Inventory Update', description: 'New stock added: Shampoo', time: '30 minutes ago', amount: '20 units' },
        { id: 4, action: 'Customer Registration', description: 'New customer registered', time: '1 hour ago', amount: 'John Doe' },
        { id: 5, action: 'Laundry Order', description: 'New laundry order placed', time: '2 hours ago', amount: '5kg' }
      ]);
      
      setLoading(false);
    }, 1000);
  }, []);

  const StatCard = ({ title, value, icon, color = 'gold' }) => (
    <div className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} transition-all duration-300 hover:scale-105`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} font-medium`}>{title}</p>
          <p className={`text-2xl font-bold mt-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{value}</p>
        </div>
        <div className={`p-3 rounded-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
          <span className={`text-xl ${color === 'gold' ? 'text-yellow-500' : color === 'blue' ? 'text-blue-500' : color === 'green' ? 'text-green-500' : 'text-purple-500'}`}>
            {icon}
          </span>
        </div>
      </div>
    </div>
  );

  const ActivityItem = ({ activity }) => (
    <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} mb-2`}>
      <div className="flex justify-between items-center">
        <div>
          <h4 className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{activity.action}</h4>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{activity.description}</p>
        </div>
        <div className="text-right">
          <p className={`text-sm font-medium ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}`}>{activity.amount}</p>
          <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>{activity.time}</p>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'} p-6`}>
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className={`h-8 bg-gray-700 rounded w-1/3 mb-8 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className={`h-24 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'}`}></div>
              ))}
            </div>
            <div className={`h-8 bg-gray-700 rounded w-1/4 mb-4 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
            {[...Array(5)].map((_, i) => (
              <div key={i} className={`h-16 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'} mb-2`}></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'} p-6`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-2`}>
            Welcome, {currentUser?.name || 'Viewer'}
          </h1>
          <p className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            {currentCompany?.name || 'Company'} Dashboard Overview
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard 
            title="Total Sales" 
            value="RM 12,500.75" 
            icon="💰" 
            color="green"
          />
          <StatCard 
            title="Transactions" 
            value="142" 
            icon="📊" 
            color="blue"
          />
          <StatCard 
            title="Customers" 
            value="89" 
            icon="👥" 
            color="gold"
          />
          <StatCard 
            title="Inventory Value" 
            value="RM 8,750.30" 
            icon="📦" 
            color="purple"
          />
          <StatCard 
            title="Active Services" 
            value="12" 
            icon="🔧" 
            color="blue"
          />
          <StatCard 
            title="Pending Orders" 
            value="7" 
            icon="⏳" 
            color="orange"
          />
        </div>

        {/* Recent Activity */}
        <div className={`rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} p-6`}>
          <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-4`}>
            Recent Activity
          </h2>
          <div>
            {recentActivity.map(activity => (
              <ActivityItem key={activity.id} activity={activity} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewerOverview;