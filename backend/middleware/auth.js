const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Company = require('../models/Company');

const auth = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('x-auth-token');
    
    if (!token) {
      return res.status(401).json({ success: false, message: 'No token, authorization denied' });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret');
    
    // Find user by ID from token
    const user = await User.findById(decoded.user.id);
    
    if (!user) {
      return res.status(401).json({ success: false, message: 'Token is not valid' });
    }
    
    // Check if user's company is active
    const company = await Company.findById(user.company_id);
    if (!company || !company.is_active) {
      return res.status(401).json({ success: false, message: 'Company account is not active' });
    }
    
    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Token is not valid' });
  }
};

// Middleware to check user role
const checkRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Access denied: insufficient permissions' });
    }
    
    next();
  };
};

// Middleware to check if user belongs to the specified company
const checkCompanyAccess = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }
    
    // For admin users, allow access to any company
    if (req.user.role === 'admin') {
      return next();
    }
    
    // For other roles, verify the company ID matches the user's company
    const requestedCompanyId = req.params.companyId || req.body.companyId || req.query.companyId;
    
    if (requestedCompanyId && req.user.company_id.toString() !== requestedCompanyId.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied: not authorized for this company' });
    }
    
    next();
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error in company access check' });
  }
};

module.exports = { auth, checkRole, checkCompanyAccess };