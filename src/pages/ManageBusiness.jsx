import React, { useState, useEffect } from 'react';
import { 
  Package, ShoppingCart, FileText, Tag, BarChart2, Settings, 
  Upload, Download, Search, Filter, Plus, Edit, Trash2, Share2,
  Copy, Check, X, ChevronDown, AlertTriangle, TrendingUp, TrendingDown,
  DollarSign, Percent, Users, Archive, RefreshCw, ExternalLink,
  Box, Layers, FileSpreadsheet, Calendar, Store, Phone, Mail,
  Instagram, Youtube, MessageCircle, Globe, Image, MoreVertical
} from 'lucide-react';

const ManageBusiness = ({ user, products, setProducts, accessories, setAccessories }) => {
  // Active section state
  const [activeSection, setActiveSection] = useState('overview');
  
  // Store & Brand Details State
  const [storeDetails, setStoreDetails] = useState({
    storeName: '',
    brandName: '',
    dbaName: '',
    businessType: '',
    gstin: '',
    cin: '',
    storeAddress: '',
    phone: '',
    whatsapp: '',
    email: '',
    instagram: '',
    youtube: '',
    whatsappGroup: '',
    linkedin: '',
    pinterest: '',
    facebook: '',
    twitter: '',
    logo: null,
    favicon: null
  });

  // Orders State
  const [orders, setOrders] = useState({
    new: [],
    confirmed: [],
    shipmentReady: [],
    inTransit: [],
    completed: [],
    returned: [],
    cancelled: []
  });

  // Financial State
  const [financialData, setFinancialData] = useState({
    amountReceived: 0,
    walletBalance: 0,
    gstPayable: 0,
    pendingPayments: 0
  });

  // Inventory State
  const [lowStockAlerts, setLowStockAlerts] = useState([]);
  const [abandonedCarts, setAbandonedCarts] = useState([]);

  // Categories State
  const [categories, setCategories] = useState([]);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
    parentCategory: '',
    subCategories: []
  });
  const [editingCategory, setEditingCategory] = useState(null);

  // Invoices State
  const [invoices, setInvoices] = useState([]);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  // Coupons State
  const [coupons, setCoupons] = useState([]);
  const [showAddCouponModal, setShowAddCouponModal] = useState(false);
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    discountType: 'percentage',
    discountValue: '',
    minimumPurchase: '',
    maxDiscount: '',
    validFrom: '',
    validUntil: '',
    usageLimit: '',
    usedCount: 0,
    status: 'active',
    applicableProducts: [],
    applicableCategories: []
  });
  const [editingCoupon, setEditingCoupon] = useState(null);

  // Team Members State
  const [teamMembers, setTeamMembers] = useState([]);
  const [showAddTeamMemberModal, setShowAddTeamMemberModal] = useState(false);
  const [newTeamMember, setNewTeamMember] = useState({
    name: '',
    email: '',
    role: 'Standard Member',
    permissions: [],
    isActive: true
  });
  const [editingTeamMember, setEditingTeamMember] = useState(null);

  // Search and Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterSubCategory, setFilterSubCategory] = useState('');

  // Modal States
  const [showStockModal, setShowStockModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [stockOperation, setStockOperation] = useState('in');
  const [stockQuantity, setStockQuantity] = useState('');
  const [stockPrice, setStockPrice] = useState('');
  const [stockMRP, setStockMRP] = useState('');
  const [taxInclusive, setTaxInclusive] = useState(true);

  // Report Generation State
  const [reportType, setReportType] = useState('');
  const [reportDateFrom, setReportDateFrom] = useState('');
  const [reportDateTo, setReportDateTo] = useState('');
  const [generatingReport, setGeneratingReport] = useState(false);

  // Load data on mount
  useEffect(() => {
    loadBusinessData();
    calculateLowStockAlerts();
    calculateFinancialData();
  }, [products, accessories]);

  // Load business data from localStorage
  const loadBusinessData = () => {
    const savedStoreDetails = localStorage.getItem(`storeDetails_${user.userId}`);
    if (savedStoreDetails) {
      setStoreDetails(JSON.parse(savedStoreDetails));
    }

    const savedOrders = localStorage.getItem(`orders_${user.userId}`);
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }

    const savedInvoices = localStorage.getItem(`invoices_${user.userId}`);
    if (savedInvoices) {
      setInvoices(JSON.parse(savedInvoices));
    }

    const savedCoupons = localStorage.getItem(`coupons_${user.userId}`);
    if (savedCoupons) {
      setCoupons(JSON.parse(savedCoupons));
    }

    const savedCategories = localStorage.getItem(`categories_${user.userId}`);
    if (savedCategories) {
      setCategories(JSON.parse(savedCategories));
    }

    const savedTeamMembers = localStorage.getItem(`teamMembers_${user.userId}`);
    if (savedTeamMembers) {
      setTeamMembers(JSON.parse(savedTeamMembers));
    }

    const savedAbandonedCarts = localStorage.getItem(`abandonedCarts_${user.userId}`);
    if (savedAbandonedCarts) {
      setAbandonedCarts(JSON.parse(savedAbandonedCarts));
    }
  };

  // Calculate low stock alerts
  const calculateLowStockAlerts = () => {
    const allItems = [...products, ...accessories];
    const alerts = allItems.filter(item => {
      const threshold = item.lowStockThreshold || 10;
      return (item.stockQuantity || 0) < threshold;
    });
    setLowStockAlerts(alerts);
  };

  // Calculate financial data
  const calculateFinancialData = () => {
    const completedOrders = orders.completed || [];
    const amountReceived = completedOrders.reduce((sum, order) => sum + (order.amount || 0), 0);
    
    const gstPayable = completedOrders.reduce((sum, order) => {
      const gstAmount = (order.amount || 0) * 0.18;
      return sum + gstAmount;
    }, 0);

    setFinancialData({
      amountReceived,
      walletBalance: amountReceived - gstPayable,
      gstPayable,
      pendingPayments: (orders.confirmed?.length || 0) + (orders.shipmentReady?.length || 0)
    });
  };

  // Save store details
  const handleSaveStoreDetails = () => {
    localStorage.setItem(`storeDetails_${user.userId}`, JSON.stringify(storeDetails));
    alert('Store details saved successfully!');
  };

  // Handle Stock In/Out
  const handleStockOperation = () => {
    if (!selectedProduct || !stockQuantity) {
      alert('Please fill in all required fields');
      return;
    }

    const quantity = parseInt(stockQuantity);
    const updatedProduct = { ...selectedProduct };

    if (stockOperation === 'in') {
      updatedProduct.stockQuantity = (updatedProduct.stockQuantity || 0) + quantity;
      if (stockPrice) updatedProduct.price = stockPrice;
      if (stockMRP) updatedProduct.mrp = stockMRP;
    } else {
      if (quantity > (updatedProduct.stockQuantity || 0)) {
        alert('Cannot remove more stock than available');
        return;
      }
      updatedProduct.stockQuantity = (updatedProduct.stockQuantity || 0) - quantity;
    }

    if (products.find(p => p.id === selectedProduct.id)) {
      setProducts(products.map(p => p.id === selectedProduct.id ? updatedProduct : p));
    } else {
      setAccessories(accessories.map(a => a.id === selectedProduct.id ? updatedProduct : a));
    }

    setShowStockModal(false);
    setSelectedProduct(null);
    setStockQuantity('');
    setStockPrice('');
    setStockMRP('');
    alert(`Stock ${stockOperation === 'in' ? 'added' : 'removed'} successfully!`);
  };

  // Category Management
  const handleAddCategory = () => {
    if (!newCategory.name) {
      alert('Please enter category name');
      return;
    }

    const category = {
      id: Date.now().toString(),
      ...newCategory,
      createdAt: new Date().toISOString()
    };

    const updatedCategories = [...categories, category];
    setCategories(updatedCategories);
    localStorage.setItem(`categories_${user.userId}`, JSON.stringify(updatedCategories));
    
    setShowAddCategoryModal(false);
    setNewCategory({
      name: '',
      description: '',
      parentCategory: '',
      subCategories: []
    });
    alert('Category added successfully!');
  };

  const handleDeleteCategory = (categoryId) => {
    if (confirm('Are you sure you want to delete this category?')) {
      const updatedCategories = categories.filter(c => c.id !== categoryId);
      setCategories(updatedCategories);
      localStorage.setItem(`categories_${user.userId}`, JSON.stringify(updatedCategories));
      alert('Category deleted successfully!');
    }
  };

  // Coupon Management
  const handleAddCoupon = () => {
    if (!newCoupon.code || !newCoupon.discountValue) {
      alert('Please fill in required fields');
      return;
    }

    const coupon = {
      id: Date.now().toString(),
      ...newCoupon,
      createdAt: new Date().toISOString()
    };

    const updatedCoupons = [...coupons, coupon];
    setCoupons(updatedCoupons);
    localStorage.setItem(`coupons_${user.userId}`, JSON.stringify(updatedCoupons));
    
    setShowAddCouponModal(false);
    setNewCoupon({
      code: '',
      discountType: 'percentage',
      discountValue: '',
      minimumPurchase: '',
      maxDiscount: '',
      validFrom: '',
      validUntil: '',
      usageLimit: '',
      usedCount: 0,
      status: 'active',
      applicableProducts: [],
      applicableCategories: []
    });
    alert('Coupon created successfully!');
  };

  const handleDeleteCoupon = (couponId) => {
    if (confirm('Are you sure you want to delete this coupon?')) {
      const updatedCoupons = coupons.filter(c => c.id !== couponId);
      setCoupons(updatedCoupons);
      localStorage.setItem(`coupons_${user.userId}`, JSON.stringify(updatedCoupons));
      alert('Coupon deleted successfully!');
    }
  };

  const handleToggleCouponStatus = (couponId) => {
    const updatedCoupons = coupons.map(c => 
      c.id === couponId ? { ...c, status: c.status === 'active' ? 'inactive' : 'active' } : c
    );
    setCoupons(updatedCoupons);
    localStorage.setItem(`coupons_${user.userId}`, JSON.stringify(updatedCoupons));
  };

  // Team Member Management
  const handleAddTeamMember = () => {
    if (!newTeamMember.name || !newTeamMember.email) {
      alert('Please fill in all required fields');
      return;
    }

    const member = {
      id: Date.now().toString(),
      ...newTeamMember,
      addedAt: new Date().toISOString()
    };

    const updatedTeamMembers = [...teamMembers, member];
    setTeamMembers(updatedTeamMembers);
    localStorage.setItem(`teamMembers_${user.userId}`, JSON.stringify(updatedTeamMembers));
    
    setShowAddTeamMemberModal(false);
    setNewTeamMember({
      name: '',
      email: '',
      role: 'Standard Member',
      permissions: [],
      isActive: true
    });
    alert('Team member added successfully!');
  };

  const handleDeleteTeamMember = (memberId) => {
    if (confirm('Are you sure you want to remove this team member?')) {
      const updatedTeamMembers = teamMembers.filter(m => m.id !== memberId);
      setTeamMembers(updatedTeamMembers);
      localStorage.setItem(`teamMembers_${user.userId}`, JSON.stringify(updatedTeamMembers));
      alert('Team member removed successfully!');
    }
  };

  const handleToggleTeamMemberStatus = (memberId) => {
    const updatedTeamMembers = teamMembers.map(m => 
      m.id === memberId ? { ...m, isActive: !m.isActive } : m
    );
    setTeamMembers(updatedTeamMembers);
    localStorage.setItem(`teamMembers_${user.userId}`, JSON.stringify(updatedTeamMembers));
  };

  // Generate Report
  const handleGenerateReport = async () => {
    if (!reportType || !reportDateFrom || !reportDateTo) {
      alert('Please select report type and date range');
      return;
    }

    setGeneratingReport(true);

    setTimeout(() => {
      const reportData = {
        type: reportType,
        dateFrom: reportDateFrom,
        dateTo: reportDateTo,
        generatedAt: new Date().toISOString(),
        data: []
      };

      switch (reportType) {
        case 'orders':
          reportData.data = Object.values(orders).flat();
          break;
        case 'invoices':
          reportData.data = invoices;
          break;
        case 'inventory':
          reportData.data = [...products, ...accessories];
          break;
        case 'sales':
          reportData.data = orders.completed || [];
          break;
        case 'gst':
          reportData.data = calculateGSTReport();
          break;
        case 'coupons':
          reportData.data = coupons;
          break;
        default:
          reportData.data = [];
      }

      const dataStr = JSON.stringify(reportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${reportType}_report_${reportDateFrom}_to_${reportDateTo}.json`;
      link.click();

      setGeneratingReport(false);
      alert('Report generated and downloaded successfully!');
    }, 2000);
  };

  const calculateGSTReport = () => {
    const gstReport = {
      totalSales: 0,
      totalGST: 0,
      gstBreakdown: {}
    };

    (orders.completed || []).forEach(order => {
      const gstRate = order.gstRate || 18;
      const amount = order.amount || 0;
      const gstAmount = amount * (gstRate / 100);

      gstReport.totalSales += amount;
      gstReport.totalGST += gstAmount;

      if (!gstReport.gstBreakdown[gstRate]) {
        gstReport.gstBreakdown[gstRate] = { sales: 0, gst: 0 };
      }

      gstReport.gstBreakdown[gstRate].sales += amount;
      gstReport.gstBreakdown[gstRate].gst += gstAmount;
    });

    return gstReport;
  };

  const getFilteredProducts = () => {
    let filtered = [...products, ...accessories];

    if (searchQuery) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.brandName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.sku?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterCategory) {
      filtered = filtered.filter(item => item.category === filterCategory);
    }

    if (filterSubCategory) {
      filtered = filtered.filter(item => item.subCategory === filterSubCategory);
    }

    return filtered;
  };

  const handleShareProduct = (product) => {
    setSelectedProduct(product);
    setShowShareModal(true);
  };

  const generateShareText = () => {
    if (!selectedProduct) return '';
    
    return `🛍️ *${selectedProduct.name}*\n\n` +
           `Brand: ${selectedProduct.brandName || 'N/A'}\n` +
           `Price: ₹${selectedProduct.price || selectedProduct.mrp || 0}\n` +
           `${selectedProduct.mrp ? `MRP: ₹${selectedProduct.mrp}` : ''}\n` +
           `${selectedProduct.offer ? `Offer: ${selectedProduct.offer}` : ''}\n\n` +
           `Available Stock: ${selectedProduct.stockQuantity || 0}\n\n` +
           `Order now! Contact us for more details.`;
  };

  const copyShareText = () => {
    navigator.clipboard.writeText(generateShareText());
    alert('Product details copied to clipboard!');
  };

  // Render Overview Section
  const renderOverview = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Business Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-md p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Products</p>
              <p className="text-3xl font-bold mt-2">{products.length + accessories.length}</p>
            </div>
            <Package size={40} className="opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow-md p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Amount Received</p>
              <p className="text-3xl font-bold mt-2">₹{financialData.amountReceived.toFixed(2)}</p>
            </div>
            <DollarSign size={40} className="opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg shadow-md p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Total Orders</p>
              <p className="text-3xl font-bold mt-2">
                {Object.values(orders).reduce((sum, arr) => sum + arr.length, 0)}
              </p>
            </div>
            <ShoppingCart size={40} className="opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg shadow-md p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Low Stock Alerts</p>
              <p className="text-3xl font-bold mt-2">{lowStockAlerts.length}</p>
            </div>
            <AlertTriangle size={40} className="opacity-80" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold mb-4">Financial Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Wallet Balance</p>
            <p className="text-2xl font-bold text-gray-900">₹{financialData.walletBalance.toFixed(2)}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">GST Payable</p>
            <p className="text-2xl font-bold text-gray-900">₹{financialData.gstPayable.toFixed(2)}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Pending Payments</p>
            <p className="text-2xl font-bold text-gray-900">{financialData.pendingPayments}</p>
          </div>
        </div>
      </div>

      {lowStockAlerts.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-red-600">Low Stock Alerts</h3>
            <AlertTriangle className="text-red-600" size={24} />
          </div>
          <div className="space-y-2">
            {lowStockAlerts.slice(0, 5).map(item => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-red-50 rounded">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-600">Stock: {item.stockQuantity || 0}</p>
                </div>
                <button
                  onClick={() => {
                    setSelectedProduct(item);
                    setStockOperation('in');
                    setShowStockModal(true);
                  }}
                  className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                >
                  Add Stock
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  // Render Products & Accessories Section
  const renderProductsAccessories = () => {
    const filteredItems = getFilteredProducts();

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Products & Accessories</h2>
          <div className="flex space-x-2">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center">
              <Plus size={16} className="mr-2" />
              Add Product
            </button>
            <button className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 flex items-center">
              <Plus size={16} className="mr-2" />
              Add Accessory
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, brand, or SKU..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Categories</option>
                {[...new Set([...products, ...accessories].map(item => item.category))].map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <select
                value={filterSubCategory}
                onChange={(e) => setFilterSubCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Sub-Categories</option>
                {[...new Set([...products, ...accessories].map(item => item.subCategory))].map(sub => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sub-Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Selling Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MRP</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Credits</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredItems.map(item => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.images && item.images[0] ? (
                        <img src={item.images[0]} alt={item.name} className="h-12 w-12 object-cover rounded" />
                      ) : (
                        <div className="h-12 w-12 bg-gray-200 rounded flex items-center justify-center">
                          <Package size={20} className="text-gray-400" />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{item.name}</div>
                      <div className="text-sm text-gray-500">{item.brandName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.subCategory}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ₹{item.price || item.sellingPrice || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ₹{item.mrp || item.price || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        (item.stockQuantity || 0) < 10 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {item.stockQuantity || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.credits || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setSelectedProduct(item);
                            setStockOperation('in');
                            setShowStockModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-900"
                          title="Stock In"
                        >
                          <TrendingUp size={16} />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedProduct(item);
                            setStockOperation('out');
                            setShowStockModal(true);
                          }}
                          className="text-orange-600 hover:text-orange-900"
                          title="Stock Out"
                        >
                          <TrendingDown size={16} />
                        </button>
                        <button
                          onClick={() => handleShareProduct(item)}
                          className="text-green-600 hover:text-green-900"
                          title="Share"
                        >
                          <Share2 size={16} />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // Render Invoices Section
  const renderInvoices = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Invoices</h2>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center">
          <Plus size={16} className="mr-2" />
          Create Invoice
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-sm text-gray-600">Total Invoices</p>
          <p className="text-2xl font-bold text-gray-900">{invoices.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-sm text-gray-600">Paid</p>
          <p className="text-2xl font-bold text-green-600">
            {invoices.filter(inv => inv.status === 'paid').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-sm text-gray-600">Pending</p>
          <p className="text-2xl font-bold text-orange-600">
            {invoices.filter(inv => inv.status === 'pending').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-sm text-gray-600">Overdue</p>
          <p className="text-2xl font-bold text-red-600">
            {invoices.filter(inv => inv.status === 'overdue').length}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice #</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {invoices.length > 0 ? (
                invoices.map(invoice => (
                  <tr key={invoice.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{invoice.invoiceNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {invoice.customerName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(invoice.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ₹{invoice.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                        invoice.status === 'pending' ? 'bg-orange-100 text-orange-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-3">View</button>
                      <button className="text-green-600 hover:text-green-900">Download</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    No invoices found. Create your first invoice!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // Render Coupons Section
  const renderCoupons = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Coupons Management</h2>
        <button
          onClick={() => setShowAddCouponModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
        >
          <Plus size={16} className="mr-2" />
          Create Coupon
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-sm text-gray-600">Total Coupons</p>
          <p className="text-2xl font-bold text-gray-900">{coupons.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-sm text-gray-600">Active</p>
          <p className="text-2xl font-bold text-green-600">
            {coupons.filter(c => c.status === 'active').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-sm text-gray-600">Inactive</p>
          <p className="text-2xl font-bold text-red-600">
            {coupons.filter(c => c.status === 'inactive').length}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {coupons.length > 0 ? (
          coupons.map(coupon => (
            <div key={coupon.id} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{coupon.code}</h3>
                  <p className="text-sm text-gray-600">
                    {coupon.discountType === 'percentage' ? `${coupon.discountValue}% OFF` : `₹${coupon.discountValue} OFF`}
                  </p>
                </div>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  coupon.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {coupon.status}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                {coupon.minimumPurchase && (
                  <p className="text-sm text-gray-600">Min Purchase: ₹{coupon.minimumPurchase}</p>
                )}
                {coupon.maxDiscount && (
                  <p className="text-sm text-gray-600">Max Discount: ₹{coupon.maxDiscount}</p>
                )}
                <p className="text-sm text-gray-600">
                  Valid: {new Date(coupon.validFrom).toLocaleDateString()} - {new Date(coupon.validUntil).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600">
                  Used: {coupon.usedCount} / {coupon.usageLimit || '∞'}
                </p>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => handleToggleCouponStatus(coupon.id)}
                  className="flex-1 px-3 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 text-sm"
                >
                  {coupon.status === 'active' ? 'Deactivate' : 'Activate'}
                </button>
                <button
                  onClick={() => handleDeleteCoupon(coupon.id)}
                  className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-3 text-center py-12 bg-white rounded-lg shadow-md">
            <Tag size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 mb-4">No coupons created yet.</p>
            <button
              onClick={() => setShowAddCouponModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Create Your First Coupon
            </button>
          </div>
        )}
      </div>
    </div>
  );

  // Render Categories Section
  const renderCategories = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Categories Management</h2>
        <button
          onClick={() => setShowAddCategoryModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
        >
          <Plus size={16} className="mr-2" />
          Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-sm text-gray-600">Total Categories</p>
          <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-sm text-gray-600">Parent Categories</p>
          <p className="text-2xl font-bold text-blue-600">
            {categories.filter(c => !c.parentCategory).length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-sm text-gray-600">Sub Categories</p>
          <p className="text-2xl font-bold text-purple-600">
            {categories.filter(c => c.parentCategory).length}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parent Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sub Categories</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categories.length > 0 ? (
                categories.map(category => (
                  <tr key={category.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Layers size={16} className="mr-2 text-gray-400" />
                        <span className="text-sm font-medium text-gray-900">{category.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {category.description || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {category.parentCategory || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {category.subCategories?.length || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    No categories found. Add your first category!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // Render Team Members Section
  const renderTeamMembers = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Team Members</h2>
        <button
          onClick={() => setShowAddTeamMemberModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
        >
          <Plus size={16} className="mr-2" />
          Add Team Member
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-sm text-gray-600">Total Members</p>
          <p className="text-2xl font-bold text-gray-900">{teamMembers.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-sm text-gray-600">Active</p>
          <p className="text-2xl font-bold text-green-600">
            {teamMembers.filter(m => m.isActive).length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-sm text-gray-600">Inactive</p>
          <p className="text-2xl font-bold text-red-600">
            {teamMembers.filter(m => !m.isActive).length}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {teamMembers.length > 0 ? (
                teamMembers.map(member => (
                  <tr key={member.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <Users size={20} className="text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{member.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {member.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {member.role}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        member.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {member.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                      <button
                        onClick={() => handleToggleTeamMemberStatus(member.id)}
                        className="text-orange-600 hover:text-orange-900 mr-3"
                      >
                        {member.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => handleDeleteTeamMember(member.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    No team members found. Add your first team member!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // Render Store Details Section
  const renderStoreDetails = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Store & Brand Details</h2>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={(e) => { e.preventDefault(); handleSaveStoreDetails(); }} className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Store Name</label>
                <input
                  type="text"
                  value={storeDetails.storeName}
                  onChange={(e) => setStoreDetails({...storeDetails, storeName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter store name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Brand Name</label>
                <input
                  type="text"
                  value={storeDetails.brandName}
                  onChange={(e) => setStoreDetails({...storeDetails, brandName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter brand name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">DBA Name</label>
                <input
                  type="text"
                  value={storeDetails.dbaName}
                  onChange={(e) => setStoreDetails({...storeDetails, dbaName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Doing Business As"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Business Type</label>
                <select
                  value={storeDetails.businessType}
                  onChange={(e) => setStoreDetails({...storeDetails, businessType: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Business Type</option>
                  <option value="partnership">Partnership</option>
                  <option value="proprietorship">Proprietorship</option>
                  <option value="llp">LLP</option>
                  <option value="private_limited">Private Limited</option>
                  <option value="public_limited">Public Limited</option>
                  <option value="not_registered">Not Yet Registered</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Legal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">GSTIN</label>
                <input
                  type="text"
                  value={storeDetails.gstin}
                  onChange={(e) => setStoreDetails({...storeDetails, gstin: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter GSTIN"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">CIN</label>
                <input
                  type="text"
                  value={storeDetails.cin}
                  onChange={(e) => setStoreDetails({...storeDetails, cin: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter CIN"
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Store Address</label>
                <textarea
                  value={storeDetails.storeAddress}
                  onChange={(e) => setStoreDetails({...storeDetails, storeAddress: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Enter complete store address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={storeDetails.phone}
                  onChange={(e) => setStoreDetails({...storeDetails, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter phone number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp Number</label>
                <input
                  type="tel"
                  value={storeDetails.whatsapp}
                  onChange={(e) => setStoreDetails({...storeDetails, whatsapp: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter WhatsApp number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={storeDetails.email}
                  onChange={(e) => setStoreDetails({...storeDetails, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter email address"
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Social Media Links</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Instagram</label>
                <input
                  type="url"
                  value={storeDetails.instagram}
                  onChange={(e) => setStoreDetails({...storeDetails, instagram: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Instagram profile URL"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">YouTube</label>
                <input
                  type="url"
                  value={storeDetails.youtube}
                  onChange={(e) => setStoreDetails({...storeDetails, youtube: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="YouTube channel URL"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp Group</label>
                <input
                  type="url"
                  value={storeDetails.whatsappGroup}
                  onChange={(e) => setStoreDetails({...storeDetails, whatsappGroup: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="WhatsApp group invite link"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
                <input
                  type="url"
                  value={storeDetails.linkedin}
                  onChange={(e) => setStoreDetails({...storeDetails, linkedin: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="LinkedIn profile URL"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Facebook</label>
                <input
                  type="url"
                  value={storeDetails.facebook}
                  onChange={(e) => setStoreDetails({...storeDetails, facebook: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Facebook page URL"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">X (Twitter)</label>
                <input
                  type="url"
                  value={storeDetails.twitter}
                  onChange={(e) => setStoreDetails({...storeDetails, twitter: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="X (Twitter) profile URL"
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Branding Assets</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Logo</label>
                <div className="flex items-center space-x-4">
                  <input
                    type="file"
                    id="logo-upload"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setStoreDetails({...storeDetails, logo: reader.result});
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="hidden"
                  />
                  <label
                    htmlFor="logo-upload"
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 cursor-pointer flex items-center"
                  >
                    <Upload size={16} className="mr-2" />
                    Upload Logo
                  </label>
                  {storeDetails.logo && (
                    <img src={storeDetails.logo} alt="Logo" className="h-12 w-12 object-cover rounded" />
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Favicon</label>
                <div className="flex items-center space-x-4">
                  <input
                    type="file"
                    id="favicon-upload"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setStoreDetails({...storeDetails, favicon: reader.result});
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="hidden"
                  />
                  <label
                    htmlFor="favicon-upload"
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 cursor-pointer flex items-center"
                  >
                    <Upload size={16} className="mr-2" />
                    Upload Favicon
                  </label>
                  {storeDetails.favicon && (
                    <img src={storeDetails.favicon} alt="Favicon" className="h-8 w-8 object-cover rounded" />
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Save Store Details
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  // Render Reports Section
  const renderReports = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Reports</h2>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Generate Report</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Report Type</option>
              <option value="orders">Order Report</option>
              <option value="invoices">Invoice Report</option>
              <option value="customers">Customer Report</option>
              <option value="inventory">Product Inventory Report</option>
              <option value="gst">GST Sales Report</option>
              <option value="sales">Daily Sales Summary</option>
              <option value="coupons">Coupon Usage Report</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
            <input
              type="date"
              value={reportDateFrom}
              onChange={(e) => setReportDateFrom(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
            <input
              type="date"
              value={reportDateTo}
              onChange={(e) => setReportDateTo(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={handleGenerateReport}
              disabled={generatingReport}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 flex items-center justify-center"
            >
              {generatingReport ? (
                <>
                  <RefreshCw size={16} className="mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Download size={16} className="mr-2" />
                  Generate
                </>
              )}
            </button>
          </div>
        </div>

        <div>
          <h4 className="text-md font-semibold mb-3">Quick Reports</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left">
              <FileText size={20} className="mb-2 text-blue-600" />
              <p className="text-sm font-medium">Today's Sales</p>
            </button>
            <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left">
              <BarChart2 size={20} className="mb-2 text-green-600" />
              <p className="text-sm font-medium">This Month</p>
            </button>
            <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left">
              <Percent size={20} className="mb-2 text-purple-600" />
              <p className="text-sm font-medium">GST Report</p>
            </button>
            <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left">
              <Box size={20} className="mb-2 text-orange-600" />
              <p className="text-sm font-medium">Stock Report</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Render Orders Section
  const renderOrders = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Orders Management</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {Object.entries(orders).map(([status, orderList]) => (
          <div key={status} className="bg-white rounded-lg shadow-md p-4">
            <p className="text-sm text-gray-600 mb-1 capitalize">{status.replace(/([A-Z])/g, ' $1')}</p>
            <p className="text-2xl font-bold">{orderList.length}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 border-b">
          <div className="flex items-center space-x-4">
            <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">All Orders</option>
              <option value="new">New</option>
              <option value="confirmed">Confirmed</option>
              <option value="shipmentReady">Shipment Ready</option>
              <option value="inTransit">In Transit</option>
              <option value="completed">Completed</option>
              <option value="returned">Returned</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <input
              type="text"
              placeholder="Search orders..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Object.values(orders).flat().slice(0, 10).map(order => (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{order.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.customerName || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.date || new Date().toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ₹{order.amount || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {order.status || 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">View</button>
                    <button className="text-green-600 hover:text-green-900">Print</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // Stock Modal
  const renderStockModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">
            {stockOperation === 'in' ? 'Stock In' : 'Stock Out'}
          </h3>
          <button
            onClick={() => setShowStockModal(false)}
            className="p-1 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-gray-700">Product: {selectedProduct?.name}</p>
            <p className="text-sm text-gray-600">Current Stock: {selectedProduct?.stockQuantity || 0}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
            <input
              type="number"
              value={stockQuantity}
              onChange={(e) => setStockQuantity(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter quantity"
              min="1"
            />
          </div>

          {stockOperation === 'in' && (
            <>
              <div>
                <label className="flex items-center mb-3">
                  <input
                    type="checkbox"
                    checked={taxInclusive}
                    onChange={(e) => setTaxInclusive(e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Tax Inclusive Price</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Selling Price (₹)</label>
                <input
                  type="number"
                  value={stockPrice}
                  onChange={(e) => setStockPrice(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter selling price"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">MRP (₹)</label>
                <input
                  type="number"
                  value={stockMRP}
                  onChange={(e) => setStockMRP(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter MRP"
                  step="0.01"
                />
              </div>
            </>
          )}

          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowStockModal(false)}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={handleStockOperation}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {stockOperation === 'in' ? 'Add Stock' : 'Remove Stock'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Share Modal
  const renderShareModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Share Product</h3>
          <button
            onClick={() => setShowShareModal(false)}
            className="p-1 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          {selectedProduct?.images && selectedProduct.images[0] && (
            <img
              src={selectedProduct.images[0]}
              alt={selectedProduct.name}
              className="w-full h-48 object-cover rounded-lg"
            />
          )}

          <div className="p-4 bg-gray-50 rounded-lg">
            <pre className="text-sm whitespace-pre-wrap">{generateShareText()}</pre>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={copyShareText}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center"
            >
              <Copy size={16} className="mr-2" />
              Copy Text
            </button>
            <button
              onClick={() => {
                const text = encodeURIComponent(generateShareText());
                window.open(`https://wa.me/?text=${text}`, '_blank');
              }}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center justify-center"
            >
              <MessageCircle size={16} className="mr-2" />
              WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Add Category Modal
  const renderAddCategoryModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Add Category</h3>
          <button
            onClick={() => setShowAddCategoryModal(false)}
            className="p-1 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category Name *</label>
            <input
              type="text"
              value={newCategory.name}
              onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter category name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={newCategory.description}
              onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Enter category description"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Parent Category (Optional)</label>
            <select
              value={newCategory.parentCategory}
              onChange={(e) => setNewCategory({...newCategory, parentCategory: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">None (Top Level)</option>
              {categories.filter(c => !c.parentCategory).map(cat => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowAddCategoryModal(false)}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={handleAddCategory}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Add Category
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Add Coupon Modal
  const renderAddCouponModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Create Coupon</h3>
          <button
            onClick={() => setShowAddCouponModal(false)}
            className="p-1 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Coupon Code *</label>
              <input
                type="text"
                value={newCoupon.code}
                onChange={(e) => setNewCoupon({...newCoupon, code: e.target.value.toUpperCase()})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., SAVE20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Discount Type *</label>
              <select
                value={newCoupon.discountType}
                onChange={(e) => setNewCoupon({...newCoupon, discountType: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount (₹)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Discount Value *</label>
              <input
                type="number"
                value={newCoupon.discountValue}
                onChange={(e) => setNewCoupon({...newCoupon, discountValue: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={newCoupon.discountType === 'percentage' ? 'e.g., 20' : 'e.g., 500'}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Purchase</label>
              <input
                type="number"
                value={newCoupon.minimumPurchase}
                onChange={(e) => setNewCoupon({...newCoupon, minimumPurchase: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Minimum order value"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Max Discount (₹)</label>
              <input
                type="number"
                value={newCoupon.maxDiscount}
                onChange={(e) => setNewCoupon({...newCoupon, maxDiscount: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Maximum discount cap"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Usage Limit</label>
              <input
                type="number"
                value={newCoupon.usageLimit}
                onChange={(e) => setNewCoupon({...newCoupon, usageLimit: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Total usage limit"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Valid From *</label>
              <input
                type="date"
                value={newCoupon.validFrom}
                onChange={(e) => setNewCoupon({...newCoupon, validFrom: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Valid Until *</label>
              <input
                type="date"
                value={newCoupon.validUntil}
                onChange={(e) => setNewCoupon({...newCoupon, validUntil: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowAddCouponModal(false)}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={handleAddCoupon}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Create Coupon
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Add Team Member Modal
  const renderAddTeamMemberModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Add Team Member</h3>
          <button
            onClick={() => setShowAddTeamMemberModal(false)}
            className="p-1 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
            <input
              type="text"
              value={newTeamMember.name}
              onChange={(e) => setNewTeamMember({...newTeamMember, name: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter member name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
            <input
              type="email"
              value={newTeamMember.email}
              onChange={(e) => setNewTeamMember({...newTeamMember, email: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter email address"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Role *</label>
            <select
              value={newTeamMember.role}
              onChange={(e) => setNewTeamMember({...newTeamMember, role: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Standard Member">Standard Member</option>
              <option value="Premium Member">Premium Member</option>
              <option value="Manager">Manager</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowAddTeamMemberModal(false)}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={handleAddTeamMember}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Add Member
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-8xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Manage Business</h1>
            <div className="flex items-center space-x-4">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                <RefreshCw size={16} className="inline mr-2" />
                Sync Data
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-8xl mx-auto px-4">
          <div className="flex space-x-1 overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart2 },
              { id: 'products', label: 'Products & Accessories', icon: Package },
              { id: 'orders', label: 'Orders', icon: ShoppingCart },
              { id: 'invoices', label: 'Invoices', icon: FileText },
              { id: 'coupons', label: 'Coupons', icon: Tag },
              { id: 'categories', label: 'Categories', icon: Layers },
              { id: 'team', label: 'Team Members', icon: Users },
              { id: 'store', label: 'Store Details', icon: Store },
              { id: 'reports', label: 'Reports', icon: BarChart2 }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id)}
                className={`flex items-center px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeSection === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                <tab.icon size={16} className="mr-2" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-8xl mx-auto px-4 py-8">
        {activeSection === 'overview' && renderOverview()}
        {activeSection === 'products' && renderProductsAccessories()}
        {activeSection === 'orders' && renderOrders()}
        {activeSection === 'invoices' && renderInvoices()}
        {activeSection === 'coupons' && renderCoupons()}
        {activeSection === 'categories' && renderCategories()}
        {activeSection === 'team' && renderTeamMembers()}
        {activeSection === 'store' && renderStoreDetails()}
        {activeSection === 'reports' && renderReports()}
      </div>

      {/* Modals */}
      {showStockModal && renderStockModal()}
      {showShareModal && renderShareModal()}
      {showAddCategoryModal && renderAddCategoryModal()}
      {showAddCouponModal && renderAddCouponModal()}
      {showAddTeamMemberModal && renderAddTeamMemberModal()}
    </div>
  );
};

export default ManageBusiness;