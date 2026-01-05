import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { FaBuilding, FaUsers, FaMoneyBillWave, FaChartBar, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import axios from 'axios';

const AdminOverview = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [dashboardData, setDashboardData] = useState({
    totalCompanies: 0,
    activeCompanies: 0,
    pendingCompanies: 0,
    totalUsers: 0,
    totalRevenue: 0,
    newRegistrations: 0,
    pendingPayments: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch admin dashboard data
  const fetchAdminData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Simulate API call to fetch platform metrics
      const mockData = {
        totalCompanies: 42,
        activeCompanies: 38,
        pendingCompanies: 4,
        totalUsers: 156,
        totalRevenue: 12450.75,
        newRegistrations: 5,
        pendingPayments: 8
      };
      
      setDashboardData(mockData);
    } catch (err) {
      setError(err.response?.data?.message || 'Error loading admin data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
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
    <div className="admin-overview">
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
          Platform Overview
        </h2>
        <p style={{ color: theme.textSecondary }}>
          Monitor platform performance and metrics at a glance.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2-md grid-cols-4" style={{ gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Total Companies */}
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
              <FaBuilding style={{ color: theme.goldPrimary }} />
            </div>
            <div>
              <p style={{ color: theme.textTertiary, fontSize: '0.875rem', marginBottom: '0.25rem' }}>Total Companies</p>
              <h3 style={{ color: theme.textPrimary, fontSize: '1.5rem' }}>
                {formatNumber(dashboardData.totalCompanies)}
              </h3>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ color: theme.success, fontSize: '0.75rem', display: 'flex', alignItems: 'center' }}>
              <span style={{ marginRight: '0.25rem' }}>↑</span>
              +{dashboardData.newRegistrations} this week
            </span>
          </div>
        </div>

        {/* Active Companies */}
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
              <FaCheckCircle style={{ color: theme.success }} />
            </div>
            <div>
              <p style={{ color: theme.textTertiary, fontSize: '0.875rem', marginBottom: '0.25rem' }}>Active Companies</p>
              <h3 style={{ color: theme.textPrimary, fontSize: '1.5rem' }}>
                {formatNumber(dashboardData.activeCompanies)}
              </h3>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ color: theme.textTertiary, fontSize: '0.75rem' }}>
              {Math.round((dashboardData.activeCompanies / dashboardData.totalCompanies) * 100)}% of total
            </span>
          </div>
        </div>

        {/* Pending Companies */}
        <div className="card" style={{ backgroundColor: theme.backgroundLight, padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '50%', 
              backgroundColor: `${theme.warning}20`, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              marginRight: '1rem'
            }}>
              <FaExclamationTriangle style={{ color: theme.warning }} />
            </div>
            <div>
              <p style={{ color: theme.textTertiary, fontSize: '0.875rem', marginBottom: '0.25rem' }}>Pending</p>
              <h3 style={{ color: theme.textPrimary, fontSize: '1.5rem' }}>
                {formatNumber(dashboardData.pendingCompanies)}
              </h3>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ color: theme.warning, fontSize: '0.75rem', display: 'flex', alignItems: 'center' }}>
              <span style={{ marginRight: '0.25rem' }}>!</span>
              Requires attention
            </span>
          </div>
        </div>

        {/* Total Revenue */}
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
              <p style={{ color: theme.textTertiary, fontSize: '0.875rem', marginBottom: '0.25rem' }}>Monthly Revenue</p>
              <h3 style={{ color: theme.textPrimary, fontSize: '1.5rem' }}>
                {formatCurrency(dashboardData.totalRevenue)}
              </h3>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ color: theme.success, fontSize: '0.75rem', display: 'flex', alignItems: 'center' }}>
              <span style={{ marginRight: '0.25rem' }}>↑</span>
              +12.5% from last month
            </span>
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1-md grid-cols-2" style={{ gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Platform Health */}
        <div className="card" style={{ backgroundColor: theme.backgroundLight, padding: '1.5rem' }}>
          <h3 style={{ color: theme.textPrimary, marginBottom: '1rem' }}>Platform Health</h3>
          
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ color: theme.textSecondary }}>System Uptime</span>
              <span style={{ color: theme.success, fontWeight: '500' }}>99.9%</span>
            </div>
            <div style={{ height: '8px', backgroundColor: theme.backgroundMedium, borderRadius: '4px', overflow: 'hidden' }}>
              <div 
                style={{ 
                  height: '100%', 
                  width: '99.9%', 
                  backgroundColor: theme.success,
                  transition: theme.transition
                }}
              ></div>
            </div>
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ color: theme.textSecondary }}>Database Performance</span>
              <span style={{ color: theme.success, fontWeight: '500' }}>Excellent</span>
            </div>
            <div style={{ height: '8px', backgroundColor: theme.backgroundMedium, borderRadius: '4px', overflow: 'hidden' }}>
              <div 
                style={{ 
                  height: '100%', 
                  width: '95%', 
                  backgroundColor: theme.success,
                  transition: theme.transition
                }}
              ></div>
            </div>
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ color: theme.textSecondary }}>API Response Time</span>
              <span style={{ color: theme.success, fontWeight: '500' }}>120ms</span>
            </div>
            <div style={{ height: '8px', backgroundColor: theme.backgroundMedium, borderRadius: '4px', overflow: 'hidden' }}>
              <div 
                style={{ 
                  height: '100%', 
                  width: '90%', 
                  backgroundColor: theme.success,
                  transition: theme.transition
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card" style={{ backgroundColor: theme.backgroundLight, padding: '1.5rem' }}>
          <h3 style={{ color: theme.textPrimary, marginBottom: '1rem' }}>Recent Platform Activity</h3>
          
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ padding: '1rem 0', borderBottom: `1px solid ${theme.border}`, display: 'flex', alignItems: 'flex-start' }}>
                <div style={{ 
                  width: '8px', 
                  height: '8px', 
                  borderRadius: '50%', 
                  backgroundColor: theme.success,
                  marginTop: '0.5rem',
                  marginRight: '1rem',
                  flexShrink: 0
                }}></div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: theme.textPrimary, fontWeight: '500', marginBottom: '0.25rem' }}>
                    New company registered: ABC Retail Sdn Bhd
                  </div>
                  <div style={{ color: theme.textTertiary, fontSize: '0.75rem' }}>
                    2 hours ago
                  </div>
                </div>
              </li>
              
              <li style={{ padding: '1rem 0', borderBottom: `1px solid ${theme.border}`, display: 'flex', alignItems: 'flex-start' }}>
                <div style={{ 
                  width: '8px', 
                  height: '8px', 
                  borderRadius: '50%', 
                  backgroundColor: theme.warning,
                  marginTop: '0.5rem',
                  marginRight: '1rem',
                  flexShrink: 0
                }}></div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: theme.textPrimary, fontWeight: '500', marginBottom: '0.25rem' }}>
                    Subscription payment pending: XYZ Laundry Services
                  </div>
                  <div style={{ color: theme.textTertiary, fontSize: '0.75rem' }}>
                    5 hours ago
                  </div>
                </div>
              </li>
              
              <li style={{ padding: '1rem 0', borderBottom: `1px solid ${theme.border}`, display: 'flex', alignItems: 'flex-start' }}>
                <div style={{ 
                  width: '8px', 
                  height: '8px', 
                  borderRadius: '50%', 
                  backgroundColor: theme.success,
                  marginTop: '0.5rem',
                  marginRight: '1rem',
                  flexShrink: 0
                }}></div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: theme.textPrimary, fontWeight: '500', marginBottom: '0.25rem' }}>
                    Company activated: Tech Solutions Sdn Bhd
                  </div>
                  <div style={{ color: theme.textTertiary, fontSize: '0.75rem' }}>
                    1 day ago
                  </div>
                </div>
              </li>
              
              <li style={{ padding: '1rem 0', display: 'flex', alignItems: 'flex-start' }}>
                <div style={{ 
                  width: '8px', 
                  height: '8px', 
                  borderRadius: '50%', 
                  backgroundColor: theme.info,
                  marginTop: '0.5rem',
                  marginRight: '1rem',
                  flexShrink: 0
                }}></div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: theme.textPrimary, fontWeight: '500', marginBottom: '0.25rem' }}>
                    New user registered: 12 new users this week
                  </div>
                  <div style={{ color: theme.textTertiary, fontSize: '0.75rem' }}>
                    2 days ago
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;