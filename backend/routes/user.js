const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Company = require('../models/Company');
const { auth, checkRole, checkCompanyAccess } = require('../middleware/auth');

const router = express.Router();

// @route   GET api/users
// @desc    Get all users for a company
// @access  Private
router.get('/', auth, checkCompanyAccess, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let result;
    let users;
    let total;
    
    if (req.user.role !== 'admin') {
      // For company-admin, only return users from their company
      users = await User.findByCompany(req.user.companyId);
      total = users.length;
      result = { users, total, pages: 1, currentPage: page };
    } else if (req.query.companyId) {
      // For admin, return users from specific company
      users = await User.findByCompany(req.query.companyId);
      total = users.length;
      result = { users, total, pages: 1, currentPage: page };
    } else {
      // For admin, return all users with pagination
      result = await User.findAllPaginated(page, limit);
    }

    res.json({
      success: true,
      data: {
        users: result.users,
        pagination: {
          page: result.currentPage,
          limit,
          total: result.total,
          pages: result.pages
        }
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error getting users' 
    });
  }
});

// @route   GET api/users/:id
// @desc    Get a specific user
// @access  Private
router.get('/:id', auth, checkCompanyAccess, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user || user.is_deleted) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Check if user belongs to the same company (unless admin)
    if (req.user.role !== 'admin' && user.company_id.toString() !== req.user.companyId.toString()) {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied' 
      });
    }

    res.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error getting user' 
    });
  }
});

// @route   POST api/users
// @desc    Create a new user
// @access  Private
router.post('/', auth, checkCompanyAccess, async (req, res) => {
  try {
    // Only company-admin and admin can create users
    if (req.user.role !== 'admin' && req.user.role !== 'company-admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied: insufficient permissions' 
      });
    }

    const { 
      firstName, 
      lastName, 
      email, 
      password, 
      role, 
      phone,
      permissions 
    } = req.body;

    // Validation
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide all required fields' 
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

    // Determine company ID (use current user's company unless admin specifies another)
    const companyId = req.user.role === 'admin' && req.body.companyId 
      ? req.body.companyId 
      : req.user.companyId;

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Set default permissions based on role if not provided
    let userPermissions = permissions;
    if (!userPermissions) {
      userPermissions = {};
      
      switch(role) {
        case 'admin':
          userPermissions = {
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
          };
          break;
        case 'company-admin':
          userPermissions = {
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
          };
          break;
        case 'staff':
          userPermissions = {
            pos_access: true,
            pos_create_transaction: true,
            inventory_access: true,
            reports_access: true
          };
          break;
        case 'viewer':
          userPermissions = {
            reports_access: true
          };
          break;
        default:
          userPermissions = {
            pos_access: false,
            inventory_access: false,
            reports_access: false
          };
      }
    }

    user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: role || 'staff',
      companyId,
      phone,
      permissions: userPermissions
    });

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: { 
        user: {
          id: user.id,
          firstName: user.first_name,
          lastName: user.last_name,
          email: user.email,
          role: user.role,
          companyId: user.company_id,
          permissions: user.permissions,
          phone: user.phone
        }
      }
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error creating user' 
    });
  }
});

// @route   PUT api/users/:id
// @desc    Update a user
// @access  Private
router.put('/:id', auth, checkCompanyAccess, async (req, res) => {
  try {
    // Only admin and company-admin can update users
    if (req.user.role !== 'admin' && req.user.role !== 'company-admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied: insufficient permissions' 
      });
    }

    const { firstName, lastName, email, role, phone, permissions, isActive } = req.body;

    const user = await User.findById(req.params.id);

    if (!user || user.isDeleted) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Check if user belongs to the same company (unless admin)
    if (req.user.role !== 'admin' && user.company_id.toString() !== req.user.companyId.toString()) {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied' 
      });
    }

    // Update fields if provided
    const updateData = {};
    if (firstName) updateData.first_name = firstName;
    if (lastName) updateData.last_name = lastName;
    if (email) updateData.email = email;
    if (role) updateData.role = role;
    if (phone) updateData.phone = phone;
    if (permissions) updateData.permissions = permissions;
    if (typeof isActive !== 'undefined') updateData.is_active = isActive;

    const updatedUser = await User.update(user.id, updateData);

    res.json({
      success: true,
      message: 'User updated successfully',
      data: { 
        user: {
          id: updatedUser.id,
          firstName: updatedUser.first_name,
          lastName: updatedUser.last_name,
          email: updatedUser.email,
          role: updatedUser.role,
          companyId: updatedUser.company_id,
          permissions: updatedUser.permissions,
          phone: updatedUser.phone,
          isActive: updatedUser.is_active
        }
      }
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error updating user' 
    });
  }
});

// @route   DELETE api/users/:id
// @desc    Delete a user (soft delete)
// @access  Private
router.delete('/:id', auth, checkCompanyAccess, async (req, res) => {
  try {
    // Only admin and company-admin can delete users
    if (req.user.role !== 'admin' && req.user.role !== 'company-admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied: insufficient permissions' 
      });
    }

    const user = await User.findById(req.params.id);

    if (!user || user.is_deleted) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Check if user belongs to the same company (unless admin)
    if (req.user.role !== 'admin' && user.company_id.toString() !== req.user.companyId.toString()) {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied' 
      });
    }

    // Prevent company-admin from deleting themselves
    if (user.id.toString() === req.user.id) {
      return res.status(400).json({ 
        success: false, 
        message: 'Cannot delete your own account' 
      });
    }

    // Soft delete
    const updatedUser = await User.delete(user.id);

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error deleting user' 
    });
  }
});

module.exports = router;
