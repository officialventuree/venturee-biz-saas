const express = require('express');
const { v4: uuidv4 } = require('uuid');
const Company = require('../models/Company');
const User = require('../models/User');
const { auth, checkRole } = require('../middleware/auth');

const router = express.Router();

// @route   GET api/companies
// @desc    Get all companies (admin only)
// @access  Private
router.get('/', auth, checkRole(['admin']), async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const companies = await Company.findAll();
    const total = companies.length;

    res.json({
      success: true,
      data: {
        companies,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get companies error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error getting companies' 
    });
  }
});

// @route   GET api/companies/:id
// @desc    Get a specific company (admin only)
// @access  Private
router.get('/:id', auth, checkRole(['admin']), async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company || company.isDeleted) {
      return res.status(404).json({ 
        success: false, 
        message: 'Company not found' 
      });
    }

    res.json({
      success: true,
      data: { company }
    });
  } catch (error) {
    console.error('Get company error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error getting company' 
    });
  }
});

// @route   PUT api/companies/:id/activate
// @desc    Activate a company (admin only)
// @access  Private
router.put('/:id/activate', auth, checkRole(['admin']), async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company || company.isDeleted) {
      return res.status(404).json({ 
        success: false, 
        message: 'Company not found' 
      });
    }

    // Update company status
    const updatedCompany = await Company.update(company.id, {
      subscription: {
        ...company.subscription,
        status: 'active',
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
      },
      is_active: true
    });

    res.json({
      success: true,
      message: 'Company activated successfully',
      data: { company }
    });
  } catch (error) {
    console.error('Activate company error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error activating company' 
    });
  }
});

// @route   PUT api/companies/:id/deactivate
// @desc    Deactivate a company (admin only)
// @access  Private
router.put('/:id/deactivate', auth, checkRole(['admin']), async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company || company.isDeleted) {
      return res.status(404).json({ 
        success: false, 
        message: 'Company not found' 
      });
    }

    // Update company status
    const updatedCompany = await Company.update(company.id, {
      subscription: {
        ...company.subscription,
        status: 'suspended'
      },
      is_active: false
    });

    res.json({
      success: true,
      message: 'Company deactivated successfully',
      data: { company }
    });
  } catch (error) {
    console.error('Deactivate company error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error deactivating company' 
    });
  }
});

// @route   PUT api/companies/:id/subscription
// @desc    Update company subscription (admin only)
// @access  Private
router.put('/:id/subscription', auth, checkRole(['admin']), async (req, res) => {
  try {
    const { plan, modules } = req.body;
    const company = await Company.findById(req.params.id);

    if (!company || company.isDeleted) {
      return res.status(404).json({ 
        success: false, 
        message: 'Company not found' 
      });
    }

    // Update subscription details
    const subscriptionUpdate = { ...company.subscription };
    if (plan) {
      subscriptionUpdate.plan = plan;
    }
    
    if (modules) {
      subscriptionUpdate.modules = {
        ...subscriptionUpdate.modules,
        ...modules
      };
    }
    
    const updatedCompany = await Company.update(company.id, {
      subscription: subscriptionUpdate
    });

    res.json({
      success: true,
      message: 'Company subscription updated successfully',
      data: { company }
    });
  } catch (error) {
    console.error('Update subscription error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error updating subscription' 
    });
  }
});

// @route   GET api/companies/my
// @desc    Get current user's company
// @access  Private
router.get('/my', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user || !user.company_id) {
      return res.status(404).json({ 
        success: false, 
        message: 'Company not found for user' 
      });
    }

    const company = await Company.findById(user.company_id);

    res.json({
      success: true,
      data: { 
        company: {
          id: company.id,
          name: company.name,
          businessType: company.business_type,
          address: company.address,
          contact: company.contact,
          subscription: company.subscription,
          isActive: company.is_active,
          tenantId: company.tenant_id
        }
      }
    });
  } catch (error) {
    console.error('Get my company error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error getting company' 
    });
  }
});

module.exports = router;
