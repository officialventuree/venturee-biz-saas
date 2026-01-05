const { pool } = require('../config/db');
const bcrypt = require('bcryptjs');

// Create users table if it doesn't exist
const createUsersTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      first_name VARCHAR(50) NOT NULL,
      last_name VARCHAR(50) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(20) DEFAULT 'staff',
      company_id INTEGER NOT NULL,
      is_active BOOLEAN DEFAULT true,
      is_deleted BOOLEAN DEFAULT false,
      last_login TIMESTAMP,
      profile_picture VARCHAR(255),
      phone VARCHAR(20),
      permissions JSONB DEFAULT '{}',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  
  try {
    await pool.query(query);
    console.log('Users table created or already exists');
  } catch (error) {
    console.error('Error creating users table:', error);
    throw error;
  }
};

// Create the table when this module is loaded
createUsersTable();

// User methods
const User = {
  // Find user by email
  findByEmail: async (email) => {
    const query = 'SELECT * FROM users WHERE email = $1 AND is_deleted = false';
    const result = await pool.query(query, [email]);
    return result.rows[0];
  },

  // Find user by ID
  findById: async (id) => {
    const query = 'SELECT * FROM users WHERE id = $1 AND is_deleted = false';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  // Create new user
  create: async (userData) => {
    const {
      firstName,
      lastName,
      email,
      password,
      role,
      companyId,
      phone,
      permissions
    } = userData;

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const query = `
      INSERT INTO users (
        first_name, 
        last_name, 
        email, 
        password, 
        role, 
        company_id, 
        phone, 
        permissions
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id, first_name, last_name, email, role, company_id, created_at, updated_at
    `;

    const result = await pool.query(query, [
      firstName,
      lastName,
      email,
      hashedPassword,
      role,
      companyId,
      phone || null,
      permissions || {}
    ]);

    return result.rows[0];
  },

  // Update user's last login
  updateLastLogin: async (id) => {
    const query = 'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1';
    await pool.query(query, [id]);
  },

  // Update user
  update: async (id, userData) => {
    const fields = [];
    const values = [];
    let index = 1;

    for (const [key, value] of Object.entries(userData)) {
      if (value !== undefined) {
        fields.push(`${key} = $${index}`);
        values.push(value);
        index++;
      }
    }

    if (fields.length === 0) {
      throw new Error('No fields to update');
    }

    values.push(id);
    const query = `UPDATE users SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $${index} RETURNING *`;
    
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  // Delete user (soft delete)
  delete: async (id) => {
    const query = 'UPDATE users SET is_deleted = true, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  // Get all users for a company
  findByCompany: async (companyId) => {
    const query = 'SELECT id, first_name, last_name, email, role, is_active, created_at, updated_at FROM users WHERE company_id = $1 AND is_deleted = false ORDER BY created_at DESC';
    const result = await pool.query(query, [companyId]);
    return result.rows;
  },

  // Get all users (for admin access)
  findAll: async () => {
    const query = 'SELECT id, first_name, last_name, email, role, company_id, is_active, created_at, updated_at FROM users WHERE is_deleted = false ORDER BY created_at DESC';
    const result = await pool.query(query);
    return result.rows;
  },

  // Get all users with pagination (for admin access)
  findAllPaginated: async (page = 1, limit = 10) => {
    const offset = (page - 1) * limit;
    
    // Get users with pagination
    const usersQuery = `SELECT id, first_name, last_name, email, role, company_id, is_active, 
                      created_at, updated_at FROM users WHERE is_deleted = false 
                      ORDER BY created_at DESC LIMIT $1 OFFSET $2`;
    
    // Get total count
    const countQuery = 'SELECT COUNT(*) FROM users WHERE is_deleted = false';
    
    const usersResult = await pool.query(usersQuery, [limit, offset]);
    const countResult = await pool.query(countQuery);
    
    const total = parseInt(countResult.rows[0].count);
    
    return {
      users: usersResult.rows,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page
    };
  }
};

module.exports = User;