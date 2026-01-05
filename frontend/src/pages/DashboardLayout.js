import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { FaHome, FaChartBar, FaShoppingCart, FaBox, FaUsers, FaCog, FaSignOutAlt, FaMoneyBillWave, FaTags, FaWallet } from 'react-icons/fa';

const DashboardLayout = () => {
  const { user, company, logout } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Define navigation items based on user role and company modules
  const getNavigationItems = () => {
    const items = [
      { name: 'Dashboard', path: '/dashboard', icon: <FaHome /> },
      { name: 'Reports', path: '/dashboard/reports', icon: <FaChartBar /> }
    ];
    
    // Add items based on company modules and user permissions
    if (company?.modules?.pos && user?.permissions?.pos_access) {
      items.splice(1, 0, { name: 'POS', path: '/dashboard/pos', icon: <FaShoppingCart /> });
    }
    
    if (company?.modules?.inventory && user?.permissions?.inventory_access) {
      items.splice(2, 0, { name: 'Inventory', path: '/dashboard/inventory', icon: <FaBox /> });
    }
    
    if (company?.modules?.services) {
      items.splice(3, 0, { name: 'Services', path: '/dashboard/services', icon: <FaMoneyBillWave /> });
    }
    
    if (company?.modules?.coupons) {
      items.splice(4, 0, { name: 'Coupons', path: '/dashboard/coupons', icon: <FaTags /> });
    }
    
    if (company?.modules?.wallet) {
      items.splice(5, 0, { name: 'Wallet', path: '/dashboard/wallet', icon: <FaWallet /> });
    }
    
    // Add user management for company admins
    if (user?.role === 'company-admin' || user?.role === 'admin') {
      items.push({ name: 'Users', path: '/dashboard/users', icon: <FaUsers /> });
    }
    
    // Add settings for company admins
    if (user?.role === 'company-admin' || user?.role === 'admin') {
      items.push({ name: 'Settings', path: '/dashboard/settings', icon: <FaCog /> });
    }
    
    return items;
  };
  
  const navigationItems = getNavigationItems();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  // Only show layout if user is authenticated and has company
  if (!user || !company) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: theme.background,
        color: theme.textPrimary
      }}>
        <div className="spinner"></div>
      </div>
    );
  }
  
  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside 
        className="sidebar" 
        style={{ 
          backgroundColor: theme.backgroundLight,
          borderRight: `1px solid ${theme.border}`,
          width: sidebarOpen ? '250px' : '70px',
          transition: theme.transition
        }}
      >
        <div style={{ padding: '1rem' }}>
          <div 
            style={{ 
              fontSize: '1.5rem', 
              fontWeight: 'bold', 
              color: theme.goldPrimary, 
              marginBottom: '2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: sidebarOpen ? 'flex-start' : 'center'
            }}
          >
            <span>Venturee<span style={{ color: theme.textPrimary }}>Biz</span></span>
          </div>
          
          <nav>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {navigationItems.map((item, index) => (
                <li key={index}>
                  <a
                    href={item.path}
                    className="nav-link"
                    style={{
                      color: window.location.pathname === item.path ? theme.goldPrimary : theme.textSecondary,
                      backgroundColor: window.location.pathname === item.path ? `${theme.goldPrimary}10` : 'transparent',
                      borderLeft: window.location.pathname === item.path ? `3px solid ${theme.goldPrimary}` : 'none',
                      ...(sidebarOpen ? {} : { justifyContent: 'center' })
                    }}
                  >
                    <span className="nav-icon" style={{ color: window.location.pathname === item.path ? theme.goldPrimary : theme.textSecondary }}>
                      {item.icon}
                    </span>
                    {sidebarOpen && (
                      <span className="nav-text" style={{ marginLeft: '0.75rem', color: theme.textPrimary }}>
                        {item.name}
                      </span>
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        
        {/* User profile and logout */}
        <div style={{ 
          position: 'absolute', 
          bottom: '0', 
          left: '0', 
          right: '0', 
          padding: '1rem',
          borderTop: `1px solid ${theme.border}`
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: theme.backgroundMedium,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: theme.goldPrimary,
              fontWeight: 'bold',
              marginRight: sidebarOpen ? '0.75rem' : 'auto',
              justifyContent: 'center'
            }}>
              {user.firstName.charAt(0)}{user.lastName.charAt(0)}
            </div>
            {sidebarOpen && (
              <div style={{ flex: 1 }}>
                <div style={{ color: theme.textPrimary, fontSize: '0.875rem', fontWeight: '500' }}>
                  {user.firstName} {user.lastName}
                </div>
                <div style={{ color: theme.textTertiary, fontSize: '0.75rem' }}>
                  {user.role.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </div>
              </div>
            )}
          </div>
          
          <button
            onClick={handleLogout}
            className="btn btn-outline w-full"
            style={{
              color: theme.error,
              borderColor: theme.error,
              display: 'flex',
              alignItems: 'center',
              justifyContent: sidebarOpen ? 'flex-start' : 'center'
            }}
          >
            <FaSignOutAlt style={{ marginRight: sidebarOpen ? '0.75rem' : 0 }} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>
      
      {/* Main Content */}
      <main 
        className="main-content" 
        style={{ 
          backgroundColor: theme.background,
          marginLeft: sidebarOpen ? '250px' : '70px',
          transition: theme.transition,
          minHeight: '100vh'
        }}
      >
        <div style={{ padding: '0 1.5rem 1.5rem' }}>
          {/* Dashboard Header */}
          <header style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            padding: '1.5rem 0',
            borderBottom: `1px solid ${theme.border}`,
            marginBottom: '2rem'
          }}>
            <div>
              <h1 style={{ color: theme.textPrimary, fontSize: '1.5rem', margin: 0 }}>
                {company.name} Dashboard
              </h1>
              <p style={{ color: theme.textSecondary, fontSize: '0.875rem', margin: '0.25rem 0 0' }}>
                Welcome back, {user.firstName}! Manage your business operations.
              </p>
            </div>
            
            <button 
              onClick={toggleSidebar}
              className="btn btn-outline"
              style={{ 
                color: theme.textPrimary, 
                borderColor: theme.border,
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <span style={{ marginRight: '0.5rem' }}>
                {sidebarOpen ? '«' : '»'}
              </span>
              {sidebarOpen ? 'Collapse' : 'Expand'}
            </button>
          </header>
          
          {/* Dashboard Content */}
          <div className="dashboard-content">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;