import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Set up axios defaults
  useEffect(() => {
    axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
    
    if (token) {
      axios.defaults.headers.common['x-auth-token'] = token;
    } else {
      delete axios.defaults.headers.common['x-auth-token'];
    }
  }, [token]);

  // Check if user is authenticated on initial load
  useEffect(() => {
    // Skip authentication check during server-side rendering/build
    if (typeof window === 'undefined') {
      setLoading(false);
      return;
    }
    
    const checkAuth = async () => {
      if (token) {
        try {
          const res = await axios.get('/auth/me');
          if (res.data.success) {
            setUser(res.data.data.user);
            setCompany(res.data.data.company);
          } else {
            // Token is invalid, clear it
            localStorage.removeItem('token');
            setToken(null);
            setUser(null);
            setCompany(null);
          }
        } catch (error) {
          console.error('Auth check error:', error);
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
          setCompany(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await axios.post('/auth/login', { email, password });
      
      if (res.data.success) {
        const { token, user, company } = res.data.data;
        
        localStorage.setItem('token', token);
        setToken(token);
        setUser(user);
        setCompany(company);
        
        axios.defaults.headers.common['x-auth-token'] = token;
        
        return { success: true, user, company };
      } else {
        return { success: false, message: res.data.message };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const registerCompany = async (companyData) => {
    try {
      const res = await axios.post('/auth/register-company', companyData);
      
      if (res.data.success) {
        const { token, user, company } = res.data.data;
        
        localStorage.setItem('token', token);
        setToken(token);
        setUser(user);
        setCompany(company);
        
        axios.defaults.headers.common['x-auth-token'] = token;
        
        return { success: true, user, company };
      } else {
        return { success: false, message: res.data.message };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setCompany(null);
    delete axios.defaults.headers.common['x-auth-token'];
  };

  const value = {
    user,
    company,
    token,
    login,
    registerCompany,
    logout,
    loading,
    isAuthenticated: !!token
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};