const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('joi');
const User = require('../models/User');
const Company = require('../models/Company');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   POST api/auth/register-company
// @desc    Register a new company and admin user
// @access  Public
router.post('/register-company', async (req, res) => {
  try {
    const { 
      companyName, 
      businessType, 
      firstName, 
      lastName, 
      email, 
      password, 
      phone,
      address 
    } = req.body;

    // Validation
    if (!companyName || !email || !password || !firstName || !lastName) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide all required fields' 
      });
    }

    // Check if company already exists
    let company = await Company.findByName(companyName);
    if (company) {
      return res.status(400).json({ 
        success: false, 
        message: 'Company already exists' 
      });
    }

    // Check if user already exists
    let user = await User.findByEmail(email);
    if (user) {
      return res.status(400).json({ 
        success: false, 
        message: 'User already exists with this email' 
      });
    }

    // Create new company (pending activation)
    const newCompany = await Company.create({
      name: companyName,
      businessType,
      registrationNumber,
      contact: {
        email,
        phone
      },
      address,
      subscription: {
        plan: 'basic', // Default to basic plan
        status: 'pending', // Pending until payment
        modules: {
          pos: false,
          inventory: false,
          laundry: false,
          services: false,
          coupons: false,
          wallet: false,
          reports: true,
          viewerAccess: true
        }
      },
      tenantId: `tenant_${Date.now()}_${Math.random().toString(36).substr(2, 9)}` // Unique tenant ID
    });

    // Create admin user for the company
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: 'company-admin',
      companyId: newCompany.id,
      permissions: {
        // Grant all permissions to company admin
        pos_access: true,
        pos_create_transaction: true,
        pos_edit_transaction: true,
        pos_delete_transaction: true,
        inventory_access: true,
        inventory_create: true,
        inventory_edit: true,
        inventory_delete: true,
        reports_access: true,
        reports_generate: true,
        users_manage: true
      }
    });

    // Generate JWT token
    const payload = {
      user: {
        id: user.id,
        role: user.role,
        companyId: user.companyId
      }
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'Company registered successfully. Please complete payment to activate.',
      data: {
        token,
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          companyId: user.companyId
        },
        company: {
          id: newCompany.id,
          name: newCompany.name,
          status: newCompany.subscription.status
        }
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during registration' 
    });
  }
});

// @route   POST api/auth/login
// @desc    Authenticate user and get token
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide email and password' 
      });
    }

    // Find user by email
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(400).json({ 
        success: false, 
        message: 'Account is deactivated' 
      });
    }

    // Check if user's company is active
    const company = await Company.findById(user.company_id);
    if (!company || !company.is_active) {
      return res.status(400).json({ 
        success: false, 
        message: 'Company account is not active' 
      });
    }

    // Check if user's company subscription is active
    if (company.subscription.status !== 'active') {
      return res.status(400).json({ 
        success: false, 
        message: 'Company subscription is not active' 
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    // Update last login
    await User.updateLastLogin(user.id);

    // Generate JWT token
    const payload = {
      user: {
        id: user.id,
        role: user.role,
        companyId: user.company_id
      }
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          firstName: user.first_name,
          lastName: user.last_name,
          email: user.email,
          role: user.role,
          companyId: user.company_id,
          permissions: user.permissions
        },
        company: {
          id: company.id,
          name: company.name,
          status: company.subscription.status
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during login' 
    });
  }
});

// @route   GET api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    // User is already attached to req by auth middleware
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    const company = await Company.findById(user.company_id);
    if (!company) {
      return res.status(404).json({ 
        success: false, 
        message: 'Company not found' 
      });
    }

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          firstName: user.first_name,
          lastName: user.last_name,
          email: user.email,
          role: user.role,
          companyId: user.company_id,
          permissions: user.permissions
        },
        company: {
          id: company.id,
          name: company.name,
          status: company.subscription.status,
          modules: company.subscription.modules,
          isActive: company.is_active
        }
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error getting user data' 
    });
  }
});

module.exports = router;