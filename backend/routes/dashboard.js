const express = require('express');
const User = require('../models/User');
const Company = require('../models/Company');
const { auth, checkCompanyAccess } = require('../middleware/auth');

const router = express.Router();

// @route   GET api/dashboard/stats
// @desc    Get dashboard statistics for a company
// @access  Private
router.get('/stats', auth, checkCompanyAccess, async (req, res) => {
  try {
    // For demo purposes, we'll return mock data
    // In a real implementation, this would aggregate data from various collections
    const companyId = req.user.role === 'admin' && req.query.companyId 
      ? req.query.companyId 
      : req.user.company_id;

    // Get company info
    const company = await Company.findById(companyId);
    if (!company || !company.is_active) {
      return res.status(404).json({ 
        success: false, 
        message: 'Company not found or inactive' 
      });
    }

    // Mock statistics data (in real implementation, this would come from actual data)
    const stats = {
      totalSales: 15420.50,
      totalTransactions: 324,
      totalInventoryItems: 128,
      lowStockItems: 12,
      activeUsers: 8,
      monthlyGrowth: 15.3
    };

    res.json({
      success: true,
      data: { stats }
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error getting dashboard stats' 
    });
  }
});

// @route   GET api/dashboard/recent-activity
// @desc    Get recent activity for the company
// @access  Private
router.get('/recent-activity', auth, checkCompanyAccess, async (req, res) => {
  try {
    const companyId = req.user.role === 'admin' && req.query.companyId 
      ? req.query.companyId 
      : req.user.companyId;

    // Mock recent activity data (in real implementation, this would come from audit logs)
    const recentActivity = [
      {
        id: 'act_1',
        type: 'transaction',
        description: 'New POS transaction completed',
        amount: 125.50,
        timestamp: new Date(Date.now() - 3600000), // 1 hour ago
        user: 'John Doe'
      },
      {
        id: 'act_2',
        type: 'inventory',
        description: 'Inventory updated for Product A',
        quantity: 50,
        timestamp: new Date(Date.now() - 7200000), // 2 hours ago
        user: 'Jane Smith'
      },
      {
        id: 'act_3',
        type: 'user',
        description: 'New user registered',
        username: 'Bob Johnson',
        timestamp: new Date(Date.now() - 10800000), // 3 hours ago
        user: 'System'
      },
      {
        id: 'act_4',
        type: 'payment',
        description: 'Subscription payment received',
        amount: 99.99,
        timestamp: new Date(Date.now() - 86400000), // 1 day ago
        user: 'System'
      }
    ];

    res.json({
      success: true,
      data: { recentActivity }
    });
  } catch (error) {
    console.error('Get recent activity error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error getting recent activity' 
    });
  }
});

// @route   GET api/dashboard/modules
// @desc    Get available modules for the company
// @access  Private
router.get('/modules', auth, checkCompanyAccess, async (req, res) => {
  try {
    const companyId = req.user.role === 'admin' && req.query.companyId 
      ? req.query.companyId 
      : req.user.company_id;

    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ 
        success: false, 
        message: 'Company not found' 
      });
    }

    // Return enabled modules
    const modules = {
      pos: company.subscription.modules.pos,
      inventory: company.subscription.modules.inventory,
      laundry: company.subscription.modules.laundry,
      services: company.subscription.modules.services,
      coupons: company.subscription.modules.coupons,
      wallet: company.subscription.modules.wallet,
      reports: company.subscription.modules.reports,
      viewerAccess: company.subscription.modules.viewerAccess
    };

    res.json({
      success: true,
      data: { modules }
    });
  } catch (error) {
    console.error('Get modules error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error getting modules' 
    });
  }
});

module.exports = router;