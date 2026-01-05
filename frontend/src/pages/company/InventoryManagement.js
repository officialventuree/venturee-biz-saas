import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { FaBox, FaPlus, FaEdit, FaTrash, FaSearch, FaChartBar, FaExclamationTriangle } from 'react-icons/fa';

const InventoryManagement = () => {
  const { user, company } = useAuth();
  const { theme } = useTheme();
  const [inventory, setInventory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [newItem, setNewItem] = useState({
    name: '',
    category: '',
    price: '',
    cost: '',
    quantity: '',
    minStock: '',
    supplier: '',
    description: ''
  });

  // Mock inventory data
  useEffect(() => {
    const mockInventory = [
      {
        id: 1,
        name: 'Product A',
        category: 'Electronics',
        price: 29.99,
        cost: 15.00,
        quantity: 45,
        minStock: 10,
        supplier: 'ABC Supplier',
        description: 'High quality electronic product',
        lastUpdated: '2023-12-15'
      },
      {
        id: 2,
        name: 'Product B',
        category: 'Clothing',
        price: 19.99,
        cost: 8.50,
        quantity: 5,
        minStock: 20,
        supplier: 'XYZ Supplier',
        description: 'Fashion clothing item',
        lastUpdated: '2023-12-10'
      },
      {
        id: 3,
        name: 'Product C',
        category: 'Food',
        price: 8.99,
        cost: 3.20,
        quantity: 100,
        minStock: 15,
        supplier: 'Food Co.',
        description: 'Organic food product',
        lastUpdated: '2023-12-12'
      },
      {
        id: 4,
        name: 'Product D',
        category: 'Home',
        price: 45.50,
        cost: 25.00,
        quantity: 12,
        minStock: 5,
        supplier: 'Home Essentials',
        description: 'Home decoration item',
        lastUpdated: '2023-12-08'
      }
    ];
    setInventory(mockInventory);
  }, []);

  // Filter inventory based on search term
  const filteredInventory = inventory.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.supplier.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Add new item
  const handleAddItem = () => {
    const item = {
      id: inventory.length + 1,
      ...newItem,
      price: parseFloat(newItem.price),
      cost: parseFloat(newItem.cost),
      quantity: parseInt(newItem.quantity),
      minStock: parseInt(newItem.minStock)
    };
    
    setInventory([...inventory, item]);
    setNewItem({
      name: '',
      category: '',
      price: '',
      cost: '',
      quantity: '',
      minStock: '',
      supplier: '',
      description: ''
    });
    setShowAddModal(false);
  };

  // Update item
  const handleUpdateItem = () => {
    setInventory(inventory.map(item => 
      item.id === currentItem.id ? { ...currentItem } : item
    ));
    setShowEditModal(false);
    setCurrentItem(null);
  };

  // Delete item
  const handleDeleteItem = (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setInventory(inventory.filter(item => item.id !== id));
    }
  };

  // Check for low stock items
  const lowStockItems = inventory.filter(item => item.quantity <= item.minStock);

  return (
    <div className="inventory-management" style={{ backgroundColor: theme.background, minHeight: '100vh', padding: '2rem 0' }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div className="card" style={{ backgroundColor: theme.backgroundCard, padding: '2rem' }}>
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ color: theme.textPrimary, marginBottom: '0.5rem', display: 'flex', alignItems: 'center' }}>
              <FaBox style={{ marginRight: '0.75rem', color: theme.goldPrimary }} />
              Inventory Management
            </h1>
            <p style={{ color: theme.textSecondary }}>
              Manage your products, stock levels, and suppliers
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2-md grid-cols-4" style={{ gap: '1.5rem', marginBottom: '2rem' }}>
            {/* Total Items */}
            <div className="card" style={{ backgroundColor: theme.backgroundLight, padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{ 
                  width: '40px', 
                  height: '40px', 
                  borderRadius: '50%', 
                  backgroundColor: `${theme.goldPrimary}20`, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  marginRight: '1rem'
                }}>
                  <FaBox style={{ color: theme.goldPrimary }} />
                </div>
                <div>
                  <p style={{ color: theme.textTertiary, fontSize: '0.875rem', marginBottom: '0.25rem' }}>Total Items</p>
                  <h3 style={{ color: theme.textPrimary, fontSize: '1.5rem' }}>
                    {inventory.length}
                  </h3>
                </div>
              </div>
            </div>

            {/* Low Stock */}
            <div className="card" style={{ backgroundColor: theme.backgroundLight, padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{ 
                  width: '40px', 
                  height: '40px', 
                  borderRadius: '50%', 
                  backgroundColor: `${theme.warning}20`, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  marginRight: '1rem'
                }}>
                  <FaExclamationTriangle style={{ color: theme.warning }} />
                </div>
                <div>
                  <p style={{ color: theme.textTertiary, fontSize: '0.875rem', marginBottom: '0.25rem' }}>Low Stock</p>
                  <h3 style={{ color: theme.textPrimary, fontSize: '1.5rem' }}>
                    {lowStockItems.length}
                  </h3>
                </div>
              </div>
            </div>

            {/* Total Value */}
            <div className="card" style={{ backgroundColor: theme.backgroundLight, padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{ 
                  width: '40px', 
                  height: '40px', 
                  borderRadius: '50%', 
                  backgroundColor: `${theme.success}20`, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  marginRight: '1rem'
                }}>
                  <FaChartBar style={{ color: theme.success }} />
                </div>
                <div>
                  <p style={{ color: theme.textTertiary, fontSize: '0.875rem', marginBottom: '0.25rem' }}>Total Value</p>
                  <h3 style={{ color: theme.textPrimary, fontSize: '1.5rem' }}>
                    {new Intl.NumberFormat('en-MY', { 
                      style: 'currency', 
                      currency: 'MYR' 
                    }).format(inventory.reduce((sum, item) => sum + (item.price * item.quantity), 0))}
                  </h3>
                </div>
              </div>
            </div>

            {/* Total Quantity */}
            <div className="card" style={{ backgroundColor: theme.backgroundLight, padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{ 
                  width: '40px', 
                  height: '40px', 
                  borderRadius: '50%', 
                  backgroundColor: `${theme.info}20`, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  marginRight: '1rem'
                }}>
                  <FaBox style={{ color: theme.info }} />
                </div>
                <div>
                  <p style={{ color: theme.textTertiary, fontSize: '0.875rem', marginBottom: '0.25rem' }}>Total Quantity</p>
                  <h3 style={{ color: theme.textPrimary, fontSize: '1.5rem' }}>
                    {inventory.reduce((sum, item) => sum + item.quantity, 0)}
                  </h3>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Add Controls */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
              <input
                type="text"
                placeholder="Search products, categories, suppliers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input"
                style={{ 
                  backgroundColor: theme.backgroundLight, 
                  borderColor: theme.border, 
                  color: theme.textPrimary,
                  paddingLeft: '2.5rem',
                  width: '100%'
                }}
              />
              <FaSearch style={{ 
                position: 'absolute', 
                left: '1rem', 
                top: '50%', 
                transform: 'translateY(-50%)', 
                color: theme.textTertiary 
              }} />
            </div>
            
            <button
              className="btn btn-primary"
              style={{ backgroundColor: theme.goldPrimary, color: 'white', marginLeft: '1rem' }}
              onClick={() => setShowAddModal(true)}
            >
              <FaPlus style={{ marginRight: '0.5rem' }} />
              Add Product
            </button>
          </div>

          {/* Inventory Table */}
          <div className="card" style={{ backgroundColor: theme.backgroundLight, padding: '1.5rem' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: `2px solid ${theme.border}` }}>
                    <th style={{ textAlign: 'left', padding: '1rem', color: theme.textTertiary, fontSize: '0.875rem' }}>Product</th>
                    <th style={{ textAlign: 'left', padding: '1rem', color: theme.textTertiary, fontSize: '0.875rem' }}>Category</th>
                    <th style={{ textAlign: 'left', padding: '1rem', color: theme.textTertiary, fontSize: '0.875rem' }}>Price</th>
                    <th style={{ textAlign: 'left', padding: '1rem', color: theme.textTertiary, fontSize: '0.875rem' }}>Cost</th>
                    <th style={{ textAlign: 'left', padding: '1rem', color: theme.textTertiary, fontSize: '0.875rem' }}>Quantity</th>
                    <th style={{ textAlign: 'left', padding: '1rem', color: theme.textTertiary, fontSize: '0.875rem' }}>Min Stock</th>
                    <th style={{ textAlign: 'left', padding: '1rem', color: theme.textTertiary, fontSize: '0.875rem' }}>Supplier</th>
                    <th style={{ textAlign: 'left', padding: '1rem', color: theme.textTertiary, fontSize: '0.875rem' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInventory.map((item) => (
                    <tr 
                      key={item.id} 
                      style={{ 
                        borderBottom: `1px solid ${theme.border}`,
                        backgroundColor: item.quantity <= item.minStock ? `${theme.warning}10` : 'transparent'
                      }}
                    >
                      <td style={{ padding: '1rem', color: theme.textPrimary }}>
                        <div style={{ fontWeight: '500' }}>{item.name}</div>
                        <div style={{ fontSize: '0.75rem', color: theme.textTertiary }}>
                          {item.description}
                        </div>
                      </td>
                      <td style={{ padding: '1rem', color: theme.textSecondary }}>
                        {item.category}
                      </td>
                      <td style={{ padding: '1rem', color: theme.textPrimary }}>
                        {new Intl.NumberFormat('en-MY', { 
                          style: 'currency', 
                          currency: 'MYR' 
                        }).format(item.price)}
                      </td>
                      <td style={{ padding: '1rem', color: theme.textSecondary }}>
                        {new Intl.NumberFormat('en-MY', { 
                          style: 'currency', 
                          currency: 'MYR' 
                        }).format(item.cost)}
                      </td>
                      <td style={{ padding: '1rem', color: theme.textPrimary }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <span style={{ marginRight: '0.5rem' }}>{item.quantity}</span>
                          {item.quantity <= item.minStock && (
                            <FaExclamationTriangle style={{ color: theme.warning }} title="Low stock" />
                          )}
                        </div>
                      </td>
                      <td style={{ padding: '1rem', color: theme.textSecondary }}>
                        {item.minStock}
                      </td>
                      <td style={{ padding: '1rem', color: theme.textSecondary }}>
                        {item.supplier}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            className="btn btn-outline"
                            style={{ 
                              color: theme.textPrimary, 
                              borderColor: theme.border,
                              padding: '0.25rem 0.5rem',
                              fontSize: '0.75rem'
                            }}
                            onClick={() => {
                              setCurrentItem(item);
                              setShowEditModal(true);
                            }}
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="btn btn-outline"
                            style={{ 
                              color: theme.error, 
                              borderColor: theme.error,
                              padding: '0.25rem 0.5rem',
                              fontSize: '0.75rem'
                            }}
                            onClick={() => handleDeleteItem(item.id)}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Low Stock Alert */}
          {lowStockItems.length > 0 && (
            <div style={{ 
              marginTop: '2rem', 
              padding: '1rem', 
              backgroundColor: `${theme.warning}10`, 
              border: `1px solid ${theme.warning}`,
              borderRadius: theme.borderRadius
            }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <FaExclamationTriangle style={{ color: theme.warning, fontSize: '1.5rem', marginRight: '1rem' }} />
                <div>
                  <h4 style={{ color: theme.warning, marginBottom: '0.5rem' }}>Low Stock Alert</h4>
                  <p style={{ color: theme.textSecondary }}>
                    You have {lowStockItems.length} item(s) that are below minimum stock levels. Please restock soon.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: theme.overlay,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="card" style={{ 
            backgroundColor: theme.backgroundCard, 
            padding: '2rem', 
            maxWidth: '600px',
            width: '90%'
          }}>
            <h2 style={{ color: theme.textPrimary, marginBottom: '1.5rem' }}>Add New Product</h2>
            
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: theme.textPrimary }}>Product Name</label>
              <input
                type="text"
                value={newItem.name}
                onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                className="form-input"
                style={{ 
                  backgroundColor: theme.backgroundLight, 
                  borderColor: theme.border, 
                  color: theme.textPrimary,
                  width: '100%',
                  padding: '0.75rem'
                }}
              />
            </div>
            
            <div className="grid grid-cols-2" style={{ gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: theme.textPrimary }}>Category</label>
                <input
                  type="text"
                  value={newItem.category}
                  onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                  className="form-input"
                  style={{ 
                    backgroundColor: theme.backgroundLight, 
                    borderColor: theme.border, 
                    color: theme.textPrimary,
                    width: '100%',
                    padding: '0.75rem'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: theme.textPrimary }}>Supplier</label>
                <input
                  type="text"
                  value={newItem.supplier}
                  onChange={(e) => setNewItem({...newItem, supplier: e.target.value})}
                  className="form-input"
                  style={{ 
                    backgroundColor: theme.backgroundLight, 
                    borderColor: theme.border, 
                    color: theme.textPrimary,
                    width: '100%',
                    padding: '0.75rem'
                  }}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2" style={{ gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: theme.textPrimary }}>Price (RM)</label>
                <input
                  type="number"
                  step="0.01"
                  value={newItem.price}
                  onChange={(e) => setNewItem({...newItem, price: e.target.value})}
                  className="form-input"
                  style={{ 
                    backgroundColor: theme.backgroundLight, 
                    borderColor: theme.border, 
                    color: theme.textPrimary,
                    width: '100%',
                    padding: '0.75rem'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: theme.textPrimary }}>Cost (RM)</label>
                <input
                  type="number"
                  step="0.01"
                  value={newItem.cost}
                  onChange={(e) => setNewItem({...newItem, cost: e.target.value})}
                  className="form-input"
                  style={{ 
                    backgroundColor: theme.backgroundLight, 
                    borderColor: theme.border, 
                    color: theme.textPrimary,
                    width: '100%',
                    padding: '0.75rem'
                  }}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2" style={{ gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: theme.textPrimary }}>Quantity</label>
                <input
                  type="number"
                  value={newItem.quantity}
                  onChange={(e) => setNewItem({...newItem, quantity: e.target.value})}
                  className="form-input"
                  style={{ 
                    backgroundColor: theme.backgroundLight, 
                    borderColor: theme.border, 
                    color: theme.textPrimary,
                    width: '100%',
                    padding: '0.75rem'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: theme.textPrimary }}>Minimum Stock</label>
                <input
                  type="number"
                  value={newItem.minStock}
                  onChange={(e) => setNewItem({...newItem, minStock: e.target.value})}
                  className="form-input"
                  style={{ 
                    backgroundColor: theme.backgroundLight, 
                    borderColor: theme.border, 
                    color: theme.textPrimary,
                    width: '100%',
                    padding: '0.75rem'
                  }}
                />
              </div>
            </div>
            
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: theme.textPrimary }}>Description</label>
              <textarea
                value={newItem.description}
                onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                className="form-input"
                rows="3"
                style={{ 
                  backgroundColor: theme.backgroundLight, 
                  borderColor: theme.border, 
                  color: theme.textPrimary,
                  width: '100%',
                  padding: '0.75rem'
                }}
              />
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
              <button
                className="btn btn-outline"
                style={{ color: theme.textPrimary, borderColor: theme.border }}
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                style={{ backgroundColor: theme.goldPrimary, color: 'white' }}
                onClick={handleAddItem}
              >
                Add Product
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {showEditModal && currentItem && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: theme.overlay,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="card" style={{ 
            backgroundColor: theme.backgroundCard, 
            padding: '2rem', 
            maxWidth: '600px',
            width: '90%'
          }}>
            <h2 style={{ color: theme.textPrimary, marginBottom: '1.5rem' }}>Edit Product</h2>
            
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: theme.textPrimary }}>Product Name</label>
              <input
                type="text"
                value={currentItem.name}
                onChange={(e) => setCurrentItem({...currentItem, name: e.target.value})}
                className="form-input"
                style={{ 
                  backgroundColor: theme.backgroundLight, 
                  borderColor: theme.border, 
                  color: theme.textPrimary,
                  width: '100%',
                  padding: '0.75rem'
                }}
              />
            </div>
            
            <div className="grid grid-cols-2" style={{ gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: theme.textPrimary }}>Category</label>
                <input
                  type="text"
                  value={currentItem.category}
                  onChange={(e) => setCurrentItem({...currentItem, category: e.target.value})}
                  className="form-input"
                  style={{ 
                    backgroundColor: theme.backgroundLight, 
                    borderColor: theme.border, 
                    color: theme.textPrimary,
                    width: '100%',
                    padding: '0.75rem'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: theme.textPrimary }}>Supplier</label>
                <input
                  type="text"
                  value={currentItem.supplier}
                  onChange={(e) => setCurrentItem({...currentItem, supplier: e.target.value})}
                  className="form-input"
                  style={{ 
                    backgroundColor: theme.backgroundLight, 
                    borderColor: theme.border, 
                    color: theme.textPrimary,
                    width: '100%',
                    padding: '0.75rem'
                  }}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2" style={{ gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: theme.textPrimary }}>Price (RM)</label>
                <input
                  type="number"
                  step="0.01"
                  value={currentItem.price}
                  onChange={(e) => setCurrentItem({...currentItem, price: parseFloat(e.target.value)})}
                  className="form-input"
                  style={{ 
                    backgroundColor: theme.backgroundLight, 
                    borderColor: theme.border, 
                    color: theme.textPrimary,
                    width: '100%',
                    padding: '0.75rem'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: theme.textPrimary }}>Cost (RM)</label>
                <input
                  type="number"
                  step="0.01"
                  value={currentItem.cost}
                  onChange={(e) => setCurrentItem({...currentItem, cost: parseFloat(e.target.value)})}
                  className="form-input"
                  style={{ 
                    backgroundColor: theme.backgroundLight, 
                    borderColor: theme.border, 
                    color: theme.textPrimary,
                    width: '100%',
                    padding: '0.75rem'
                  }}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2" style={{ gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: theme.textPrimary }}>Quantity</label>
                <input
                  type="number"
                  value={currentItem.quantity}
                  onChange={(e) => setCurrentItem({...currentItem, quantity: parseInt(e.target.value)})}
                  className="form-input"
                  style={{ 
                    backgroundColor: theme.backgroundLight, 
                    borderColor: theme.border, 
                    color: theme.textPrimary,
                    width: '100%',
                    padding: '0.75rem'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: theme.textPrimary }}>Minimum Stock</label>
                <input
                  type="number"
                  value={currentItem.minStock}
                  onChange={(e) => setCurrentItem({...currentItem, minStock: parseInt(e.target.value)})}
                  className="form-input"
                  style={{ 
                    backgroundColor: theme.backgroundLight, 
                    borderColor: theme.border, 
                    color: theme.textPrimary,
                    width: '100%',
                    padding: '0.75rem'
                  }}
                />
              </div>
            </div>
            
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: theme.textPrimary }}>Description</label>
              <textarea
                value={currentItem.description}
                onChange={(e) => setCurrentItem({...currentItem, description: e.target.value})}
                className="form-input"
                rows="3"
                style={{ 
                  backgroundColor: theme.backgroundLight, 
                  borderColor: theme.border, 
                  color: theme.textPrimary,
                  width: '100%',
                  padding: '0.75rem'
                }}
              />
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
              <button
                className="btn btn-outline"
                style={{ color: theme.textPrimary, borderColor: theme.border }}
                onClick={() => {
                  setShowEditModal(false);
                  setCurrentItem(null);
                }}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                style={{ backgroundColor: theme.goldPrimary, color: 'white' }}
                onClick={handleUpdateItem}
              >
                Update Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryManagement;