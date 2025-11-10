import React, { useState, useEffect, useContext } from "react";
import { Check, Copy, X, ChevronRight, ChevronLeft, Upload, Eye, Edit } from "lucide-react";

// Cart Context for the header (assuming this is defined in your main file)
const CartContext = React.createContext({
  cartItems: [],
  wishlistItems: []
});

// Customer Portal Component
function CustomerPortal({ user, onLogout, onBackToDashboard }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [portalData, setPortalData] = useState({
    brandName: "",
    portalUrl: "",
    logo: null,
    favicon: null,
    brandMessage: "",
    lastUpdated: null,
    isPublished: false
  });
  const [previewMode, setPreviewMode] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [portalExists, setPortalExists] = useState(false);
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const companyDropdownRef = React.useRef(null);
  
  // Generate referral link
  const referralLink = `${window.location.origin}?ref=${user.userId}`;
  
  // Check if portal already exists for this user
  useEffect(() => {
    // In a real app, this would be an API call to check if portal exists
    // For now, we'll simulate with localStorage
    const savedPortal = localStorage.getItem(`portal_${user.userId}`);
    if (savedPortal) {
      const portal = JSON.parse(savedPortal);
      setPortalData(portal);
      setPortalExists(true);
    }
  }, [user.userId]);
  
  const handleCopyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPortalData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleFileUpload = (e, fileType) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size
      if (file.size > 500 * 1024) {
        alert("File size exceeds 500 KB limit");
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPortalData(prev => ({ ...prev, [fileType]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };
  
  const generatePortalUrl = () => {
    const brandName = portalData.brandName.replace(/\s+/g, '-').toLowerCase();
    const url = `${window.location.origin}/portal/${brandName}-${user.userId}`;
    setPortalData(prev => ({ ...prev, portalUrl: url }));
  };
  
  const handleSaveAndPublish = () => {
    const now = new Date();
    const formattedDate = now.toLocaleString();
    
    const updatedPortal = {
      ...portalData,
      lastUpdated: formattedDate,
      isPublished: true
    };
    
    setPortalData(updatedPortal);
    setPortalExists(true);
    
    // Save to localStorage (in a real app, this would be an API call)
    localStorage.setItem(`portal_${user.userId}`, JSON.stringify(updatedPortal));
    
    alert("Portal successfully customized!");
    setCurrentStep(1);
    setEditMode(false);
  };
  
  const handleEditPortal = () => {
    setEditMode(true);
    setCurrentStep(2); // Start editing from Step 2
  };
  
  const handlePreviewPortal = () => {
    setPreviewMode(true);
  };
  
  const handleBackToManage = () => {
    setPreviewMode(false);
  };
  
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">Step 1: Portal Sign Up and Sign In Page</h2>
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <p className="text-sm text-blue-800 mb-2">
                Your referral link will now serve as the Portal Registration Page. When new users register through this link, they will become your direct children in the system hierarchy.
              </p>
              <div className="flex items-center">
                <input 
                  type="text" 
                  value={referralLink} 
                  readOnly 
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-sm"
                />
                <button 
                  onClick={handleCopyReferralLink}
                  className="ml-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>
              {copied && (
                <p className="text-sm text-green-600 mt-2">Link copied to clipboard!</p>
              )}
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-3">Preview of Portal Registration Page</h3>
              <div className="border border-gray-200 rounded-lg p-4 bg-white">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Parent ID</label>
                  <input 
                    type="text" 
                    value={user.userId} 
                    readOnly 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Parent Name</label>
                  <input 
                    type="text" 
                    value={user.name} 
                    readOnly 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input 
                    type="text" 
                    placeholder="Enter your name" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input 
                    type="email" 
                    placeholder="Enter your email" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input 
                    type="password" 
                    placeholder="Enter your password" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact</label>
                  <input 
                    type="tel" 
                    placeholder="Enter your contact number" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
                  Register
                </button>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleNextStep}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Continue
              </button>
            </div>
          </div>
        );
        
      case 2:
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">Step 2: Portal Setup</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Brand Name</label>
                <input 
                  type="text" 
                  name="brandName"
                  value={portalData.brandName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your brand name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Portal URL</label>
                <div className="flex items-center">
                  <input 
                    type="text" 
                    name="portalUrl"
                    value={portalData.portalUrl}
                    onChange={handleInputChange}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Your portal URL will be generated here"
                  />
                  <button
                    onClick={generatePortalUrl}
                    className="ml-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                  >
                    Generate
                  </button>
                </div>
                {portalData.portalUrl && (
                  <div className="mt-2 flex items-center">
                    <span className="text-sm text-gray-600">Your portal URL: </span>
                    <span className="text-sm text-blue-600 font-medium ml-1">{portalData.portalUrl}</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(portalData.portalUrl);
                        alert("URL copied to clipboard!");
                      }}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      <Copy size={16} />
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-6 flex justify-between">
              <button
                onClick={handlePrevStep}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                Back
              </button>
              <button
                onClick={handleNextStep}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Continue
              </button>
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">Step 3: Logo and Branding Customization</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Logo Upload</label>
                <div className="flex items-center space-x-4">
                  <input 
                    type="file" 
                    id="logo-upload"
                    accept="image/png, image/jpg, image/jpeg, image/svg"
                    onChange={(e) => handleFileUpload(e, 'logo')}
                    className="hidden"
                  />
                  <label 
                    htmlFor="logo-upload"
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 cursor-pointer"
                  >
                    Choose File
                  </label>
                  <span className="text-sm text-gray-500">Allowed: PNG, JPG, SVG (Max: 500 KB)</span>
                </div>
                {portalData.logo && (
                  <div className="mt-2">
                    <img 
                      src={portalData.logo} 
                      alt="Logo Preview" 
                      className="h-20 w-auto"
                    />
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Favicon Upload</label>
                <div className="flex items-center space-x-4">
                  <input 
                    type="file" 
                    id="favicon-upload"
                    accept="image/svg, image/png, image/ico"
                    onChange={(e) => handleFileUpload(e, 'favicon')}
                    className="hidden"
                  />
                  <label 
                    htmlFor="favicon-upload"
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 cursor-pointer"
                  >
                    Choose File
                  </label>
                  <span className="text-sm text-gray-500">Allowed: SVG, PNG, ICO (16×16 pixels)</span>
                </div>
                {portalData.favicon && (
                  <div className="mt-2">
                    <img 
                      src={portalData.favicon} 
                      alt="Favicon Preview" 
                      className="h-8 w-auto"
                    />
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Brand Message</label>
                <textarea 
                  name="brandMessage"
                  value={portalData.brandMessage}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Enter your brand message (max 250 characters)"
                  maxLength={250}
                />
                <div className="text-right text-sm text-gray-500">
                  {portalData.brandMessage.length}/250
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-between">
              <button
                onClick={handlePrevStep}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                Back
              </button>
              <button
                onClick={handleNextStep}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Continue
              </button>
            </div>
          </div>
        );
        
      case 4:
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">Step 4: Preview and Publish</h2>
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <h3 className="text-lg font-semibold mb-4">Portal Preview</h3>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                  {portalData.logo ? (
                    <img 
                      src={portalData.logo} 
                      alt="Logo" 
                      className="h-12 w-auto mr-4"
                    />
                  ) : (
                    <div className="h-12 w-12 bg-gray-200 rounded mr-4 flex items-center justify-center">
                      <span className="text-gray-500 text-xs">Logo</span>
                    </div>
                  )}
                  <div>
                    <h4 className="text-xl font-bold">{portalData.brandName || "Your Brand Name"}</h4>
                    <p className="text-sm text-gray-600">{portalData.portalUrl || "your-portal-url.com"}</p>
                  </div>
                </div>
                <div className="mb-4">
                  <p className="text-gray-700">{portalData.brandMessage || "Your brand message will appear here"}</p>
                </div>
                <div className="flex justify-center">
                  <button className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    Sign In
                  </button>
                  <button className="ml-4 px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">
                    Sign Up
                  </button>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-between">
              <button
                onClick={handlePrevStep}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                Back
              </button>
              <button
                onClick={handleSaveAndPublish}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Save and Publish
              </button>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  const renderManagePortal = () => {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6">Manage Customer Portal</h2>
        
        {portalExists ? (
          <div className="space-y-6">
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-500">Brand Name</span>
                  <p className="font-medium">{portalData.brandName}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Portal URL</span>
                  <div className="flex items-center">
                    <p className="font-medium truncate mr-2">{portalData.portalUrl}</p>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(portalData.portalUrl);
                        alert("URL copied to clipboard!");
                      }}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Copy size={16} />
                    </button>
                  </div>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Last Updated</span>
                  <p className="font-medium">{portalData.lastUpdated}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Status</span>
                  <p className="font-medium">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Published
                    </span>
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-4">
              <button
                onClick={handleEditPortal}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
              >
                <Edit size={16} className="mr-2" />
                Edit
              </button>
              <button
                onClick={handlePreviewPortal}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 flex items-center"
              >
                <Eye size={16} className="mr-2" />
                Preview
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">You haven't created a portal yet</p>
            <button
              onClick={() => setCurrentStep(1)}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Create Portal
            </button>
          </div>
        )}
      </div>
    );
  };
  
  const renderPreview = () => {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto p-4">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              {portalData.logo ? (
                <img 
                  src={portalData.logo} 
                  alt="Logo" 
                  className="h-12 w-auto mr-4"
                />
              ) : (
                <div className="h-12 w-12 bg-gray-200 rounded mr-4 flex items-center justify-center">
                  <span className="text-gray-500 text-xs">Logo</span>
                </div>
              )}
              <div>
                <h4 className="text-xl font-bold">{portalData.brandName || "Your Brand Name"}</h4>
                <p className="text-sm text-gray-600">{portalData.portalUrl || "your-portal-url.com"}</p>
              </div>
            </div>
            <div className="mb-4">
              <p className="text-gray-700">{portalData.brandMessage || "Your brand message will appear here"}</p>
            </div>
            <div className="flex justify-center">
              <button className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Sign In
              </button>
              <button className="ml-4 px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">
                Sign Up
              </button>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <button
              onClick={handleBackToManage}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              Back to Manage Portal
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  // Header Component (reused from main app)
  const Header = ({ 
    user,
    onLogout,
    onProfileClick,
    searchQuery,
    setSearchQuery,
    isCompanyDropdownOpen,
    setIsCompanyDropdownOpen,
    companyDropdownRef,
    showSecondaryHeader = false,
    secondaryTitle = '',
    onMenuClick
  }) => {
    const { cartItems, wishlistItems } = useContext(CartContext);
    
    const handleSearch = (e) => {
      e.preventDefault();
      if (searchQuery.trim()) {
        // Handle search
      }
    };
  
    return (
      <>
        <header className="sticky top-0 bg-white z-40 border-b border-gray-200 shadow-sm">
          <div className="max-w-8xl mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              {/* Left Section - Logo and Navigation */}
              <div className="flex items-center space-x-8">
                
                {/* Logo */}
                <div className="flex-shrink-0">
                  <div className="text-2xl font-bold text-black">ENGINEERS</div>
                </div>
                
                {/* Navigation Links */}
                <div className="hidden md:flex items-center space-x-6 text-sm font-bold">
                  <a 
                    href="#all" 
                    className="text-gray-800 hover:text-black uppercase tracking-wide hover:underline transition-colors"
                  >
                    All
                  </a>
                  
                  <a 
                    href="#men" 
                    className="text-gray-800 hover:text-black uppercase tracking-wide hover:underline transition-colors"
                  >
                    Men
                  </a>
                  
                  <a 
                    href="#women" 
                    className="text-gray-800 hover:text-black uppercase tracking-wide hover:underline transition-colors"
                  >
                    Women
                  </a>
                  
                  <a 
                    href="#accessories" 
                    className="text-gray-800 hover:text-black uppercase tracking-wide hover:underline transition-colors"
                  >
                    Accessories
                  </a>
                  
                  <a 
                    href="#home" 
                    className="text-gray-800 hover:text-black uppercase tracking-wide hover:underline transition-colors"
                  >
                    Home
                  </a>
                  
                  <div className="relative" ref={companyDropdownRef}>
                    <button 
                      onClick={() => setIsCompanyDropdownOpen(!isCompanyDropdownOpen)}
                      className="text-gray-800 hover:text-black uppercase tracking-wide font-bold flex items-center space-x-1 transition-colors"
                    >
                      <span>Company</span>
                      {isCompanyDropdownOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                    {isCompanyDropdownOpen && (
                      <div className="absolute top-full left-0 mt-2 w-48 bg-white shadow-lg rounded-md z-50">
                        <a href="#founders" className="block px-4 py-2 hover:bg-gray-100 text-sm font-semibold">About Us</a>
                        <a href="#founders" className="block px-4 py-2 hover:bg-gray-100 text-sm font-semibold">News</a>
                        <a href="#entrepreneurs" className="block px-4 py-2 hover:bg-gray-100 text-sm font-semibold">Entrepreneurs</a>
                        <a href="#brand-owners" className="block px-4 py-2 hover:bg-gray-100 text-sm font-semibold">Brand Owners</a>
                        <a href="#founders" className="block px-4 py-2 hover:bg-gray-100 text-sm font-semibold">Founders</a>
                        <a href="#documents" className="block px-4 py-2 hover:bg-gray-100 text-sm font-semibold">Documents</a>
                        <a href="#founders" className="block px-4 py-2 hover:bg-gray-100 text-sm font-semibold">Bankings</a>
                        <a href="#feedback" className="block px-4 py-2 hover:bg-gray-100 text-sm font-semibold">Legals</a>
                      </div>
                    )}
                  </div>
                  
                  <a href="#services" className="text-gray-800 hover:text-black uppercase tracking-wide hover:underline transition-colors">Services</a>
                  <a href="#contact" className="text-gray-800 hover:text-black uppercase tracking-wide hover:underline transition-colors">Contact Us</a>
                </div>
              </div>
              
              {/* Right Section - Search, Icons, and Auth Button */}
              <div className="flex items-center gap-4">
  
                {/* Search Icon */}
                 <form onSubmit={handleSearch} className="hidden md:flex items-center border border-gray-300 rounded-md px-4 py-2 gap-2 w-72">
                   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                   </svg>
                      <input 
                       type="text" 
                       placeholder="Search Products..." 
                       className="outline-none text-sm flex-1 bg-transparent"
                       value={searchQuery}
                       onChange={(e) => setSearchQuery(e.target.value)}
                     />
                 </form>
  
                {/* Wishlist Icon */}
                <div className="flex flex-col items-center justify-center gap-0.5 cursor-pointer">
                  <div className="relative">
                    <svg xmlns="http://www.w3.org/2000/svg" className="cursor-pointer fill-[#333] inline w-5 h-5"
                      viewBox="0 0 64 64">
                      <path
                        d="M45.5 4A18.53 18.53 0 0 0 32 9.86 18.5 18.5 0 0 0 0 22.5C0 40.92 29.71 59 31 59.71a2 2 0 0 0 2.06 0C34.29 59 64 40.92 64 22.5A18.52 18.52 0 0 0 45.5 4ZM32 55.64C26.83 52.34 4 36.92 4 22.5a14.5 14.5 0 0 1 26.36-8.33 2 2 0 0 0 3.27 0A14.5 14.5 0 0 1 60 22.5c0 14.41-22.83 29.83-28 33.14Z"
                        data-original="#000000" />
                    </svg>
                    <span className="absolute left-auto -ml-1 top-0 rounded-full bg-red-500 px-1 py-0 text-xs text-white">
                      {wishlistItems.length}
                    </span>
                  </div>
                  <span className="text-[13px] font-semibold text-slate-900">Wishlist</span>
                </div>
                
                {/* Cart Icon */}
                <div className="flex flex-col items-center justify-center gap-0.5 cursor-pointer">
                  <div className="relative">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" className="cursor-pointer fill-[#333] inline"
                      viewBox="0 0 512 512">
                      <path
                        d="M164.96 300.004h.024c.02 0 .04-.004.059-.004H437a15.003 15.003 0 0 0 14.422-10.879l60-210a15.003 15.003 0 0 0-2.445-13.152A15.006 15.006 0 0 0 497 60H130.367l-10.722-48.254A15.003 15.003 0 0 0 105 0H15C6.715 0 0 6.715 0 15s6.715 15 15 15h77.969c1.898 8.55 51.312 230.918 54.156 243.71C131.184 280.64 120 296.536 120 315c0 24.812 20.188 45 45 45h272c8.285 0 15-6.715 15-15s-6.715-15-15-15H165c-8.27 0-15-6.73-15-15 0-8.258 6.707-14.977 14.96-14.996zM477.114 90l-51.43 180H177.032l-40-180zM150 405c0 24.813 20.188 45 45 45s45-20.188 45-45-20.188-45-45-45-45 20.188-45 45zm45-15c8.27 0 15 6.73 15 15s-6.73 15-15 15-15-6.73-15-15 6.73-15 15-15zm167 15c0 24.813 20.188 45 45 45s45-20.188 45-45-20.188-45-45-45-45 20.188-45 45zm45-15c8.27 0 15 6.73 15 15s-6.73 15-15 15-15-6.73-15-15 6.73-15 15-15zm0 0"
                        data-original="#000000"></path>
                    </svg>
                    <span className="absolute left-auto -ml-1 top-0 rounded-full bg-red-500 px-1 py-0 text-xs text-white">
                      {cartItems.reduce((total, item) => total + item.quantity, 0)}
                    </span>
                  </div>
                  <span className="text-[13px] font-semibold text-slate-900">Cart</span>
                </div>
                
                {/* User Icon */}
                <div className="flex flex-col items-center justify-center gap-0.5 cursor-pointer" onClick={onProfileClick}>
                  <div className="relative">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="absolute -top-1 -right-1 bg-green-500 w-2 h-2 rounded-full"></span>
                  </div>
                    <span className="text-[13px] font-semibold text-slate-900">Profile</span>
                 </div>
                
                {/* Logout Button */}
                <button 
                  onClick={onLogout}
                  className="px-5 py-2 text-sm font-bold text-gray-800 border border-gray-300 rounded hover:bg-gray-50 transition-colors uppercase tracking-wide"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>
      </>
    );
  };
  
  // Footer Component (reused from main app)
  const Footer = () => {
    return (
      <footer className="py-12 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            {/* Company Info */}
            <div>
              <h3 className="text-2xl font-bold mb-6">About Us</h3>
              <p className="block text-gray-300 hover:text-white font-semibold">
                We are a leading fashion company dedicated to bringing you the latest trends and styles for both men and women.
              </p>
            </div>
            
            {/* Quick Links */}
            <div>
              <h3 className="text-2xl font-bold mb-6">Quick Links</h3>
              <div className="space-y-2">
                <a href="#banking" className="block text-gray-300 hover:text-white font-semibold hover:underline transition-colors">
                  Banking
                </a>
                <a href="#documents" className="block text-gray-300 hover:text-white font-semibold hover:underline transition-colors">
                  Documents
                </a>
                <a href="#business-affiliate" className="block text-gray-300 hover:text-white font-semibold hover:underline transition-colors">
                  Business Affiliate
                </a>
                <a href="#register" className="block text-gray-300 hover:text-white font-semibold hover:underline transition-colors">
                  Register
                </a>
                <a href="#login" className="block text-gray-300 hover:text-white font-semibold hover:underline transition-colors">
                  Login
                </a>
                <a href="#contact" className="block text-gray-300 hover:text-white font-semibold hover:underline transition-colors">
                  Contact Us
                </a>
              </div>
            </div>
  
            {/* Need Help */}
            <div>
              <h3 className="text-2xl font-bold mb-6">Need Help?</h3>
              <div className="space-y-4">
                <a href="#privacy-policy" className="block text-gray-300 hover:text-white font-semibold hover:underline transition-colors">
                  Privacy Policy
                </a>
                <a href="#refund-policy" className="block text-gray-300 hover:text-white font-semibold hover:underline transition-colors">
                  Refund Policy
                </a>
                <a href="#return-refund-policy" className="block text-gray-300 hover:text-white font-semibold hover:underline transition-colors">
                  Return Refund Policy Goods
                </a>
                <a href="#buy-back-policy" className="block text-gray-300 hover:text-white font-semibold hover:underline transition-colors">
                  Buy Back Policy
                </a>
                <a href="#grievance-redressal" className="block text-gray-300 hover:text-white font-semibold hover:underline transition-colors">
                  Grievance Redressal
                </a>
              </div>
            </div>
  
            {/* Policies */}
            <div>
              <h3 className="text-2xl font-bold mb-6">Policies</h3>
              <div className="space-y-4">
                <a href="#terms-policy" className="block text-gray-300 hover:text-white font-semibold hover:underline transition-colors">
                  Terms And Policy
                </a>
                <a href="#direct-sellers-agreement" className="block text-gray-300 hover:text-white font-semibold hover:underline transition-colors">
                  Direct Sellers Agreement
                </a>
                <a href="#terms-services" className="block text-gray-300 hover:text-white font-semibold hover:underline transition-colors">
                  Terms of Services
                </a>
                <a href="#shipping-policy" className="block text-gray-300 hover:text-white font-semibold hover:underline transition-colors">
                  Shipping Policy
                </a>
                <a href="#engineers-franchise" className="block text-gray-300 hover:text-white font-semibold hover:underline transition-colors">
                  Engineers Franchise
                </a>
              </div>
            </div>
          </div>
  
          <div className="text-center">
            <h6 className="block text-gray-300 hover:text-white font-semibold">
              Stay connected with us:
            </h6>
  
            <ul className="flex flex-wrap justify-center gap-x-6 ga-y-3 gap-4 mt-6">
              {/* Facebook */}
              <li>
                <a href="#">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="fill-blue-600 w-8 h-8"
                    viewBox="0 0 49.652 49.652"
                  >
                    <path d="M24.826 0C11.137 0 0 11.137 0 24.826c0 13.688 11.137 24.826 24.826 24.826 13.688 0 24.826-11.138 24.826-24.826C49.652 11.137 38.516 0 24.826 0zM31 25.7h-4.039v14.396h-5.985V25.7h-2.845v-5.088h2.845v-3.291c0-2.357 1.12-6.04 6.04-6.04l4.435.017v4.939h-3.219c-.524 0-1.269.262-1.269 1.386v2.99h4.56z" />
                  </svg>
                </a>
              </li>
  
              {/* LinkedIn */}
              <li>
                <a href="#">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-8 h-8"
                    viewBox="0 0 112.196 112.196"
                  >
                    <circle cx="56.098" cy="56.097" r="56.098" fill="#007ab9" />
                    <path
                      fill="#fff"
                      d="M89.616 60.611v23.128H76.207V62.161c0-5.418-1.936-9.118-6.791-9.118-3.705 0-5.906 2.491-6.878 4.903-.353.862-.444 2.059-.444 3.268v22.524h-13.41s.18-36.546 0-40.329h13.411v5.715c1.782-2.742 4.96-6.662 12.085-6.662 8.822 0 15.436 5.764 15.436 18.149zM34.656 23.969c-4.587 0-7.588 3.011-7.588 6.967 0 3.872 2.914 6.97 7.412 6.97h.087c4.677 0 7.585-3.098 7.585-6.97-.089-3.956-2.908-6.967-7.496-6.967zM27.865 83.739H41.27v-40.33H27.865v40.33z"
                    />
                  </svg>
                </a>
              </li>
  
              {/* Instagram */}
              <li>
                <a href="#">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-8 h-8"
                    viewBox="0 0 152 152"
                  >
                    <defs>
                      <linearGradient
                        id="a"
                        x1="22.26"
                        x2="129.74"
                        y1="22.26"
                        y2="129.74"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop offset="0" stopColor="#fae100" />
                        <stop offset=".15" stopColor="#fcb720" />
                        <stop offset=".3" stopColor="#ff7950" />
                        <stop offset=".5" stopColor="#ff1c74" />
                        <stop offset="1" stopColor="#6c1cd1" />
                      </linearGradient>
                    </defs>
                    <g data-name="Layer 2">
                      <g data-name="03.Instagram">
                        <rect
                          width="152"
                          height="152"
                          fill="url(#a)"
                          rx="76"
                        />
                        <g fill="#fff">
                          <path
                            fill="#ffffff10"
                            d="M133.2 26c-11.08 20.34-26.75 41.32-46.33 60.9S46.31 122.12 26 133.2q-1.91-1.66-3.71-3.46A76 76 0 1 1 129.74 22.26q1.8 1.8 3.46 3.74z"
                          />
                          <path d="M94 36H58a22 22 0 0 0-22 22v36a22 22 0 0 0 22 22h36a22 22 0 0 0 22-22V58a22 22 0 0 0-22-22zm15 54.84A18.16 18.16 0 0 1 90.84 109H61.16A18.16 18.16 0 0 1 43 90.84V61.16A18.16 18.16 0 0 1 61.16 43h29.68A18.16 18.16 0 0 1 109 61.16z" />
                          <path d="m90.59 61.56-.19-.19-.16-.16A20.16 20.16 0 0 0 76 55.33 20.52 20.52 0 0 0 55.62 76a20.75 20.75 0 0 0 6 14.61 20.19 20.19 0 0 0 14.42 6 20.73 20.73 0 0 0 14.55-35.05zM76 89.56A13.56 13.56 0 1 1 89.37 76 13.46 13.46 0 0 1 76 89.56zm26.43-35.18a4.88 4.88 0 0 1-4.85 4.92 4.81 4.81 0 0 1-3.42-1.43 4.93 4.93 0 0 1 3.43-8.39 4.82 4.82 0 0 1 3.09 1.12l.1.1a3.05 3.05 0 0 1 .44.44l.11.12a4.92 4.92 0 0 1 1.1 3.12z" />
                        </g>
                      </g>
                    </g>
                  </svg>
                </a>
              </li>
  
              {/* X (Twitter/X) */}
              <li>
                <a href="javascript:void(0)">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-8 h-8"
                    viewBox="0 0 1227 1227"
                  >
                    <path d="M613.5 0C274.685 0 0 274.685 0 613.5S274.685 1227 613.5 1227 1227 952.315 1227 613.5 952.315 0 613.5 0z" />
                    <path
                      fill="#fff"
                      d="m680.617 557.98 262.632-305.288h-62.235L652.97 517.77 470.833 252.692H260.759l275.427 400.844-275.427 320.142h62.239l240.82-279.931 192.35 279.931h210.074L680.601 557.98zM345.423 299.545h95.595l440.024 629.411h-95.595z"
                    />
                  </svg>
                </a>
              </li>
            </ul>
          </div>
  
          {/* Bottom Footer */}
          <div className="border-t border-gray-700 mt-12 pt-8 text-center">
            <p className="text-gray-400 font-medium">© 2025 Engineers Ecom Pvt Ltd. All rights reserved.</p>
          </div>
        </div>
      </footer>
    );
  };
  
  // Profile Modal Component (reused from main app)
  const ProfileModal = ({ showProfileModal, setShowProfileModal, user, referralLink, copied, handleCopyReferralLink }) => {
    return (
      showProfileModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Profile Information</h3>
              <button 
                onClick={() => setShowProfileModal(false)}
                className="p-1 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">User Name</label>
                <p className="text-gray-900">{user.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">User ID</label>
                <p className="text-gray-900">{user.userId}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Referral Link</label>
                <div className="flex items-center">
                  <input 
                    type="text" 
                    value={referralLink} 
                    readOnly 
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-sm"
                  />
                  <button 
                    onClick={handleCopyReferralLink}
                    className="ml-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button 
                onClick={() => setShowProfileModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )
    );
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Assistant:wght@200;300;400;500;600;700;800&display=swap');
        
        * {
          font-family: 'Assistant', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
        }
      `}</style>
      
      <CartContext.Provider value={{ cartItems: [], wishlistItems: [] }}>
        <Header 
          user={user}
          onLogout={onLogout}
          onProfileClick={() => setShowProfileModal(true)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          isCompanyDropdownOpen={isCompanyDropdownOpen}
          setIsCompanyDropdownOpen={setIsCompanyDropdownOpen}
          companyDropdownRef={companyDropdownRef}
          showSecondaryHeader={true}
          secondaryTitle="Manage Customer Portal"
        />
      </CartContext.Provider>
      
      {/* Dashboard Header with Back Button */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-8xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <button 
                onClick={onBackToDashboard}
                className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              >
                <ChevronLeft size={24} />
              </button>
              
              <div className="flex items-center space-x-4">
                <div className="text-1xl text-gray-600">
                  Manage Customer Portal
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="max-w-8xl mx-auto px-4 py-8">
        {previewMode ? (
          renderPreview()
        ) : editMode || !portalExists ? (
          renderStepContent()
        ) : (
          renderManagePortal()
        )}
      </div>
      
      {/* Profile Modal */}
      <ProfileModal 
        showProfileModal={showProfileModal}
        setShowProfileModal={setShowProfileModal}
        user={user}
        referralLink={referralLink}
        copied={copied}
        handleCopyReferralLink={handleCopyReferralLink}
      />
      
      {/* Footer */}
      <Footer />
    </div>
  );
}

export default CustomerPortal;