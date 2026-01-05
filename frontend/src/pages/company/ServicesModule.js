import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { FaShoppingCart, FaTags, FaMoneyBillWave, FaUser, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

const ServicesModule = () => {
  const { user, company } = useAuth();
  const { theme } = useTheme();
  const [services, setServices] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [currentTab, setCurrentTab] = useState('services'); // services, coupons
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [newService, setNewService] = useState({
    name: '',
    description: '',
    price: '',
    duration: '',
    category: ''
  });
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    discountType: 'percentage', // percentage, fixed
    discountValue: '',
    minOrder: '',
    expiryDate: '',
    usageLimit: '',
    usedCount: 0
  });

  // Mock data initialization
  useEffect(() => {
    // Mock services
    const mockServices = [
      {
        id: 1,
        name: 'Haircut',
        description: 'Professional haircut with styling',
        price: 25.00,
        duration: 30,
        category: 'Beauty',
        active: true
      },
      {
        id: 2,
        name: 'Manicure',
        description: 'Nail care and polish',
        price: 15.00,
        duration: 45,
        category: 'Beauty',
        active: true
      },
      {
        id: 3,
        name: 'Massage',
        description: 'Relaxing full body massage',
        price: 60.00,
        duration: 60,
        category: 'Wellness',
        active: true
      },
      {
        id: 4,
        name: 'Consultation',
        description: 'Business consultation session',
        price: 100.00,
        duration: 60,
        category: 'Business',
        active: true
      }
    ];
    setServices(mockServices);

    // Mock coupons
    const mockCoupons = [
      {
        id: 1,
        code: 'WELCOME10',
        discountType: 'percentage',
        discountValue: 10,
        minOrder: 50,
        expiryDate: '2024-06-30',
        usageLimit: 100,
        usedCount: 25,
        active: true
      },
      {
        id: 2,
        code: 'SAVE20',
        discountType: 'percentage',
        discountValue: 20,
        minOrder: 100,
        expiryDate: '2024-03-31',
        usageLimit: 50,
        usedCount: 30,
        active: true
      },
      {
        id: 3,
        code: 'FREESHIP',
        discountType: 'fixed',
        discountValue: 5,
        minOrder: 30,
        expiryDate: '2024-02-28',
        usageLimit: 200,
        usedCount: 180,
        active: true
      }
    ];
    setCoupons(mockCoupons);
  }, []);

  // Add new service
  const handleAddService = () => {
    const service = {
      id: services.length + 1,
      ...newService,
      price: parseFloat(newService.price),
      duration: parseInt(newService.duration),
      active: true
    };
    setServices([...services, service]);
    setNewService({
      name: '',
      description: '',
      price: '',
      duration: '',
      category: ''
    });
    setShowAddModal(false);
  };

  // Add new coupon
  const handleAddCoupon = () => {
    const coupon = {
      id: coupons.length + 1,
      ...newCoupon,
      discountValue: parseFloat(newCoupon.discountValue),
      minOrder: parseFloat(newCoupon.minOrder),
      usageLimit: parseInt(newCoupon.usageLimit),
      usedCount: 0,
      active: true
    };
    setCoupons([...coupons, coupon]);
    setNewCoupon({
      code: '',
      discountType: 'percentage',
      discountValue: '',
      minOrder: '',
      expiryDate: '',
      usageLimit: '',
      usedCount: 0
    });
    setShowCouponModal(false);
  };

  // Toggle service active status
  const toggleServiceStatus = (id) => {
    setServices(services.map(service => 
      service.id === id ? { ...service, active: !service.active } : service
    ));
  };

  // Toggle coupon active status
  const toggleCouponStatus = (id) => {
    setCoupons(coupons.map(coupon => 
      coupon.id === id ? { ...coupon, active: !coupon.active } : coupon
    ));
  };

  // Calculate stats
  const activeServices = services.filter(s => s.active).length;
  const activeCoupons = coupons.filter(c => c.active).length;
  const totalRevenue = services.reduce((sum, service) => sum + service.price, 0);

  return (
    <div className="services-module" style={{ backgroundColor: theme.background, minHeight: '100vh', padding: '2rem 0' }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div className="card" style={{ backgroundColor: theme.backgroundCard, padding: '2rem' }}>
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ color: theme.textPrimary, marginBottom: '0.5rem', display: 'flex', alignItems: 'center' }}>
              <FaShoppingCart style={{ marginRight: '0.75rem', color: theme.goldPrimary }} />
              Services & Coupons
            </h1>
            <p style={{ color: theme.textSecondary }}>
              Manage services, pricing, and promotional coupons
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2-md grid-cols-3" style={{ gap: '1.5rem', marginBottom: '2rem' }}>
            {/* Active Services */}
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
                  <FaShoppingCart style={{ color: theme.goldPrimary }} />
                </div>
                <div>
                  <p style={{ color: theme.textTertiary, fontSize: '0.875rem', marginBottom: '0.25rem' }}>Active Services</p>
                  <h3 style={{ color: theme.textPrimary, fontSize: '1.5rem' }}>
                    {activeServices}
                  </h3>
                </div>
              </div>
            </div>

            {/* Active Coupons */}
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
                  <FaTags style={{ color: theme.success }} />
                </div>
                <div>
                  <p style={{ color: theme.textTertiary, fontSize: '0.875rem', marginBottom: '0.25rem' }}>Active Coupons</p>
                  <h3 style={{ color: theme.textPrimary, fontSize: '1.5rem' }}>
                    {activeCoupons}
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
                  backgroundColor: `${theme.info}20`, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  marginRight: '1rem'
                }}>
                  <FaMoneyBillWave style={{ color: theme.info }} />
                </div>
                <div>
                  <p style={{ color: theme.textTertiary, fontSize: '0.875rem', marginBottom: '0.25rem' }}>Potential Revenue</p>
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

          {/* Navigation Tabs */}
          <div style={{ display: 'flex', marginBottom: '2rem', borderBottom: `1px solid ${theme.border}` }}>
            <button
              className="btn"
              style={{ 
                color: currentTab === 'services' ? theme.goldPrimary : theme.textPrimary,
                borderBottom: currentTab === 'services' ? `2px solid ${theme.goldPrimary}` : 'none',
                fontWeight: '500',
                marginBottom: '-1px',
                marginRight: '1rem',
                paddingBottom: '0.5rem'
              }}
              onClick={() => setCurrentTab('services')}
            >
              <FaShoppingCart style={{ marginRight: '0.5rem' }} />
              Services
            </button>
            <button
              className="btn"
              style={{ 
                color: currentTab === 'coupons' ? theme.goldPrimary : theme.textPrimary,
                borderBottom: currentTab === 'coupons' ? `2px solid ${theme.goldPrimary}` : 'none',
                fontWeight: '500',
                marginBottom: '-1px',
                marginRight: '1rem',
                paddingBottom: '0.5rem'
              }}
              onClick={() => setCurrentTab('coupons')}
            >
              <FaTags style={{ marginRight: '0.5rem' }} />
              Coupons
            </button>
          </div>

          {/* Services Tab */}
          {currentTab === 'services' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ color: theme.textPrimary, marginBottom: 0 }}>Services</h2>
                <button
                  className="btn btn-primary"
                  style={{ backgroundColor: theme.goldPrimary, color: 'white' }}
                  onClick={() => setShowAddModal(true)}
                >
                  <FaPlus style={{ marginRight: '0.5rem' }} />
                  Add Service
                </button>
              </div>

              <div className="card" style={{ backgroundColor: theme.backgroundLight, padding: '1.5rem', marginBottom: '2rem' }}>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: `2px solid ${theme.border}` }}>
                        <th style={{ textAlign: 'left', padding: '1rem', color: theme.textTertiary, fontSize: '0.875rem' }}>Service</th>
                        <th style={{ textAlign: 'left', padding: '1rem', color: theme.textTertiary, fontSize: '0.875rem' }}>Description</th>
                        <th style={{ textAlign: 'left', padding: '1rem', color: theme.textTertiary, fontSize: '0.875rem' }}>Price</th>
                        <th style={{ textAlign: 'left', padding: '1rem', color: theme.textTertiary, fontSize: '0.875rem' }}>Duration</th>
                        <th style={{ textAlign: 'left', padding: '1rem', color: theme.textTertiary, fontSize: '0.875rem' }}>Category</th>
                        <th style={{ textAlign: 'left', padding: '1rem', color: theme.textTertiary, fontSize: '0.875rem' }}>Status</th>
                        <th style={{ textAlign: 'left', padding: '1rem', color: theme.textTertiary, fontSize: '0.875rem' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {services.map((service) => (
                        <tr 
                          key={service.id} 
                          style={{ 
                            borderBottom: `1px solid ${theme.border}`
                          }}
                        >
                          <td style={{ padding: '1rem', color: theme.textPrimary }}>
                            <div style={{ fontWeight: '500' }}>{service.name}</div>
                          </td>
                          <td style={{ padding: '1rem', color: theme.textSecondary }}>
                            {service.description}
                          </td>
                          <td style={{ padding: '1rem', color: theme.textPrimary }}>
                            {new Intl.NumberFormat('en-MY', { 
                              style: 'currency', 
                              currency: 'MYR' 
                            }).format(service.price)}
                          </td>
                          <td style={{ padding: '1rem', color: theme.textSecondary }}>
                            {service.duration} min
                          </td>
                          <td style={{ padding: '1rem', color: theme.textSecondary }}>
                            {service.category}
                          </td>
                          <td style={{ padding: '1rem' }}>
                            <div style={{ 
                              display: 'inline-flex', 
                              alignItems: 'center', 
                              padding: '0.25rem 0.75rem',
                              borderRadius: '12px',
                              backgroundColor: service.active ? `${theme.success}20` : `${theme.warning}20`,
                              color: service.active ? theme.success : theme.warning,
                              fontSize: '0.75rem'
                            }}>
                              {service.active ? <FaCheckCircle style={{ marginRight: '0.25rem' }} /> : <FaExclamationTriangle style={{ marginRight: '0.25rem' }} />}
                              {service.active ? 'Active' : 'Inactive'}
                            </div>
                          </td>
                          <td style={{ padding: '1rem' }}>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                              <button
                                className="btn btn-outline"
                                style={{ 
                                  color: service.active ? theme.warning : theme.success, 
                                  borderColor: service.active ? theme.warning : theme.success,
                                  padding: '0.25rem 0.5rem',
                                  fontSize: '0.75rem'
                                }}
                                onClick={() => toggleServiceStatus(service.id)}
                              >
                                {service.active ? 'Deactivate' : 'Activate'}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Coupons Tab */}
          {currentTab === 'coupons' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ color: theme.textPrimary, marginBottom: 0 }}>Coupons</h2>
                <button
                  className="btn btn-primary"
                  style={{ backgroundColor: theme.goldPrimary, color: 'white' }}
                  onClick={() => setShowCouponModal(true)}
                >
                  <FaPlus style={{ marginRight: '0.5rem' }} />
                  Add Coupon
                </button>
              </div>

              <div className="card" style={{ backgroundColor: theme.backgroundLight, padding: '1.5rem', marginBottom: '2rem' }}>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: `2px solid ${theme.border}` }}>
                        <th style={{ textAlign: 'left', padding: '1rem', color: theme.textTertiary, fontSize: '0.875rem' }}>Code</th>
                        <th style={{ textAlign: 'left', padding: '1rem', color: theme.textTertiary, fontSize: '0.875rem' }}>Discount</th>
                        <th style={{ textAlign: 'left', padding: '1rem', color: theme.textTertiary, fontSize: '0.875rem' }}>Min Order</th>
                        <th style={{ textAlign: 'left', padding: '1rem', color: theme.textTertiary, fontSize: '0.875rem' }}>Expiry</th>
                        <th style={{ textAlign: 'left', padding: '1rem', color: theme.textTertiary, fontSize: '0.875rem' }}>Usage</th>
                        <th style={{ textAlign: 'left', padding: '1rem', color: theme.textTertiary, fontSize: '0.875rem' }}>Status</th>
                        <th style={{ textAlign: 'left', padding: '1rem', color: theme.textTertiary, fontSize: '0.875rem' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {coupons.map((coupon) => (
                        <tr 
                          key={coupon.id} 
                          style={{ 
                            borderBottom: `1px solid ${theme.border}`
                          }}
                        >
                          <td style={{ padding: '1rem', color: theme.textPrimary }}>
                            <div style={{ fontWeight: '500' }}>{coupon.code}</div>
                          </td>
                          <td style={{ padding: '1rem', color: theme.textSecondary }}>
                            {coupon.discountType === 'percentage' 
                              ? `${coupon.discountValue}% off` 
                              : `${new Intl.NumberFormat('en-MY', { style: 'currency', currency: 'MYR' }).format(coupon.discountValue)} off`}
                          </td>
                          <td style={{ padding: '1rem', color: theme.textSecondary }}>
                            {coupon.minOrder > 0 
                              ? new Intl.NumberFormat('en-MY', { style: 'currency', currency: 'MYR' }).format(coupon.minOrder)
                              : 'No minimum'}
                          </td>
                          <td style={{ padding: '1rem', color: theme.textSecondary }}>
                            {new Date(coupon.expiryDate).toLocaleDateString('en-MY')}
                          </td>
                          <td style={{ padding: '1rem', color: theme.textSecondary }}>
                            {coupon.usedCount}/{coupon.usageLimit} used
                            <div style={{ 
                              width: '100%', 
                              height: '6px', 
                              backgroundColor: theme.backgroundMedium, 
                              borderRadius: '3px', 
                              marginTop: '0.25rem', 
                              overflow: 'hidden' 
                            }}>
                              <div 
                                style={{ 
                                  height: '100%', 
                                  width: `${(coupon.usedCount / coupon.usageLimit) * 100}%`, 
                                  backgroundColor: theme.goldPrimary,
                                  transition: theme.transition
                                }} 
                              ></div>
                            </div>
                          </td>
                          <td style={{ padding: '1rem' }}>
                            <div style={{ 
                              display: 'inline-flex', 
                              alignItems: 'center', 
                              padding: '0.25rem 0.75rem',
                              borderRadius: '12px',
                              backgroundColor: coupon.active ? `${theme.success}20` : `${theme.warning}20`,
                              color: coupon.active ? theme.success : theme.warning,
                              fontSize: '0.75rem'
                            }}>
                              {coupon.active ? <FaCheckCircle style={{ marginRight: '0.25rem' }} /> : <FaExclamationTriangle style={{ marginRight: '0.25rem' }} />}
                              {coupon.active ? 'Active' : 'Inactive'}
                            </div>
                          </td>
                          <td style={{ padding: '1rem' }}>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                              <button
                                className="btn btn-outline"
                                style={{ 
                                  color: coupon.active ? theme.warning : theme.success, 
                                  borderColor: coupon.active ? theme.warning : theme.success,
                                  padding: '0.25rem 0.5rem',
                                  fontSize: '0.75rem'
                                }}
                                onClick={() => toggleCouponStatus(coupon.id)}
                              >
                                {coupon.active ? 'Deactivate' : 'Activate'}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Service Modal */}
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
            <h2 style={{ color: theme.textPrimary, marginBottom: '1.5rem' }}>Add New Service</h2>
            
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: theme.textPrimary }}>Service Name</label>
              <input
                type="text"
                value={newService.name}
                onChange={(e) => setNewService({...newService, name: e.target.value})}
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
              <label style={{ display: 'block', marginBottom: '0.5rem', color: theme.textPrimary }}>Description</label>
              <textarea
                value={newService.description}
                onChange={(e) => setNewService({...newService, description: e.target.value})}
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
            
            <div className="grid grid-cols-2" style={{ gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: theme.textPrimary }}>Price (RM)</label>
                <input
                  type="number"
                  step="0.01"
                  value={newService.price}
                  onChange={(e) => setNewService({...newService, price: e.target.value})}
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
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: theme.textPrimary }}>Duration (min)</label>
                <input
                  type="number"
                  value={newService.duration}
                  onChange={(e) => setNewService({...newService, duration: e.target.value})}
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
            </div>
            
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: theme.textPrimary }}>Category</label>
              <input
                type="text"
                value={newService.category}
                onChange={(e) => setNewService({...newService, category: e.target.value})}
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
                onClick={handleAddService}
              >
                Add Service
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Coupon Modal */}
      {showCouponModal && (
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
            <h2 style={{ color: theme.textPrimary, marginBottom: '1.5rem' }}>Add New Coupon</h2>
            
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: theme.textPrimary }}>Coupon Code</label>
              <input
                type="text"
                value={newCoupon.code}
                onChange={(e) => setNewCoupon({...newCoupon, code: e.target.value.toUpperCase()})}
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
            
            <div className="grid grid-cols-2" style={{ gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: theme.textPrimary }}>Discount Type</label>
                <select
                  value={newCoupon.discountType}
                  onChange={(e) => setNewCoupon({...newCoupon, discountType: e.target.value})}
                  className="form-input"
                  style={{ 
                    backgroundColor: theme.backgroundLight, 
                    borderColor: theme.border, 
                    color: theme.textPrimary,
                    width: '100%',
                    padding: '0.75rem'
                  }}
                >
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed Amount</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: theme.textPrimary }}>Discount Value</label>
                <input
                  type="number"
                  step="0.01"
                  value={newCoupon.discountValue}
                  onChange={(e) => setNewCoupon({...newCoupon, discountValue: e.target.value})}
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
            </div>
            
            <div className="grid grid-cols-2" style={{ gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: theme.textPrimary }}>Minimum Order (RM)</label>
                <input
                  type="number"
                  step="0.01"
                  value={newCoupon.minOrder}
                  onChange={(e) => setNewCoupon({...newCoupon, minOrder: e.target.value})}
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
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: theme.textPrimary }}>Usage Limit</label>
                <input
                  type="number"
                  value={newCoupon.usageLimit}
                  onChange={(e) => setNewCoupon({...newCoupon, usageLimit: e.target.value})}
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
            </div>
            
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: theme.textPrimary }}>Expiry Date</label>
              <input
                type="date"
                value={newCoupon.expiryDate}
                onChange={(e) => setNewCoupon({...newCoupon, expiryDate: e.target.value})}
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
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
              <button
                className="btn btn-outline"
                style={{ color: theme.textPrimary, borderColor: theme.border }}
                onClick={() => setShowCouponModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                style={{ backgroundColor: theme.goldPrimary, color: 'white' }}
                onClick={handleAddCoupon}
              >
                Add Coupon
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesModule;