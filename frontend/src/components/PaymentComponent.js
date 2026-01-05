import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import axios from 'axios';

const PaymentComponent = ({ onPaymentSuccess }) => {
  const { user, company } = useAuth();
  const { theme } = useTheme();
  const [paymentStatus, setPaymentStatus] = useState('pending'); // pending, processing, success, failed
  const [qrData, setQrData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(0);

  // Function to generate DuitNow QR code
  const generateDuitNowQR = async () => {
    if (!company) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post('/payment/duitnow/generate', {
        plan: 'basic', // Default to basic plan for now
        modules: company.subscription.modules // Use existing modules or default
      });
      
      if (response.data.success) {
        setQrData(response.data.data);
        setPaymentStatus('pending');
        setCountdown(900); // 15 minutes in seconds
      } else {
        setError(response.data.message || 'Failed to generate QR code');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error generating QR code');
    } finally {
      setLoading(false);
    }
  };

  // Countdown timer effect
  useEffect(() => {
    let interval = null;
    if (countdown > 0 && paymentStatus === 'pending') {
      interval = setInterval(() => {
        setCountdown(countdown => countdown - 1);
      }, 1000);
    } else if (countdown === 0 && paymentStatus === 'pending') {
      setPaymentStatus('expired');
    }
    return () => clearInterval(interval);
  }, [countdown, paymentStatus]);

  // Format time for display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Check payment status
  const checkPaymentStatus = async () => {
    try {
      const response = await axios.get('/payment/status');
      if (response.data.success) {
        const status = response.data.data.subscription.status;
        if (status === 'active') {
          setPaymentStatus('success');
          if (onPaymentSuccess) onPaymentSuccess();
        }
      }
    } catch (err) {
      console.error('Error checking payment status:', err);
    }
  };

  // Initial QR generation when component mounts
  useEffect(() => {
    generateDuitNowQR();
  }, []);

  return (
    <div className="payment-component" style={{ maxWidth: '500px', margin: '0 auto' }}>
      <div className="card" style={{ 
        backgroundColor: theme.backgroundCard, 
        padding: '2rem', 
        textAlign: 'center',
        border: paymentStatus === 'success' ? `2px solid ${theme.success}` : 
                 paymentStatus === 'failed' ? `2px solid ${theme.error}` : 
                 `1px solid ${theme.border}`
      }}>
        <h2 style={{ color: theme.textPrimary, marginBottom: '1.5rem' }}>
          Complete Your Payment
        </h2>
        
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
        
        {paymentStatus === 'pending' && (
          <>
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ color: theme.textPrimary, marginBottom: '1rem' }}>Scan QR to Pay</h3>
              <p style={{ color: theme.textSecondary, marginBottom: '1rem' }}>
                Use your banking app to scan the QR code below
              </p>
              
              {qrData ? (
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  marginBottom: '1.5rem'
                }}>
                  <div 
                    style={{ 
                      backgroundColor: 'white', 
                      padding: '1rem', 
                      borderRadius: '8px',
                      marginBottom: '1rem'
                    }}
                    dangerouslySetInnerHTML={{ __html: `<img src="${qrData.qrCode}" alt="DuitNow QR Code" style="max-width: 200px; height: auto;" />` }}
                  />
                  
                  <div style={{ 
                    padding: '0.5rem 1rem', 
                    backgroundColor: theme.backgroundMedium, 
                    borderRadius: theme.borderRadius,
                    marginBottom: '1rem'
                  }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: theme.goldPrimary }}>
                      RM {qrData.amount.toFixed(2)}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: theme.textTertiary }}>
                      Amount to Pay
                    </div>
                  </div>
                  
                  <div style={{ 
                    padding: '0.5rem 1rem', 
                    backgroundColor: theme.backgroundMedium, 
                    borderRadius: theme.borderRadius
                  }}>
                    <div style={{ fontSize: '0.875rem', color: theme.textPrimary, fontWeight: '500' }}>
                      {formatTime(countdown)}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: theme.textTertiary }}>
                      Time Remaining
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ padding: '2rem' }}>
                  <div className="spinner" style={{ margin: '0 auto' }}></div>
                </div>
              )}
            </div>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <p style={{ color: theme.textSecondary, fontSize: '0.875rem' }}>
                After payment, please wait for confirmation. The system will automatically update your subscription status.
              </p>
            </div>
            
            <button
              onClick={checkPaymentStatus}
              className="btn btn-outline"
              style={{ 
                color: theme.textPrimary, 
                borderColor: theme.border,
                marginBottom: '1rem'
              }}
              disabled={loading}
            >
              {loading ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span className="spinner" style={{ marginRight: '0.5rem' }}></span>
                  Checking...
                </div>
              ) : (
                'Check Payment Status'
              )}
            </button>
            
            <button
              onClick={generateDuitNowQR}
              className="btn btn-primary"
              style={{ backgroundColor: theme.goldPrimary, color: 'white' }}
              disabled={loading}
            >
              {loading ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span className="spinner" style={{ marginRight: '0.5rem' }}></span>
                  Generating...
                </div>
              ) : (
                'Generate New QR Code'
              )}
            </button>
          </>
        )}
        
        {paymentStatus === 'processing' && (
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <div className="spinner" style={{ margin: '0 auto 1rem' }}></div>
            <h3 style={{ color: theme.textPrimary, marginBottom: '1rem' }}>Processing Payment</h3>
            <p style={{ color: theme.textSecondary }}>
              Please wait while we verify your payment...
            </p>
          </div>
        )}
        
        {paymentStatus === 'success' && (
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem', color: theme.success }}>✅</div>
            <h3 style={{ color: theme.textPrimary, marginBottom: '1rem' }}>Payment Successful!</h3>
            <p style={{ color: theme.textSecondary, marginBottom: '1.5rem' }}>
              Your subscription has been activated. You can now access all premium features.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="btn btn-primary"
              style={{ backgroundColor: theme.goldPrimary, color: 'white' }}
            >
              Continue to Dashboard
            </button>
          </div>
        )}
        
        {paymentStatus === 'failed' && (
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem', color: theme.error }}>❌</div>
            <h3 style={{ color: theme.textPrimary, marginBottom: '1rem' }}>Payment Failed</h3>
            <p style={{ color: theme.textSecondary, marginBottom: '1.5rem' }}>
              There was an issue with your payment. Please try again.
            </p>
            <button
              onClick={generateDuitNowQR}
              className="btn btn-primary"
              style={{ backgroundColor: theme.goldPrimary, color: 'white' }}
            >
              Try Again
            </button>
          </div>
        )}
        
        {paymentStatus === 'expired' && (
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem', color: theme.warning }}>⏰</div>
            <h3 style={{ color: theme.textPrimary, marginBottom: '1rem' }}>QR Code Expired</h3>
            <p style={{ color: theme.textSecondary, marginBottom: '1.5rem' }}>
              The payment window has expired. Please generate a new QR code to continue.
            </p>
            <button
              onClick={generateDuitNowQR}
              className="btn btn-primary"
              style={{ backgroundColor: theme.goldPrimary, color: 'white' }}
            >
              Generate New QR Code
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentComponent;