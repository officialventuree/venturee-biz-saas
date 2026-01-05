const { pool } = require('../config/db');

// Create companies table if it doesn't exist
const createCompaniesTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS companies (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      business_type VARCHAR(20) NOT NULL,
      registration_number VARCHAR(50),
      address JSONB,
      contact JSONB,
      subscription JSONB DEFAULT '{}',
      tenant_id VARCHAR(255) UNIQUE NOT NULL,
      is_active BOOLEAN DEFAULT false,
      is_deleted BOOLEAN DEFAULT false,
      payment_details JSONB DEFAULT '{}',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  
  try {
    await pool.query(query);
    console.log('Companies table created or already exists');
  } catch (error) {
    console.error('Error creating companies table:', error);
    throw error;
  }
};

// Create the table when this module is loaded
createCompaniesTable();

// Company methods
const Company = {
  // Find company by tenant ID
  findByTenantId: async (tenantId) => {
    const query = 'SELECT * FROM companies WHERE tenant_id = $1 AND is_deleted = false';
    const result = await pool.query(query, [tenantId]);
    return result.rows[0];
  },

  // Find company by ID
  findById: async (id) => {
    const query = 'SELECT * FROM companies WHERE id = $1 AND is_deleted = false';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  // Find company by email
  findByEmail: async (email) => {
    const query = 'SELECT * FROM companies WHERE contact->>\'email\' = $1 AND is_deleted = false';
    const result = await pool.query(query, [email]);
    return result.rows[0];
  },

  // Find company by name (for registration check)
  findByName: async (name) => {
    const query = 'SELECT * FROM companies WHERE name = $1 AND is_deleted = false';
    const result = await pool.query(query, [name]);
    return result.rows[0];
  },

  // Create new company
  create: async (companyData) => {
    const {
      name,
      businessType,
      registrationNumber,
      address,
      contact,
      subscription,
      tenantId,
      paymentDetails
    } = companyData;

    const query = `
      INSERT INTO companies (
        name, 
        business_type, 
        registration_number, 
        address, 
        contact, 
        subscription, 
        tenant_id, 
        payment_details
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id, name, business_type, contact, tenant_id, is_active, created_at, updated_at
    `;

    const result = await pool.query(query, [
      name,
      businessType,
      registrationNumber || null,
      address || {},
      contact || {},
      subscription || {},
      tenantId,
      paymentDetails || {}
    ]);

    return result.rows[0];
  },

  // Update company
  update: async (id, companyData) => {
    const fields = [];
    const values = [];
    let index = 1;

    for (const [key, value] of Object.entries(companyData)) {
      if (value !== undefined) {
        const dbKey = key === 'businessType' ? 'business_type' : 
                     key === 'registrationNumber' ? 'registration_number' : key;
        fields.push(`${dbKey} = $${index}`);
        values.push(value);
        index++;
      }
    }

    if (fields.length === 0) {
      throw new Error('No fields to update');
    }

    values.push(id);
    const query = `UPDATE companies SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $${index} RETURNING *`;
    
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  // Delete company (soft delete)
  delete: async (id) => {
    const query = 'UPDATE companies SET is_deleted = true, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  // Get all companies
  findAll: async () => {
    const query = 'SELECT id, name, business_type, contact, is_active, created_at FROM companies WHERE is_deleted = false ORDER BY created_at DESC';
    const result = await pool.query(query);
    return result.rows;
  },

  // Update company subscription
  updateSubscription: async (id, subscription) => {
    const query = 'UPDATE companies SET subscription = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *';
    const result = await pool.query(query, [subscription, id]);
    return result.rows[0];
  },

  // Update company activation status
  updateActivation: async (id, isActive) => {
    const query = 'UPDATE companies SET is_active = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *';
    const result = await pool.query(query, [isActive, id]);
    return result.rows[0];
  }
};

module.exports = Company;