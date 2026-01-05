// Utility functions for DuitNow payment integration
const QRCode = require('qrcode');
const crypto = require('crypto');

/**
 * Generate a DuitNow QR code for payment
 * @param {Object} paymentData - Payment details
 * @param {string} paymentData.companyId - Company ID
 * @param {string} paymentData.planId - Plan ID
 * @param {number} paymentData.amount - Payment amount
 * @param {string} paymentData.currency - Currency code (default: MYR)
 * @param {Date} paymentData.expiryTime - Expiry time for the QR code
 * @returns {Promise<string>} - Base64 encoded QR code image
 */
const generateDuitNowQR = async (paymentData) => {
  try {
    // Create a unique reference for the transaction
    const transactionRef = `VENTUREE_BIZ_${Date.now()}_${paymentData.companyId}`;
    
    // Create the DuitNow QR payload
    // This is a simplified version - in a real implementation, you would follow the official DuitNow specs
    const qrPayload = `00020101021226610014A00000061700010801${transactionRef}0208${paymentData.amount.toFixed(2)}53034585802MY5920VENTUREE BIZ PLATFORM6008KUALA LUMPUR62220716${transactionRef}6304`;
    
    // Generate QR code as base64
    const qrCodeBase64 = await QRCode.toDataURL(qrPayload);
    
    return {
      qrCode: qrCodeBase64,
      transactionRef,
      amount: paymentData.amount,
      currency: paymentData.currency || 'MYR',
      expiryTime: paymentData.expiryTime,
      createdAt: new Date()
    };
  } catch (error) {
    throw new Error(`Failed to generate DuitNow QR: ${error.message}`);
  }
};

/**
 * Validate DuitNow payment
 * @param {string} transactionRef - Transaction reference
 * @param {number} amount - Expected amount
 * @returns {Promise<boolean>} - Whether payment is valid
 */
const validateDuitNowPayment = async (transactionRef, amount) => {
  // In a real implementation, this would check with the payment gateway
  // For now, we'll return true for demo purposes
  return true;
};

/**
 * Verify payment callback from payment gateway
 * @param {Object} callbackData - Payment gateway callback data
 * @returns {Promise<Object>} - Verification result
 */
const verifyPaymentCallback = async (callbackData) => {
  try {
    // Verify the callback signature (in real implementation)
    // This would involve checking the signature against a secret key
    
    const { transactionId, amount, status, referenceNo } = callbackData;
    
    // In a real implementation, verify the payment with the gateway
    // For now, return a success response
    
    return {
      isValid: true,
      transactionId,
      amount,
      status,
      referenceNo,
      verifiedAt: new Date()
    };
  } catch (error) {
    return {
      isValid: false,
      error: error.message
    };
  }
};

module.exports = {
  generateDuitNowQR,
  validateDuitNowPayment,
  verifyPaymentCallback
};