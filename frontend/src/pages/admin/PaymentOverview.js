import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { FaMoneyBillWave, FaCreditCard, FaCheckCircle, FaExclamationTriangle, FaTimesCircle, FaChartBar, FaWallet } from 'react-icons/fa';
import axios from 'axios';

const PaymentOverview = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [paymentData, setPaymentData] = useState({
    totalRevenue: 0,
    monthlyRevenue: 0,
    pendingPayments: 0,
    completedPayments: 0,
    failedPayments: 0,
    totalTransactions: 0
  });
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dateRange, setDateRange] = useState('monthly'); // daily, weekly, monthly, yearly

  // Fetch payment data
  const fetchPaymentData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Simulate API call to fetch payment data
      const mockPaymentData = {
        totalRevenue: 12450.75,
        monthlyRevenue: 2450.50,
        pendingPayments: 8,
        completedPayments: 156,
        failedPayments: 3,
        totalTransactions: 167
      };
      
      setPaymentData(mockPaymentData);
      
      // Mock payment history
      const mockPaymentHistory = [
        {
          id: 'pay1',
          companyId: 'comp1',
          companyName: 'ABC Retail Sdn Bhd',
          amount: 199.99,
          status: 'completed',
          date: '2023-12-15T10:30:00Z',
          method: 'duitnow',
          description: 'Monthly subscription'
        },
        {
          id: 'pay2',
          companyId: 'comp2',
          companyName: 'XYZ Laundry Services',
          amount: 99.99,
          status: 'completed',
          date: '2023-12-14T14:20:00Z',
          method: 'duitnow',
          description: 'Basic plan subscription'
        },
        {
          id: 'pay3',
          companyId: 'comp3',
          companyName: 'QuickMart Enterprise',
          amount: 0.00,
          status: 'pending',
          date: '2023-12-14T09:15:00Z',
          method: 'duitnow',
          description: 'Basic plan registration'
        },
        {
          id: 'pay4',
          companyId: 'comp4',
          companyName: 'Tech Solutions Sdn Bhd',
          amount: 499.99,
          status: 'completed',
          date: '2023-12-13T16:45:00Z',
          method: 'duitnow',
          description: 'Enterprise plan subscription'
        },
        {
          id: 'pay5',
          companyId: 'comp5',
          companyName: 'Cafe Delight',
          amount: 199.99,
          status: 'failed',
          date: '2023-12-12T11:30:00Z',
          method: 'duitnow',
          description: 'Standard plan renewal'
        },
        {
          id: 'pay6',
          companyId: 'comp6',
          companyName: 'Fashion Hub',
          amount: 299.99,
          status: 'completed',
          date: '2023-12-11T13:20:00Z',
          method: 'duitnow',
          description: 'Premium plan subscription'
        }
      ];
      
      setPaymentHistory(mockPaymentHistory);
    } catch (err) {
      setError(err.response?.data?.message || 'Error loading payment data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentData();
  }, [dateRange]);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-MY', { 
      style: 'currency', 
      currency: 'MYR' 
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-MY', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return theme.success;
      case 'pending': return theme.warning;
      case 'failed': return theme.error;
      default: return theme.textSecondary;
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <FaCheckCircle />;
      case 'pending': return <FaExclamationTriangle />;
      case 'failed': return <FaTimesCircle />;
      default: return <FaExclamationTriangle />;
    }
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
    <div className="payment-overview" style={{ backgroundColor: theme.background, minHeight: '100vh', padding: '2rem 0' }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div className="card" style={{ backgroundColor: theme.backgroundCard, padding: '2rem' }}>
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ color: theme.textPrimary, marginBottom: '0.5rem', display: 'flex', alignItems: 'center' }}>
              <FaMoneyBillWave style={{ marginRight: '0.75rem', color: theme.goldPrimary }} />
              Payment Overview
            </h1>
            <p style={{ color: theme.textSecondary }}>
              Monitor platform earnings, subscription income, and transaction histories
            </p>
          </div>

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

          {/* Date Range Filter */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem', backgroundColor: theme.backgroundLight, padding: '0.25rem', borderRadius: theme.borderRadius }}>
              {['daily', 'weekly', 'monthly', 'yearly'].map((range) => (
                <button
                  key={range}
                  className="btn"
                  style={{ 
                    color: dateRange === range ? theme.goldPrimary : theme.textSecondary,
                    backgroundColor: dateRange === range ? theme.background : 'transparent',
                    fontSize: '0.875rem',
                    padding: '0.25rem 0.75rem',
                    borderRadius: theme.borderRadius
                  }}
                  onClick={() => setDateRange(range)}
                >
                  {range.charAt(0).toUpperCase() + range.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2-md grid-cols-5" style={{ gap: '1.5rem', marginBottom: '2rem' }}>
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
                  <p style={{ color: theme.textTertiary, fontSize: '0.875rem', marginBottom: '0.25rem' }}>Total Revenue</p>
                  <h3 style={{ color: theme.textPrimary, fontSize: '1.5rem' }}>
                    {formatCurrency(paymentData.totalRevenue)}
                  </h3>
                </div>
              </div>
            </div>

            {/* Monthly Revenue */}
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
                  <FaChartBar style={{ color: theme.success }} />
                </div>
                <div>
                  <p style={{ color: theme.textTertiary, fontSize: '0.875rem', marginBottom: '0.25rem' }}>Monthly Revenue</p>
                  <h3 style={{ color: theme.textPrimary, fontSize: '1.5rem' }}>
                    {formatCurrency(paymentData.monthlyRevenue)}
                  </h3>
                </div>
              </div>
            </div>

            {/* Pending Payments */}
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
                    {paymentData.pendingPayments}
                  </h3>
                </div>
              </div>
            </div>

            {/* Completed Payments */}
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
                  <p style={{ color: theme.textTertiary, fontSize: '0.875rem', marginBottom: '0.25rem' }}>Completed</p>
                  <h3 style={{ color: theme.textPrimary, fontSize: '1.5rem' }}>
                    {paymentData.completedPayments}
                  </h3>
                </div>
              </div>
            </div>

            {/* Failed Payments */}
            <div className="card" style={{ backgroundColor: theme.backgroundLight, padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{ 
                  width: '40px', 
                  height: '40px', 
                  borderRadius: '50%', 
                  backgroundColor: `${theme.error}20`, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  marginRight: '1rem'
                }}>
                  <FaTimesCircle style={{ color: theme.error }} />
                </div>
                <div>
                  <p style={{ color: theme.textTertiary, fontSize: '0.875rem', marginBottom: '0.25rem' }}>Failed</p>
                  <h3 style={{ color: theme.textPrimary, fontSize: '1.5rem' }}>
                    {paymentData.failedPayments}
                  </h3>
                </div>
              </div>
            </div>
          </div>

          {/* Payment History Table */}
          <div className="card" style={{ backgroundColor: theme.backgroundLight, padding: '1.5rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ color: theme.textPrimary, display: 'flex', alignItems: 'center' }}>
                <FaCreditCard style={{ marginRight: '0.5rem', color: theme.goldPrimary }} />
                Recent Transactions
              </h3>
              <button 
                className="btn btn-primary" 
                style={{ backgroundColor: theme.goldPrimary, color: 'white' }}
              >
                Export Report
              </button>
            </div>
            
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: `2px solid ${theme.border}` }}>
                    <th style={{ textAlign: 'left', padding: '1rem', color: theme.textTertiary, fontSize: '0.875rem' }}>Company</th>
                    <th style={{ textAlign: 'left', padding: '1rem', color: theme.textTertiary, fontSize: '0.875rem' }}>Description</th>
                    <th style={{ textAlign: 'left', padding: '1rem', color: theme.textTertiary, fontSize: '0.875rem' }}>Amount</th>
                    <th style={{ textAlign: 'left', padding: '1rem', color: theme.textTertiary, fontSize: '0.875rem' }}>Method</th>
                    <th style={{ textAlign: 'left', padding: '1rem', color: theme.textTertiary, fontSize: '0.875rem' }}>Date</th>
                    <th style={{ textAlign: 'left', padding: '1rem', color: theme.textTertiary, fontSize: '0.875rem' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {paymentHistory.map((payment, index) => (
                    <tr 
                      key={payment.id} 
                      style={{ 
                        borderBottom: index < paymentHistory.length - 1 ? `1px solid ${theme.border}` : 'none',
                        transition: theme.transition
                      }}
                    >
                      <td style={{ padding: '1rem', color: theme.textPrimary }}>
                        <div style={{ fontWeight: '500' }}>{payment.companyName}</div>
                        <div style={{ fontSize: '0.75rem', color: theme.textTertiary }}>
                          ID: {payment.companyId}
                        </div>
                      </td>
                      <td style={{ padding: '1rem', color: theme.textSecondary }}>
                        {payment.description}
                      </td>
                      <td style={{ padding: '1rem', color: theme.textPrimary }}>
                        <div style={{ fontWeight: '500' }}>
                          {formatCurrency(payment.amount)}
                        </div>
                      </td>
                      <td style={{ padding: '1rem', color: theme.textSecondary }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', padding: '0.25rem 0.5rem', backgroundColor: theme.backgroundMedium, borderRadius: '6px', fontSize: '0.75rem' }}>
                          <FaWallet style={{ marginRight: '0.25rem', fontSize: '0.875rem' }} />
                          {payment.method.toUpperCase()}
                        </div>
                      </td>
                      <td style={{ padding: '1rem', color: theme.textTertiary, fontSize: '0.875rem' }}>
                        {formatDate(payment.date)}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ 
                          display: 'inline-flex', 
                          alignItems: 'center', 
                          padding: '0.25rem 0.75rem',
                          borderRadius: '12px',
                          backgroundColor: `${getStatusColor(payment.status)}20`,
                          color: getStatusColor(payment.status),
                          fontSize: '0.75rem'
                        }}>
                          {getStatusIcon(payment.status)}
                          <span style={{ marginLeft: '0.25rem' }}>
                            {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Payment Trends */}
          <div className="grid grid-cols-1-md grid-cols-2" style={{ gap: '1.5rem' }}>
            {/* Revenue by Plan */}
            <div className="card" style={{ backgroundColor: theme.backgroundLight, padding: '1.5rem' }}>
              <h3 style={{ color: theme.textPrimary, marginBottom: '1rem' }}>Revenue by Plan</h3>
              
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ color: theme.textSecondary }}>Basic Plan</span>
                  <span style={{ color: theme.textPrimary, fontWeight: '500' }}>{formatCurrency(2499.90)}</span>
                </div>
                <div style={{ height: '8px', backgroundColor: theme.backgroundMedium, borderRadius: '4px', overflow: 'hidden' }}>
                  <div 
                    style={{ 
                      height: '100%', 
                      width: '20%', 
                      backgroundColor: theme.goldPrimary,
                      transition: theme.transition
                    }}
                  ></div>
                </div>
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ color: theme.textSecondary }}>Standard Plan</span>
                  <span style={{ color: theme.textPrimary, fontWeight: '500' }}>{formatCurrency(4999.80)}</span>
                </div>
                <div style={{ height: '8px', backgroundColor: theme.backgroundMedium, borderRadius: '4px', overflow: 'hidden' }}>
                  <div 
                    style={{ 
                      height: '100%', 
                      width: '40%', 
                      backgroundColor: theme.goldPrimary,
                      transition: theme.transition
                    }}
                  ></div>
                </div>
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ color: theme.textSecondary }}>Premium Plan</span>
                  <span style={{ color: theme.textPrimary, fontWeight: '500' }}>{formatCurrency(3999.90)}</span>
                </div>
                <div style={{ height: '8px', backgroundColor: theme.backgroundMedium, borderRadius: '4px', overflow: 'hidden' }}>
                  <div 
                    style={{ 
                      height: '100%', 
                      width: '32%', 
                      backgroundColor: theme.goldPrimary,
                      transition: theme.transition
                    }}
                  ></div>
                </div>
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ color: theme.textSecondary }}>Enterprise Plan</span>
                  <span style={{ color: theme.textPrimary, fontWeight: '500' }}>{formatCurrency(999.99)}</span>
                </div>
                <div style={{ height: '8px', backgroundColor: theme.backgroundMedium, borderRadius: '4px', overflow: 'hidden' }}>
                  <div 
                    style={{ 
                      height: '100%', 
                      width: '8%', 
                      backgroundColor: theme.goldPrimary,
                      transition: theme.transition
                    }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Payment Status Distribution */}
            <div className="card" style={{ backgroundColor: theme.backgroundLight, padding: '1.5rem' }}>
              <h3 style={{ color: theme.textPrimary, marginBottom: '1rem' }}>Payment Status Distribution</h3>
              
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ color: theme.textSecondary }}>Completed</span>
                  <span style={{ color: theme.success, fontWeight: '500' }}>{paymentData.completedPayments} ({Math.round((paymentData.completedPayments / paymentData.totalTransactions) * 100)}%)</span>
                </div>
                <div style={{ height: '8px', backgroundColor: theme.backgroundMedium, borderRadius: '4px', overflow: 'hidden' }}>
                  <div 
                    style={{ 
                      height: '100%', 
                      width: `${(paymentData.completedPayments / paymentData.totalTransactions) * 100}%`, 
                      backgroundColor: theme.success,
                      transition: theme.transition
                    }}
                  ></div>
                </div>
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ color: theme.textSecondary }}>Pending</span>
                  <span style={{ color: theme.warning, fontWeight: '500' }}>{paymentData.pendingPayments} ({Math.round((paymentData.pendingPayments / paymentData.totalTransactions) * 100)}%)</span>
                </div>
                <div style={{ height: '8px', backgroundColor: theme.backgroundMedium, borderRadius: '4px', overflow: 'hidden' }}>
                  <div 
                    style={{ 
                      height: '100%', 
                      width: `${(paymentData.pendingPayments / paymentData.totalTransactions) * 100}%`, 
                      backgroundColor: theme.warning,
                      transition: theme.transition
                    }}
                  ></div>
                </div>
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ color: theme.textSecondary }}>Failed</span>
                  <span style={{ color: theme.error, fontWeight: '500' }}>{paymentData.failedPayments} ({Math.round((paymentData.failedPayments / paymentData.totalTransactions) * 100)}%)</span>
                </div>
                <div style={{ height: '8px', backgroundColor: theme.backgroundMedium, borderRadius: '4px', overflow: 'hidden' }}>
                  <div 
                    style={{ 
                      height: '100%', 
                      width: `${(paymentData.failedPayments / paymentData.totalTransactions) * 100}%`, 
                      backgroundColor: theme.error,
                      transition: theme.transition
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentOverview;