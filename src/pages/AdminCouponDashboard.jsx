import React, { useState, useEffect } from 'react';
import { 
  X, Check, XCircle, Edit, Trash2, Eye, Download, Filter, Search, 
  TrendingUp, DollarSign, Tag, Users, Calendar, AlertCircle, 
  Clock, BarChart3, PieChart, Activity, Bell, Shield, FileText,
  CheckCircle, RefreshCw, ChevronDown, ChevronUp
} from 'lucide-react';

function AdminCouponDashboard({ adminUser }) {
  const [activeTab, setActiveTab] = useState('pending');
  const [allCoupons, setAllCoupons] = useState([]);
  const [pendingCoupons, setPendingCoupons] = useState([]);
  const [approvedCoupons, setApprovedCoupons] = useState([]);
  const [rejectedCoupons, setRejectedCoupons] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showAuditLogs, setShowAuditLogs] = useState(false);
  const [auditLogs, setAuditLogs] = useState([]);
  const [expandedCard, setExpandedCard] = useState(null);

  // Analytics State
  const [analytics, setAnalytics] = useState({
    totalRedemptions: 0,
    totalDiscountGiven: 0,
    totalRevenueImpact: 0,
    topCoupons: []
  });

  // Settings State
  const [settings, setSettings] = useState({
    defaultExpiryPeriod: 30,
    defaultDiscountType: 'percentage',
    maxDiscountLimit: 1000,
    allowStacking: false,
    customerEligibility: 'all',
    expirationAlert: true,
    expirationAlertDays: 5,
    usageLimitAlert: true,
    usageLimitPercentage: 90,
    newCouponAlert: true
  });

  // Editing Coupon State
  const [editForm, setEditForm] = useState({
    couponCode: '',
    discountType: 'percentage',
    discountPercentage: '',
    maxDiscountAmount: '',
    minOrderAmount: '',
    expiryDate: '',
    usageLimit: '',
    usagePerCustomer: '',
    status: 'active'
  });

  // Load all coupons from all brand owners
  useEffect(() => {
    loadAllCoupons();
    loadAuditLogs();
    calculateAnalytics();
  }, []);

  const loadAllCoupons = () => {
    // Get all coupons from localStorage
    const allBrandCoupons = [];
    
    // Iterate through localStorage to find all coupon entries
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('coupons_')) {
        const brandId = key.replace('coupons_', '');
        const coupons = JSON.parse(localStorage.getItem(key) || '[]');
        
        // Add brand info to each coupon
        const couponsWithBrand = coupons.map(coupon => ({
          ...coupon,
          brandId: brandId,
          brandName: getBrandName(brandId)
        }));
        
        allBrandCoupons.push(...couponsWithBrand);
      }
    }

    setAllCoupons(allBrandCoupons);
    
    // Categorize coupons
    setPendingCoupons(allBrandCoupons.filter(c => c.approvalStatus === 'pending'));
    setApprovedCoupons(allBrandCoupons.filter(c => c.approvalStatus === 'approved'));
    setRejectedCoupons(allBrandCoupons.filter(c => c.approvalStatus === 'rejected'));
  };

  const getBrandName = (brandId) => {
    // Try to get brand name from user data
    const userDataKey = `user_${brandId}`;
    const userData = localStorage.getItem(userDataKey);
    if (userData) {
      const user = JSON.parse(userData);
      return user.name || `Brand ${brandId}`;
    }
    return `Brand ${brandId}`;
  };

  const loadAuditLogs = () => {
    const logs = JSON.parse(localStorage.getItem('coupon_audit_logs') || '[]');
    setAuditLogs(logs);
  };

  const addAuditLog = (action, couponCode, reason = '') => {
    const newLog = {
      id: Date.now().toString(),
      actionType: action,
      couponCode: couponCode,
      adminName: adminUser?.name || 'Admin',
      timestamp: new Date().toISOString(),
      reason: reason
    };

    const logs = JSON.parse(localStorage.getItem('coupon_audit_logs') || '[]');
    logs.unshift(newLog);
    localStorage.setItem('coupon_audit_logs', JSON.stringify(logs));
    setAuditLogs(logs);
  };

  const calculateAnalytics = () => {
    const allBrandCoupons = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('coupons_')) {
        const coupons = JSON.parse(localStorage.getItem(key) || '[]');
        allBrandCoupons.push(...coupons);
      }
    }

    const totalRedemptions = allBrandCoupons.reduce((sum, c) => sum + (c.usedCount || 0), 0);
    
    // Calculate total discount given (mock calculation)
    const totalDiscountGiven = allBrandCoupons.reduce((sum, c) => {
      const avgDiscount = c.discountType === 'percentage' 
        ? parseFloat(c.maxDiscountAmount || 100) 
        : parseFloat(c.maxDiscountAmount || 0);
      return sum + (avgDiscount * (c.usedCount || 0));
    }, 0);

    // Calculate revenue impact (mock - assumes 3x return on discount)
    const totalRevenueImpact = totalDiscountGiven * 3;

    // Get top performing coupons
    const topCoupons = allBrandCoupons
      .filter(c => c.approvalStatus === 'approved')
      .sort((a, b) => (b.usedCount || 0) - (a.usedCount || 0))
      .slice(0, 5)
      .map(c => ({
        code: c.couponCode,
        redemptions: c.usedCount || 0,
        discount: c.discountType === 'percentage' 
          ? `${c.discountPercentage}%` 
          : `₹${c.maxDiscountAmount}`
      }));

    setAnalytics({
      totalRedemptions,
      totalDiscountGiven,
      totalRevenueImpact,
      topCoupons
    });
  };

  const handleApproveCoupon = () => {
    if (!selectedCoupon) return;

    // Update coupon status
    const updatedCoupon = {
      ...selectedCoupon,
      approvalStatus: 'approved',
      approvedBy: adminUser?.name || 'Admin',
      approvedDate: new Date().toISOString()
    };

    updateCouponInStorage(updatedCoupon);
    addAuditLog('Approved', selectedCoupon.couponCode, 'Coupon approved by admin');
    
    setShowApprovalModal(false);
    setSelectedCoupon(null);
    loadAllCoupons();
    calculateAnalytics();
    
    alert('Coupon approved successfully!');
  };

  const handleRejectCoupon = () => {
    if (!selectedCoupon || !rejectionReason) {
      alert('Please provide a reason for rejection');
      return;
    }

    const updatedCoupon = {
      ...selectedCoupon,
      approvalStatus: 'rejected',
      rejectedBy: adminUser?.name || 'Admin',
      rejectedDate: new Date().toISOString(),
      rejectionReason: rejectionReason
    };

    updateCouponInStorage(updatedCoupon);
    addAuditLog('Rejected', selectedCoupon.couponCode, rejectionReason);
    
    setShowRejectModal(false);
    setSelectedCoupon(null);
    setRejectionReason('');
    loadAllCoupons();
    
    alert('Coupon rejected successfully!');
  };

  const handleEditCoupon = () => {
    if (!selectedCoupon) return;

    const updatedCoupon = {
      ...selectedCoupon,
      ...editForm,
      updatedBy: adminUser?.name || 'Admin',
      updatedDate: new Date().toISOString()
    };

    updateCouponInStorage(updatedCoupon);
    addAuditLog('Edited', selectedCoupon.couponCode, 'Coupon edited by admin');
    
    setShowEditModal(false);
    setSelectedCoupon(null);
    loadAllCoupons();
    calculateAnalytics();
    
    alert('Coupon updated successfully!');
  };

  const handleDeleteCoupon = () => {
    if (!selectedCoupon) return;

    deleteCouponFromStorage(selectedCoupon);
    addAuditLog('Deleted', selectedCoupon.couponCode, 'Coupon deleted by admin');
    
    setShowDeleteConfirm(false);
    setSelectedCoupon(null);
    loadAllCoupons();
    calculateAnalytics();
    
    alert('Coupon deleted successfully!');
  };

  const handleToggleStatus = (coupon) => {
    const newStatus = coupon.status === 'active' ? 'inactive' : 'active';
    const updatedCoupon = {
      ...coupon,
      status: newStatus,
      updatedBy: adminUser?.name || 'Admin',
      updatedDate: new Date().toISOString()
    };

    updateCouponInStorage(updatedCoupon);
    addAuditLog(
      newStatus === 'active' ? 'Activated' : 'Deactivated', 
      coupon.couponCode, 
      `Coupon ${newStatus}`
    );
    
    loadAllCoupons();
    alert(`Coupon ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully!`);
  };

  const updateCouponInStorage = (updatedCoupon) => {
    const key = `coupons_${updatedCoupon.brandId}`;
    const coupons = JSON.parse(localStorage.getItem(key) || '[]');
    const updatedCoupons = coupons.map(c => 
      c.id === updatedCoupon.id ? updatedCoupon : c
    );
    localStorage.setItem(key, JSON.stringify(updatedCoupons));
  };

  const deleteCouponFromStorage = (coupon) => {
    const key = `coupons_${coupon.brandId}`;
    const coupons = JSON.parse(localStorage.getItem(key) || '[]');
    const filteredCoupons = coupons.filter(c => c.id !== coupon.id);
    localStorage.setItem(key, JSON.stringify(filteredCoupons));
  };

  const openEditModal = (coupon) => {
    setSelectedCoupon(coupon);
    setEditForm({
      couponCode: coupon.couponCode,
      discountType: coupon.discountType,
      discountPercentage: coupon.discountPercentage,
      maxDiscountAmount: coupon.maxDiscountAmount,
      minOrderAmount: coupon.minOrderAmount,
      expiryDate: coupon.expiryDate,
      usageLimit: coupon.usageLimit,
      usagePerCustomer: coupon.usagePerCustomer,
      status: coupon.status
    });
    setShowEditModal(true);
  };

  const saveSettings = () => {
    localStorage.setItem('admin_coupon_settings', JSON.stringify(settings));
    setShowSettingsModal(false);
    alert('Settings saved successfully!');
  };

  const exportToCSV = () => {
    const csvData = [
      ['Coupon Code', 'Brand', 'Discount Type', 'Discount Value', 'Min Order', 'Expiry Date', 'Status', 'Approval Status', 'Usage Count'],
      ...allCoupons.map(c => [
        c.couponCode,
        c.brandName,
        c.discountType,
        c.discountType === 'percentage' ? `${c.discountPercentage}%` : `₹${c.maxDiscountAmount}`,
        `₹${c.minOrderAmount}`,
        c.expiryDate || 'No Expiry',
        c.status,
        c.approvalStatus,
        c.usedCount || 0
      ])
    ];

    const csv = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `coupons_report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const isExpired = (expiryDate) => {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getApprovalStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredCoupons = () => {
    let coupons = [];
    
    switch (activeTab) {
      case 'pending':
        coupons = pendingCoupons;
        break;
      case 'approved':
        coupons = approvedCoupons;
        break;
      case 'rejected':
        coupons = rejectedCoupons;
        break;
      case 'all':
        coupons = allCoupons;
        break;
      default:
        coupons = allCoupons;
    }

    return coupons.filter(coupon => {
      const matchesSearch = coupon.couponCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            coupon.brandName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filterStatus === 'all' || coupon.status === filterStatus;
      return matchesSearch && matchesFilter;
    });
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'pending':
      case 'approved':
      case 'rejected':
      case 'all':
        return renderCouponsList();
      case 'analytics':
        return renderAnalytics();
      case 'settings':
        return renderSettings();
      case 'audit':
        return renderAuditLogs();
      default:
        return renderCouponsList();
    }
  };

  const renderCouponsList = () => {
    const coupons = filteredCoupons();

    return (
      <div>
        {/* Search and Filter */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by coupon code or brand..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Status</label>
              <div className="relative">
                <Filter size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Coupons Grid */}
        {coupons.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coupons.map(coupon => (
              <div key={coupon.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white">
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 p-4 text-white">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-bold">{coupon.couponCode}</h3>
                      <p className="text-sm text-indigo-100">{coupon.brandName}</p>
                    </div>
                    <Tag size={20} />
                  </div>
                  <p className="text-sm text-indigo-100">{coupon.description}</p>
                </div>

                {/* Content */}
                <div className="p-4">
                  {/* Discount Info */}
                  <div className="mb-3 p-3 bg-green-50 rounded">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-green-700">
                        <DollarSign size={16} className="mr-1" />
                        <span className="font-semibold">
                          {coupon.discountType === 'percentage' 
                            ? `${coupon.discountPercentage}% OFF` 
                            : `₹${coupon.maxDiscountAmount} OFF`}
                        </span>
                      </div>
                      {coupon.maxDiscountAmount && coupon.discountType === 'percentage' && (
                        <span className="text-xs text-green-600">Max: ₹{coupon.maxDiscountAmount}</span>
                      )}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-2 text-sm mb-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Min Order:</span>
                      <span className="font-medium">₹{coupon.minOrderAmount}</span>
                    </div>
                    
                    {coupon.expiryDate && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Expires:</span>
                        <span className={`font-medium ${isExpired(coupon.expiryDate) ? 'text-red-600' : ''}`}>
                          {new Date(coupon.expiryDate).toLocaleDateString()}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span className="text-gray-600">Usage:</span>
                      <span className="font-medium">{coupon.usagePerCustomer}/customer</span>
                    </div>

                    {coupon.usageLimit && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Limit:</span>
                        <span className="font-medium">{coupon.usedCount || 0}/{coupon.usageLimit}</span>
                      </div>
                    )}
                  </div>

                  {/* Status Badges */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(coupon.status)}`}>
                      {coupon.status.charAt(0).toUpperCase() + coupon.status.slice(1)}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getApprovalStatusColor(coupon.approvalStatus)}`}>
                      {coupon.approvalStatus.charAt(0).toUpperCase() + coupon.approvalStatus.slice(1)}
                    </span>
                    {isExpired(coupon.expiryDate) && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Expired
                      </span>
                    )}
                  </div>

                  {/* Expandable Details */}
                  {expandedCard === coupon.id && (
                    <div className="mb-3 p-3 bg-gray-50 rounded text-xs space-y-1">
                      {coupon.approvedBy && (
                        <div><span className="font-medium">Approved by:</span> {coupon.approvedBy}</div>
                      )}
                      {coupon.approvedDate && (
                        <div><span className="font-medium">Approved on:</span> {new Date(coupon.approvedDate).toLocaleString()}</div>
                      )}
                      {coupon.rejectedBy && (
                        <div><span className="font-medium">Rejected by:</span> {coupon.rejectedBy}</div>
                      )}
                      {coupon.rejectionReason && (
                        <div><span className="font-medium">Reason:</span> {coupon.rejectionReason}</div>
                      )}
                      {coupon.customerEligibility && (
                        <div><span className="font-medium">Eligibility:</span> {coupon.customerEligibility}</div>
                      )}
                    </div>
                  )}

                  <button
                    onClick={() => setExpandedCard(expandedCard === coupon.id ? null : coupon.id)}
                    className="w-full text-xs text-blue-600 hover:text-blue-800 mb-3 flex items-center justify-center"
                  >
                    {expandedCard === coupon.id ? (
                      <>Show Less <ChevronUp size={14} className="ml-1" /></>
                    ) : (
                      <>Show More <ChevronDown size={14} className="ml-1" /></>
                    )}
                  </button>

                  {/* Action Buttons */}
                  {activeTab === 'pending' && (
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => {
                          setSelectedCoupon(coupon);
                          setShowApprovalModal(true);
                        }}
                        className="flex items-center justify-center px-2 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-xs"
                      >
                        <Check size={14} className="mr-1" />
                        Approve
                      </button>
                      <button
                        onClick={() => {
                          setSelectedCoupon(coupon);
                          setShowRejectModal(true);
                        }}
                        className="flex items-center justify-center px-2 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-xs"
                      >
                        <XCircle size={14} className="mr-1" />
                        Reject
                      </button>
                      <button
                        onClick={() => openEditModal(coupon)}
                        className="flex items-center justify-center px-2 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-xs"
                      >
                        <Edit size={14} className="mr-1" />
                        Edit
                      </button>
                    </div>
                  )}

                  {activeTab === 'approved' && (
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => openEditModal(coupon)}
                        className="flex items-center justify-center px-2 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-xs"
                      >
                        <Edit size={14} className="mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleToggleStatus(coupon)}
                        className={`flex items-center justify-center px-2 py-2 text-white rounded-md text-xs ${
                          coupon.status === 'active' 
                            ? 'bg-gray-600 hover:bg-gray-700' 
                            : 'bg-green-600 hover:bg-green-700'
                        }`}
                      >
                        <RefreshCw size={14} className="mr-1" />
                        {coupon.status === 'active' ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => {
                          setSelectedCoupon(coupon);
                          setShowDeleteConfirm(true);
                        }}
                        className="flex items-center justify-center px-2 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-xs"
                      >
                        <Trash2 size={14} className="mr-1" />
                        Delete
                      </button>
                    </div>
                  )}

                  {(activeTab === 'rejected' || activeTab === 'all') && (
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => openEditModal(coupon)}
                        className="flex items-center justify-center px-2 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-xs"
                      >
                        <Edit size={14} className="mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          setSelectedCoupon(coupon);
                          setShowDeleteConfirm(true);
                        }}
                        className="flex items-center justify-center px-2 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-xs"
                      >
                        <Trash2 size={14} className="mr-1" />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 border border-gray-200 rounded-lg bg-gray-50 text-center">
            <Tag size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">No coupons found</p>
          </div>
        )}
      </div>
    );
  };

  const renderAnalytics = () => {
    return (
      <div className="space-y-6">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">Total Redemptions</h3>
              <Activity size={24} />
            </div>
            <p className="text-3xl font-bold">{analytics.totalRedemptions.toLocaleString()}</p>
            <p className="text-sm text-blue-100 mt-1">All-time coupon usage</p>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-lg text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">Total Discount Given</h3>
              <DollarSign size={24} />
            </div>
            <p className="text-3xl font-bold">₹{analytics.totalDiscountGiven.toLocaleString()}</p>
            <p className="text-sm text-green-100 mt-1">Total savings for customers</p>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-lg text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">Revenue Impact</h3>
              <TrendingUp size={24} />
            </div>
            <p className="text-3xl font-bold">₹{analytics.totalRevenueImpact.toLocaleString()}</p>
            <p className="text-sm text-purple-100 mt-1">Generated revenue</p>
          </div>
        </div>

        {/* Top Performing Coupons */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-4 flex items-center">
            <TrendingUp size={20} className="mr-2" />
            Top Performing Coupons
          </h3>
          
          {analytics.topCoupons.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rank
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Coupon Code
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Redemptions
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Discount
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {analytics.topCoupons.map((coupon, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                          index === 0 ? 'bg-yellow-100 text-yellow-800' :
                          index === 1 ? 'bg-gray-100 text-gray-800' :
                          index === 2 ? 'bg-orange-100 text-orange-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          #{index + 1}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-medium">{coupon.code}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{coupon.redemptions}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{coupon.discount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No redemptions yet</p>
          )}
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-bold mb-4 flex items-center">
              <PieChart size={20} className="mr-2" />
              Coupon Status Distribution
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Pending Approval</span>
                <span className="font-bold text-yellow-600">{pendingCoupons.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Approved</span>
                <span className="font-bold text-green-600">{approvedCoupons.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Rejected</span>
                <span className="font-bold text-red-600">{rejectedCoupons.length}</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t">
                <span className="text-gray-600 font-semibold">Total Coupons</span>
                <span className="font-bold text-blue-600">{allCoupons.length}</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-bold mb-4 flex items-center">
              <BarChart3 size={20} className="mr-2" />
              Active vs Inactive
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Active Coupons</span>
                <span className="font-bold text-green-600">
                  {allCoupons.filter(c => c.status === 'active').length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Inactive Coupons</span>
                <span className="font-bold text-gray-600">
                  {allCoupons.filter(c => c.status === 'inactive').length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Expired Coupons</span>
                <span className="font-bold text-red-600">
                  {allCoupons.filter(c => isExpired(c.expiryDate)).length}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Export Button */}
        <div className="flex justify-end">
          <button
            onClick={exportToCSV}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Download size={20} className="mr-2" />
            Export Report to CSV
          </button>
        </div>
      </div>
    );
  };

  const renderSettings = () => {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold mb-6 flex items-center">
          <Shield size={24} className="mr-2" />
          Coupon Settings & Configuration
        </h3>

        <div className="space-y-6">
          {/* Default Settings */}
          <div className="border-b pb-6">
            <h4 className="text-lg font-semibold mb-4">Default Coupon Settings</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Default Expiry Period (Days)
                </label>
                <input
                  type="number"
                  value={settings.defaultExpiryPeriod}
                  onChange={(e) => setSettings({...settings, defaultExpiryPeriod: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Default Discount Type
                </label>
                <select
                  value={settings.defaultDiscountType}
                  onChange={(e) => setSettings({...settings, defaultDiscountType: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="percentage">Percentage</option>
                  <option value="flat">Flat Amount</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Discount Limit (₹)
                </label>
                <input
                  type="number"
                  value={settings.maxDiscountLimit}
                  onChange={(e) => setSettings({...settings, maxDiscountLimit: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer Eligibility
                </label>
                <select
                  value={settings.customerEligibility}
                  onChange={(e) => setSettings({...settings, customerEligibility: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Customers</option>
                  <option value="first-time">First-time Customers</option>
                  <option value="vip">VIP Customers</option>
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.allowStacking}
                  onChange={(e) => setSettings({...settings, allowStacking: e.target.checked})}
                  className="mr-2"
                />
                <span className="text-sm font-medium text-gray-700">Allow Coupon Stacking</span>
              </label>
            </div>
          </div>

          {/* Alert Settings */}
          <div className="border-b pb-6">
            <h4 className="text-lg font-semibold mb-4 flex items-center">
              <Bell size={20} className="mr-2" />
              Alerts & Notifications
            </h4>
            
            <div className="space-y-4">
              <div>
                <label className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    checked={settings.expirationAlert}
                    onChange={(e) => setSettings({...settings, expirationAlert: e.target.checked})}
                    className="mr-2"
                  />
                  <span className="text-sm font-medium text-gray-700">Expiration Alert</span>
                </label>
                {settings.expirationAlert && (
                  <div className="ml-6">
                    <label className="block text-sm text-gray-600 mb-1">
                      Alert days before expiry
                    </label>
                    <input
                      type="number"
                      value={settings.expirationAlertDays}
                      onChange={(e) => setSettings({...settings, expirationAlertDays: parseInt(e.target.value)})}
                      className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="1"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    checked={settings.usageLimitAlert}
                    onChange={(e) => setSettings({...settings, usageLimitAlert: e.target.checked})}
                    className="mr-2"
                  />
                  <span className="text-sm font-medium text-gray-700">Usage Limit Alert</span>
                </label>
                {settings.usageLimitAlert && (
                  <div className="ml-6">
                    <label className="block text-sm text-gray-600 mb-1">
                      Alert at usage percentage
                    </label>
                    <input
                      type="number"
                      value={settings.usageLimitPercentage}
                      onChange={(e) => setSettings({...settings, usageLimitPercentage: parseInt(e.target.value)})}
                      className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="1"
                      max="100"
                    />
                    <span className="text-xs text-gray-500 ml-2">%</span>
                  </div>
                )}
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.newCouponAlert}
                    onChange={(e) => setSettings({...settings, newCouponAlert: e.target.checked})}
                    className="mr-2"
                  />
                  <span className="text-sm font-medium text-gray-700">New Coupon Approval Request Alert</span>
                </label>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={saveSettings}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderAuditLogs = () => {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold mb-6 flex items-center">
          <FileText size={24} className="mr-2" />
          Audit Logs
        </h3>

        {auditLogs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Coupon Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Admin Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Timestamp
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reason/Notes
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {auditLogs.map((log) => (
                  <tr key={log.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        log.actionType === 'Approved' ? 'bg-green-100 text-green-800' :
                        log.actionType === 'Rejected' ? 'bg-red-100 text-red-800' :
                        log.actionType === 'Edited' ? 'bg-blue-100 text-blue-800' :
                        log.actionType === 'Deleted' ? 'bg-gray-100 text-gray-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {log.actionType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium">{log.couponCode}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{log.adminName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {log.reason || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <FileText size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">No audit logs found</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Coupon Management</h1>
          <p className="text-gray-600">Manage and monitor all coupon activities</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Approval</p>
                <p className="text-2xl font-bold text-yellow-600">{pendingCoupons.length}</p>
              </div>
              <Clock className="text-yellow-600" size={32} />
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Approved Coupons</p>
                <p className="text-2xl font-bold text-green-600">{approvedCoupons.length}</p>
              </div>
              <CheckCircle className="text-green-600" size={32} />
            </div>
          </div>

          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Rejected Coupons</p>
                <p className="text-2xl font-bold text-red-600">{rejectedCoupons.length}</p>
              </div>
              <XCircle className="text-red-600" size={32} />
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Coupons</p>
                <p className="text-2xl font-bold text-blue-600">{allCoupons.length}</p>
              </div>
              <Tag className="text-blue-600" size={32} />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="border-b">
            <nav className="flex flex-wrap -mb-px">
              <button
                onClick={() => setActiveTab('pending')}
                className={`px-6 py-3 text-sm font-medium border-b-2 ${
                  activeTab === 'pending'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Pending Approval ({pendingCoupons.length})
              </button>
              <button
                onClick={() => setActiveTab('approved')}
                className={`px-6 py-3 text-sm font-medium border-b-2 ${
                  activeTab === 'approved'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Approved ({approvedCoupons.length})
              </button>
              <button
                onClick={() => setActiveTab('rejected')}
                className={`px-6 py-3 text-sm font-medium border-b-2 ${
                  activeTab === 'rejected'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Rejected ({rejectedCoupons.length})
              </button>
              <button
                onClick={() => setActiveTab('all')}
                className={`px-6 py-3 text-sm font-medium border-b-2 ${
                  activeTab === 'all'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                All Coupons ({allCoupons.length})
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`px-6 py-3 text-sm font-medium border-b-2 ${
                  activeTab === 'analytics'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Analytics
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`px-6 py-3 text-sm font-medium border-b-2 ${
                  activeTab === 'settings'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Settings
              </button>
              <button
                onClick={() => setActiveTab('audit')}
                className={`px-6 py-3 text-sm font-medium border-b-2 ${
                  activeTab === 'audit'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Audit Logs
              </button>
            </nav>
          </div>

          <div className="p-6">
            {renderTabContent()}
          </div>
        </div>

        {/* Approval Modal */}
        {showApprovalModal && selectedCoupon && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg w-full max-w-md p-6">
              <div className="flex items-center mb-4">
                <CheckCircle className="text-green-600 mr-3" size={24} />
                <h3 className="text-lg font-semibold">Approve Coupon</h3>
              </div>
              
              <div className="mb-6">
                <p className="text-gray-700">
                  Are you sure you want to approve the coupon <span className="font-semibold">{selectedCoupon.couponCode}</span>?
                </p>
                <div className="mt-4 p-3 bg-gray-50 rounded text-sm">
                  <p><span className="font-medium">Brand:</span> {selectedCoupon.brandName}</p>
                  <p><span className="font-medium">Discount:</span> {selectedCoupon.discountType === 'percentage' ? `${selectedCoupon.discountPercentage}%` : `₹${selectedCoupon.maxDiscountAmount}`}</p>
                  <p><span className="font-medium">Min Order:</span> ₹{selectedCoupon.minOrderAmount}</p>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowApprovalModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApproveCoupon}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Approve Coupon
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Reject Modal */}
        {showRejectModal && selectedCoupon && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg w-full max-w-md p-6">
              <div className="flex items-center mb-4">
                <XCircle className="text-red-600 mr-3" size={24} />
                <h3 className="text-lg font-semibold">Reject Coupon</h3>
              </div>
              
              <div className="mb-6">
                <p className="text-gray-700 mb-4">
                  Rejecting coupon: <span className="font-semibold">{selectedCoupon.couponCode}</span>
                </p>
                
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Rejection <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Provide a reason for rejecting this coupon..."
                  required
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowRejectModal(false);
                    setRejectionReason('');
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRejectCoupon}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  disabled={!rejectionReason}
                >
                  Reject Coupon
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {showEditModal && selectedCoupon && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-lg w-full max-w-2xl my-8">
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center rounded-t-lg">
                <h3 className="text-lg font-semibold">Edit Coupon</h3>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="p-1 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Coupon Code</label>
                    <input
                      type="text"
                      value={editForm.couponCode}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Discount Type</label>
                    <select
                      value={editForm.discountType}
                      onChange={(e) => setEditForm({...editForm, discountType: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="percentage">Percentage</option>
                      <option value="flat">Flat Amount</option>
                    </select>
                  </div>

                  {editForm.discountType === 'percentage' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Discount Percentage</label>
                      <input
                        type="number"
                        value={editForm.discountPercentage}
                        onChange={(e) => setEditForm({...editForm, discountPercentage: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min="0"
                        max="100"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Max Discount Amount (₹)</label>
                    <input
                      type="number"
                      value={editForm.maxDiscountAmount}
                      onChange={(e) => setEditForm({...editForm, maxDiscountAmount: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Min Order Amount (₹)</label>
                    <input
                      type="number"
                      value={editForm.minOrderAmount}
                      onChange={(e) => setEditForm({...editForm, minOrderAmount: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                    <input
                      type="date"
                      value={editForm.expiryDate}
                      onChange={(e) => setEditForm({...editForm, expiryDate: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Usage Limit</label>
                    <input
                      type="number"
                      value={editForm.usageLimit}
                      onChange={(e) => setEditForm({...editForm, usageLimit: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Usage per Customer</label>
                    <input
                      type="number"
                      value={editForm.usagePerCustomer}
                      onChange={(e) => setEditForm({...editForm, usagePerCustomer: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                      value={editForm.status}
                      onChange={(e) => setEditForm({...editForm, status: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="sticky bottom-0 bg-gray-50 border-t px-6 py-4 flex justify-end space-x-3 rounded-b-lg">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditCoupon}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Update Coupon
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && selectedCoupon && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg w-full max-w-md p-6">
              <div className="flex items-center mb-4">
                <AlertCircle className="text-red-600 mr-3" size={24} />
                <h3 className="text-lg font-semibold">Delete Coupon</h3>
              </div>
              
              <p className="text-gray-700 mb-6">
                Are you sure you want to permanently delete the coupon <span className="font-semibold">{selectedCoupon.couponCode}</span>? 
                This action cannot be undone.
              </p>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteCoupon}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminCouponDashboard;