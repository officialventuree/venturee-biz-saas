import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { FaMoneyBillWave, FaShoppingCart, FaBox, FaChartBar, FaUsers, FaExclamationTriangle } from 'react-icons/fa';
import axios from 'axios';

const CompanyOverview = () => {
  const { user, company } = useAuth();
  const { theme } = useTheme();
  const [dashboardData, setDashboardData] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Fetch dashboard stats
      const statsResponse = await axios.get('/dashboard/stats');
      if (statsResponse.data.success) {
        setDashboardData(statsResponse.data.data.stats);
      }
      
      // Fetch recent activity
      const activityResponse = await axios.get('/dashboard/recent-activity');
      if (activityResponse.data.success) {
        setRecentActivity(activityResponse.data.data.recentActivity);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error loading dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-MY', { 
      style: 'currency', 
      currency: 'MYR' 
    }).format(amount);
  };

  // Format number
  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '500px',
        backgroundColor: theme.background,
        color: theme.textPrimary
      }}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="company-overview">
      {error && (
        <div className="alert alert-error" style={{ 
          padding: '1rem', 
          borderRadius: theme.borderRadius, 
          backgroundColor: `${theme.error}20`, 
          color: theme.error, 
          marginBottom: '1rem',
          border: `1px solid ${theme.error}`
        }}>
          {error}
        </div>
      )}

      {/* Dashboard Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ color: theme.textPrimary, marginBottom: '0.5rem' }}>
          Welcome back, {user.firstName}!
        </h2>
        <p style={{ color: theme.textSecondary }}>
          Here's what's happening with {company?.name} today.
        </p>
      </div>

      {/* Stats Cards */}
      {dashboardData && (
        <div className="grid grid-cols-2-md grid-cols-4" style={{ gap: '1.5rem', marginBottom: '2rem' }}>
          {/* Total Sales */}
          <div className="card" style={{ backgroundColor: theme.backgroundLight, padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ 
                width: '40px', 
                height: '40px', 
                borderRadius: '50%', 
                backgroundColor: `${theme.goldPrimary}20`, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                marginRight: '1rem'
              }}>
                <FaMoneyBillWave style={{ color: theme.goldPrimary }} />
              </div>
              <div>
                <p style={{ color: theme.textTertiary, fontSize: '0.875rem', marginBottom: '0.25rem' }}>Total Sales</p>
                <h3 style={{ color: theme.textPrimary, fontSize: '1.5rem' }}>
                  {formatCurrency(dashboardData.totalSales)}
                </h3>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ color: theme.success, fontSize: '0.75rem', display: 'flex', alignItems: 'center' }}>
                <span style={{ marginRight: '0.25rem' }}>↑</span>
                {dashboardData.monthlyGrowth}%
              </span>
              <span style={{ color: theme.textTertiary, fontSize: '0.75rem', marginLeft: '0.5rem' }}>
                from last month
              </span>
            </div>
          </div>

          {/* Total Transactions */}
          <div className="card" style={{ backgroundColor: theme.backgroundLight, padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ 
                width: '40px', 
                height: '40px', 
                borderRadius: '50%', 
                backgroundColor: `${theme.success}20`, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                marginRight: '1rem'
              }}>
                <FaShoppingCart style={{ color: theme.success }} />
              </div>
              <div>
                <p style={{ color: theme.textTertiary, fontSize: '0.875rem', marginBottom: '0.25rem' }}>Transactions</p>
                <h3 style={{ color: theme.textPrimary, fontSize: '1.5rem' }}>
                  {formatNumber(dashboardData.totalTransactions)}
                </h3>
              </div>
            </div>
            <div style={{ color: theme.textTertiary, fontSize: '0.75rem' }}>
              completed today
            </div>
          </div>

          {/* Inventory Items */}
          <div className="card" style={{ backgroundColor: theme.backgroundLight, padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ 
                width: '40px', 
                height: '40px', 
                borderRadius: '50%', 
                backgroundColor: `${theme.info}20`, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                marginRight: '1rem'
              }}>
                <FaBox style={{ color: theme.info }} />
              </div>
              <div>
                <p style={{ color: theme.textTertiary, fontSize: '0.875rem', marginBottom: '0.25rem' }}>Inventory Items</p>
                <h3 style={{ color: theme.textPrimary, fontSize: '1.5rem' }}>
                  {formatNumber(dashboardData.totalInventoryItems)}
                </h3>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ color: theme.warning, fontSize: '0.75rem', display: 'flex', alignItems: 'center' }}>
                <FaExclamationTriangle style={{ marginRight: '0.25rem' }} />
                {dashboardData.lowStockItems} low
              </span>
            </div>
          </div>

          {/* Active Users */}
          <div className="card" style={{ backgroundColor: theme.backgroundLight, padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ 
                width: '40px', 
                height: '40px', 
                borderRadius: '50%', 
                backgroundColor: `${theme.textSecondary}20`, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                marginRight: '1rem'
              }}>
                <FaUsers style={{ color: theme.textSecondary }} />
              </div>
              <div>
                <p style={{ color: theme.textTertiary, fontSize: '0.875rem', marginBottom: '0.25rem' }}>Active Users</p>
                <h3 style={{ color: theme.textPrimary, fontSize: '1.5rem' }}>
                  {dashboardData.activeUsers}
                </h3>
              </div>
            </div>
            <div style={{ color: theme.textTertiary, fontSize: '0.75rem' }}>
              team members online
            </div>
          </div>
        </div>
      )}

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1-md grid-cols-2" style={{ gap: '1.5rem' }}>
        {/* Recent Activity */}
        <div className="card" style={{ backgroundColor: theme.backgroundLight, padding: '1.5rem' }}>
          <h3 style={{ color: theme.textPrimary, marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
            <FaChartBar style={{ marginRight: '0.5rem', color: theme.goldPrimary }} />
            Recent Activity
          </h3>
          
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {recentActivity.length > 0 ? (
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {recentActivity.map((activity, index) => (
                  <li 
                    key={activity.id || index} 
                    style={{ 
                      padding: '1rem 0', 
                      borderBottom: index < recentActivity.length - 1 ? `1px solid ${theme.border}` : 'none',
                      display: 'flex',
                      alignItems: 'flex-start'
                    }}
                  >
                    <div style={{ 
                      width: '8px', 
                      height: '8px', 
                      borderRadius: '50%', 
                      backgroundColor: 
                        activity.type === 'transaction' ? theme.success :
                        activity.type === 'inventory' ? theme.warning :
                        activity.type === 'user' ? theme.info :
                        theme.textSecondary,
                      marginTop: '0.5rem',
                      marginRight: '1rem',
                      flexShrink: 0
                    }}></div>
                    
                    <div style={{ flex: 1 }}>
                      <div style={{ color: theme.textPrimary, fontWeight: '500', marginBottom: '0.25rem' }}>
                        {activity.description}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ color: theme.textTertiary, fontSize: '0.75rem' }}>
                          {activity.user} • {new Date(activity.timestamp).toLocaleString()}
                        </span>
                        {activity.amount && (
                          <span style={{ color: theme.goldPrimary, fontWeight: '500' }}>
                            {formatCurrency(activity.amount)}
                          </span>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem', color: theme.textTertiary }}>
                No recent activity
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card" style={{ backgroundColor: theme.backgroundLight, padding: '1.5rem' }}>
          <h3 style={{ color: theme.textPrimary, marginBottom: '1rem' }}>Quick Actions</h3>
          
          <div className="grid grid-cols-2" style={{ gap: '1rem' }}>
            {company?.modules?.pos && user?.permissions?.pos_access && (
              <button 
                className="btn btn-outline" 
                style={{ 
                  color: theme.textPrimary, 
                  borderColor: theme.border,
                  textAlign: 'left',
                  padding: '1rem',
                  display: 'flex',
                  alignItems: 'center'
                }}
                onClick={() => window.location.hash = '#pos'}
              >
                <FaShoppingCart style={{ marginRight: '0.5rem', color: theme.goldPrimary }} />
                <span>POS Terminal</span>
              </button>
            )}
            
            {company?.modules?.inventory && user?.permissions?.inventory_access && (
              <button 
                className="btn btn-outline" 
                style={{ 
                  color: theme.textPrimary, 
                  borderColor: theme.border,
                  textAlign: 'left',
                  padding: '1rem',
                  display: 'flex',
                  alignItems: 'center'
                }}
                onClick={() => window.location.hash = '#inventory'}
              >
                <FaBox style={{ marginRight: '0.5rem', color: theme.goldPrimary }} />
                <span>Manage Inventory</span>
              </button>
            )}
            
            {user?.role === 'company-admin' && (
              <button 
                className="btn btn-outline" 
                style={{ 
                  color: theme.textPrimary, 
                  borderColor: theme.border,
                  textAlign: 'left',
                  padding: '1rem',
                  display: 'flex',
                  alignItems: 'center'
                }}
                onClick={() => window.location.hash = '#users'}
              >
                <FaUsers style={{ marginRight: '0.5rem', color: theme.goldPrimary }} />
                <span>Manage Users</span>
              </button>
            )}
            
            <button 
              className="btn btn-outline" 
              style={{ 
                color: theme.textPrimary, 
                borderColor: theme.border,
                textAlign: 'left',
                padding: '1rem',
                display: 'flex',
                alignItems: 'center'
              }}
              onClick={() => window.location.hash = '#reports'}
            >
              <FaChartBar style={{ marginRight: '0.5rem', color: theme.goldPrimary }} />
              <span>View Reports</span>
            </button>
          </div>
          
          {/* Subscription Status */}
          <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: theme.backgroundMedium, borderRadius: theme.borderRadius }}>
            <h4 style={{ color: theme.textPrimary, marginBottom: '0.5rem' }}>Subscription Status</h4>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: theme.textSecondary, fontSize: '0.875rem' }}>
                {company?.subscription?.plan?.charAt(0).toUpperCase() + company?.subscription?.plan?.slice(1) || 'Basic'} Plan
              </span>
              <span style={{ 
                padding: '0.25rem 0.5rem', 
                borderRadius: '12px', 
                fontSize: '0.75rem',
                backgroundColor: 
                  company?.subscription?.status === 'active' ? `${theme.success}20` : 
                  company?.subscription?.status === 'pending' ? `${theme.warning}20` : 
                  `${theme.error}20`,
                color: 
                  company?.subscription?.status === 'active' ? theme.success : 
                  company?.subscription?.status === 'pending' ? theme.warning : 
                  theme.error
              }}>
                {company?.subscription?.status?.charAt(0).toUpperCase() + company?.subscription?.status?.slice(1) || 'Active'}
              </span>
            </div>
            
            {company?.subscription?.status !== 'active' && (
              <button 
                className="btn btn-primary" 
                style={{ 
                  backgroundColor: theme.goldPrimary, 
                  color: 'white', 
                  width: '100%', 
                  marginTop: '1rem' 
                }}
                onClick={() => window.location.hash = '#payment'}
              >
                Complete Payment
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyOverview;