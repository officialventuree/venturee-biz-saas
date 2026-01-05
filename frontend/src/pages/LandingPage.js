import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import '../styles/App.css';

const LandingPage = () => {
  const { theme, isDark, toggleTheme } = useTheme();

  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className="landing-nav" style={{ backgroundColor: theme.backgroundLight, padding: '1rem 0' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="logo" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: theme.goldPrimary }}>
            Venturee<span style={{ color: theme.textPrimary }}>Biz</span>
          </div>
          
          <div className="nav-links">
            <Link to="/login" className="btn btn-outline" style={{ marginRight: '1rem', color: theme.textPrimary, borderColor: theme.border }}>
              Sign In
            </Link>
            <Link to="/register" className="btn btn-primary">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero" style={{ 
        background: `linear-gradient(135deg, ${theme.background} 0%, ${theme.backgroundLight} 100%)`,
        padding: '4rem 0',
        textAlign: 'center'
      }}>
        <div className="container">
          <h1 className="slide-in-left" style={{ fontSize: '3rem', marginBottom: '1rem', color: theme.textPrimary }}>
            All-in-One Business Management
          </h1>
          <p className="slide-in-left" style={{ fontSize: '1.25rem', marginBottom: '2rem', color: theme.textSecondary, maxWidth: '600px', margin: '0 auto 2rem' }}>
            Streamline your operations with our comprehensive SaaS platform designed for cooperatives, schools, and SMEs.
          </p>
          <div className="hero-buttons slide-in-left">
            <Link to="/register" className="btn btn-primary" style={{ marginRight: '1rem', padding: '1rem 2rem' }}>
              Start Free Trial
            </Link>
            <Link to="#features" className="btn btn-outline" style={{ padding: '1rem 2rem', color: theme.textPrimary, borderColor: theme.border }}>
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features" style={{ padding: '4rem 0', backgroundColor: theme.background }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', marginBottom: '3rem', color: theme.textPrimary }}>Powerful Features</h2>
          
          <div className="grid grid-cols-1-md grid-cols-3" style={{ gap: '2rem' }}>
            {/* Feature 1 */}
            <div className="card fade-in" style={{ padding: '2rem', textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem', color: theme.goldPrimary }}>💰</div>
              <h3 style={{ marginBottom: '1rem', color: theme.textPrimary }}>POS & Payments</h3>
              <p style={{ color: theme.textSecondary }}>
                Accept payments seamlessly with our integrated POS system. Support for multiple payment methods and real-time transaction tracking.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="card fade-in" style={{ padding: '2rem', textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem', color: theme.goldPrimary }}>📦</div>
              <h3 style={{ marginBottom: '1rem', color: theme.textPrimary }}>Inventory Management</h3>
              <p style={{ color: theme.textSecondary }}>
                Track stock levels, manage suppliers, and get low-stock alerts. Automated reordering and detailed reports.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="card fade-in" style={{ padding: '2rem', textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem', color: theme.goldPrimary }}>📊</div>
              <h3 style={{ marginBottom: '1rem', color: theme.textPrimary }}>Real-time Analytics</h3>
              <p style={{ color: theme.textSecondary }}>
                Get actionable insights with our comprehensive reporting dashboard. Track sales, profits, and business trends.
              </p>
            </div>
            
            {/* Feature 4 */}
            <div className="card fade-in" style={{ padding: '2rem', textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem', color: theme.goldPrimary }}>👥</div>
              <h3 style={{ marginBottom: '1rem', color: theme.textPrimary }}>Multi-user Access</h3>
              <p style={{ color: theme.textSecondary }}>
                Control access with role-based permissions. Admin, staff, and viewer roles with customizable permissions.
              </p>
            </div>
            
            {/* Feature 5 */}
            <div className="card fade-in" style={{ padding: '2rem', textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem', color: theme.goldPrimary }}>💳</div>
              <h3 style={{ marginBottom: '1rem', color: theme.textPrimary }}>DuitNow Integration</h3>
              <p style={{ color: theme.textSecondary }}>
                Accept payments via Malaysia's popular DuitNow system. Secure, fast, and convenient for your customers.
              </p>
            </div>
            
            {/* Feature 6 */}
            <div className="card fade-in" style={{ padding: '2rem', textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem', color: theme.goldPrimary }}>🔒</div>
              <h3 style={{ marginBottom: '1rem', color: theme.textPrimary }}>Secure & Compliant</h3>
              <p style={{ color: theme.textSecondary }}>
                Enterprise-grade security with data encryption, audit trails, and compliance with industry standards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta" style={{ 
        background: `linear-gradient(135deg, ${theme.backgroundLight} 0%, ${theme.backgroundMedium} 100%)`,
        padding: '4rem 0',
        textAlign: 'center'
      }}>
        <div className="container">
          <h2 style={{ marginBottom: '1rem', color: theme.textPrimary }}>Ready to Transform Your Business?</h2>
          <p style={{ marginBottom: '2rem', color: theme.textSecondary, maxWidth: '600px', margin: '0 auto 2rem' }}>
            Join thousands of businesses already using Venturee Biz to streamline their operations and grow their profits.
          </p>
          <Link to="/register" className="btn btn-primary" style={{ padding: '1rem 2rem' }}>
            Get Started Today
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: theme.backgroundLight, padding: '2rem 0', marginTop: '4rem' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <p style={{ color: theme.textSecondary }}>
            © {new Date().getFullYear()} Venturee Biz. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;