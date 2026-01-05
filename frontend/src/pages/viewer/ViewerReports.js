import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

const ViewerReports = () => {
  const { currentUser, currentCompany } = useAuth();
  const { theme } = useTheme();
  const [reportData, setReportData] = useState({
    salesReport: [],
    transactionReport: [],
    inventoryReport: [],
    serviceReport: []
  });
  const [selectedReport, setSelectedReport] = useState('sales');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [loading, setLoading] = useState(true);

  // Mock data - in a real app, this would come from an API
  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setReportData({
        salesReport: [
          { date: '2024-01-01', sales: 1250.50, transactions: 15 },
          { date: '2024-01-02', sales: 980.75, transactions: 12 },
          { date: '2024-01-03', sales: 1420.30, transactions: 18 },
          { date: '2024-01-04', sales: 1100.25, transactions: 14 },
          { date: '2024-01-05', sales: 1650.80, transactions: 20 },
          { date: '2024-01-06', sales: 1320.40, transactions: 16 },
          { date: '2024-01-07', sales: 1780.90, transactions: 22 }
        ],
        transactionReport: [
          { type: 'Cash', count: 45, percentage: 35 },
          { type: 'Card', count: 32, percentage: 25 },
          { type: 'DuitNow', count: 28, percentage: 22 },
          { type: 'Touch \'n Go', count: 23, percentage: 18 }
        ],
        inventoryReport: [
          { item: 'Shampoo', stock: 25, value: 125.00 },
          { item: 'Conditioner', stock: 18, value: 90.00 },
          { item: 'Hair Gel', stock: 32, value: 160.00 },
          { item: 'Hair Spray', stock: 15, value: 75.00 },
          { item: 'Razor', stock: 42, value: 210.00 }
        ],
        serviceReport: [
          { service: 'Haircut', count: 89, revenue: 4005.00 },
          { service: 'Beard Trim', count: 56, revenue: 1680.00 },
          { service: 'Hair Color', count: 23, revenue: 1380.00 },
          { service: 'Hair Treatment', count: 12, revenue: 960.00 },
          { service: 'Shampoo & Style', count: 34, revenue: 1360.00 }
        ]
      });
      setLoading(false);
    }, 1000);
  }, []);

  const ReportCard = ({ title, children }) => (
    <div className={`rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} p-6`}>
      <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-4`}>{title}</h3>
      {children}
    </div>
  );

  const SalesChart = () => {
    const maxSales = Math.max(...reportData.salesReport.map(item => item.sales));
    
    return (
      <div className="space-y-4">
        {reportData.salesReport.map((item, index) => (
          <div key={index} className="flex items-center space-x-4">
            <div className="w-20 text-sm text-gray-600">{item.date}</div>
            <div className="flex-1 flex items-center">
              <div 
                className="bg-gradient-to-r from-yellow-500 to-yellow-600 h-8 rounded flex items-center justify-end pr-2 text-white text-sm font-medium"
                style={{ width: `${(item.sales / maxSales) * 100}%` }}
              >
                RM {item.sales.toFixed(2)}
              </div>
            </div>
            <div className="w-16 text-right text-sm text-gray-600">{item.transactions}</div>
          </div>
        ))}
      </div>
    );
  };

  const renderReportContent = () => {
    switch (selectedReport) {
      case 'sales':
        return (
          <ReportCard title="Sales Report">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    <th className="p-3 text-left">Date</th>
                    <th className="p-3 text-left">Sales (RM)</th>
                    <th className="p-3 text-left">Transactions</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.salesReport.map((item, index) => (
                    <tr key={index} className={`${index % 2 === 0 ? (theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50') : (theme === 'dark' ? 'bg-gray-900' : 'bg-white')}`}>
                      <td className={`p-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{item.date}</td>
                      <td className={`p-3 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'} font-medium`}>RM {item.sales.toFixed(2)}</td>
                      <td className={`p-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{item.transactions}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-6">
              <h4 className={`text-md font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-3`}>Sales Trend</h4>
              <SalesChart />
            </div>
          </ReportCard>
        );
      
      case 'transactions':
        return (
          <ReportCard title="Transaction Report">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className={`text-md font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-3`}>Payment Methods</h4>
                <div className="space-y-3">
                  {reportData.transactionReport.map((item, index) => (
                    <div key={index}>
                      <div className="flex justify-between mb-1">
                        <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{item.type}</span>
                        <span className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{item.count} ({item.percentage}%)</span>
                      </div>
                      <div className={`w-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-2`}>
                        <div 
                          className="bg-gradient-to-r from-yellow-500 to-yellow-600 h-2 rounded-full" 
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className={`text-md font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-3`}>Summary</h4>
                <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <div className="flex justify-between mb-2">
                    <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Total Transactions:</span>
                    <span className={`font-semibold ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}`}>128</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Average Value:</span>
                    <span className={`font-semibold ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}`}>RM 82.50</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Most Popular:</span>
                    <span className={`font-semibold ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}`}>Cash</span>
                  </div>
                </div>
              </div>
            </div>
          </ReportCard>
        );
      
      case 'inventory':
        return (
          <ReportCard title="Inventory Report">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    <th className="p-3 text-left">Item</th>
                    <th className="p-3 text-left">Stock</th>
                    <th className="p-3 text-left">Value (RM)</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.inventoryReport.map((item, index) => (
                    <tr key={index} className={`${index % 2 === 0 ? (theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50') : (theme === 'dark' ? 'bg-gray-900' : 'bg-white')}`}>
                      <td className={`p-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{item.item}</td>
                      <td className={`p-3 ${item.stock < 20 ? (theme === 'dark' ? 'text-red-400' : 'text-red-600') : (theme === 'dark' ? 'text-green-400' : 'text-green-600')} font-medium`}>
                        {item.stock} {item.stock < 20 ? '⚠️ Low' : ''}
                      </td>
                      <td className={`p-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>RM {item.value.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-6">
              <h4 className={`text-md font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-3`}>Inventory Summary</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Total Items</p>
                  <p className={`text-xl font-bold ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}`}>5</p>
                </div>
                <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Total Value</p>
                  <p className={`text-xl font-bold ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}`}>RM 660.00</p>
                </div>
                <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Low Stock Items</p>
                  <p className={`text-xl font-bold ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>2</p>
                </div>
              </div>
            </div>
          </ReportCard>
        );
      
      case 'services':
        return (
          <ReportCard title="Service Report">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    <th className="p-3 text-left">Service</th>
                    <th className="p-3 text-left">Count</th>
                    <th className="p-3 text-left">Revenue (RM)</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.serviceReport.map((item, index) => (
                    <tr key={index} className={`${index % 2 === 0 ? (theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50') : (theme === 'dark' ? 'bg-gray-900' : 'bg-white')}`}>
                      <td className={`p-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{item.service}</td>
                      <td className={`p-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{item.count}</td>
                      <td className={`p-3 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'} font-medium`}>RM {item.revenue.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-6">
              <h4 className={`text-md font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-3`}>Service Summary</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Total Services</p>
                  <p className={`text-xl font-bold ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}`}>5</p>
                </div>
                <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Total Revenue</p>
                  <p className={`text-xl font-bold ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}`}>RM 9,385.00</p>
                </div>
                <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Avg Revenue/Service</p>
                  <p className={`text-xl font-bold ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}`}>RM 1,877.00</p>
                </div>
              </div>
            </div>
          </ReportCard>
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
            Reports & Analytics
          </h1>
          <p className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            {currentCompany?.name || 'Company'} Business Insights
          </p>
        </div>

        {/* Filters */}
        <div className={`rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} p-6 mb-6`}>
          <div className="flex flex-wrap gap-4 items-center">
            <div>
              <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Report Type</label>
              <select
                value={selectedReport}
                onChange={(e) => setSelectedReport(e.target.value)}
                className={`rounded-lg px-3 py-2 ${theme === 'dark' ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'} border focus:ring-2 focus:ring-yellow-500 focus:border-transparent`}
              >
                <option value="sales">Sales Report</option>
                <option value="transactions">Transaction Report</option>
                <option value="inventory">Inventory Report</option>
                <option value="services">Service Report</option>
              </select>
            </div>
            
            <div>
              <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Start Date</label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                className={`rounded-lg px-3 py-2 ${theme === 'dark' ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'} border focus:ring-2 focus:ring-yellow-500 focus:border-transparent`}
              />
            </div>
            
            <div>
              <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-1`}>End Date</label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                className={`rounded-lg px-3 py-2 ${theme === 'dark' ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'} border focus:ring-2 focus:ring-yellow-500 focus:border-transparent`}
              />
            </div>
          </div>
        </div>

        {/* Report Content */}
        {renderReportContent()}
      </div>
    </div>
  );
};

export default ViewerReports;