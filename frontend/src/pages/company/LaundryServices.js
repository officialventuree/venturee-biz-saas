import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { FaTshirt, FaShoppingCart, FaClock, FaMoneyBillWave, FaUser, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

const LaundryServices = () => {
  const { user, company } = useAuth();
  const { theme } = useTheme();
  const [laundryOrders, setLaundryOrders] = useState([]);
  const [services, setServices] = useState([]);
  const [newOrder, setNewOrder] = useState({
    customerName: '',
    customerPhone: '',
    serviceType: '',
    quantity: 1,
    weight: 0,
    specialInstructions: ''
  });
  const [showAddModal, setShowAddModal] = useState(false);

  // Mock data initialization
  useEffect(() => {
    // Mock services
    const mockServices = [
      { id: 1, name: 'Basic Wash', price: 3.00, unit: 'kg' },
      { id: 2, name: 'Dry Clean', price: 8.00, unit: 'item' },
      { id: 3, name: 'Iron Only', price: 2.00, unit: 'item' },
      { id: 4, name: 'Premium Wash', price: 5.00, unit: 'kg' },
      { id: 5, name: 'Express Wash', price: 6.00, unit: 'kg' }
    ];
    setServices(mockServices);

    // Mock laundry orders
    const mockOrders = [
      {
        id: 1,
        customerName: 'Ahmad Ali',
        customerPhone: '012-3456789',
        serviceType: 'Basic Wash',
        quantity: 1,
        weight: 3.5,
        specialInstructions: 'No fabric softener',
        status: 'washing',
        price: 10.50,
        orderDate: '2023-12-15T09:30:00Z',
        estimatedCompletion: '2023-12-15T14:00:00Z'
      },
      {
        id: 2,
        customerName: 'Sarah Lim',
        customerPhone: '016-9876543',
        serviceType: 'Dry Clean',
        quantity: 3,
        weight: 0,
        specialInstructions: 'Handle with care',
        status: 'completed',
        price: 24.00,
        orderDate: '2023-12-14T14:20:00Z',
        estimatedCompletion: '2023-12-14T17:00:00Z'
      },
      {
        id: 3,
        customerName: 'Raj Kumar',
        customerPhone: '019-1234567',
        serviceType: 'Premium Wash',
        quantity: 1,
        weight: 2.0,
        specialInstructions: 'Use gentle cycle',
        status: 'pending',
        price: 10.00,
        orderDate: '2023-12-15T10:15:00Z',
        estimatedCompletion: '2023-12-15T15:00:00Z'
      }
    ];
    setLaundryOrders(mockOrders);
  }, []);

  // Add new order
  const handleAddOrder = () => {
    const service = services.find(s => s.name === newOrder.serviceType);
    if (!service) return;

    const price = service.unit === 'kg' 
      ? service.price * newOrder.weight 
      : service.price * newOrder.quantity;

    const order = {
      id: laundryOrders.length + 1,
      customerName: newOrder.customerName,
      customerPhone: newOrder.customerPhone,
      serviceType: newOrder.serviceType,
      quantity: newOrder.quantity,
      weight: newOrder.weight,
      specialInstructions: newOrder.specialInstructions,
      status: 'pending',
      price: price,
      orderDate: new Date().toISOString(),
      estimatedCompletion: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString() // 4 hours from now
    };

    setLaundryOrders([...laundryOrders, order]);
    setNewOrder({
      customerName: '',
      customerPhone: '',
      serviceType: '',
      quantity: 1,
      weight: 0,
      specialInstructions: ''
    });
    setShowAddModal(false);
  };

  // Update order status
  const updateOrderStatus = (orderId, newStatus) => {
    setLaundryOrders(laundryOrders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  // Calculate stats
  const pendingOrders = laundryOrders.filter(order => order.status === 'pending').length;
  const washingOrders = laundryOrders.filter(order => order.status === 'washing').length;
  const completedOrders = laundryOrders.filter(order => order.status === 'completed').length;
  const totalRevenue = laundryOrders.filter(order => order.status === 'completed').reduce((sum, order) => sum + order.price, 0);

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-MY', {
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
      case 'pending': return theme.warning;
      case 'washing': return theme.info;
      case 'completed': return theme.success;
      default: return theme.textSecondary;
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <FaClock />;
      case 'washing': return <FaTshirt />;
      case 'completed': return <FaCheckCircle />;
      default: return <FaClock />;
    }
  };

  return (
    <div className="laundry-services" style={{ backgroundColor: theme.background, minHeight: '100vh', padding: '2rem 0' }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div className="card" style={{ backgroundColor: theme.backgroundCard, padding: '2rem' }}>
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ color: theme.textPrimary, marginBottom: '0.5rem', display: 'flex', alignItems: 'center' }}>
              <FaTshirt style={{ marginRight: '0.75rem', color: theme.goldPrimary }} />
              Laundry Services
            </h1>
            <p style={{ color: theme.textSecondary }}>
              Manage laundry orders, services, and customer information
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2-md grid-cols-4" style={{ gap: '1.5rem', marginBottom: '2rem' }}>
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
                  <FaClock style={{ color: theme.warning }} />
                </div>
                <div>
                  <p style={{ color: theme.textTertiary, fontSize: '0.875rem', marginBottom: '0.25rem' }}>Pending Orders</p>
                  <h3 style={{ color: theme.textPrimary, fontSize: '1.5rem' }}>
                    {pendingOrders}
                  </h3>
                </div>
              </div>
            </div>

            {/* Washing Orders */}
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
                  <FaTshirt style={{ color: theme.info }} />
                </div>
                <div>
                  <p style={{ color: theme.textTertiary, fontSize: '0.875rem', marginBottom: '0.25rem' }}>In Progress</p>
                  <h3 style={{ color: theme.textPrimary, fontSize: '1.5rem' }}>
                    {washingOrders}
                  </h3>
                </div>
              </div>
            </div>

            {/* Completed Orders */}
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
                    {completedOrders}
                  </h3>
                </div>
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
                  <p style={{ color: theme.textTertiary, fontSize: '0.875rem', marginBottom: '0.25rem' }}>Revenue (Today)</p>
                  <h3 style={{ color: theme.textPrimary, fontSize: '1.5rem' }}>
                    {new Intl.NumberFormat('en-MY', { 
                      style: 'currency', 
                      currency: 'MYR' 
                    }).format(totalRevenue)}
                  </h3>
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h2 style={{ color: theme.textPrimary, marginBottom: 0 }}>Laundry Orders</h2>
            <button
              className="btn btn-primary"
              style={{ backgroundColor: theme.goldPrimary, color: 'white' }}
              onClick={() => setShowAddModal(true)}
            >
              <FaPlus style={{ marginRight: '0.5rem' }} />
              New Order
            </button>
          </div>

          {/* Orders Table */}
          <div className="card" style={{ backgroundColor: theme.backgroundLight, padding: '1.5rem', marginBottom: '2rem' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: `2px solid ${theme.border}` }}>
                    <th style={{ textAlign: 'left', padding: '1rem', color: theme.textTertiary, fontSize: '0.875rem' }}>Customer</th>
                    <th style={{ textAlign: 'left', padding: '1rem', color: theme.textTertiary, fontSize: '0.875rem' }}>Service</th>
                    <th style={{ textAlign: 'left', padding: '1rem', color: theme.textTertiary, fontSize: '0.875rem' }}>Details</th>
                    <th style={{ textAlign: 'left', padding: '1rem', color: theme.textTertiary, fontSize: '0.875rem' }}>Status</th>
                    <th style={{ textAlign: 'left', padding: '1rem', color: theme.textTertiary, fontSize: '0.875rem' }}>Price</th>
                    <th style={{ textAlign: 'left', padding: '1rem', color: theme.textTertiary, fontSize: '0.875rem' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {laundryOrders.map((order) => (
                    <tr 
                      key={order.id} 
                      style={{ 
                        borderBottom: `1px solid ${theme.border}`
                      }}
                    >
                      <td style={{ padding: '1rem', color: theme.textPrimary }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <div style={{ 
                            width: '32px', 
                            height: '32px', 
                            borderRadius: '50%', 
                            backgroundColor: theme.backgroundMedium,
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            marginRight: '0.75rem',
                            flexShrink: 0
                          }}>
                            <FaUser style={{ color: theme.textTertiary }} />
                          </div>
                          <div>
                            <div style={{ fontWeight: '500' }}>{order.customerName}</div>
                            <div style={{ fontSize: '0.75rem', color: theme.textTertiary }}>
                              {order.customerPhone}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '1rem', color: theme.textSecondary }}>
                        {order.serviceType}
                      </td>
                      <td style={{ padding: '1rem', color: theme.textSecondary }}>
                        {order.weight > 0 ? (
                          <div>{order.weight} kg</div>
                        ) : (
                          <div>{order.quantity} item(s)</div>
                        )}
                        <div style={{ fontSize: '0.75rem', color: theme.textTertiary }}>
                          {order.specialInstructions || 'No special instructions'}
                        </div>
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
                      <td style={{ padding: '1rem', color: theme.textPrimary }}>
                        {new Intl.NumberFormat('en-MY', { 
                          style: 'currency', 
                          currency: 'MYR' 
                        }).format(order.price)}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                          {order.status === 'pending' && (
                            <button
                              className="btn btn-outline"
                              style={{ 
                                color: theme.info, 
                                borderColor: theme.info,
                                padding: '0.25rem 0.5rem',
                                fontSize: '0.75rem'
                              }}
                              onClick={() => updateOrderStatus(order.id, 'washing')}
                            >
                              Start
                            </button>
                          )}
                          {order.status === 'washing' && (
                            <button
                              className="btn btn-outline"
                              style={{ 
                                color: theme.success, 
                                borderColor: theme.success,
                                padding: '0.25rem 0.5rem',
                                fontSize: '0.75rem'
                              }}
                              onClick={() => updateOrderStatus(order.id, 'completed')}
                            >
                              Complete
                            </button>
                          )}
                          <button
                            className="btn btn-outline"
                            style={{ 
                              color: theme.error, 
                              borderColor: theme.error,
                              padding: '0.25rem 0.5rem',
                              fontSize: '0.75rem'
                            }}
                            onClick={() => {
                              if (window.confirm('Are you sure you want to delete this order?')) {
                                setLaundryOrders(laundryOrders.filter(o => o.id !== order.id));
                              }
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Services Pricing */}
          <div className="card" style={{ backgroundColor: theme.backgroundLight, padding: '1.5rem' }}>
            <h3 style={{ color: theme.textPrimary, marginBottom: '1rem' }}>Service Pricing</h3>
            <div className="grid grid-cols-1-md grid-cols-3" style={{ gap: '1rem' }}>
              {services.map((service) => (
                <div key={service.id} className="card" style={{ backgroundColor: theme.backgroundMedium, padding: '1rem' }}>
                  <h4 style={{ color: theme.textPrimary, marginBottom: '0.5rem' }}>{service.name}</h4>
                  <p style={{ color: theme.textSecondary, marginBottom: '0.5rem' }}>
                    {new Intl.NumberFormat('en-MY', { 
                      style: 'currency', 
                      currency: 'MYR' 
                    }).format(service.price)} per {service.unit}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add Order Modal */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: theme.overlay,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="card" style={{ 
            backgroundColor: theme.backgroundCard, 
            padding: '2rem', 
            maxWidth: '600px',
            width: '90%'
          }}>
            <h2 style={{ color: theme.textPrimary, marginBottom: '1.5rem' }}>New Laundry Order</h2>
            
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: theme.textPrimary }}>Customer Name</label>
              <input
                type="text"
                value={newOrder.customerName}
                onChange={(e) => setNewOrder({...newOrder, customerName: e.target.value})}
                className="form-input"
                style={{ 
                  backgroundColor: theme.backgroundLight, 
                  borderColor: theme.border, 
                  color: theme.textPrimary,
                  width: '100%',
                  padding: '0.75rem'
                }}
              />
            </div>
            
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: theme.textPrimary }}>Customer Phone</label>
              <input
                type="tel"
                value={newOrder.customerPhone}
                onChange={(e) => setNewOrder({...newOrder, customerPhone: e.target.value})}
                className="form-input"
                style={{ 
                  backgroundColor: theme.backgroundLight, 
                  borderColor: theme.border, 
                  color: theme.textPrimary,
                  width: '100%',
                  padding: '0.75rem'
                }}
              />
            </div>
            
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: theme.textPrimary }}>Service Type</label>
              <select
                value={newOrder.serviceType}
                onChange={(e) => setNewOrder({...newOrder, serviceType: e.target.value})}
                className="form-input"
                style={{ 
                  backgroundColor: theme.backgroundLight, 
                  borderColor: theme.border, 
                  color: theme.textPrimary,
                  width: '100%',
                  padding: '0.75rem'
                }}
              >
                <option value="">Select a service</option>
                {services.map(service => (
                  <option key={service.id} value={service.name}>
                    {service.name} - {new Intl.NumberFormat('en-MY', { 
                      style: 'currency', 
                      currency: 'MYR' 
                    }).format(service.price)} per {service.unit}
                  </option>
                ))}
              </select>
            </div>
            
            {newOrder.serviceType && (
              <>
                {services.find(s => s.name === newOrder.serviceType)?.unit === 'kg' ? (
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: theme.textPrimary }}>Weight (kg)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      value={newOrder.weight}
                      onChange={(e) => setNewOrder({...newOrder, weight: parseFloat(e.target.value)})}
                      className="form-input"
                      style={{ 
                        backgroundColor: theme.backgroundLight, 
                        borderColor: theme.border, 
                        color: theme.textPrimary,
                        width: '100%',
                        padding: '0.75rem'
                      }}
                    />
                  </div>
                ) : (
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: theme.textPrimary }}>Quantity (items)</label>
                    <input
                      type="number"
                      min="1"
                      value={newOrder.quantity}
                      onChange={(e) => setNewOrder({...newOrder, quantity: parseInt(e.target.value)})}
                      className="form-input"
                      style={{ 
                        backgroundColor: theme.backgroundLight, 
                        borderColor: theme.border, 
                        color: theme.textPrimary,
                        width: '100%',
                        padding: '0.75rem'
                      }}
                    />
                  </div>
                )}
              </>
            )}
            
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: theme.textPrimary }}>Special Instructions</label>
              <textarea
                value={newOrder.specialInstructions}
                onChange={(e) => setNewOrder({...newOrder, specialInstructions: e.target.value})}
                className="form-input"
                rows="3"
                style={{ 
                  backgroundColor: theme.backgroundLight, 
                  borderColor: theme.border, 
                  color: theme.textPrimary,
                  width: '100%',
                  padding: '0.75rem'
                }}
              />
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
              <button
                className="btn btn-outline"
                style={{ color: theme.textPrimary, borderColor: theme.border }}
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                style={{ backgroundColor: theme.goldPrimary, color: 'white' }}
                onClick={handleAddOrder}
                disabled={!newOrder.customerName || !newOrder.serviceType}
              >
                Add Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LaundryServices;