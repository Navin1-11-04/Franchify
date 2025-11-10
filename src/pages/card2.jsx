import React, { useState, useEffect, useRef } from 'react';
import { 
  Menu, X, ChevronDown, ChevronUp, Search, Heart, Plus,
  Star, Share2, Play, User, Upload, CheckCircle,
  Instagram, Youtube, Linkedin, Twitter,
  Eye, ShoppingCart, Copy, Check, Trash2, Package,
  MapPin, CreditCard, Smartphone, Wallet, ArrowLeft,
  Download, Clock, Truck, Home as HomeIcon
} from 'lucide-react';

// Products data
const productsData = [
  {
    id: 1,
    name: 'Classic Formal Shirt',
    brand: 'Engineers',
    price: 1299,
    originalPrice: 1599,
    rating: 4.5,
    reviews: 128,
    fit: 'Slim Fit',
    type: 'Formal',
    category: 'men',
    colors: ['White', 'Blue', 'Black'],
    sizes: ['S', 'M', 'L', 'XL'],
    images: [
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?w=400&h=500&fit=crop'
    ],
    videoUrl: 'https://www.instagram.com/p/CQ8XJ2vJ_5d/',
    description: 'A classic formal shirt perfect for office wear and business meetings.',
    material: '100% Cotton',
    care: 'Machine wash cold',
    offers: '10% off on first purchase',
    bankOffers: '5% cashback on select cards'
  },
  {
    id: 2,
    name: 'Casual Denim Jeans',
    brand: 'Engineers',
    price: 1999,
    originalPrice: 2499,
    rating: 4.3,
    reviews: 89,
    fit: 'Regular Fit',
    type: 'Casual',
    category: 'men',
    colors: ['Blue', 'Black', 'Grey'],
    sizes: ['28', '30', '32', '34', '36'],
    images: [
      'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1516252635089-856262a5a6b4?w=400&h=500&fit=crop'
    ],
    videoUrl: 'https://www.instagram.com/p/CQ8XJ2vJ_5d/',
    description: 'Comfortable denim jeans for everyday wear.',
    material: '98% Cotton, 2% Elastane',
    care: 'Machine wash cold',
    offers: 'Buy 2 get 1 free',
    bankOffers: '10% cashback on select cards'
  },
  {
    id: 3,
    name: 'Elegant Evening Dress',
    brand: 'Engineers',
    price: 2999,
    originalPrice: 3999,
    rating: 4.7,
    reviews: 56,
    fit: 'Body Fit',
    type: 'Party Wear',
    category: 'women',
    colors: ['Red', 'Black', 'Navy'],
    sizes: ['XS', 'S', 'M', 'L'],
    images: [
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1572804013652-2f5e0a2efee2?w=400&h=500&fit=crop'
    ],
    videoUrl: 'https://www.instagram.com/p/CQ8XJ2vJ_5d/',
    description: 'Stunning evening dress for special occasions.',
    material: 'Polyester Blend',
    care: 'Dry clean only',
    offers: '15% off on first purchase',
    bankOffers: 'No cost EMI available'
  }
];

// Shopping Cart Page Component
const ShoppingCartPage = ({ setCurrentPage, cartItems, setCartItems }) => {
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const calculateTotals = () => {
    const totalMRP = cartItems.reduce((sum, item) => sum + (item.originalPrice * item.quantity), 0);
    const discount = cartItems.reduce((sum, item) => sum + ((item.originalPrice - item.price) * item.quantity), 0);
    const gst = (totalMRP - discount) * 0.18;
    const total = totalMRP - discount + gst;
    return { totalMRP, discount, gst, total };
  };

  const { totalMRP, discount, gst, total } = calculateTotals();

  const handleRemoveItem = (item) => {
    setItemToRemove(item);
    setShowRemoveModal(true);
  };

  const confirmRemove = () => {
    setCartItems(cartItems.filter(item => item.id !== itemToRemove.id));
    setShowRemoveModal(false);
    setItemToRemove(null);
  };

  const moveToWishlist = () => {
    setCartItems(cartItems.filter(item => item.id !== itemToRemove.id));
    setShowRemoveModal(false);
    setItemToRemove(null);
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 bg-white z-40 border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <button onClick={() => setMenuOpen(!menuOpen)} className="p-2">
                {menuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <h1 className="text-xl font-bold">Shopping Cart</h1>
            </div>
            <div className="flex items-center gap-2">
              <ShoppingCart size={20} />
              <span className="font-semibold">{cartItems.length}</span>
            </div>
          </div>
        </div>
        
        {menuOpen && (
          <div className="bg-white border-t border-gray-200 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 py-2">
              <button onClick={() => setCurrentPage('orderSummary')} className="block w-full text-left px-4 py-2 hover:bg-gray-100 font-semibold">Order Summary</button>
              <button onClick={() => setCurrentPage('orderHistory')} className="block w-full text-left px-4 py-2 hover:bg-gray-100 font-semibold">Order History</button>
              <button onClick={() => setCurrentPage('orderTracking')} className="block w-full text-left px-4 py-2 hover:bg-gray-100 font-semibold">Order Tracking</button>
            </div>
          </div>
        )}
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.length === 0 ? (
              <div className="bg-white rounded-lg p-12 text-center">
                <ShoppingCart size={64} className="mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl font-bold mb-2">Your cart is empty</h3>
                <p className="text-gray-600 mb-4">Add items to get started</p>
                <button onClick={() => setCurrentPage('all')} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Continue Shopping
                </button>
              </div>
            ) : (
              cartItems.map((item) => (
                <div key={item.id} className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex gap-4">
                    <img src={item.images[0]} alt={item.name} className="w-24 h-24 object-cover rounded" />
                    <div className="flex-1">
                      <h3 className="font-bold">{item.name}</h3>
                      <p className="text-sm text-gray-600">Size: {item.selectedSize} | Color: {item.selectedColor}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="font-bold text-lg">₹{item.price}</span>
                        <span className="text-sm text-gray-500 line-through">₹{item.originalPrice}</span>
                        <span className="text-sm text-green-600 font-semibold">
                          {Math.round((1 - item.price / item.originalPrice) * 100)}% OFF
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mt-3">
                        <div className="flex items-center border border-gray-300 rounded">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-3 py-1 hover:bg-gray-100">-</button>
                          <span className="px-4 py-1 border-x">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-3 py-1 hover:bg-gray-100">+</button>
                        </div>
                        <button onClick={() => handleRemoveItem(item)} className="text-red-600 text-sm font-semibold hover:underline">Remove</button>
                        <button className="text-blue-600 text-sm font-semibold hover:underline">Move to Wishlist</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 shadow-sm sticky top-24">
              <h3 className="text-lg font-bold mb-4">Order Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total MRP</span>
                  <span className="font-semibold">₹{totalMRP.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span className="font-semibold">-₹{discount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">GST (18%)</span>
                  <span className="font-semibold">₹{gst.toFixed(2)}</span>
                </div>
                <div className="border-t pt-3 flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>
              <button 
                onClick={() => setCurrentPage('checkout')}
                disabled={cartItems.length === 0}
                className="w-full mt-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-semibold"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Remove Confirmation Modal */}
      {showRemoveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Remove Item?</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to remove this item from your cart?</p>
            <div className="flex gap-3">
              <button onClick={confirmRemove} className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold">
                Delete
              </button>
              <button onClick={moveToWishlist} className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-semibold">
                Move to Wishlist
              </button>
              <button onClick={() => setShowRemoveModal(false)} className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-semibold">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Checkout Page Component
const CheckoutPage = ({ setCurrentPage, cartItems }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('card');

  const calculateTotals = () => {
    const totalMRP = cartItems.reduce((sum, item) => sum + (item.originalPrice * item.quantity), 0);
    const discount = cartItems.reduce((sum, item) => sum + ((item.originalPrice - item.price) * item.quantity), 0);
    const gst = (totalMRP - discount) * 0.18;
    const total = totalMRP - discount + gst;
    return { totalMRP, discount, gst, total };
  };

  const { totalMRP, discount, gst, total } = calculateTotals();

  const handleSubmit = (e) => {
    e.preventDefault();
    setCurrentPage('orderSummary');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 bg-white z-40 border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <button onClick={() => setCurrentPage('cart')} className="p-2">
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-xl font-bold">Checkout</h1>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Summary */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="bg-white rounded-lg p-6 shadow-sm sticky top-24">
              <h3 className="text-lg font-bold mb-4">Cart Summary</h3>
              <div className="space-y-3 mb-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <img src={item.images[0]} alt={item.name} className="w-16 h-16 object-cover rounded" />
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{item.name}</p>
                      <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                      <p className="text-sm font-bold">₹{item.price * item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total MRP</span>
                  <span className="font-semibold">₹{totalMRP.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount</span>
                  <span className="font-semibold">-₹{discount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">GST (18%)</span>
                  <span className="font-semibold">₹{gst.toFixed(2)}</span>
                </div>
                <div className="border-t pt-2 flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>
              <button onClick={handleSubmit} className="w-full mt-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold">
                Complete Purchase
              </button>
            </div>
          </div>

          {/* Forms */}
          <div className="lg:col-span-2 order-1 lg:order-2 space-y-6">
            {/* Delivery Details */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-bold mb-4">Delivery Details</h3>
              <form className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Address"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="md:col-span-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="City"
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="State"
                  value={formData.state}
                  onChange={(e) => setFormData({...formData, state: e.target.value})}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Zip Code"
                  value={formData.zipCode}
                  onChange={(e) => setFormData({...formData, zipCode: e.target.value})}
                  className="md:col-span-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </form>
            </div>

            {/* Payment Section */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-bold mb-4">Payment Method</h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={(e) => setPaymentMethod(e.target.value)} />
                  <CreditCard size={20} />
                  <span className="font-semibold">Card Payment</span>
                </label>
                <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input type="radio" name="payment" value="upi" checked={paymentMethod === 'upi'} onChange={(e) => setPaymentMethod(e.target.value)} />
                  <Smartphone size={20} />
                  <span className="font-semibold">UPI (Google Pay, PhonePe, Paytm)</span>
                </label>
                <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input type="radio" name="payment" value="wallet" checked={paymentMethod === 'wallet'} onChange={(e) => setPaymentMethod(e.target.value)} />
                  <Wallet size={20} />
                  <span className="font-semibold">Platform Wallet</span>
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button onClick={() => setCurrentPage('all')} className="flex-1 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-semibold">
                Continue Shopping
              </button>
              <button onClick={handleSubmit} className="flex-1 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold">
                Pay Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Order Summary Page Component
const OrderSummaryPage = ({ setCurrentPage, orderDetails }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 bg-white z-40 border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-xl font-bold">Order Summary</h1>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg p-6 shadow-sm mb-6 text-center">
          <CheckCircle size={64} className="mx-auto mb-4 text-green-600" />
          <h2 className="text-2xl font-bold mb-2">Order Placed Successfully!</h2>
          <p className="text-gray-600">Thank you for your purchase</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Order Info */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-bold mb-4">Order Information</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Delivery Date</p>
                  <p className="font-semibold">Nov 12, 2025</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Order ID</p>
                  <p className="font-semibold">#ORD-2024-001</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Payment Method</p>
                  <p className="font-semibold">Card Payment</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Delivery Address</p>
                  <p className="font-semibold">123 Main St, City, State 12345</p>
                </div>
              </div>
            </div>

            {/* Ordered Items */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-bold mb-4">Ordered Items</h3>
              <div className="space-y-4">
                {productsData.slice(0, 2).map((item) => (
                  <div key={item.id} className="flex gap-4 pb-4 border-b last:border-b-0">
                    <img src={item.images[0]} alt={item.name} className="w-20 h-20 object-cover rounded" />
                    <div className="flex-1">
                      <h4 className="font-semibold">{item.name}</h4>
                      <p className="text-sm text-gray-600">Size: M | Quantity: 1</p>
                      <p className="font-bold mt-1">₹{item.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Billing Details */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 shadow-sm sticky top-24">
              <h3 className="text-lg font-bold mb-4">Billing Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">₹3,298</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold text-green-600">FREE</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-semibold">₹594</span>
                </div>
                <div className="border-t pt-3 flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>₹3,892</span>
                </div>
              </div>
              <div className="space-y-3 mt-6">
                <button onClick={() => setCurrentPage('orderTracking')} className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold">
                  Track Order
                </button>
                <button onClick={() => setCurrentPage('all')} className="w-full py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-semibold">
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Order History Page Component
const OrderHistoryPage = ({ setCurrentPage }) => {
  const [filter, setFilter] = useState('all');
  
  const orders = [
    { id: 1, productName: 'Classic Formal Shirt', orderId: '#ORD-001', date: 'Nov 1, 2025', status: 'Completed', price: 1299, image: productsData[0].images[0] },
    { id: 2, productName: 'Casual Denim Jeans', orderId: '#ORD-002', date: 'Nov 3, 2025', status: 'Processing', price: 1999, image: productsData[1].images[0] },
    { id: 3, productName: 'Elegant Evening Dress', orderId: '#ORD-003', date: 'Oct 28, 2025', status: 'Cancelled', price: 2999, image: productsData[2].images[0] }
  ];

  const filteredOrders = filter === 'all' ? orders : orders.filter(o => o.status.toLowerCase() === filter);

  const getStatusColor = (status) => {
    switch(status) {
      case 'Completed': return 'text-green-600 bg-green-50';
      case 'Processing': return 'text-blue-600 bg-blue-50';
      case 'Cancelled': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 bg-white z-40 border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-xl font-bold">Order History</h1>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Orders</option>
            <option value="completed">Completed</option>
            <option value="processing">Processing</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex gap-4 flex-1">
                  <img src={order.image} alt={order.productName} className="w-20 h-20 object-cover rounded" />
                  <div className="flex-1">
                    <h3 className="font-semibold">{order.productName}</h3>
                    <p className="text-sm text-gray-600">{order.orderId}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">{order.date}</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mt-2 ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                  <p className="font-bold mt-2">₹{order.price}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Order Tracking Page Component
const OrderTrackingPage = ({ setCurrentPage }) => {
  const trackingStages = [
    { label: 'Order Placed', completed: true, date: 'Nov 5, 2025 10:30 AM' },
    { label: 'Arrived at Courier Warehouse', completed: true, date: 'Nov 6, 2025 2:15 PM' },
    { label: 'Out for Delivery', completed: true, date: 'Nov 7, 2025 8:00 AM' },
    { label: 'Products Delivered', completed: false, date: 'Expected: Nov 8, 2025' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 bg-white z-40 border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold">Order Details</h1>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-semibold">
              <Download size={18} />
              Download Invoice
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Order Information */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-bold mb-4">Order Information</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Order Number</p>
                  <p className="font-semibold">#ORD-2024-001</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Order Placed Date</p>
                  <p className="font-semibold">Nov 5, 2025</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Order Delivered Date</p>
                  <p className="font-semibold">Expected: Nov 8, 2025</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Number of Items</p>
                  <p className="font-semibold">2 Items</p>
                </div>
              </div>
            </div>

            {/* Order Tracking */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-bold mb-6">Order Tracking</h3>
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                <div className="space-y-6">
                  {trackingStages.map((stage, index) => (
                    <div key={index} className="relative flex items-start gap-4">
                      <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center ${
                        stage.completed ? 'bg-blue-600' : 'bg-gray-300'
                      }`}>
                        {stage.completed && <CheckCircle size={20} className="text-white" />}
                      </div>
                      <div className="flex-1 pb-6">
                        <h4 className={`font-semibold ${stage.completed ? 'text-gray-900' : 'text-gray-500'}`}>
                          {stage.label}
                        </h4>
                        <p className="text-sm text-gray-600">{stage.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Items from Order */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-bold mb-4">Items from the Order</h3>
              <div className="space-y-4">
                {productsData.slice(0, 2).map((item, index) => (
                  <div key={item.id} className={`flex gap-4 pb-4 ${index !== 1 ? 'border-b' : ''}`}>
                    <img src={item.images[0]} alt={item.name} className="w-20 h-20 object-cover rounded" />
                    <div className="flex-1">
                      <h4 className="font-semibold">{item.name}</h4>
                      <p className="text-sm text-gray-600">Color: {item.colors[0]} | Quantity: 1</p>
                      <p className="font-bold mt-1">₹{item.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Billing Details */}
          <div className="lg:col-span-1">
            <div className="bg-gray-100 rounded-lg p-6 shadow-sm sticky top-24">
              <h3 className="text-lg font-bold mb-4">Billing Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-700">Total MRP</span>
                  <span className="font-semibold">₹4,098</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span className="font-semibold">-₹800</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">GST (18%)</span>
                  <span className="font-semibold">₹594</span>
                </div>
                <div className="border-t border-gray-300 pt-3 flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>₹3,892</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main App Component
const FashionEcomApp = () => {
  const [currentPage, setCurrentPage] = useState('landing');
  const [cartItems, setCartItems] = useState([
    {
      ...productsData[0],
      quantity: 1,
      selectedSize: 'M',
      selectedColor: 'White'
    },
    {
      ...productsData[1],
      quantity: 2,
      selectedSize: '32',
      selectedColor: 'Blue'
    }
  ]);

  const renderPage = () => {
    switch(currentPage) {
      case 'cart':
        return <ShoppingCartPage setCurrentPage={setCurrentPage} cartItems={cartItems} setCartItems={setCartItems} />;
      case 'checkout':
        return <CheckoutPage setCurrentPage={setCurrentPage} cartItems={cartItems} />;
      case 'orderSummary':
        return <OrderSummaryPage setCurrentPage={setCurrentPage} />;
      case 'orderHistory':
        return <OrderHistoryPage setCurrentPage={setCurrentPage} />;
      case 'orderTracking':
        return <OrderTrackingPage setCurrentPage={setCurrentPage} />;
      default:
        return (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-8">Fashion E-Commerce Platform</h1>
              <div className="grid grid-cols-2 gap-4 max-w-md">
                <button onClick={() => setCurrentPage('cart')} className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <ShoppingCart size={32} className="mx-auto mb-2" />
                  <p className="font-semibold">Shopping Cart</p>
                </button>
                <button onClick={() => setCurrentPage('checkout')} className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <CreditCard size={32} className="mx-auto mb-2" />
                  <p className="font-semibold">Checkout</p>
                </button>
                <button onClick={() => setCurrentPage('orderSummary')} className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <CheckCircle size={32} className="mx-auto mb-2" />
                  <p className="font-semibold">Order Summary</p>
                </button>
                <button onClick={() => setCurrentPage('orderHistory')} className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <Package size={32} className="mx-auto mb-2" />
                  <p className="font-semibold">Order History</p>
                </button>
                <button onClick={() => setCurrentPage('orderTracking')} className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow col-span-2">
                  <Truck size={32} className="mx-auto mb-2" />
                  <p className="font-semibold">Order Tracking</p>
                </button>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Assistant:wght@200;300;400;500;600;700;800&display=swap');
        
        * {
          font-family: 'Assistant', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
        }
        
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      {renderPage()}
    </div>
  );
};

export default FashionEcomApp;