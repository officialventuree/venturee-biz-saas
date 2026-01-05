import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { FaBuilding, FaCheckCircle, FaExclamationTriangle, FaTimesCircle, FaUser, FaCreditCard, FaEye } from 'react-icons/fa';
import axios from 'axios';

const CompanyStatus = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // all, active, pending, suspended

  // Fetch companies
  const fetchCompanies = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Simulate API call to fetch companies
      const mockCompanies = [
        {
          id: 'comp1',
          name: 'ABC Retail Sdn Bhd',
          businessType: 'retail',
          subscription: { plan: 'premium', status: 'active', startDate: '2023-10-15', endDate: '2024-10-15' },
          registrationDate: '2023-10-15',
          lastPayment: '2023-12-01',
          users: 8,
          isActive: true,
          isSuspended: false,
          securityFlags: 0
        },
        {
          id: 'comp2',
          name: 'XYZ Laundry Services',
          businessType: 'laundry',
          subscription: { plan: 'standard', status: 'active', startDate: '2023-11-20', endDate: '2024-11-20' },
          registrationDate: '2023-11-20',
          lastPayment: '2023-12-05',
          users: 5,
          isActive: true,
          isSuspended: false,
          securityFlags: 0
        },
        {
          id: 'comp3',
          name: 'QuickMart Enterprise',
          businessType: 'mart',
          subscription: { plan: 'basic', status: 'pending', startDate: null, endDate: null },
          registrationDate: '2023-12-01',
          lastPayment: null,
          users: 3,
          isActive: false,
          isSuspended: false,
          securityFlags: 0
        },
        {
          id: 'comp4',
          name: 'Tech Solutions Sdn Bhd',
          businessType: 'services',
          subscription: { plan: 'enterprise', status: 'active', startDate: '2023-09-10', endDate: '2024-09-10' },
          registrationDate: '2023-09-10',
          lastPayment: '2023-12-10',
          users: 12,
          isActive: true,
          isSuspended: false,
          securityFlags: 0
        },
        {
          id: 'comp5',
          name: 'Cafe Delight',
          businessType: 'restaurant',
          subscription: { plan: 'standard', status: 'suspended', startDate: '2023-11-05', endDate: '2024-11-05' },
          registrationDate: '2023-11-05',
          lastPayment: '2023-11-20',
          users: 6,
          isActive: false,
          isSuspended: true,
          securityFlags: 1
        },
        {
          id: 'comp6',
          name: 'Fashion Hub',
          businessType: 'retail',
          subscription: { plan: 'premium', status: 'active', startDate: '2023-08-12', endDate: '2024-08-12' },
          registrationDate: '2023-08-12',
          lastPayment: '2023-11-25',
          users: 10,
          isActive: true,
          isSuspended: false,
          securityFlags: 0
        }
      ];
      
      setCompanies(mockCompanies);
    } catch (err) {
      setError(err.response?.data?.message || 'Error loading companies');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  // Filter companies based on status
  const filteredCompanies = companies.filter(company => {
    if (filter === 'all') return true;
    if (filter === 'active') return company.subscription.status === 'active';
    if (filter === 'pending') return company.subscription.status === 'pending';
    if (filter === 'suspended') return company.subscription.status === 'suspended';
    return true;
  });

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return theme.success;
      case 'pending': return theme.warning;
      case 'suspended': return theme.error;
      case 'cancelled': return theme.textTertiary;
      default: return theme.textSecondary;
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <FaCheckCircle />;
      case 'pending': return <FaExclamationTriangle />;
      case 'suspended': return <FaTimesCircle />;
      default: return <FaExclamationTriangle />;
    }
  };

  // Handle company status change
  const handleStatusChange = async (companyId, newStatus) => {
    try {
      // Simulate API call to update company status
      console.log(`Changing status for company ${companyId} to ${newStatus}`);
      
      // Update local state
      setCompanies(prev => prev.map(company => 
        company.id === companyId 
          ? { 
              ...company, 
              subscription: { ...company.subscription, status: newStatus },
              isActive: newStatus === 'active',
              isSuspended: newStatus === 'suspended'
            }
          : company
      ));
    } catch (err) {
      setError('Error updating company status');
    }
  };

  // Handle security flag
  const handleSecurityFlag = async (companyId) => {
    try {
      // Simulate API call to update security flag
      console.log(`Toggling security flag for company ${companyId}`);
      
      // Update local state
      setCompanies(prev => prev.map(company => 
        company.id === companyId 
          ? { 
              ...company, 
              securityFlags: company.securityFlags > 0 ? 0 : 1
            }
          : company
      ));
    } catch (err) {
      setError('Error updating security flag');
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
    <div className="company-status" style={{ backgroundColor: theme.background, minHeight: '100vh', padding: '2rem 0' }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div className="card" style={{ backgroundColor: theme.backgroundCard, padding: '2rem' }}>
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ color: theme.textPrimary, marginBottom: '0.5rem', display: 'flex', alignItems: 'center' }}>
              <FaBuilding style={{ marginRight: '0.75rem', color: theme.goldPrimary }} />
              Company Status Management
            </h1>
            <p style={{ color: theme.textSecondary }}>
              Manage company activation states, subscriptions, and security settings
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

          {/* Filter Controls */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                className="btn btn-outline"
                style={{ 
                  color: filter === 'all' ? theme.goldPrimary : theme.textPrimary,
                  borderColor: filter === 'all' ? theme.goldPrimary : theme.border,
                  backgroundColor: filter === 'all' ? `${theme.goldPrimary}10` : 'transparent'
                }}
                onClick={() => setFilter('all')}
              >
                All Companies
              </button>
              <button
                className="btn btn-outline"
                style={{ 
                  color: filter === 'active' ? theme.success : theme.textPrimary,
                  borderColor: filter === 'active' ? theme.success : theme.border,
                  backgroundColor: filter === 'active' ? `${theme.success}10` : 'transparent'
                }}
                onClick={() => setFilter('active')}
              >
                Active
              </button>
              <button
                className="btn btn-outline"
                style={{ 
                  color: filter === 'pending' ? theme.warning : theme.textPrimary,
                  borderColor: filter === 'pending' ? theme.warning : theme.border,
                  backgroundColor: filter === 'pending' ? `${theme.warning}10` : 'transparent'
                }}
                onClick={() => setFilter('pending')}
              >
                Pending
              </button>
              <button
                className="btn btn-outline"
                style={{ 
                  color: filter === 'suspended' ? theme.error : theme.textPrimary,
                  borderColor: filter === 'suspended' ? theme.error : theme.border,
                  backgroundColor: filter === 'suspended' ? `${theme.error}10` : 'transparent'
                }}
                onClick={() => setFilter('suspended')}
              >
                Suspended
              </button>
            </div>
            
            <button 
              className="btn btn-primary" 
              style={{ backgroundColor: theme.goldPrimary, color: 'white' }}
              onClick={() => window.location.hash = '#/dashboard/admin/company-registration'}
            >
              Add Company
            </button>
          </div>

          {/* Companies Table */}
          <div className="card" style={{ backgroundColor: theme.backgroundLight, padding: '1.5rem' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: `2px solid ${theme.border}` }}>
                    <th style={{ textAlign: 'left', padding: '1rem', color: theme.textTertiary, fontSize: '0.875rem' }}>Company</th>
                    <th style={{ textAlign: 'left', padding: '1rem', color: theme.textTertiary, fontSize: '0.875rem' }}>Type</th>
                    <th style={{ textAlign: 'left', padding: '1rem', color: theme.textTertiary, fontSize: '0.875rem' }}>Plan</th>
                    <th style={{ textAlign: 'left', padding: '1rem', color: theme.textTertiary, fontSize: '0.875rem' }}>Status</th>
                    <th style={{ textAlign: 'left', padding: '1rem', color: theme.textTertiary, fontSize: '0.875rem' }}>Users</th>
                    <th style={{ textAlign: 'left', padding: '1rem', color: theme.textTertiary, fontSize: '0.875rem' }}>Security</th>
                    <th style={{ textAlign: 'left', padding: '1rem', color: theme.textTertiary, fontSize: '0.875rem' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCompanies.map((company, index) => (
                    <tr 
                      key={company.id} 
                      style={{ 
                        borderBottom: index < filteredCompanies.length - 1 ? `1px solid ${theme.border}` : 'none',
                        transition: theme.transition
                      }}
                    >
                      <td style={{ padding: '1rem', color: theme.textPrimary }}>
                        <div style={{ fontWeight: '500', display: 'flex', alignItems: 'center' }}>
                          <FaBuilding style={{ marginRight: '0.5rem', color: theme.goldPrimary }} />
                          {company.name}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: theme.textTertiary }}>
                          {new Date(company.registrationDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td style={{ padding: '1rem', color: theme.textSecondary }}>
                        {company.businessType.charAt(0).toUpperCase() + company.businessType.slice(1)}
                      </td>
                      <td style={{ padding: '1rem', color: theme.textSecondary }}>
                        {company.subscription.plan.charAt(0).toUpperCase() + company.subscription.plan.slice(1)}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ 
                          display: 'inline-flex', 
                          alignItems: 'center', 
                          padding: '0.25rem 0.75rem',
                          borderRadius: '12px',
                          backgroundColor: `${getStatusColor(company.subscription.status)}20`,
                          color: getStatusColor(company.subscription.status),
                          fontSize: '0.75rem'
                        }}>
                          {getStatusIcon(company.subscription.status)}
                          <span style={{ marginLeft: '0.25rem' }}>
                            {company.subscription.status.charAt(0).toUpperCase() + company.subscription.status.slice(1)}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: '1rem', color: theme.textSecondary }}>
                        {company.users}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        {company.securityFlags > 0 ? (
                          <div style={{ 
                            display: 'inline-flex', 
                            alignItems: 'center', 
                            padding: '0.25rem 0.75rem',
                            borderRadius: '12px',
                            backgroundColor: `${theme.error}20`,
                            color: theme.error,
                            fontSize: '0.75rem'
                          }}>
                            <FaExclamationTriangle style={{ marginRight: '0.25rem' }} />
                            Flagged
                          </div>
                        ) : (
                          <div style={{ 
                            display: 'inline-flex', 
                            alignItems: 'center', 
                            padding: '0.25rem 0.75rem',
                            borderRadius: '12px',
                            backgroundColor: `${theme.success}20`,
                            color: theme.success,
                            fontSize: '0.75rem'
                          }}>
                            <FaCheckCircle style={{ marginRight: '0.25rem' }} />
                            Secure
                          </div>
                        )}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                          <button 
                            className="btn btn-outline" 
                            style={{ 
                              color: theme.textPrimary, 
                              borderColor: theme.border,
                              fontSize: '0.75rem',
                              padding: '0.25rem 0.5rem'
                            }}
                            title="View Company Details"
                          >
                            <FaEye />
                          </button>
                          
                          {company.subscription.status !== 'active' && (
                            <button 
                              className="btn btn-outline" 
                              style={{ 
                                color: theme.success, 
                                borderColor: theme.success,
                                fontSize: '0.75rem',
                                padding: '0.25rem 0.5rem'
                              }}
                              onClick={() => handleStatusChange(company.id, 'active')}
                              title="Activate Company"
                            >
                              Activate
                            </button>
                          )}
                          
                          {company.subscription.status !== 'suspended' && (
                            <button 
                              className="btn btn-outline" 
                              style={{ 
                                color: theme.error, 
                                borderColor: theme.error,
                                fontSize: '0.75rem',
                                padding: '0.25rem 0.5rem'
                              }}
                              onClick={() => handleStatusChange(company.id, 'suspended')}
                              title="Suspend Company"
                            >
                              Suspend
                            </button>
                          )}
                          
                          <button 
                            className="btn btn-outline" 
                            style={{ 
                              color: company.securityFlags > 0 ? theme.success : theme.warning, 
                              borderColor: company.securityFlags > 0 ? theme.success : theme.warning,
                              fontSize: '0.75rem',
                              padding: '0.25rem 0.5rem'
                            }}
                            onClick={() => handleSecurityFlag(company.id)}
                            title={company.securityFlags > 0 ? "Clear Security Flag" : "Add Security Flag"}
                          >
                            {company.securityFlags > 0 ? "Clear Flag" : "Flag"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-2-md grid-cols-4" style={{ gap: '1.5rem', marginTop: '2rem' }}>
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
                    {companies.length}
                  </h3>
                </div>
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
                  <p style={{ color: theme.textTertiary, fontSize: '0.875rem', marginBottom: '0.25rem' }}>Active</p>
                  <h3 style={{ color: theme.textPrimary, fontSize: '1.5rem' }}>
                    {companies.filter(c => c.subscription.status === 'active').length}
                  </h3>
                </div>
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
                    {companies.filter(c => c.subscription.status === 'pending').length}
                  </h3>
                </div>
              </div>
            </div>

            {/* Suspended Companies */}
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
                  <p style={{ color: theme.textTertiary, fontSize: '0.875rem', marginBottom: '0.25rem' }}>Suspended</p>
                  <h3 style={{ color: theme.textPrimary, fontSize: '1.5rem' }}>
                    {companies.filter(c => c.subscription.status === 'suspended').length}
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyStatus;