import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { FaShoppingCart, FaBarcode, FaCreditCard, FaCashRegister, FaReceipt, FaTimesCircle } from 'react-icons/fa';

const POSSystem = () => {
  const { user, company } = useAuth();
  const { theme } = useTheme();
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('cash');
  const [showReceipt, setShowReceipt] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState(null);

  // Mock products data
  const [products] = useState([
    { id: 1, name: 'Product A', price: 15.99, stock: 50 },
    { id: 2, name: 'Product B', price: 29.99, stock: 30 },
    { id: 3, name: 'Product C', price: 8.99, stock: 100 },
    { id: 4, name: 'Product D', price: 45.50, stock: 15 },
    { id: 5, name: 'Product E', price: 12.75, stock: 75 }
  ]);

  // Add item to cart
  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      if (existingItem.quantity < product.stock) {
        setCart(cart.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        ));
      }
    } else {
      if (product.stock > 0) {
        setCart([...cart, { ...product, quantity: 1 }]);
      }
    }
  };

  // Remove item from cart
  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  // Update item quantity
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    const product = products.find(p => p.id === productId);
    if (product && newQuantity <= product.stock) {
      setCart(cart.map(item => 
        item.id === productId 
          ? { ...item, quantity: newQuantity } 
          : item
      ));
    }
  };

  // Calculate total
  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Process transaction
  const processTransaction = () => {
    const transaction = {
      id: `TXN${Date.now()}`,
      items: [...cart],
      total: calculateTotal(),
      paymentMethod: selectedPaymentMethod,
      timestamp: new Date().toISOString(),
      cashier: `${user.firstName} ${user.lastName}`
    };
    
    setCurrentTransaction(transaction);
    setShowReceipt(true);
    
    // In a real app, this would send the transaction to the backend
    console.log('Transaction processed:', transaction);
    
    // Clear cart after transaction
    setCart([]);
  };

  // Filter products based on search term
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="pos-system" style={{ backgroundColor: theme.background, minHeight: '100vh', padding: '2rem 0' }}>
      <div className="container" style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div className="card" style={{ backgroundColor: theme.backgroundCard, padding: '2rem' }}>
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ color: theme.textPrimary, marginBottom: '0.5rem', display: 'flex', alignItems: 'center' }}>
              <FaCashRegister style={{ marginRight: '0.75rem', color: theme.goldPrimary }} />
              POS System
            </h1>
            <p style={{ color: theme.textSecondary }}>
              Process sales transactions and manage payments
            </p>
          </div>

          <div className="grid grid-cols-1-md grid-cols-3" style={{ gap: '2rem' }}>
            {/* Product Search and List */}
            <div className="card" style={{ backgroundColor: theme.backgroundLight, padding: '1.5rem' }}>
              <h3 style={{ color: theme.textPrimary, marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
                <FaBarcode style={{ marginRight: '0.5rem', color: theme.goldPrimary }} />
                Products
              </h3>
              
              <div style={{ marginBottom: '1rem' }}>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-input"
                  style={{ 
                    backgroundColor: theme.backgroundMedium, 
                    borderColor: theme.border, 
                    color: theme.textPrimary,
                    width: '100%',
                    padding: '0.75rem'
                  }}
                />
              </div>
              
              <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {filteredProducts.map(product => (
                  <div 
                    key={product.id}
                    style={{ 
                      padding: '1rem', 
                      marginBottom: '0.5rem', 
                      backgroundColor: theme.backgroundMedium,
                      borderRadius: theme.borderRadius,
                      cursor: 'pointer',
                      transition: theme.transition
                    }}
                    onClick={() => addToCart(product)}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h4 style={{ color: theme.textPrimary, marginBottom: '0.25rem' }}>{product.name}</h4>
                        <p style={{ color: theme.textSecondary, fontSize: '0.875rem' }}>
                          RM {product.price.toFixed(2)} | Stock: {product.stock}
                        </p>
                      </div>
                      <div style={{ 
                        width: '32px', 
                        height: '32px', 
                        borderRadius: '50%', 
                        backgroundColor: theme.goldPrimary,
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 'bold'
                      }}>
                        +
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shopping Cart */}
            <div className="card" style={{ backgroundColor: theme.backgroundLight, padding: '1.5rem' }}>
              <h3 style={{ color: theme.textPrimary, marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
                <FaShoppingCart style={{ marginRight: '0.5rem', color: theme.goldPrimary }} />
                Shopping Cart
              </h3>
              
              {cart.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: theme.textTertiary }}>
                  <p>Your cart is empty</p>
                </div>
              ) : (
                <>
                  <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '1rem' }}>
                    {cart.map(item => (
                      <div key={item.id} style={{ padding: '1rem 0', borderBottom: `1px solid ${theme.border}` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                          <div>
                            <h4 style={{ color: theme.textPrimary, marginBottom: '0.25rem' }}>{item.name}</h4>
                            <p style={{ color: theme.textSecondary, fontSize: '0.875rem' }}>
                              RM {item.price.toFixed(2)} x {item.quantity}
                            </p>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              style={{ 
                                width: '24px', 
                                height: '24px', 
                                borderRadius: '50%', 
                                backgroundColor: theme.backgroundMedium,
                                border: 'none',
                                color: theme.textPrimary,
                                cursor: 'pointer'
                              }}
                            >
                              -
                            </button>
                            <span style={{ color: theme.textPrimary, minWidth: '20px', textAlign: 'center' }}>
                              {item.quantity}
                            </span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              style={{ 
                                width: '24px', 
                                height: '24px', 
                                borderRadius: '50%', 
                                backgroundColor: theme.backgroundMedium,
                                border: 'none',
                                color: theme.textPrimary,
                                cursor: 'pointer'
                              }}
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ color: theme.textPrimary, fontWeight: '500' }}>
                            RM {(item.price * item.quantity).toFixed(2)}
                          </span>
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            style={{ 
                              color: theme.error,
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              fontSize: '1rem'
                            }}
                          >
                            <FaTimesCircle />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div style={{ 
                    borderTop: `2px solid ${theme.border}`, 
                    paddingTop: '1rem', 
                    marginBottom: '1rem' 
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span style={{ color: theme.textSecondary }}>Subtotal:</span>
                      <span style={{ color: theme.textPrimary, fontWeight: '500' }}>
                        RM {calculateTotal().toFixed(2)}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span style={{ color: theme.textSecondary }}>Tax (6%):</span>
                      <span style={{ color: theme.textPrimary, fontWeight: '500' }}>
                        RM {(calculateTotal() * 0.06).toFixed(2)}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 'bold' }}>
                      <span style={{ color: theme.textPrimary }}>Total:</span>
                      <span style={{ color: theme.goldPrimary, fontSize: '1.25rem' }}>
                        RM {(calculateTotal() * 1.06).toFixed(2)}
                      </span>
                    </div>
                  </div>
                  
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: theme.textPrimary }}>
                      Payment Method
                    </label>
                    <select
                      value={selectedPaymentMethod}
                      onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                      className="form-input"
                      style={{ 
                        backgroundColor: theme.backgroundMedium, 
                        borderColor: theme.border, 
                        color: theme.textPrimary,
                        width: '100%',
                        padding: '0.75rem'
                      }}
                    >
                      <option value="cash">Cash</option>
                      <option value="card">Credit/Debit Card</option>
                      <option value="duitnow">DuitNow</option>
                      <option value="tng">Touch 'n Go</option>
                    </select>
                  </div>
                  
                  <button 
                    onClick={processTransaction}
                    className="btn btn-primary"
                    style={{ 
                      backgroundColor: theme.goldPrimary, 
                      color: 'white', 
                      width: '100%',
                      padding: '1rem'
                    }}
                    disabled={cart.length === 0}
                  >
                    Process Transaction
                  </button>
                </>
              )}
            </div>

            {/* Receipt Preview */}
            <div className="card" style={{ backgroundColor: theme.backgroundLight, padding: '1.5rem' }}>
              <h3 style={{ color: theme.textPrimary, marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
                <FaReceipt style={{ marginRight: '0.5rem', color: theme.goldPrimary }} />
                Receipt Preview
              </h3>
              
              <div style={{ 
                backgroundColor: theme.backgroundMedium, 
                padding: '1rem', 
                borderRadius: theme.borderRadius,
                fontFamily: 'monospace',
                fontSize: '0.875rem'
              }}>
                <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                  <h4 style={{ color: theme.textPrimary, fontWeight: 'bold', marginBottom: '0.25rem' }}>
                    {company?.name}
                  </h4>
                  <p style={{ color: theme.textSecondary, fontSize: '0.75rem' }}>
                    {company?.address?.street}, {company?.address?.city}
                  </p>
                  <p style={{ color: theme.textSecondary, fontSize: '0.75rem' }}>
                    {new Date().toLocaleString()}
                  </p>
                </div>
                
                <div style={{ marginBottom: '1rem' }}>
                  {cart.length === 0 ? (
                    <p style={{ color: theme.textTertiary, textAlign: 'center', fontStyle: 'italic' }}>
                      No items in cart
                    </p>
                  ) : (
                    cart.map(item => (
                      <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                        <span style={{ color: theme.textSecondary }}>
                          {item.name} x{item.quantity}
                        </span>
                        <span style={{ color: theme.textPrimary }}>
                          RM {(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))
                  )}
                </div>
                
                <div style={{ borderTop: `1px solid ${theme.border}`, paddingTop: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span style={{ color: theme.textSecondary }}>Subtotal:</span>
                    <span style={{ color: theme.textPrimary }}>
                      RM {cart.length > 0 ? calculateTotal().toFixed(2) : '0.00'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span style={{ color: theme.textSecondary }}>Tax (6%):</span>
                    <span style={{ color: theme.textPrimary }}>
                      RM {cart.length > 0 ? (calculateTotal() * 0.06).toFixed(2) : '0.00'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', borderTop: `1px solid ${theme.border}`, paddingTop: '0.5rem' }}>
                    <span style={{ color: theme.textPrimary }}>TOTAL:</span>
                    <span style={{ color: theme.goldPrimary }}>
                      RM {cart.length > 0 ? (calculateTotal() * 1.06).toFixed(2) : '0.00'}
                    </span>
                  </div>
                </div>
                
                <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                  <p style={{ color: theme.textSecondary, fontSize: '0.75rem' }}>
                    Cashier: {user?.firstName} {user?.lastName}
                  </p>
                  <p style={{ color: theme.textSecondary, fontSize: '0.75rem', marginTop: '0.5rem' }}>
                    Thank you for your purchase!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Receipt Modal */}
      {showReceipt && currentTransaction && (
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
            maxWidth: '500px',
            width: '90%',
            textAlign: 'center'
          }}>
            <div style={{ 
              backgroundColor: theme.backgroundMedium, 
              padding: '1.5rem', 
              borderRadius: theme.borderRadius,
              fontFamily: 'monospace',
              fontSize: '0.875rem',
              marginBottom: '1rem'
            }}>
              <h3 style={{ color: theme.textPrimary, fontWeight: 'bold', marginBottom: '1rem' }}>
                RECEIPT
              </h3>
              
              <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                <h4 style={{ color: theme.textPrimary, fontWeight: 'bold', marginBottom: '0.25rem' }}>
                  {company?.name}
                </h4>
                <p style={{ color: theme.textSecondary, fontSize: '0.75rem' }}>
                  {company?.address?.street}, {company?.address?.city}
                </p>
                <p style={{ color: theme.textSecondary, fontSize: '0.75rem', marginTop: '0.5rem' }}>
                  Transaction ID: {currentTransaction.id}
                </p>
                <p style={{ color: theme.textSecondary, fontSize: '0.75rem' }}>
                  {new Date(currentTransaction.timestamp).toLocaleString()}
                </p>
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                {currentTransaction.items.map(item => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span style={{ color: theme.textSecondary }}>
                      {item.name} x{item.quantity}
                    </span>
                    <span style={{ color: theme.textPrimary }}>
                      RM {(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              
              <div style={{ borderTop: `1px solid ${theme.border}`, paddingTop: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span style={{ color: theme.textSecondary }}>Subtotal:</span>
                  <span style={{ color: theme.textPrimary }}>
                    RM {calculateTotal().toFixed(2)}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span style={{ color: theme.textSecondary }}>Tax (6%):</span>
                  <span style={{ color: theme.textPrimary }}>
                    RM {(calculateTotal() * 0.06).toFixed(2)}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', borderTop: `1px solid ${theme.border}`, paddingTop: '0.5rem' }}>
                  <span style={{ color: theme.textPrimary }}>TOTAL:</span>
                  <span style={{ color: theme.goldPrimary }}>
                    RM {(calculateTotal() * 1.06).toFixed(2)}
                  </span>
                </div>
                
                <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: theme.textSecondary }}>Payment:</span>
                  <span style={{ color: theme.textPrimary, textTransform: 'capitalize' }}>
                    {currentTransaction.paymentMethod}
                  </span>
                </div>
              </div>
              
              <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                <p style={{ color: theme.textSecondary, fontSize: '0.75rem' }}>
                  Cashier: {currentTransaction.cashier}
                </p>
                <p style={{ color: theme.textSecondary, fontSize: '0.75rem', marginTop: '0.5rem' }}>
                  Thank you for your purchase!
                </p>
              </div>
            </div>
            
            <button
              onClick={() => setShowReceipt(false)}
              className="btn btn-primary"
              style={{ 
                backgroundColor: theme.goldPrimary, 
                color: 'white', 
                width: '100%',
                marginTop: '1rem'
              }}
            >
              Close Receipt
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default POSSystem;