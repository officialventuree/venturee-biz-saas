import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

const ViewerTrends = () => {
  const { currentUser, currentCompany } = useAuth();
  const { theme } = useTheme();
  const [trendData, setTrendData] = useState({
    monthlySales: [],
    customerGrowth: [],
    popularServices: [],
    peakHours: [],
    seasonalTrends: []
  });
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [loading, setLoading] = useState(true);

  // Mock data - in a real app, this would come from an API
  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setTrendData({
        monthlySales: [
          { month: 'Jan', sales: 12500, growth: 5.2 },
          { month: 'Feb', sales: 13200, growth: 5.6 },
          { month: 'Mar', sales: 14800, growth: 12.1 },
          { month: 'Apr', sales: 13900, growth: -6.1 },
          { month: 'May', sales: 15600, growth: 12.2 },
          { month: 'Jun', sales: 16800, growth: 7.7 },
          { month: 'Jul', sales: 18200, growth: 8.3 },
          { month: 'Aug', sales: 17500, growth: -3.8 },
          { month: 'Sep', sales: 19200, growth: 9.7 },
          { month: 'Oct', sales: 20500, growth: 6.8 },
          { month: 'Nov', sales: 22100, growth: 7.8 },
          { month: 'Dec', sales: 24800, growth: 12.2 }
        ],
        customerGrowth: [
          { month: 'Jan', customers: 89, new: 12 },
          { month: 'Feb', customers: 95, new: 8 },
          { month: 'Mar', customers: 102, new: 10 },
          { month: 'Apr', customers: 108, new: 6 },
          { month: 'May', customers: 115, new: 9 },
          { month: 'Jun', customers: 122, new: 7 },
          { month: 'Jul', customers: 128, new: 8 },
          { month: 'Aug', customers: 134, new: 6 },
          { month: 'Sep', customers: 141, new: 9 },
          { month: 'Oct', customers: 147, new: 8 },
          { month: 'Nov', customers: 153, new: 7 },
          { month: 'Dec', customers: 159, new: 8 }
        ],
        popularServices: [
          { service: 'Haircut', percentage: 45, trend: 'up' },
          { service: 'Beard Trim', percentage: 25, trend: 'stable' },
          { service: 'Hair Color', percentage: 15, trend: 'up' },
          { service: 'Shampoo & Style', percentage: 10, trend: 'down' },
          { service: 'Hair Treatment', percentage: 5, trend: 'stable' }
        ],
        peakHours: [
          { hour: '9:00 AM', transactions: 8 },
          { hour: '10:00 AM', transactions: 12 },
          { hour: '11:00 AM', transactions: 15 },
          { hour: '12:00 PM', transactions: 18 },
          { hour: '1:00 PM', transactions: 14 },
          { hour: '2:00 PM', transactions: 10 },
          { hour: '3:00 PM', transactions: 16 },
          { hour: '4:00 PM', transactions: 20 },
          { hour: '5:00 PM', transactions: 22 },
          { hour: '6:00 PM', transactions: 18 },
          { hour: '7:00 PM', transactions: 12 },
          { hour: '8:00 PM', transactions: 8 }
        ],
        seasonalTrends: [
          { season: 'Spring', sales: 15600, growth: 8.2 },
          { season: 'Summer', sales: 18200, growth: 16.7 },
          { season: 'Fall', sales: 17500, growth: -3.8 },
          { season: 'Winter', sales: 22100, growth: 26.3 }
        ]
      });
      setLoading(false);
    }, 1000);
  }, []);

  const TrendCard = ({ title, children }) => (
    <div className={`rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} p-6`}>
      <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-4`}>{title}</h3>
      {children}
    </div>
  );

  const SalesTrendChart = () => {
    const maxSales = Math.max(...trendData.monthlySales.map(item => item.sales));
    
    return (
      <div className="space-y-4">
        {trendData.monthlySales.map((item, index) => (
          <div key={index} className="flex items-center space-x-4">
            <div className="w-12 text-sm text-gray-600">{item.month}</div>
            <div className="flex-1 flex items-center">
              <div 
                className="bg-gradient-to-r from-yellow-500 to-yellow-600 h-8 rounded flex items-center justify-end pr-2 text-white text-sm font-medium"
                style={{ width: `${(item.sales / maxSales) * 100}%` }}
              >
                RM {item.sales.toLocaleString()}
              </div>
            </div>
            <div className={`w-16 text-right text-sm font-medium ${item.growth >= 0 ? (theme === 'dark' ? 'text-green-400' : 'text-green-600') : (theme === 'dark' ? 'text-red-400' : 'text-red-600')}`}>
              {item.growth >= 0 ? '+' : ''}{item.growth}%
            </div>
          </div>
        ))}
      </div>
    );
  };

  const PeakHoursChart = () => {
    const maxTransactions = Math.max(...trendData.peakHours.map(item => item.transactions));
    
    return (
      <div className="space-y-4">
        {trendData.peakHours.map((item, index) => (
          <div key={index} className="flex items-center space-x-4">
            <div className="w-16 text-sm text-gray-600">{item.hour}</div>
            <div className="flex-1 flex items-center">
              <div 
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-8 rounded flex items-center justify-end pr-2 text-white text-sm font-medium"
                style={{ width: `${(item.transactions / maxTransactions) * 100}%` }}
              >
                {item.transactions} transactions
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderTrendContent = () => {
    switch (selectedPeriod) {
      case 'monthly':
        return (
          <div className="space-y-6">
            <TrendCard title="Monthly Sales Trend">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      <th className="p-3 text-left">Month</th>
                      <th className="p-3 text-left">Sales (RM)</th>
                      <th className="p-3 text-left">Growth</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trendData.monthlySales.map((item, index) => (
                      <tr key={index} className={`${index % 2 === 0 ? (theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50') : (theme === 'dark' ? 'bg-gray-900' : 'bg-white')}`}>
                        <td className={`p-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{item.month}</td>
                        <td className={`p-3 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'} font-medium`}>RM {item.sales.toLocaleString()}</td>
                        <td className={`p-3 font-medium ${item.growth >= 0 ? (theme === 'dark' ? 'text-green-400' : 'text-green-600') : (theme === 'dark' ? 'text-red-400' : 'text-red-600')}`}>
                          {item.growth >= 0 ? '+' : ''}{item.growth}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-6">
                <h4 className={`text-md font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-3`}>Sales Trend Visualization</h4>
                <SalesTrendChart />
              </div>
            </TrendCard>
            
            <TrendCard title="Customer Growth">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className={`text-md font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-3`}>Customer Count</h4>
                  <div className="space-y-4">
                    {trendData.customerGrowth.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{item.month}</span>
                        <span className={`font-medium ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}`}>{item.customers} customers</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className={`text-md font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-3`}>New Customers</h4>
                  <div className="space-y-4">
                    {trendData.customerGrowth.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{item.month}</span>
                        <span className={`font-medium ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>+{item.new} new</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TrendCard>
          </div>
        );
      
      case 'seasonal':
        return (
          <div className="space-y-6">
            <TrendCard title="Seasonal Trends">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      <th className="p-3 text-left">Season</th>
                      <th className="p-3 text-left">Sales (RM)</th>
                      <th className="p-3 text-left">Growth</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trendData.seasonalTrends.map((item, index) => (
                      <tr key={index} className={`${index % 2 === 0 ? (theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50') : (theme === 'dark' ? 'bg-gray-900' : 'bg-white')}`}>
                        <td className={`p-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{item.season}</td>
                        <td className={`p-3 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'} font-medium`}>RM {item.sales.toLocaleString()}</td>
                        <td className={`p-3 font-medium ${item.growth >= 0 ? (theme === 'dark' ? 'text-green-400' : 'text-green-600') : (theme === 'dark' ? 'text-red-400' : 'text-red-600')}`}>
                          {item.growth >= 0 ? '+' : ''}{item.growth}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TrendCard>
            
            <TrendCard title="Popular Services">
              <div className="space-y-4">
                {trendData.popularServices.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-100 dark:bg-gray-700">
                    <div className="flex items-center">
                      <span className={`w-24 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{item.service}</span>
                      <div className="w-32 h-2 bg-gray-300 dark:bg-gray-600 rounded-full mx-3">
                        <div 
                          className="h-2 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full" 
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`text-sm font-medium ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}`}>{item.percentage}%</span>
                      <span className={`text-xs ${item.trend === 'up' ? (theme === 'dark' ? 'text-green-400' : 'text-green-600') : item.trend === 'down' ? (theme === 'dark' ? 'text-red-400' : 'text-red-600') : (theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}`}>
                        {item.trend === 'up' ? '↗' : item.trend === 'down' ? '↘' : '→'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </TrendCard>
          </div>
        );
      
      case 'daily':
        return (
          <div className="space-y-6">
            <TrendCard title="Peak Hours Analysis">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      <th className="p-3 text-left">Hour</th>
                      <th className="p-3 text-left">Transactions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trendData.peakHours.map((item, index) => (
                      <tr key={index} className={`${index % 2 === 0 ? (theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50') : (theme === 'dark' ? 'bg-gray-900' : 'bg-white')}`}>
                        <td className={`p-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{item.hour}</td>
                        <td className={`p-3 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'} font-medium`}>{item.transactions} transactions</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-6">
                <h4 className={`text-md font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-3`}>Peak Hours Visualization</h4>
                <PeakHoursChart />
              </div>
            </TrendCard>
            
            <TrendCard title="Business Insights">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Busiest Day</p>
                  <p className={`text-xl font-bold ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}`}>Friday</p>
                </div>
                <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Peak Hour</p>
                  <p className={`text-xl font-bold ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}`}>5:00 PM</p>
                </div>
                <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Avg Daily Transactions</p>
                  <p className={`text-xl font-bold ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}`}>156</p>
                </div>
              </div>
            </TrendCard>
          </div>
        );
      
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'} p-6`}>
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className={`h-8 bg-gray-700 rounded w-1/4 mb-8 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
            <div className={`h-12 bg-gray-700 rounded mb-6 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
            <div className={`h-64 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'}`}></div>
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
            Trends & Analytics
          </h1>
          <p className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            {currentCompany?.name || 'Company'} Business Trends
          </p>
        </div>

        {/* Filters */}
        <div className={`rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} p-6 mb-6`}>
          <div className="flex flex-wrap gap-4 items-center">
            <div>
              <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Analysis Period</label>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className={`rounded-lg px-3 py-2 ${theme === 'dark' ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'} border focus:ring-2 focus:ring-yellow-500 focus:border-transparent`}
              >
                <option value="monthly">Monthly Trends</option>
                <option value="seasonal">Seasonal Trends</option>
                <option value="daily">Daily Patterns</option>
              </select>
            </div>
          </div>
        </div>

        {/* Trend Content */}
        {renderTrendContent()}
      </div>
    </div>
  );
};

export default ViewerTrends;