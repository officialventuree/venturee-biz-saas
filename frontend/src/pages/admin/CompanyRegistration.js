import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { FaBuilding, FaUser, FaCreditCard, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import axios from 'axios';

const CompanyRegistration = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [step, setStep] = useState(1); // 1: Company Info, 2: Admin Account, 3: Plan Selection, 4: Payment, 5: Confirmation
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Step 1: Company Information
  const [companyInfo, setCompanyInfo] = useState({
    name: '',
    businessType: 'retail',
    registrationNumber: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'Malaysia'
    },
    contact: {
      phone: '',
      email: ''
    }
  });

  // Step 2: Admin Account
  const [adminInfo, setAdminInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // Step 3: Plan Selection
  const [selectedPlan, setSelectedPlan] = useState('basic');
  const [selectedModules, setSelectedModules] = useState({
    pos: false,
    inventory: false,
    laundry: false,
    services: false,
    coupons: false,
    wallet: false,
    reports: false,
    viewerAccess: false
  });

  // Step 4: Payment
  const [paymentMethod, setPaymentMethod] = useState('duitnow');
  const [paymentDetails, setPaymentDetails] = useState({
    amount: 0,
    transactionId: '',
    notes: ''
  });

  const handleCompanyInfoChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setCompanyInfo(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setCompanyInfo(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleAdminInfoChange = (e) => {
    const { name, value } = e.target;
    setAdminInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleModuleToggle = (module) => {
    setSelectedModules(prev => ({
      ...prev,
      [module]: !prev[module]
    }));
  };

  const calculateTotal = () => {
    const planPricing = {
      basic: 99.99,
      standard: 199.99,
      premium: 299.99,
      enterprise: 499.99
    };

    const modulePricing = {
      pos: 29.99,
      inventory: 29.99,
      laundry: 39.99,
      services: 29.99,
      coupons: 19.99,
      wallet: 24.99,
      reports: 19.99,
      viewerAccess: 14.99
    };

    let total = planPricing[selectedPlan] || 0;

    Object.keys(selectedModules).forEach(module => {
      if (selectedModules[module]) {
        total += modulePricing[module] || 0;
      }
    });

    return total;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate admin password match
      if (adminInfo.password !== adminInfo.confirmPassword) {
        setError('Passwords do not match');
        setLoading(false);
        return;
      }

      // Simulate API call to register company
      const registrationData = {
        ...companyInfo,
        ...adminInfo,
        plan: selectedPlan,
        modules: selectedModules,
        payment: {
          method: paymentMethod,
          ...paymentDetails
        }
      };

      console.log('Company Registration Data:', registrationData);

      // Simulate success
      setTimeout(() => {
        setStep(5); // Move to confirmation
        setLoading(false);
      }, 1500);

    } catch (err) {
      setError('Registration failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="company-registration" style={{ backgroundColor: theme.background, minHeight: '100vh', padding: '2rem 0' }}>
      <div className="container" style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div className="card" style={{ backgroundColor: theme.backgroundCard, padding: '2rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h1 style={{ color: theme.textPrimary, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FaBuilding style={{ marginRight: '0.75rem', color: theme.goldPrimary }} />
              Company Registration
            </h1>
            <p style={{ color: theme.textSecondary }}>
              Onboard new companies to the Venturee Biz platform
            </p>
          </div>

          {/* Progress Steps */}
          <div className="progress-steps" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '50%', left: '5%', right: '5%', height: '2px', backgroundColor: theme.border, zIndex: 0 }}></div>
            
            {[1, 2, 3, 4].map((s) => (
              <div key={s} style={{ zIndex: 1, textAlign: 'center' }}>
                <div 
                  style={{ 
                    width: '32px', 
                    height: '32px', 
                    borderRadius: '50%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    backgroundColor: step >= s ? theme.goldPrimary : theme.backgroundMedium,
                    color: step >= s ? 'white' : theme.textTertiary,
                    fontWeight: 'bold',
                    border: `2px solid ${step >= s ? theme.goldPrimary : theme.border}`,
                    margin: '0 auto 0.5rem'
                  }}
                >
                  {s}
                </div>
                <div style={{ fontSize: '0.75rem', color: step >= s ? theme.textPrimary : theme.textTertiary }}>
                  {s === 1 && 'Company'}
                  {s === 2 && 'Admin'}
                  {s === 3 && 'Plan'}
                  {s === 4 && 'Payment'}
                </div>
              </div>
            ))}
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

          {/* Step 1: Company Information */}
          {step === 1 && (
            <form onSubmit={(e) => { e.preventDefault(); setStep(2); }} className="fade-in">
              <h2 style={{ color: theme.textPrimary, marginBottom: '1.5rem', display: 'flex', alignItems: 'center' }}>
                <FaBuilding style={{ marginRight: '0.75rem', color: theme.goldPrimary }} />
                Company Information
              </h2>

              <div className="form-group">
                <label className="form-label">Company Name</label>
                <input
                  type="text"
                  name="name"
                  value={companyInfo.name}
                  onChange={handleCompanyInfoChange}
                  className="form-input"
                  style={{ backgroundColor: theme.backgroundLight, borderColor: theme.border, color: theme.textPrimary }}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Business Type</label>
                <select
                  name="businessType"
                  value={companyInfo.businessType}
                  onChange={handleCompanyInfoChange}
                  className="form-input"
                  style={{ backgroundColor: theme.backgroundLight, borderColor: theme.border, color: theme.textPrimary }}
                >
                  <option value="retail">Retail</option>
                  <option value="mart">Mart/Store</option>
                  <option value="laundry">Laundry Service</option>
                  <option value="services">Services</option>
                  <option value="restaurant">Restaurant/Cafe</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Registration Number (Optional)</label>
                <input
                  type="text"
                  name="registrationNumber"
                  value={companyInfo.registrationNumber}
                  onChange={handleCompanyInfoChange}
                  className="form-input"
                  style={{ backgroundColor: theme.backgroundLight, borderColor: theme.border, color: theme.textPrimary }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="contact.email"
                  value={companyInfo.contact.email}
                  onChange={handleCompanyInfoChange}
                  className="form-input"
                  style={{ backgroundColor: theme.backgroundLight, borderColor: theme.border, color: theme.textPrimary }}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone</label>
                <input
                  type="tel"
                  name="contact.phone"
                  value={companyInfo.contact.phone}
                  onChange={handleCompanyInfoChange}
                  className="form-input"
                  style={{ backgroundColor: theme.backgroundLight, borderColor: theme.border, color: theme.textPrimary }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Street Address</label>
                <input
                  type="text"
                  name="address.street"
                  value={companyInfo.address.street}
                  onChange={handleCompanyInfoChange}
                  className="form-input"
                  style={{ backgroundColor: theme.backgroundLight, borderColor: theme.border, color: theme.textPrimary }}
                />
              </div>

              <div className="grid grid-cols-2" style={{ gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">City</label>
                  <input
                    type="text"
                    name="address.city"
                    value={companyInfo.address.city}
                    onChange={handleCompanyInfoChange}
                    className="form-input"
                    style={{ backgroundColor: theme.backgroundLight, borderColor: theme.border, color: theme.textPrimary }}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">State</label>
                  <input
                    type="text"
                    name="address.state"
                    value={companyInfo.address.state}
                    onChange={handleCompanyInfoChange}
                    className="form-input"
                    style={{ backgroundColor: theme.backgroundLight, borderColor: theme.border, color: theme.textPrimary }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2" style={{ gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">ZIP Code</label>
                  <input
                    type="text"
                    name="address.zipCode"
                    value={companyInfo.address.zipCode}
                    onChange={handleCompanyInfoChange}
                    className="form-input"
                    style={{ backgroundColor: theme.backgroundLight, borderColor: theme.border, color: theme.textPrimary }}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Country</label>
                  <input
                    type="text"
                    name="address.country"
                    value={companyInfo.address.country}
                    onChange={handleCompanyInfoChange}
                    className="form-input"
                    style={{ backgroundColor: theme.backgroundLight, borderColor: theme.border, color: theme.textPrimary }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ backgroundColor: theme.goldPrimary, color: 'white' }}
                >
                  Continue to Admin Account
                </button>
              </div>
            </form>
          )}

          {/* Step 2: Admin Account */}
          {step === 2 && (
            <form onSubmit={(e) => { e.preventDefault(); setStep(3); }} className="fade-in">
              <h2 style={{ color: theme.textPrimary, marginBottom: '1.5rem', display: 'flex', alignItems: 'center' }}>
                <FaUser style={{ marginRight: '0.75rem', color: theme.goldPrimary }} />
                Admin Account
              </h2>
              <p style={{ color: theme.textSecondary, marginBottom: '1.5rem' }}>Create the administrator account for this company</p>

              <div className="grid grid-cols-2" style={{ gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={adminInfo.firstName}
                    onChange={handleAdminInfoChange}
                    className="form-input"
                    style={{ backgroundColor: theme.backgroundLight, borderColor: theme.border, color: theme.textPrimary }}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={adminInfo.lastName}
                    onChange={handleAdminInfoChange}
                    className="form-input"
                    style={{ backgroundColor: theme.backgroundLight, borderColor: theme.border, color: theme.textPrimary }}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  value={adminInfo.email}
                  onChange={handleAdminInfoChange}
                  className="form-input"
                  style={{ backgroundColor: theme.backgroundLight, borderColor: theme.border, color: theme.textPrimary }}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  name="password"
                  value={adminInfo.password}
                  onChange={handleAdminInfoChange}
                  className="form-input"
                  style={{ backgroundColor: theme.backgroundLight, borderColor: theme.border, color: theme.textPrimary }}
                  required
                  minLength="6"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={adminInfo.confirmPassword}
                  onChange={handleAdminInfoChange}
                  className="form-input"
                  style={{ backgroundColor: theme.backgroundLight, borderColor: theme.border, color: theme.textPrimary }}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="btn btn-outline"
                  style={{ color: theme.textPrimary, borderColor: theme.border }}
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ backgroundColor: theme.goldPrimary, color: 'white' }}
                >
                  Continue to Plan Selection
                </button>
              </div>
            </form>
          )}

          {/* Step 3: Plan Selection */}
          {step === 3 && (
            <form onSubmit={(e) => { e.preventDefault(); setStep(4); }} className="fade-in">
              <h2 style={{ color: theme.textPrimary, marginBottom: '1.5rem', display: 'flex', alignItems: 'center' }}>
                <FaCreditCard style={{ marginRight: '0.75rem', color: theme.goldPrimary }} />
                Plan & Modules
              </h2>
              <p style={{ color: theme.textSecondary, marginBottom: '1.5rem' }}>Select a plan and modules for the company</p>

              {/* Plan Selection */}
              <div className="form-group">
                <label className="form-label">Subscription Plan</label>
                <div className="grid grid-cols-2" style={{ gap: '1rem' }}>
                  {['basic', 'standard', 'premium', 'enterprise'].map((plan) => (
                    <div
                      key={plan}
                      onClick={() => setSelectedPlan(plan)}
                      style={{
                        border: `2px solid ${selectedPlan === plan ? theme.goldPrimary : theme.border}`,
                        borderRadius: theme.borderRadius,
                        padding: '1.5rem',
                        cursor: 'pointer',
                        backgroundColor: selectedPlan === plan ? `${theme.goldPrimary}10` : theme.backgroundLight,
                        transition: theme.transition
                      }}
                    >
                      <h3 style={{ color: theme.textPrimary, marginBottom: '0.5rem' }}>
                        {plan.charAt(0).toUpperCase() + plan.slice(1)}
                      </h3>
                      <p style={{ color: theme.textSecondary, marginBottom: '0.5rem' }}>
                        RM {plan === 'basic' ? '99.99' : plan === 'standard' ? '199.99' : plan === 'premium' ? '299.99' : '499.99'}/mo
                      </p>
                      <p style={{ color: theme.textTertiary, fontSize: '0.875rem' }}>
                        {plan === 'basic' && 'Essential features for small businesses'}
                        {plan === 'standard' && 'Advanced features for growing businesses'}
                        {plan === 'premium' && 'Full features for established businesses'}
                        {plan === 'enterprise' && 'Custom solutions for large businesses'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Module Selection */}
              <div className="form-group">
                <label className="form-label">Additional Modules</label>
                <div className="grid grid-cols-2" style={{ gap: '1rem' }}>
                  {Object.keys(selectedModules).map((module) => (
                    <div
                      key={module}
                      onClick={() => handleModuleToggle(module)}
                      style={{
                        border: `2px solid ${selectedModules[module] ? theme.goldPrimary : theme.border}`,
                        borderRadius: theme.borderRadius,
                        padding: '1rem',
                        cursor: 'pointer',
                        backgroundColor: selectedModules[module] ? `${theme.goldPrimary}10` : theme.backgroundLight,
                        transition: theme.transition,
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={selectedModules[module]}
                        onChange={() => {}} // Controlled by click on the whole div
                        style={{ marginRight: '0.5rem' }}
                      />
                      <div>
                        <h4 style={{ color: theme.textPrimary, marginBottom: '0.25rem' }}>
                          {module.charAt(0).toUpperCase() + module.slice(1)}
                        </h4>
                        <p style={{ color: theme.textTertiary, fontSize: '0.875rem' }}>
                          +RM {module === 'pos' ? '29.99' : module === 'inventory' ? '29.99' : module === 'laundry' ? '39.99' : module === 'services' ? '29.99' : module === 'coupons' ? '19.99' : module === 'wallet' ? '24.99' : module === 'reports' ? '19.99' : '14.99'}/mo
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div className="card" style={{ backgroundColor: theme.backgroundLight, padding: '1.5rem', marginTop: '1.5rem' }}>
                <h3 style={{ color: theme.textPrimary, marginBottom: '1rem' }}>Summary</h3>
                <div style={{ marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: theme.textSecondary }}>Plan ({selectedPlan}):</span>
                  <span style={{ color: theme.textPrimary }}>
                    RM {selectedPlan === 'basic' ? '99.99' : selectedPlan === 'standard' ? '199.99' : selectedPlan === 'premium' ? '299.99' : '499.99'}
                  </span>
                </div>

                {Object.keys(selectedModules).map(module => 
                  selectedModules[module] && (
                    <div key={module} style={{ marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: theme.textSecondary }}>+ {module.charAt(0).toUpperCase() + module.slice(1)}:</span>
                      <span style={{ color: theme.textPrimary }}>
                        +RM {module === 'pos' ? '29.99' : module === 'inventory' ? '29.99' : module === 'laundry' ? '39.99' : module === 'services' ? '29.99' : module === 'coupons' ? '19.99' : module === 'wallet' ? '24.99' : module === 'reports' ? '19.99' : '14.99'}
                      </span>
                    </div>
                  )
                )}

                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: `1px solid ${theme.border}`, display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                  <span style={{ color: theme.textPrimary }}>Total:</span>
                  <span style={{ color: theme.goldPrimary }}>RM {calculateTotal().toFixed(2)}/mo</span>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="btn btn-outline"
                  style={{ color: theme.textPrimary, borderColor: theme.border }}
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ backgroundColor: theme.goldPrimary, color: 'white' }}
                >
                  Continue to Payment
                </button>
              </div>
            </form>
          )}

          {/* Step 4: Payment */}
          {step === 4 && (
            <form onSubmit={handleRegister} className="fade-in">
              <h2 style={{ color: theme.textPrimary, marginBottom: '1.5rem', display: 'flex', alignItems: 'center' }}>
                <FaCreditCard style={{ marginRight: '0.75rem', color: theme.goldPrimary }} />
                Payment Information
              </h2>
              <p style={{ color: theme.textSecondary, marginBottom: '1.5rem' }}>Complete the payment for company registration</p>

              <div className="form-group">
                <label className="form-label">Payment Method</label>
                <div className="grid grid-cols-2" style={{ gap: '1rem' }}>
                  <div
                    onClick={() => setPaymentMethod('duitnow')}
                    style={{
                      border: `2px solid ${paymentMethod === 'duitnow' ? theme.goldPrimary : theme.border}`,
                      borderRadius: theme.borderRadius,
                      padding: '1rem',
                      cursor: 'pointer',
                      backgroundColor: paymentMethod === 'duitnow' ? `${theme.goldPrimary}10` : theme.backgroundLight,
                      transition: theme.transition
                    }}
                  >
                    <h4 style={{ color: theme.textPrimary, marginBottom: '0.25rem' }}>DuitNow</h4>
                    <p style={{ color: theme.textTertiary, fontSize: '0.875rem' }}>Malaysia's popular payment system</p>
                  </div>
                  
                  <div
                    onClick={() => setPaymentMethod('manual')}
                    style={{
                      border: `2px solid ${paymentMethod === 'manual' ? theme.goldPrimary : theme.border}`,
                      borderRadius: theme.borderRadius,
                      padding: '1rem',
                      cursor: 'pointer',
                      backgroundColor: paymentMethod === 'manual' ? `${theme.goldPrimary}10` : theme.backgroundLight,
                      transition: theme.transition
                    }}
                  >
                    <h4 style={{ color: theme.textPrimary, marginBottom: '0.25rem' }}>Manual Payment</h4>
                    <p style={{ color: theme.textTertiary, fontSize: '0.875rem' }}>For special arrangements</p>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Amount to Pay</label>
                <div style={{ 
                  padding: '1rem', 
                  backgroundColor: theme.backgroundLight, 
                  borderRadius: theme.borderRadius,
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: theme.goldPrimary,
                  textAlign: 'center'
                }}>
                  RM {calculateTotal().toFixed(2)}
                </div>
              </div>

              {paymentMethod === 'manual' && (
                <>
                  <div className="form-group">
                    <label className="form-label">Transaction ID (Optional)</label>
                    <input
                      type="text"
                      value={paymentDetails.transactionId}
                      onChange={(e) => setPaymentDetails({...paymentDetails, transactionId: e.target.value})}
                      className="form-input"
                      style={{ backgroundColor: theme.backgroundLight, borderColor: theme.border, color: theme.textPrimary }}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Notes (Optional)</label>
                    <textarea
                      value={paymentDetails.notes}
                      onChange={(e) => setPaymentDetails({...paymentDetails, notes: e.target.value})}
                      className="form-input"
                      rows="3"
                      style={{ backgroundColor: theme.backgroundLight, borderColor: theme.border, color: theme.textPrimary }}
                    />
                  </div>
                </>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="btn btn-outline"
                  style={{ color: theme.textPrimary, borderColor: theme.border }}
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ backgroundColor: theme.goldPrimary, color: 'white' }}
                  disabled={loading}
                >
                  {loading ? (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span className="spinner" style={{ marginRight: '0.5rem' }}></span>
                      Processing...
                    </div>
                  ) : (
                    'Complete Registration'
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Step 5: Confirmation */}
          {step === 5 && (
            <div className="fade-in" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem', color: theme.success }}>✓</div>
              <h2 style={{ color: theme.textPrimary, marginBottom: '1rem' }}>Registration Complete!</h2>
              <p style={{ color: theme.textSecondary, marginBottom: '2rem' }}>
                The company has been successfully registered on the platform. The admin account has been created and will receive login credentials via email.
              </p>
              
              <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', backgroundColor: theme.backgroundLight, borderRadius: theme.borderRadius, marginBottom: '0.5rem' }}>
                  <span style={{ color: theme.textSecondary }}>Company:</span>
                  <span style={{ color: theme.textPrimary, fontWeight: '500' }}>{companyInfo.name}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', backgroundColor: theme.backgroundLight, borderRadius: theme.borderRadius, marginBottom: '0.5rem' }}>
                  <span style={{ color: theme.textSecondary }}>Plan:</span>
                  <span style={{ color: theme.textPrimary, fontWeight: '500' }}>{selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', backgroundColor: theme.backgroundLight, borderRadius: theme.borderRadius }}>
                  <span style={{ color: theme.textSecondary }}>Total Amount:</span>
                  <span style={{ color: theme.goldPrimary, fontWeight: '500' }}>RM {calculateTotal().toFixed(2)}/mo</span>
                </div>
              </div>
              
              <button
                onClick={() => {
                  setStep(1);
                  setCompanyInfo({
                    name: '',
                    businessType: 'retail',
                    registrationNumber: '',
                    address: {
                      street: '',
                      city: '',
                      state: '',
                      zipCode: '',
                      country: 'Malaysia'
                    },
                    contact: {
                      phone: '',
                      email: ''
                    }
                  });
                  setAdminInfo({
                    firstName: '',
                    lastName: '',
                    email: '',
                    password: '',
                    confirmPassword: ''
                  });
                  setSelectedPlan('basic');
                  setSelectedModules({
                    pos: false,
                    inventory: false,
                    laundry: false,
                    services: false,
                    coupons: false,
                    wallet: false,
                    reports: false,
                    viewerAccess: false
                  });
                }}
                className="btn btn-primary"
                style={{ backgroundColor: theme.goldPrimary, color: 'white', marginRight: '1rem' }}
              >
                Register Another Company
              </button>
              <button
                onClick={() => window.location.hash = '#/dashboard/admin'}
                className="btn btn-outline"
                style={{ color: theme.textPrimary, borderColor: theme.border }}
              >
                Back to Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyRegistration;