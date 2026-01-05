const express = require('express');
const Company = require('../models/Company');
const { pool } = require('../config/db');
const { auth, checkRole, checkCompanyAccess } = require('../middleware/auth');
const { generateDuitNowQR, validateDuitNowPayment, verifyPaymentCallback } = require('../utils/duitnow');

const router = express.Router();

// @route   POST api/payment/duitnow/generate
// @desc    Generate DuitNow QR code for company subscription
// @access  Private (Company Admin)
router.post('/duitnow/generate', auth, checkRole(['company-admin']), async (req, res) => {
  try {
    const { plan, modules } = req.body;

    // Get company details
    const company = await Company.findById(req.user.company_id);
    if (!company) {
      return res.status(404).json({ 
        success: false, 
        message: 'Company not found' 
      });
    }

    // Define pricing based on plan and modules
    const pricing = {
      basic: 99.99,
      standard: 199.99,
      premium: 299.99,
      enterprise: 499.99
    };

    // Calculate total amount based on plan and selected modules
    let amount = pricing[plan] || pricing.basic;
    
    // Add module costs if specified
    if (modules) {
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
      
      Object.keys(modules).forEach(module => {
        if (modules[module] && modulePricing[module]) {
          amount += modulePricing[module];
        }
      });
    }

    // Generate DuitNow QR code
    const paymentData = {
      companyId: company.id.toString(),
      planId: plan,
      amount: amount,
      currency: 'MYR',
      expiryTime: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now
    };

    const qrResult = await generateDuitNowQR(paymentData);

    // Update company with payment details (but keep status as pending)
    const updatedCompany = await Company.update(company.id, {
      payment_details: {
        duitNowCode: qrResult.transactionRef,
        amount: amount,
        status: 'pending',
        generatedAt: qrResult.createdAt
      }
    });

    res.json({
      success: true,
      message: 'DuitNow QR code generated successfully',
      data: {
        qrCode: qrResult.qrCode,
        transactionRef: qrResult.transactionRef,
        amount: qrResult.amount,
        expiryTime: qrResult.expiryTime,
        company: {
          id: updatedCompany.id,
          name: updatedCompany.name
        }
      }
    });
  } catch (error) {
    console.error('Generate DuitNow QR error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error generating DuitNow QR' 
    });
  }
});

// @route   POST api/payment/duitnow/verify
// @desc    Verify DuitNow payment callback
// @access  Public (for payment gateway callback)
router.post('/duitnow/verify', async (req, res) => {
  try {
    const callbackData = req.body;

    // Verify the payment callback
    const verificationResult = await verifyPaymentCallback(callbackData);

    if (!verificationResult.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment callback',
        error: verificationResult.error
      });
    }

    // Find the company by transaction reference
    // This requires a custom query since we need to search in JSON field
    const result = await pool.query(
      'SELECT * FROM companies WHERE payment_details->>\'duitNowCode\' = $1', 
      [verificationResult.referenceNo]
    );
    const company = result.rows[0];

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found for this transaction'
      });
    }

    // Update company payment and subscription status
    if (verificationResult.status === 'SUCCESS' || verificationResult.status === 'COMPLETED') {
      const updatedCompany = await Company.update(company.id, {
        subscription: {
          ...company.subscription,
          status: 'active',
          startDate: new Date(),
          endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year from now
        },
        is_active: true,
        payment_details: {
          ...company.payment_details,
          transactionId: verificationResult.transactionId,
          status: 'completed',
          paymentDate: verificationResult.verifiedAt,
          paymentMethod: 'DuitNow'
        }
      });

      res.json({
        success: true,
        message: 'Payment verified and company activated successfully',
        data: {
          company: {
            id: updatedCompany.id,
            name: updatedCompany.name,
            status: updatedCompany.subscription.status
          }
        }
      });
    } else {
      // Payment failed or pending
      const updatedCompany = await Company.update(company.id, {
        payment_details: {
          ...company.payment_details,
          status: verificationResult.status.toLowerCase()
        }
      });

      res.json({
        success: true,
        message: `Payment status: ${verificationResult.status}`,
        data: {
          status: verificationResult.status
        }
      });
    }
  } catch (error) {
    console.error('Verify payment callback error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error verifying payment' 
    });
  }
});

// @route   GET api/payment/status
// @desc    Get payment status for current company
// @access  Private
router.get('/status', auth, checkCompanyAccess, async (req, res) => {
  try {
    const company = await Company.findById(req.user.company_id);

    if (!company) {
      return res.status(404).json({ 
        success: false, 
        message: 'Company not found' 
      });
    }

    res.json({
      success: true,
      data: {
        subscription: company.subscription,
        paymentDetails: company.payment_details,
        isActive: company.is_active
      }
    });
  } catch (error) {
    console.error('Get payment status error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error getting payment status' 
    });
  }
});

module.exports = router;