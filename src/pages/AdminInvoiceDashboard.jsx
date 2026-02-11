import React, { useState, useEffect } from 'react';
import { 
  X, Eye, Download, Printer, Search, Filter, Calendar, 
  DollarSign, FileText, TrendingUp, Users, CreditCard,
  Check, XCircle, Clock, AlertCircle, ChevronDown, ChevronUp,
  Edit, Trash2, Send, RefreshCw, BarChart3, PieChart
} from 'lucide-react';

function AdminInvoiceDashboard({ adminUser }) {
  const [activeTab, setActiveTab] = useState('all');
  const [allInvoices, setAllInvoices] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPaymentStatus, setFilterPaymentStatus] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [showInvoicePreview, setShowInvoicePreview] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [expandedCard, setExpandedCard] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);

  // Analytics State
  const [analytics, setAnalytics] = useState({
    totalInvoices: 0,
    totalRevenue: 0,
    pendingAmount: 0,
    paidAmount: 0,
    overdueInvoices: 0,
    topBrands: []
  });

  // Edit Form State
  const [editForm, setEditForm] = useState({
    paymentStatus: '',
    paymentMethod: '',
    notes: ''
  });

  // Load all invoices from all brand owners
  useEffect(() => {
    loadAllInvoices();
    loadAuditLogs();
    calculateAnalytics();
  }, []);

  const loadAllInvoices = () => {
    const allBrandInvoices = [];
    
    // Iterate through localStorage to find all invoice entries
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('invoices_')) {
        const brandId = key.replace('invoices_', '');
        const invoices = JSON.parse(localStorage.getItem(key) || '[]');
        
        // Add brand info to each invoice
        const invoicesWithBrand = invoices.map(invoice => ({
          ...invoice,
          brandId: brandId,
          brandName: getBrandName(brandId)
        }));
        
        allBrandInvoices.push(...invoicesWithBrand);
      }
    }

    setAllInvoices(allBrandInvoices);
  };

  const getBrandName = (brandId) => {
    const userDataKey = `user_${brandId}`;
    const userData = localStorage.getItem(userDataKey);
    if (userData) {
      const user = JSON.parse(userData);
      return user.name || `Brand ${brandId}`;
    }
    return `Brand ${brandId}`;
  };

  const loadAuditLogs = () => {
    const logs = JSON.parse(localStorage.getItem('invoice_audit_logs') || '[]');
    setAuditLogs(logs);
  };

  const addAuditLog = (action, invoiceNumber, reason = '') => {
    const newLog = {
      id: Date.now().toString(),
      actionType: action,
      invoiceNumber: invoiceNumber,
      adminName: adminUser?.name || 'Admin',
      timestamp: new Date().toISOString(),
      reason: reason
    };

    const logs = JSON.parse(localStorage.getItem('invoice_audit_logs') || '[]');
    logs.unshift(newLog);
    localStorage.setItem('invoice_audit_logs', JSON.stringify(logs));
    setAuditLogs(logs);
  };

  const calculateAnalytics = () => {
    const allBrandInvoices = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('invoices_')) {
        const invoices = JSON.parse(localStorage.getItem(key) || '[]');
        allBrandInvoices.push(...invoices);
      }
    }

    const totalInvoices = allBrandInvoices.length;
    const totalRevenue = allBrandInvoices.reduce((sum, inv) => sum + parseFloat(inv.totalAmount || 0), 0);
    const paidAmount = allBrandInvoices
      .filter(inv => inv.paymentStatus === 'Paid')
      .reduce((sum, inv) => sum + parseFloat(inv.totalAmount || 0), 0);
    const pendingAmount = allBrandInvoices
      .filter(inv => inv.paymentStatus === 'Pending')
      .reduce((sum, inv) => sum + parseFloat(inv.totalAmount || 0), 0);
    
    const overdueInvoices = allBrandInvoices.filter(inv => {
      if (inv.paymentStatus === 'Paid') return false;
      return new Date(inv.dueDate) < new Date();
    }).length;

    // Calculate top brands by revenue
    const brandRevenue = {};
    allBrandInvoices.forEach(inv => {
      const brandKey = inv.brandId || 'Unknown';
      if (!brandRevenue[brandKey]) {
        brandRevenue[brandKey] = { brandId: brandKey, revenue: 0, invoiceCount: 0 };
      }
      brandRevenue[brandKey].revenue += parseFloat(inv.totalAmount || 0);
      brandRevenue[brandKey].invoiceCount += 1;
    });

    const topBrands = Object.values(brandRevenue)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5)
      .map(brand => ({
        brandName: getBrandName(brand.brandId),
        revenue: brand.revenue,
        invoiceCount: brand.invoiceCount
      }));

    setAnalytics({
      totalInvoices,
      totalRevenue,
      pendingAmount,
      paidAmount,
      overdueInvoices,
      topBrands
    });
  };

  const handleUpdateInvoice = () => {
    if (!selectedInvoice) return;

    const updatedInvoice = {
      ...selectedInvoice,
      paymentStatus: editForm.paymentStatus,
      paymentMethod: editForm.paymentMethod,
      adminNotes: editForm.notes,
      updatedBy: adminUser?.name || 'Admin',
      updatedDate: new Date().toISOString()
    };

    updateInvoiceInStorage(updatedInvoice);
    addAuditLog('Updated', selectedInvoice.invoiceNumber, 'Invoice updated by admin');
    
    setShowEditModal(false);
    setSelectedInvoice(null);
    loadAllInvoices();
    calculateAnalytics();
    
    alert('Invoice updated successfully!');
  };

  const handleDeleteInvoice = () => {
    if (!selectedInvoice) return;

    deleteInvoiceFromStorage(selectedInvoice);
    addAuditLog('Deleted', selectedInvoice.invoiceNumber, 'Invoice deleted by admin');
    
    setShowDeleteConfirm(false);
    setSelectedInvoice(null);
    loadAllInvoices();
    calculateAnalytics();
    
    alert('Invoice deleted successfully!');
  };

  const handleSendReminder = (invoice) => {
    addAuditLog('Reminder Sent', invoice.invoiceNumber, 'Payment reminder sent to customer');
    alert(`Payment reminder sent for invoice ${invoice.invoiceNumber}`);
  };

  const updateInvoiceInStorage = (updatedInvoice) => {
    const key = `invoices_${updatedInvoice.brandId}`;
    const invoices = JSON.parse(localStorage.getItem(key) || '[]');
    const updatedInvoices = invoices.map(inv => 
      inv.invoiceNumber === updatedInvoice.invoiceNumber ? updatedInvoice : inv
    );
    localStorage.setItem(key, JSON.stringify(updatedInvoices));
  };

  const deleteInvoiceFromStorage = (invoice) => {
    const key = `invoices_${invoice.brandId}`;
    const invoices = JSON.parse(localStorage.getItem(key) || '[]');
    const filteredInvoices = invoices.filter(inv => inv.invoiceNumber !== invoice.invoiceNumber);
    localStorage.setItem(key, JSON.stringify(filteredInvoices));
  };

  const openEditModal = (invoice) => {
    setSelectedInvoice(invoice);
    setEditForm({
      paymentStatus: invoice.paymentStatus,
      paymentMethod: invoice.paymentMethod,
      notes: invoice.adminNotes || ''
    });
    setShowEditModal(true);
  };

  const exportToCSV = () => {
    const csvData = [
      ['Invoice Number', 'Brand', 'Customer Name', 'Invoice Date', 'Due Date', 'Total Amount', 'Payment Status', 'Payment Method'],
      ...allInvoices.map(inv => [
        inv.invoiceNumber,
        inv.brandName,
        inv.customerName,
        inv.invoiceDate,
        inv.dueDate,
        `₹${inv.totalAmount}`,
        inv.paymentStatus,
        inv.paymentMethod
      ])
    ];

    const csv = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoices_report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const isOverdue = (invoice) => {
    if (invoice.paymentStatus === 'Paid') return false;
    return new Date(invoice.dueDate) < new Date();
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'Paid': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Partially Paid': return 'bg-blue-100 text-blue-800';
      case 'Overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredInvoices = () => {
    let invoices = allInvoices;

    // Filter by search query
    if (searchQuery) {
      invoices = invoices.filter(inv =>
        inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.brandName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by payment status
    if (filterPaymentStatus !== 'all') {
      invoices = invoices.filter(inv => inv.paymentStatus === filterPaymentStatus);
    }

    // Filter by date range
    if (dateFrom) {
      invoices = invoices.filter(inv => new Date(inv.invoiceDate) >= new Date(dateFrom));
    }
    if (dateTo) {
      invoices = invoices.filter(inv => new Date(inv.invoiceDate) <= new Date(dateTo));
    }

    // Filter by tab
    switch (activeTab) {
      case 'paid':
        invoices = invoices.filter(inv => inv.paymentStatus === 'Paid');
        break;
      case 'pending':
        invoices = invoices.filter(inv => inv.paymentStatus === 'Pending');
        break;
      case 'overdue':
        invoices = invoices.filter(inv => isOverdue(inv));
        break;
      default:
        break;
    }

    return invoices;
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'all':
      case 'paid':
      case 'pending':
      case 'overdue':
        return renderInvoicesList();
      case 'analytics':
        return renderAnalytics();
      case 'audit':
        return renderAuditLogs();
      default:
        return renderInvoicesList();
    }
  };

  const renderInvoicesList = () => {
    const invoices = filteredInvoices();

    return (
      <div>
        {/* Search and Filter */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by invoice #, customer, or brand..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
              <div className="relative">
                <Filter size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  value={filterPaymentStatus}
                  onChange={(e) => setFilterPaymentStatus(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="Paid">Paid</option>
                  <option value="Pending">Pending</option>
                  <option value="Partially Paid">Partially Paid</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
              <div className="flex space-x-2">
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-full px-2 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Invoices Grid */}
        {invoices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {invoices.map(invoice => (
              <div key={invoice.invoiceNumber} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white">
                {/* Header */}
                <div className={`p-4 text-white ${
                  isOverdue(invoice) ? 'bg-gradient-to-r from-red-500 to-red-600' :
                  invoice.paymentStatus === 'Paid' ? 'bg-gradient-to-r from-green-500 to-green-600' :
                  'bg-gradient-to-r from-blue-500 to-blue-600'
                }`}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-bold">#{invoice.invoiceNumber}</h3>
                      <p className="text-sm opacity-90">{invoice.brandName}</p>
                    </div>
                    <FileText size={20} />
                  </div>
                  <p className="text-sm opacity-90">{invoice.customerName}</p>
                </div>

                {/* Content */}
                <div className="p-4">
                  {/* Amount Info */}
                  <div className="mb-3 p-3 bg-green-50 rounded">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Total Amount</span>
                      <span className="text-xl font-bold text-green-700">₹{invoice.totalAmount}</span>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-2 text-sm mb-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Invoice Date:</span>
                      <span className="font-medium">{new Date(invoice.invoiceDate).toLocaleDateString()}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Due Date:</span>
                      <span className={`font-medium ${isOverdue(invoice) ? 'text-red-600' : ''}`}>
                        {new Date(invoice.dueDate).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Method:</span>
                      <span className="font-medium">{invoice.paymentMethod}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600">Items:</span>
                      <span className="font-medium">{invoice.items?.length || 0} items</span>
                    </div>
                  </div>

                  {/* Status Badges */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      getPaymentStatusColor(invoice.paymentStatus)
                    }`}>
                      {invoice.paymentStatus}
                    </span>
                    {isOverdue(invoice) && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Overdue
                      </span>
                    )}
                  </div>

                  {/* Expandable Details */}
                  {expandedCard === invoice.invoiceNumber && (
                    <div className="mb-3 p-3 bg-gray-50 rounded text-xs space-y-1">
                      <div><span className="font-medium">Customer Email/Phone:</span> {invoice.customerContact}</div>
                      <div><span className="font-medium">Address:</span> {invoice.customerAddress}</div>
                      {invoice.invoiceNotes && (
                        <div><span className="font-medium">Notes:</span> {invoice.invoiceNotes}</div>
                      )}
                      {invoice.adminNotes && (
                        <div><span className="font-medium">Admin Notes:</span> {invoice.adminNotes}</div>
                      )}
                      {invoice.updatedBy && (
                        <div><span className="font-medium">Last Updated by:</span> {invoice.updatedBy}</div>
                      )}
                    </div>
                  )}

                  <button
                    onClick={() => setExpandedCard(expandedCard === invoice.invoiceNumber ? null : invoice.invoiceNumber)}
                    className="w-full text-xs text-blue-600 hover:text-blue-800 mb-3 flex items-center justify-center"
                  >
                    {expandedCard === invoice.invoiceNumber ? (
                      <>Show Less <ChevronUp size={14} className="ml-1" /></>
                    ) : (
                      <>Show More <ChevronDown size={14} className="ml-1" /></>
                    )}
                  </button>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        setSelectedInvoice(invoice);
                        setShowInvoicePreview(true);
                      }}
                      className="flex items-center justify-center px-2 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-xs"
                    >
                      <Eye size={14} className="mr-1" />
                      View
                    </button>
                    <button
                      onClick={() => openEditModal(invoice)}
                      className="flex items-center justify-center px-2 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-xs"
                    >
                      <Edit size={14} className="mr-1" />
                      Edit
                    </button>
                    {invoice.paymentStatus !== 'Paid' && (
                      <button
                        onClick={() => handleSendReminder(invoice)}
                        className="flex items-center justify-center px-2 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 text-xs"
                      >
                        <Send size={14} className="mr-1" />
                        Remind
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setSelectedInvoice(invoice);
                        setShowDeleteConfirm(true);
                      }}
                      className="flex items-center justify-center px-2 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-xs"
                    >
                      <Trash2 size={14} className="mr-1" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 border border-gray-200 rounded-lg bg-gray-50 text-center">
            <FileText size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">No invoices found</p>
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
              <h3 className="text-lg font-semibold">Total Revenue</h3>
              <DollarSign size={24} />
            </div>
            <p className="text-3xl font-bold">₹{analytics.totalRevenue.toLocaleString()}</p>
            <p className="text-sm text-blue-100 mt-1">{analytics.totalInvoices} invoices</p>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-lg text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">Paid Amount</h3>
              <Check size={24} />
            </div>
            <p className="text-3xl font-bold">₹{analytics.paidAmount.toLocaleString()}</p>
            <p className="text-sm text-green-100 mt-1">Successfully collected</p>
          </div>

          <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-6 rounded-lg text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">Pending Amount</h3>
              <Clock size={24} />
            </div>
            <p className="text-3xl font-bold">₹{analytics.pendingAmount.toLocaleString()}</p>
            <p className="text-sm text-yellow-100 mt-1">Awaiting payment</p>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-bold mb-4 flex items-center">
              <AlertCircle size={20} className="mr-2 text-red-600" />
              Overdue Invoices
            </h3>
            <p className="text-4xl font-bold text-red-600">{analytics.overdueInvoices}</p>
            <p className="text-sm text-gray-600 mt-2">Requires immediate attention</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-bold mb-4 flex items-center">
              <PieChart size={20} className="mr-2" />
              Payment Status Distribution
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Paid</span>
                <span className="font-bold text-green-600">
                  {allInvoices.filter(inv => inv.paymentStatus === 'Paid').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Pending</span>
                <span className="font-bold text-yellow-600">
                  {allInvoices.filter(inv => inv.paymentStatus === 'Pending').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Partially Paid</span>
                <span className="font-bold text-blue-600">
                  {allInvoices.filter(inv => inv.paymentStatus === 'Partially Paid').length}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Top Brands */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-4 flex items-center">
            <TrendingUp size={20} className="mr-2" />
            Top Brands by Revenue
          </h3>
          
          {analytics.topBrands.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rank
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Brand Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Revenue
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Invoice Count
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {analytics.topBrands.map((brand, index) => (
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
                      <td className="px-6 py-4 whitespace-nowrap font-medium">{brand.brandName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-green-600 font-bold">₹{brand.revenue.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{brand.invoiceCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No data available</p>
          )}
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
                    Invoice Number
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
                        log.actionType === 'Updated' ? 'bg-blue-100 text-blue-800' :
                        log.actionType === 'Deleted' ? 'bg-red-100 text-red-800' :
                        log.actionType === 'Reminder Sent' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {log.actionType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium">{log.invoiceNumber}</td>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Invoice Management</h1>
          <p className="text-gray-600">Monitor and manage all invoices across the platform</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Invoices</p>
                <p className="text-2xl font-bold text-blue-600">{allInvoices.length}</p>
              </div>
              <FileText className="text-blue-600" size={32} />
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Paid Invoices</p>
                <p className="text-2xl font-bold text-green-600">
                  {allInvoices.filter(inv => inv.paymentStatus === 'Paid').length}
                </p>
              </div>
              <Check className="text-green-600" size={32} />
            </div>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Payment</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {allInvoices.filter(inv => inv.paymentStatus === 'Pending').length}
                </p>
              </div>
              <Clock className="text-yellow-600" size={32} />
            </div>
          </div>

          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Overdue</p>
                <p className="text-2xl font-bold text-red-600">{analytics.overdueInvoices}</p>
              </div>
              <AlertCircle className="text-red-600" size={32} />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="border-b">
            <nav className="flex flex-wrap -mb-px">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-6 py-3 text-sm font-medium border-b-2 ${
                  activeTab === 'all'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                All Invoices ({allInvoices.length})
              </button>
              <button
                onClick={() => setActiveTab('paid')}
                className={`px-6 py-3 text-sm font-medium border-b-2 ${
                  activeTab === 'paid'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Paid ({allInvoices.filter(inv => inv.paymentStatus === 'Paid').length})
              </button>
              <button
                onClick={() => setActiveTab('pending')}
                className={`px-6 py-3 text-sm font-medium border-b-2 ${
                  activeTab === 'pending'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Pending ({allInvoices.filter(inv => inv.paymentStatus === 'Pending').length})
              </button>
              <button
                onClick={() => setActiveTab('overdue')}
                className={`px-6 py-3 text-sm font-medium border-b-2 ${
                  activeTab === 'overdue'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Overdue ({analytics.overdueInvoices})
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

        {/* Edit Modal */}
        {showEditModal && selectedInvoice && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg w-full max-w-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Edit Invoice</h3>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="p-1 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Payment Status</label>
                  <select
                    value={editForm.paymentStatus}
                    onChange={(e) => setEditForm({...editForm, paymentStatus: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                    <option value="Partially Paid">Partially Paid</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                  <select
                    value={editForm.paymentMethod}
                    onChange={(e) => setEditForm({...editForm, paymentMethod: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="UPI">UPI</option>
                    <option value="Cash">Cash</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Admin Notes</label>
                  <textarea
                    value={editForm.notes}
                    onChange={(e) => setEditForm({...editForm, notes: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Add any admin notes..."
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateInvoice}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Update Invoice
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && selectedInvoice && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg w-full max-w-md p-6">
              <div className="flex items-center mb-4">
                <AlertCircle className="text-red-600 mr-3" size={24} />
                <h3 className="text-lg font-semibold">Delete Invoice</h3>
              </div>
              
              <p className="text-gray-700 mb-6">
                Are you sure you want to permanently delete invoice <span className="font-semibold">#{selectedInvoice.invoiceNumber}</span>? 
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
                  onClick={handleDeleteInvoice}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Invoice Preview Modal */}
        {showInvoicePreview && selectedInvoice && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-lg w-full max-w-4xl my-8">
              <div className="flex justify-between items-center p-6 border-b">
                <h3 className="text-lg font-semibold">Invoice Preview</h3>
                <button
                  onClick={() => setShowInvoicePreview(false)}
                  className="p-1 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-8">
                <div className="border-b pb-6 mb-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h1 className="text-3xl font-bold text-blue-600">INVOICE</h1>
                      <p className="text-gray-600 mt-2">Invoice #: {selectedInvoice.invoiceNumber}</p>
                    </div>
                    <div className="text-right">
                      <h2 className="text-xl font-semibold">{selectedInvoice.brandName}</h2>
                      <p className="text-gray-600">Brand Owner</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="font-semibold mb-2">Bill To:</h3>
                    <p className="font-semibold">{selectedInvoice.customerName}</p>
                    <p className="text-gray-600">{selectedInvoice.customerAddress}</p>
                    <p className="text-gray-600">{selectedInvoice.customerContact}</p>
                  </div>
                  <div className="text-right">
                    <p className="mb-1"><span className="font-semibold">Invoice Date:</span> {new Date(selectedInvoice.invoiceDate).toLocaleDateString()}</p>
                    <p><span className="font-semibold">Due Date:</span> {new Date(selectedInvoice.dueDate).toLocaleDateString()}</p>
                    <p className="mt-2"><span className="font-semibold">Payment Status:</span> 
                      <span className={`ml-2 px-2 py-1 rounded text-xs ${getPaymentStatusColor(selectedInvoice.paymentStatus)}`}>
                        {selectedInvoice.paymentStatus}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="mb-6">
                  <table className="w-full">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-2 text-left">Item</th>
                        <th className="px-4 py-2 text-right">Price</th>
                        <th className="px-4 py-2 text-right">Qty</th>
                        <th className="px-4 py-2 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedInvoice.items?.map((item, index) => (
                        <tr key={index} className="border-b">
                          <td className="px-4 py-3">{item.productName}</td>
                          <td className="px-4 py-3 text-right">₹{item.price}</td>
                          <td className="px-4 py-3 text-right">{item.quantity}</td>
                          <td className="px-4 py-3 text-right font-semibold">₹{item.amount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-end mb-6">
                  <div className="w-64 space-y-2">
                    <div className="flex justify-between text-lg font-semibold border-t pt-2">
                      <span>Total:</span>
                      <span className="text-blue-600">₹{selectedInvoice.totalAmount}</span>
                    </div>
                  </div>
                </div>

                {selectedInvoice.invoiceNotes && (
                  <div className="mb-4">
                    <h3 className="font-semibold mb-2">Notes:</h3>
                    <p className="text-gray-600 whitespace-pre-wrap">{selectedInvoice.invoiceNotes}</p>
                  </div>
                )}

                {selectedInvoice.adminNotes && (
                  <div className="mb-4">
                    <h3 className="font-semibold mb-2">Admin Notes:</h3>
                    <p className="text-gray-600 whitespace-pre-wrap">{selectedInvoice.adminNotes}</p>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3 p-6 border-t">
                <button
                  onClick={() => window.print()}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  <Printer size={16} className="mr-2" />
                  Print
                </button>
                <button
                  onClick={() => setShowInvoicePreview(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminInvoiceDashboard;