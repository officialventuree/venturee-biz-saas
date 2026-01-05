import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { FaCogs, FaShoppingCart, FaBox, FaTags, FaWallet, FaChartBar, FaCheckCircle, FaExclamationTriangle, FaTimesCircle } from 'react-icons/fa';
import axios from 'axios';

const Services = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [services, setServices] = useState([]);
  const [serviceOrders, setServiceOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // all, active, pending, completed, cancelled

  // Fetch services and orders
  const fetchServicesData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Simulate API call to fetch services and orders
      const mockServices = [
        {
          id: 'svc1',
          name: 'Dashboard Subscription',
          type: 'subscription',
          description: 'Monthly access to dashboard features',
          price: 99.99,
          active: true
        },
        {
          id: 'svc2',
          name: 'POS Module',
          type: 'addon',
          description: 'Point of Sale functionality',
          price: 29.99,
          active: true
        },
        {
          id: 'svc3',
          name: 'Inventory Module',
          type: 'addon',
          description: 'Inventory management features',
          price: 29.99,
          active: true
        },
        {
          id: 'svc4',
          name: 'Laundry Module',
          type: 'addon',
          description: 'Laundry service management',
          price: 39.99,
          active: true
        },
        {
          id: 'svc5',
          name: 'Premium Support',
          type: 'service',
          description: 'Priority customer support',
          price: 49.99,
          active: true
        },
        {
          id: 'svc6',
          name: 'Custom Development',
          type: 'service',
          description: 'Custom features and integrations',
          price: 199.99,
          active: true
        }
      ];
      
      const mockServiceOrders = [
        {
          id: 'ord1',
          serviceId: 'svc1',
          serviceName: 'Dashboard Subscription',
          companyId: 'comp1',
          companyName: 'ABC Retail Sdn Bhd',
          amount: 99.99,
          status: 'active',
          startDate: '2023-10-15',
          endDate: '2024-10-15',
          type: 'subscription'
        },
        {
          id: 'ord2',
          serviceId: 'svc2',
          serviceName: 'POS Module',
          companyId: 'comp2',
          companyName: 'XYZ Laundry Services',
          amount: 29.99,
          status: 'active',
          startDate: '2023-11-20',
          endDate: '2024-11-20',
          type: 'addon'
        },
        {
          id: 'ord3',
          serviceId: 'svc3',
          serviceName: 'Inventory Module',
          companyId: 'comp3',
          companyName: 'QuickMart Enterprise',
          amount: 29.99,
          status: 'pending',
          startDate: null,
          endDate: null,
          type: 'addon'
        },
        {
          id: 'ord4',
          serviceId: 'svc1',
          serviceName: 'Dashboard Subscription',
          companyId: 'comp4',
          companyName: 'Tech Solutions Sdn Bhd',
          amount: 499.99,
          status: 'active',
          startDate: '2023-09-10',
          endDate: '2024-09-10',
          type: 'subscription'
        },
        {
          id: 'ord5',
          serviceId: 'svc5',
          serviceName: 'Premium Support',
          companyId: 'comp5',
          companyName: 'Cafe Delight',
          amount: 49.99,
          status: 'completed',
          startDate: '2023-11-05',
          endDate: '2023-12-05',
          type: 'service'
        },
        {
          id: 'ord6',
          serviceId: 'svc6',
          serviceName: 'Custom Development',
          companyId: 'comp6',
          companyName: 'Fashion Hub',
          amount: 199.99,
          status: 'pending',
          startDate: null,
          endDate: null,
          type: 'service'
        }
      ];
      
      setServices(mockServices);
      setServiceOrders(mockServiceOrders);
    } catch (err) {
      setError(err.response?.data?.message || 'Error loading services data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServicesData();
  }, []);

  // Filter service orders based on status
  const filteredServiceOrders = serviceOrders.filter(order => {
    if (filter === 'all') return true;
    if (filter === 'active') return order.status === 'active';
    if (filter === 'pending') return order.status === 'pending';
    if (filter === 'completed') return order.status === 'completed';
    if (filter === 'cancelled') return order.status === 'cancelled';
    return true;
  });

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return theme.success;
      case 'pending': return theme.warning;
      case 'completed': return theme.info;
      case 'cancelled': return theme.error;
      default: return theme.textSecondary;
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <FaCheckCircle />;
      case 'pending': return <FaExclamationTriangle />;
      case 'completed': return <FaCheckCircle />;
      case 'cancelled': return <FaTimesCircle />;
      default: return <FaExclamationTriangle />;
    }
  };

  // Get service icon
  const getServiceIcon = (type) => {
    switch (type) {
      case 'subscription': return <FaCogs />;
      case 'addon': return <FaShoppingCart />;
      case 'service': return <FaChartBar />;
      default: return <FaCogs />;
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-MY', { 
      style: 'currency', 
      currency: 'MYR' 
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-MY');
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
    <div className="services" style={{ backgroundColor: theme.background, minHeight: '100vh', padding: '2rem 0' }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div className="card" style={{ backgroundColor: theme.backgroundCard, padding: '2rem' }}>
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ color: theme.textPrimary, marginBottom: '0.5rem', display: 'flex', alignItems: 'center' }}>
              <FaCogs style={{ marginRight: '0.75rem', color: theme.goldPrimary }} />
              Services Management
            </h1>
            <p style={{ color: theme.textSecondary }}>
              Manage platform services, subscriptions, add-ons, and support requests
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

          {/* Tabs for Services vs Orders */}
          <div style={{ display: 'flex', marginBottom: '2rem', borderBottom: `1px solid ${theme.border}` }}>
            <button
              className="btn"
              style={{ 
                color: theme.textPrimary,
                borderBottom: `2px solid ${theme.goldPrimary}`,
                fontWeight: '500',
                marginBottom: '-1px',
                marginRight: '1rem'
              }}
            >
              Service Orders
            </button>
            <button
              className="btn"
              style={{ 
                color: theme.textTertiary,
                marginRight: '1rem'
              }}
            >
              Available Services
            </button>
          </div>

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
                All Orders
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
                  color: filter === 'completed' ? theme.info : theme.textPrimary,
                  borderColor: filter === 'completed' ? theme.info : theme.border,
                  backgroundColor: filter === 'completed' ? `${theme.info}10` : 'transparent'
                }}
                onClick={() => setFilter('completed')}
              >
                Completed
              </button>
            </div>
            
            <button 
              className="btn btn-primary" 
              style={{ backgroundColor: theme.goldPrimary, color: 'white' }}
            >
              Add Service
            </button>
          </div>

          {/* Service Orders Table */}
          <div className="card" style={{ backgroundColor: theme.backgroundLight, padding: '1.5rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ color: theme.textPrimary, display: 'flex', alignItems: 'center' }}>
                <FaShoppingCart style={{ marginRight: '0.5rem', color: theme.goldPrimary }} />
                Service Orders
              </h3>
              <button 
                className="btn btn-outline" 
                style={{ color: theme.textPrimary, borderColor: theme.border }}
              >
                Export Orders
              </button>
            </div>
            
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: `2px solid ${theme.border}` }}>
                    <th style={{ textAlign: 'left', padding: '1rem', color: theme.textTertiary, fontSize: '0.875rem' }}>Service</th>
                    <th style={{ textAlign: 'left', padding: '1rem', color: theme.textTertiary, fontSize: '0.875rem' }}>Company</th>
                    <th style={{ textAlign: 'left', padding: '1rem', color: theme.textTertiary, fontSize: '0.875rem' }}>Amount</th>
                    <th style={{ textAlign: 'left', padding: '1rem', color: theme.textTertiary, fontSize: '0.875rem' }}>Start Date</th>
                    <th style={{ textAlign: 'left', padding: '1rem', color: theme.textTertiary, fontSize: '0.875rem' }}>End Date</th>
                    <th style={{ textAlign: 'left', padding: '1rem', color: theme.textTertiary, fontSize: '0.875rem' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredServiceOrders.map((order, index) => (
                    <tr 
                      key={order.id} 
                      style={{ 
                        borderBottom: index < filteredServiceOrders.length - 1 ? `1px solid ${theme.border}` : 'none',
                        transition: theme.transition
                      }}
                    >
                      <td style={{ padding: '1rem', color: theme.textPrimary }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <div style={{ 
                            width: '24px', 
                            height: '24px', 
                            borderRadius: '50%', 
                            backgroundColor: `${theme.goldPrimary}20`, 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            marginRight: '0.75rem',
                            flexShrink: 0
                          }}>
                            {getServiceIcon(order.type)}
                          </div>
                          <div>
                            <div style={{ fontWeight: '500' }}>{order.serviceName}</div>
                            <div style={{ fontSize: '0.75rem', color: theme.textTertiary }}>
                              {order.type.charAt(0).toUpperCase() + order.type.slice(1)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '1rem', color: theme.textSecondary }}>
                        <div>{order.companyName}</div>
                        <div style={{ fontSize: '0.75rem', color: theme.textTertiary }}>
                          ID: {order.companyId}
                        </div>
                      </td>
                      <td style={{ padding: '1rem', color: theme.textPrimary }}>
                        {formatCurrency(order.amount)}
                      </td>
                      <td style={{ padding: '1rem', color: theme.textTertiary, fontSize: '0.875rem' }}>
                        {formatDate(order.startDate)}
                      </td>
                      <td style={{ padding: '1rem', color: theme.textTertiary, fontSize: '0.875rem' }}>
                        {formatDate(order.endDate)}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ 
                          display: 'inline-flex', 
                          alignItems: 'center', 
                          padding: '0.25rem 0.75rem',
                          borderRadius: '12px',
                          backgroundColor: `${getStatusColor(order.status)}20`,
                          color: getStatusColor(order.status),
                          fontSize: '0.75rem'
                        }}>
                          {getStatusIcon(order.status)}
                          <span style={{ marginLeft: '0.25rem' }}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Available Services */}
          <div className="card" style={{ backgroundColor: theme.backgroundLight, padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ color: theme.textPrimary, display: 'flex', alignItems: 'center' }}>
                <FaCogs style={{ marginRight: '0.5rem', color: theme.goldPrimary }} />
                Available Services
              </h3>
              <button 
                className="btn btn-outline" 
                style={{ color: theme.textPrimary, borderColor: theme.border }}
              >
                Add New Service
              </button>
            </div>
            
            <div className="grid grid-cols-1-md grid-cols-3" style={{ gap: '1.5rem' }}>
              {services.map((service) => (
                <div key={service.id} className="card" style={{ backgroundColor: theme.background, padding: '1.5rem' }}>
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
                      {getServiceIcon(service.type)}
                    </div>
                    <div>
                      <h4 style={{ color: theme.textPrimary, marginBottom: '0.25rem' }}>
                        {service.name}
                      </h4>
                      <div style={{ fontSize: '0.75rem', color: theme.textTertiary }}>
                        {service.type.charAt(0).toUpperCase() + service.type.slice(1)}
                      </div>
                    </div>
                  </div>
                  
                  <p style={{ color: theme.textSecondary, marginBottom: '1rem', fontSize: '0.875rem' }}>
                    {service.description}
                  </p>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <span style={{ color: theme.textPrimary, fontWeight: '500' }}>
                      {formatCurrency(service.price)}
                      <span style={{ color: theme.textTertiary, fontSize: '0.75rem', fontWeight: 'normal' }}>
                        {service.type === 'subscription' ? '/mo' : ''}
                      </span>
                    </span>
                    <div style={{ 
                      padding: '0.25rem 0.5rem', 
                      borderRadius: '12px', 
                      fontSize: '0.75rem',
                      backgroundColor: service.active ? `${theme.success}20` : `${theme.error}20`,
                      color: service.active ? theme.success : theme.error
                    }}>
                      {service.active ? 'Active' : 'Inactive'}
                    </div>
                  </div>
                  
                  <button 
                    className="btn btn-outline" 
                    style={{ 
                      color: theme.textPrimary, 
                      borderColor: theme.border,
                      width: '100%'
                    }}
                  >
                    Manage Service
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Service Stats */}
          <div className="grid grid-cols-2-md grid-cols-4" style={{ gap: '1.5rem', marginTop: '2rem' }}>
            {/* Total Services */}
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
                  <FaCogs style={{ color: theme.goldPrimary }} />
                </div>
                <div>
                  <p style={{ color: theme.textTertiary, fontSize: '0.875rem', marginBottom: '0.25rem' }}>Total Services</p>
                  <h3 style={{ color: theme.textPrimary, fontSize: '1.5rem' }}>
                    {services.length}
                  </h3>
                </div>
              </div>
            </div>

            {/* Active Services */}
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
                  <p style={{ color: theme.textTertiary, fontSize: '0.875rem', marginBottom: '0.25rem' }}>Active Services</p>
                  <h3 style={{ color: theme.textPrimary, fontSize: '1.5rem' }}>
                    {services.filter(s => s.active).length}
                  </h3>
                </div>
              </div>
            </div>

            {/* Pending Orders */}
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
                  <p style={{ color: theme.textTertiary, fontSize: '0.875rem', marginBottom: '0.25rem' }}>Pending Orders</p>
                  <h3 style={{ color: theme.textPrimary, fontSize: '1.5rem' }}>
                    {serviceOrders.filter(o => o.status === 'pending').length}
                  </h3>
                </div>
              </div>
            </div>

            {/* Active Orders */}
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
                  <p style={{ color: theme.textTertiary, fontSize: '0.875rem', marginBottom: '0.25rem' }}>Active Orders</p>
                  <h3 style={{ color: theme.textPrimary, fontSize: '1.5rem' }}>
                    {serviceOrders.filter(o => o.status === 'active').length}
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

export default Services;