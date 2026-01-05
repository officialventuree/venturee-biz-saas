/**
 * Multi-tenancy utilities for Venturee Biz SaaS platform
 */

/**
 * Generate a unique tenant ID
 * @returns {string} - Unique tenant identifier
 */
const generateTenantId = () => {
  return `tenant_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Get tenant-specific collection name
 * @param {string} baseCollectionName - Base collection name
 * @param {string} tenantId - Tenant identifier
 * @returns {string} - Tenant-specific collection name
 */
const getTenantCollectionName = (baseCollectionName, tenantId) => {
  return `${baseCollectionName}_${tenantId}`;
};

/**
 * Validate tenant access
 * @param {Object} user - User object
 * @param {string} requestedTenantId - Requested tenant ID
 * @returns {boolean} - Whether access is allowed
 */
const validateTenantAccess = (user, requestedTenantId) => {
  // Admin users can access any tenant
  if (user.role === 'admin') {
    return true;
  }
  
  // Regular users can only access their own company's data
  // In our current model, we use companyId instead of tenantId
  // This function would be expanded in a more complex multi-tenant setup
  return user.company_id && requestedTenantId === user.company_id.toString();
};

/**
 * Get tenant-specific database connection (for advanced multi-tenancy)
 * @param {string} tenantId - Tenant identifier
 * @returns {Object} - Tenant-specific database connection
 */
const getTenantConnection = (tenantId) => {
  // In a more advanced setup, this would return a tenant-specific DB connection
  // For now, we'll just return the default connection
  return null; // Use default connection
};

module.exports = {
  generateTenantId,
  getTenantCollectionName,
  validateTenantAccess,
  getTenantConnection
};