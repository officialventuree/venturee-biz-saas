import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import '../styles/App.css';

const LoginPage = () => {
  const { login } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        // Redirect based on user role
        if (result.user.role === 'admin') {
          navigate('/dashboard/admin');
        } else if (result.user.role === 'company-admin') {
          navigate('/dashboard/company');
        } else if (result.user.role === 'viewer') {
          navigate('/dashboard/viewer');
        } else {
          navigate('/dashboard');
        }
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page" style={{ minHeight: '100vh', backgroundColor: theme.background, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="container" style={{ maxWidth: '450px' }}>
        <div className="card" style={{ backgroundColor: theme.backgroundCard, padding: '2rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h1 style={{ color: theme.textPrimary, marginBottom: '0.5rem' }}>Welcome Back</h1>
            <p style={{ color: theme.textSecondary }}>Sign in to your Venturee Biz account</p>
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
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
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
                value={formData.password}
                onChange={handleChange}
                className="form-input"
                style={{ backgroundColor: theme.backgroundLight, borderColor: theme.border, color: theme.textPrimary }}
                required
              />
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <label className="checkbox-container" style={{ display: 'flex', alignItems: 'center' }}>
                <input
                  type="checkbox"
                  style={{ marginRight: '0.5rem', accentColor: theme.goldPrimary }}
                />
                <span style={{ color: theme.textSecondary }}>Remember me</span>
              </label>
              
              <Link to="#" style={{ color: theme.goldPrimary, textDecoration: 'none', fontSize: '0.875rem' }}>
                Forgot password?
              </Link>
            </div>
            
            <button
              type="submit"
              className="btn btn-primary w-full"
              style={{ backgroundColor: theme.goldPrimary, color: 'white', padding: '1rem' }}
              disabled={loading}
            >
              {loading ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span className="spinner" style={{ marginRight: '0.5rem' }}></span>
                  Signing in...
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
          
          <div style={{ textAlign: 'center', marginTop: '1.5rem', color: theme.textSecondary }}>
            <p>
              Don't have an account? <Link to="/register" style={{ color: theme.goldPrimary }}>Sign up</Link>
            </p>
          </div>
        </div>
        
        <div style={{ textAlign: 'center', marginTop: '2rem', color: theme.textTertiary, fontSize: '0.75rem' }}>
          <p>© {new Date().getFullYear()} Venturee Biz. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;