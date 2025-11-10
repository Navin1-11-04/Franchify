import React, { useState, useEffect, useContext } from "react";

// Mock Firebase auth functions
const mockAuth = {
  createUserWithEmailAndPassword: async (auth, email, password) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (email === "test@error.com") throw new Error("Email already in use");
    return { user: { email } };
  },
  signInWithEmailAndPassword: async (auth, email, password) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (password === "wrong") throw new Error("Invalid password");
    return { user: { email } };
  }
};

const mockFirebaseAuth = {};

// Cart Context for the new header
const CartContext = React.createContext({
  cartItems: [],
  wishlistItems: []
});

// Binary Tree Node class
class TreeNode {
  constructor(id, name, email, userType, level = 0) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.userType = userType;
    this.level = level;
    this.left = null;
    this.right = null;
    this.parent = null;
    this.directReferrals = []; // IDs of ALL direct children (not just left/right)
    this.directParentId = null; // Who referred this user
    this.directIncome = 0;
    this.indirectIncome = 0;
    this.totalSales = 0;
    this.leftSubtreeSales = 0;
    this.rightSubtreeSales = 0;
    this.carryForwardLeft = 0;
    this.carryForwardRight = 0;
    this.height = 1;
    this.brandName = "";
    // New properties for dashboard
    this.kycVerified = false;
    this.kycData = null;
    this.bankAccount = null;
    this.mobile = "";
    this.joinDate = new Date().toISOString().split('T')[0];
    this.products = [];
  }
}

// MLM Tree Manager
class MLMTreeManager {
  constructor() {
    this.allNodes = new Map();
    this.usersByEmail = new Map();
    this.root = null;
    this.initializeFounders();
  }

  initializeFounders() {
    // Level 0 - Root Founder
    const founder0 = new TreeNode("FOUND001", "Founder Alpha", "founder1@engineers.com", "founder", 0);
    
    // Level 1 - Two Founders
    const founder1 = new TreeNode("FOUND002", "Founder Beta", "founder2@engineers.com", "founder", 1);
    const founder2 = new TreeNode("FOUND003", "Founder Gamma", "founder3@engineers.com", "founder", 1);
    
    // Set up tree structure
    founder0.left = founder1;
    founder0.right = founder2;
    founder1.parent = founder0;
    founder2.parent = founder0;
    
    // Set direct parent relationships
    founder1.directParentId = "FOUND001";
    founder2.directParentId = "FOUND001";
    founder0.directReferrals = ["FOUND002", "FOUND003"];
    
    this.root = founder0;
    
    // Add to maps
    this.allNodes.set("FOUND001", founder0);
    this.allNodes.set("FOUND002", founder1);
    this.allNodes.set("FOUND003", founder2);
    
    this.usersByEmail.set("founder1@engineers.com", founder0);
    this.usersByEmail.set("founder2@engineers.com", founder1);
    this.usersByEmail.set("founder3@engineers.com", founder2);
  }

  // Find next available position in a subtree using BFS
  findNextPositionInSubtree(subtreeRoot) {
    const queue = [subtreeRoot];
    
    while (queue.length > 0) {
      const current = queue.shift();
      
      if (!current.left) {
        return { node: current, position: 'left' };
      }
      if (!current.right) {
        return { node: current, position: 'right' };
      }
      
      if (current.left) queue.push(current.left);
      if (current.right) queue.push(current.right);
    }
    
    return null;
  }

  // Find next available position for CUSTOMER using BFS (entire tree)
  getNextCustomerParentInfo() {
    const queue = [this.root];
    
    while (queue.length > 0) {
      const current = queue.shift();
      
      if (!current.left) {
        return { parentId: current.id, parentName: current.name, position: 'left' };
      }
      if (!current.right) {
        return { parentId: current.id, parentName: current.name, position: 'right' };
      }
      
      if (current.left) queue.push(current.left);
      if (current.right) queue.push(current.right);
    }
    
    return null;
  }

  // Find next available position for BRAND OWNER (only under founders and brand owners)
  getNextBrandOwnerParentInfo() {
    const queue = [this.root];
    
    while (queue.length > 0) {
      const current = queue.shift();
      
      // Only place brand owners under founders or other brand owners
      if (current.userType === 'founder' || current.userType === 'brand_owner') {
        if (!current.left) {
          return { 
            parentId: current.id, 
            parentName: current.name, 
            position: 'left',
            replacingCustomer: null
          };
        }
        
        if (current.left && current.left.userType === 'customer') {
          return {
            parentId: current.id,
            parentName: current.name,
            position: 'left',
            replacingCustomer: current.left
          };
        }
        
        if (!current.right) {
          return { 
            parentId: current.id, 
            parentName: current.name, 
            position: 'right',
            replacingCustomer: null
          };
        }
        
        if (current.right && current.right.userType === 'customer') {
          return {
            parentId: current.id,
            parentName: current.name,
            position: 'right',
            replacingCustomer: current.right
          };
        }
      }
      
      if (current.left) queue.push(current.left);
      if (current.right) queue.push(current.right);
    }
    
    return null;
  }

  generateNextUserId(userType) {
    let prefix = 'CUST';
    if (userType === 'brand_owner') prefix = 'BRAND';
    if (userType === 'founder') prefix = 'FOUND';
    
    const userIds = Array.from(this.allNodes.keys())
      .filter(id => id.startsWith(prefix))
      .map(id => {
        const numPart = id.replace(prefix, '');
        return parseInt(numPart) || 0;
      })
      .sort((a, b) => b - a);
    
    const nextNumber = userIds.length > 0 ? userIds[0] + 1 : 1;
    return `${prefix}${String(nextNumber).padStart(3, '0')}`;
  }

  registerCustomer(name, email, password, contact, dateOfBirth, manualParentId = null) {
    let directParent = null;
    let placementParent = null;
    let position = null;
    
    if (manualParentId) {
      directParent = this.allNodes.get(manualParentId);
      if (!directParent) {
        return { success: false, error: "Invalid parent ID" };
      }
      
      // For 1st and 2nd child, place directly under parent
      if (!directParent.left) {
        placementParent = directParent;
        position = 'left';
      } else if (!directParent.right) {
        placementParent = directParent;
        position = 'right';
      } else {
        // 3rd+ child: find position in parent's subtree using BFS
        const leftPosition = this.findNextPositionInSubtree(directParent.left);
        const rightPosition = this.findNextPositionInSubtree(directParent.right);
        
        // Place in left subtree first, then right (to maintain balance)
        if (leftPosition && (!rightPosition || directParent.left.level <= directParent.right.level)) {
          placementParent = leftPosition.node;
          position = leftPosition.position;
        } else if (rightPosition) {
          placementParent = rightPosition.node;
          position = rightPosition.position;
        } else {
          return { success: false, error: "No available position in parent's subtree" };
        }
      }
    } else {
      const parentInfo = this.getNextCustomerParentInfo();
      
      if (!parentInfo) {
        return { success: false, error: "No available position in tree" };
      }

      placementParent = this.allNodes.get(parentInfo.parentId);
      directParent = placementParent; // Auto-placement means direct parent = placement parent
      position = parentInfo.position;
      
      if (!placementParent) {
        return { success: false, error: "Parent node not found" };
      }
    }

    const newUserId = this.generateNextUserId('customer');
    const newUser = new TreeNode(newUserId, name, email, 'customer', placementParent.level + 1);
    newUser.directParentId = directParent.id;
    newUser.mobile = contact;

    // Place in tree structure
    if (position === 'left') {
      placementParent.left = newUser;
    } else {
      placementParent.right = newUser;
    }
    newUser.parent = placementParent;

    // Give direct income to the DIRECT parent (who referred them)
    const purchaseAmount = 1000;
    const directIncome = purchaseAmount * 0.05;
    directParent.directIncome += directIncome;
    directParent.totalSales += purchaseAmount;
    directParent.directReferrals.push(newUserId);

    this.allNodes.set(newUserId, newUser);
    this.usersByEmail.set(email, newUser);

    return {
      success: true,
      userId: newUserId,
      directParentId: directParent.id,
      directParentName: directParent.name,
      placementParentId: placementParent.id,
      placementParentName: placementParent.name,
      level: newUser.level,
      position: position,
      isThirdPlusChild: directParent.id !== placementParent.id
    };
  }

  registerBrandOwner(name, email, password, contact, brandName, businessRegNo, gstNo) {
    const parentInfo = this.getNextBrandOwnerParentInfo();
    
    if (!parentInfo) {
      return { success: false, error: "No available position for brand owner" };
    }

    const parent = this.allNodes.get(parentInfo.parentId);
    if (!parent) {
      return { success: false, error: "Parent node not found" };
    }

    const newUserId = this.generateNextUserId('brand_owner');
    const newUser = new TreeNode(newUserId, name, email, 'brand_owner', parent.level + 1);
    newUser.brandName = brandName;
    newUser.directParentId = parent.id;
    newUser.mobile = contact;

    const replacedCustomer = parentInfo.replacingCustomer;
    let movedCustomerInfo = null;

    if (parentInfo.position === 'left') {
      parent.left = newUser;
    } else {
      parent.right = newUser;
    }
    newUser.parent = parent;

    if (replacedCustomer) {
      const index = parent.directReferrals.indexOf(replacedCustomer.id);
      if (index > -1) {
        parent.directReferrals.splice(index, 1);
      }
      
      newUser.left = replacedCustomer;
      replacedCustomer.parent = newUser;
      replacedCustomer.level = newUser.level + 1;
      
      newUser.directReferrals.push(replacedCustomer.id);
      replacedCustomer.directParentId = newUser.id;
      
      movedCustomerInfo = {
        customerId: replacedCustomer.id,
        customerName: replacedCustomer.name,
        newPosition: 'left'
      };
    }

    const purchaseAmount = 5000;
    const directIncome = purchaseAmount * 0.05;
    parent.directIncome += directIncome;
    parent.totalSales += purchaseAmount;
    parent.directReferrals.push(newUserId);

    this.allNodes.set(newUserId, newUser);
    this.usersByEmail.set(email, newUser);

    return {
      success: true,
      userId: newUserId,
      brandName: brandName,
      parentId: parent.id,
      parentName: parent.name,
      level: newUser.level,
      position: parentInfo.position,
      replacedCustomer: movedCustomerInfo
    };
  }

  monthlyConsolidation() {
    const allUsers = Array.from(this.allNodes.values());
    
    allUsers.forEach(user => {
      user.leftSubtreeSales = this.calculateSubtreeSales(user.left);
      user.rightSubtreeSales = this.calculateSubtreeSales(user.right);

      user.leftSubtreeSales += user.carryForwardLeft;
      user.rightSubtreeSales += user.carryForwardRight;

      const balancedVolume = Math.min(user.leftSubtreeSales, user.rightSubtreeSales);
      
      if (balancedVolume > 0 && user.userType !== 'brand_owner') {
        user.indirectIncome += balancedVolume * 0.05;
      }

      user.carryForwardLeft = user.leftSubtreeSales - balancedVolume;
      user.carryForwardRight = user.rightSubtreeSales - balancedVolume;
    });

    return { message: "Monthly consolidation completed", totalUsers: allUsers.length };
  }

  calculateSubtreeSales(node) {
    if (!node) return 0;
    return node.totalSales + 
           this.calculateSubtreeSales(node.left) + 
           this.calculateSubtreeSales(node.right);
  }

  getTreeVisualization() {
    const result = [];
    const queue = [{ node: this.root, level: 0 }];
    
    while (queue.length > 0) {
      const { node, level } = queue.shift();
      
      if (!result[level]) result[level] = [];
      
      const directParentNode = node.directParentId ? this.allNodes.get(node.directParentId) : null;
      
      result[level].push({
        id: node.id,
        name: node.name,
        email: node.email,
        userType: node.userType,
        brandName: node.brandName || '',
        hasLeft: !!node.left,
        hasRight: !!node.right,
        leftChildId: node.left ? node.left.id : null,
        rightChildId: node.right ? node.right.id : null,
        directReferralsCount: node.directReferrals.length,
        directReferralIds: node.directReferrals,
        directParentId: node.directParentId,
        directParentName: directParentNode ? directParentNode.name : '',
        directIncome: node.directIncome,
        indirectIncome: node.indirectIncome,
        totalSales: node.totalSales,
        level: node.level
      });
      
      if (node.left) queue.push({ node: node.left, level: level + 1 });
      if (node.right) queue.push({ node: node.right, level: level + 1 });
    }
    
    return result;
  }

  getUserById(userId) {
    return this.allNodes.get(userId);
  }

  // New methods for dashboard functionality
  updateKYC(userId, kycData) {
    const user = this.allNodes.get(userId);
    if (!user) return { success: false, error: "User not found" };
    
    user.kycData = kycData;
    user.kycVerified = true;
    
    return { success: true };
  }

  addBankAccount(userId, bankData) {
    const user = this.allNodes.get(userId);
    if (!user) return { success: false, error: "User not found" };
    
    user.bankAccount = bankData;
    
    return { success: true };
  }

  getFranchiseA(userId) {
    const user = this.allNodes.get(userId);
    if (!user) return null;
    
    // Get left subtree (Franchise A)
    const leftSubtree = [];
    
    // Direct left child
    if (user.left) {
      leftSubtree.push({
        id: user.left.id,
        name: user.left.name,
        joinDate: user.left.joinDate,
        kycVerified: user.left.kycVerified
      });
    }
    
    // Get grandchildren from left subtree
    const getGrandchildren = (node) => {
      if (!node) return [];
      
      const grandchildren = [];
      
      if (node.left) {
        grandchildren.push({
          id: node.left.id,
          name: node.left.name,
          joinDate: node.left.joinDate,
          kycVerified: node.left.kycVerified
        });
        grandchildren.push(...getGrandchildren(node.left));
      }
      
      if (node.right) {
        grandchildren.push({
          id: node.right.id,
          name: node.right.name,
          joinDate: node.right.joinDate,
          kycVerified: node.left.kycVerified
        });
        grandchildren.push(...getGrandchildren(node.right));
      }
      
      return grandchildren;
    };
    
    const grandchildren = getGrandchildren(user.left);
    
    return {
      direct: user.left ? {
        id: user.left.id,
        name: user.left.name,
        joinDate: user.left.joinDate,
        kycVerified: user.left.kycVerified
      } : null,
      grandchildren: grandchildren
    };
  }

  getFranchiseB(userId) {
    const user = this.allNodes.get(userId);
    if (!user) return null;
    
    // Get right subtree (Franchise B)
    const rightSubtree = [];
    
    // Direct right child
    if (user.right) {
      rightSubtree.push({
        id: user.right.id,
        name: user.right.name,
        joinDate: user.right.joinDate,
        kycVerified: user.right.kycVerified
      });
    }
    
    // Get grandchildren from right subtree
    const getGrandchildren = (node) => {
      if (!node) return [];
      
      const grandchildren = [];
      
      if (node.left) {
        grandchildren.push({
          id: node.left.id,
          name: node.left.name,
          joinDate: node.left.joinDate,
          kycVerified: node.left.kycVerified
        });
        grandchildren.push(...getGrandchildren(node.left));
      }
      
      if (node.right) {
        grandchildren.push({
          id: node.right.id,
          name: node.right.name,
          joinDate: node.right.joinDate,
          kycVerified: user.right.kycVerified
        });
        grandchildren.push(...getGrandchildren(node.right));
      }
      
      return grandchildren;
    };
    
    const grandchildren = getGrandchildren(user.right);
    
    return {
      direct: user.right ? {
        id: user.right.id,
        name: user.right.name,
        joinDate: user.right.joinDate,
        kycVerified: user.right.kycVerified
      } : null,
      grandchildren: grandchildren
    };
  }

  getHierarchy(userId) {
    const user = this.allNodes.get(userId);
    if (!user) return null;
    
    // Get parent
    let parent = null;
    if (user.directParentId) {
      const parentNode = this.allNodes.get(user.directParentId);
      if (parentNode) {
        parent = {
          id: parentNode.id,
          name: parentNode.name,
          level: parentNode.level,
          kycVerified: parentNode.kycVerified
        };
      }
    }
    
    // Get children
    const children = [];
    
    if (user.left) {
      children.push({
        id: user.left.id,
        name: user.left.name,
        level: user.left.level,
        kycVerified: user.left.kycVerified,
        position: 'left'
      });
    }
    
    if (user.right) {
      children.push({
        id: user.right.id,
        name: user.right.name,
        level: user.right.level,
        kycVerified: user.right.kycVerified,
        position: 'right'
      });
    }
    
    return {
      parent: parent,
      user: {
        id: user.id,
        name: user.name,
        level: user.level,
        kycVerified: user.kycVerified
      },
      children: children
    };
  }

  getFinancialData(userId) {
    const user = this.allNodes.get(userId);
    if (!user) return null;
    
    // Calculate franchise A and B purchase values
    let franchiseAPurchaseValue = 0;
    let franchiseBPurchaseValue = 0;
    
    // Calculate left subtree sales
    if (user.left) {
      franchiseAPurchaseValue = this.calculateSubtreeSales(user.left);
    }
    
    // Calculate right subtree sales
    if (user.right) {
      franchiseBPurchaseValue = this.calculateSubtreeSales(user.right);
    }
    
    return {
      directIncome: user.directIncome,
      indirectIncome: user.indirectIncome,
      incomeWallet: user.directIncome + user.indirectIncome,
      eWallet: 100, // Default value, can be calculated based on business logic
      franchiseAPurchaseValue: franchiseAPurchaseValue,
      franchiseBPurchaseValue: franchiseBPurchaseValue,
      totalPayout: user.directIncome + user.indirectIncome
    };
  }

  // Product management methods for brand owners
  addProduct(userId, product) {
    const user = this.allNodes.get(userId);
    if (!user || user.userType !== 'brand_owner') return { success: false, error: "User not found or not a brand owner" };
    
    if (!user.products) user.products = [];
    user.products.push(product);
    
    return { success: true };
  }

  updateProduct(userId, product) {
    const user = this.allNodes.get(userId);
    if (!user || user.userType !== 'brand_owner') return { success: false, error: "User not found or not a brand owner" };
    
    if (!user.products) user.products = [];
    
    const index = user.products.findIndex(p => p.id === product.id);
    if (index === -1) return { success: false, error: "Product not found" };
    
    user.products[index] = product;
    
    return { success: true };
  }

  deleteProduct(userId, productId) {
    const user = this.allNodes.get(userId);
    if (!user || user.userType !== 'brand_owner') return { success: false, error: "User not found or not a brand owner" };
    
    if (!user.products) user.products = [];
    
    user.products = user.products.filter(p => p.id !== productId);
    
    return { success: true };
  }

  getProducts(userId) {
    const user = this.allNodes.get(userId);
    if (!user || user.userType !== 'brand_owner') return [];
    
    return user.products || [];
  }
}

const treeManager = new MLMTreeManager();

// Logo and Home Button Component
function LogoAndHomeButton({ onSwitchView }) {
  return ( 
      <button
        onClick={() => onSwitchView('login')}
        className="fixed top-4 right-4 px-4 py-2 text-sm cursor-pointer px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold rounded-lg transition-all duration-300 ease-in-out hover:from-pink-500 hover:to-purple-500"
      >
         Home
      </button>
  );
}

// Updated Header Component
const Header = ({ 
  setCurrentPage, 
  setShowAuth, 
  searchQuery, 
  setSearchQuery,
  isCompanyDropdownOpen,
  setIsCompanyDropdownOpen,
  companyDropdownRef,
  user,
  onLogout,
  onProfileClick,
  showSecondaryHeader = false,
  secondaryTitle = '',
  onMenuClick
}) => {
  const { cartItems, wishlistItems } = useContext(CartContext);
  
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setCurrentPage('all');
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
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage('all');
                  }}
                  className="text-gray-800 hover:text-black uppercase tracking-wide hover:underline transition-colors"
                >
                  All
                </a>
                
                <a 
                  href="#men" 
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage('mens');
                  }}
                  className="text-gray-800 hover:text-black uppercase tracking-wide hover:underline transition-colors"
                >
                  Men
                </a>
                
                <a 
                  href="#women" 
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage('womens');
                  }}
                  className="text-gray-800 hover:text-black uppercase tracking-wide hover:underline transition-colors"
                >
                  Women
                </a>
                
                <a 
                  href="#accessories" 
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage('accessories');
                  }}
                  className="text-gray-800 hover:text-black uppercase tracking-wide hover:underline transition-colors"
                >
                  Accessories
                </a>
                
                <a 
                  href="#home" 
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage('landing');
                  }}
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
                 <Search size={16} className="text-gray-400 flex-shrink-0" />
                    <input 
                     type="text" 
                     placeholder="Search Products..." 
                     className="outline-none text-sm flex-1 bg-transparent"
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                   />
               </form>

              {/* Wishlist Icon */}
              <div 
                className="flex flex-col items-center justify-center gap-0.5 cursor-pointer"
                onClick={() => setCurrentPage('wishlist')}
              >
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
              <div 
                className="flex flex-col items-center justify-center gap-0.5 cursor-pointer"
                onClick={() => setCurrentPage('cart')}
              >
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
              {user ? (
               <div className="flex flex-col items-center justify-center gap-0.5 cursor-pointer" onClick={onProfileClick}>
                <div className="relative">
                  <User size={20} className="text-gray-700" />
                  <span className="absolute -top-1 -right-1 bg-green-500 w-2 h-2 rounded-full"></span>
                </div>
                  <span className="text-[13px] font-semibold text-slate-900">Profile</span>
               </div>
               ) : (
              <div className="flex flex-col items-center justify-center gap-0.5 cursor-pointer">
                 <User size={20} className="text-gray-700" />
                  <span className="text-[13px] font-semibold text-slate-900">Account</span>
              </div>
             )}
              
              {/* Login/Sign Up Button or Logout */}
              {user ? (
                <button 
                  onClick={onLogout}
                  className="px-5 py-2 text-sm font-bold text-gray-800 border border-gray-300 rounded hover:bg-gray-50 transition-colors uppercase tracking-wide"
                >
                  Logout
                </button>
              ) : (
                <button 
                  onClick={() => setShowAuth(true)}
                  className="px-5 py-2 text-sm font-bold text-gray-800 border border-gray-300 rounded hover:bg-gray-50 transition-colors uppercase tracking-wide"
                >
                  Login / Sign Up
                </button>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

// Updated Footer Component
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

// Customer Dashboard Component
function CustomerDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('profile');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [kycData, setKycData] = useState({
    pan: '',
    aadhaar: '',
    address: '',
    panPhoto: null,
    aadhaarPhoto: null
  });
  const [bankData, setBankData] = useState({
    accountNumber: '',
    ifsc: '',
    bankName: '',
    accountHolder: '',
    passbookPhoto: null
  });
  const [franchiseA, setFranchiseA] = useState(null);
  const [franchiseB, setFranchiseB] = useState(null);
  const [hierarchy, setHierarchy] = useState(null);
  const [expandedNodes, setExpandedNodes] = useState({});
  const companyDropdownRef = React.useRef(null);
  
  // Get user data from tree manager
  const userData = treeManager.getUserById(user.userId);
  
  // Generate referral link
  const referralLink = `${window.location.origin}?ref=${user.userId}`;
  
  // Financial data - in a real app, this would come from an API
  const [financialData, setFinancialData] = useState({
    directIncome: 0,
    indirectIncome: 0,
    incomeWallet: 0,
    eWallet: 0,
    franchiseAPurchaseValue: 0,
    franchiseBPurchaseValue: 0
  });
  
  // Load data when component mounts
  React.useEffect(() => {
    if (userData) {
      // Load KYC and bank data if available
      if (userData.kycVerified) {
        setKycData({
          pan: 'XXXXXX1234',
          aadhaar: 'XXXXXX5678',
          address: '123 Main Street, City, State',
          panPhoto: userData.kycData?.panPhoto || null,
          aadhaarPhoto: userData.kycData?.aadhaarPhoto || null
        });
      }
      
      if (userData.bankAccount) {
        setBankData({
          ...userData.bankAccount,
          passbookPhoto: userData.bankAccount.passbookPhoto || null
        });
      }
      
      // Load franchise data
      setFranchiseA(treeManager.getFranchiseA(user.userId));
      setFranchiseB(treeManager.getFranchiseB(user.userId));
      
      // Load hierarchy data
      setHierarchy(treeManager.getHierarchy(user.userId));
      
      // Load financial data
      const data = treeManager.getFinancialData(user.userId);
      if (data) {
        setFinancialData(data);
      }
    }
  }, [userData, user.userId]);
  
  const handleCopyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleKYCSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would submit to a backend
    const result = treeManager.updateKYC(user.userId, kycData);
    if (result.success) {
      alert('KYC verification submitted successfully!');
      // Update user data
      const updatedUser = treeManager.getUserById(user.userId);
      if (updatedUser) {
        setHierarchy(treeManager.getHierarchy(user.userId));
      }
    } else {
      alert('Error submitting KYC verification');
    }
  };
  
  const handleBankSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would submit to a backend
    const result = treeManager.addBankAccount(user.userId, bankData);
    if (result.success) {
      alert('Bank account added successfully!');
      // Update user data
      const updatedUser = treeManager.getUserById(user.userId);
      if (updatedUser) {
        setHierarchy(treeManager.getHierarchy(user.userId));
      }
    } else {
      alert('Error adding bank account');
    }
  };
  
  const handleFileUpload = (e, fileType) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (fileType === 'panPhoto') {
          setKycData({...kycData, panPhoto: reader.result});
        } else if (fileType === 'aadhaarPhoto') {
          setKycData({...kycData, aadhaarPhoto: reader.result});
        } else if (fileType === 'passbookPhoto') {
          setBankData({...bankData, passbookPhoto: reader.result});
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  const toggleNodeExpansion = (nodeId) => {
    setExpandedNodes(prev => ({
      ...prev,
      [nodeId]: !prev[nodeId]
    }));
  };
  
  const renderHierarchyNode = (node, level = 0) => {
    const isExpanded = expandedNodes[node.id] || false;
    const hasChildren = node.children && node.children.length > 0;
    
    return (
      <div key={node.id} className="ml-4">
        <div className="flex items-center mb-2">
          <div className="flex items-center p-2 border rounded-lg bg-white shadow-sm">
            {hasChildren && (
              <button 
                onClick={() => toggleNodeExpansion(node.id)}
                className="mr-2 text-gray-500 hover:text-gray-700"
              >
                {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </button>
            )}
            <div>
              <div className="font-medium">{node.name}</div>
              <div className="text-sm text-gray-500">ID: {node.id}</div>
              <div className="text-xs">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  node.kycVerified 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {node.kycVerified ? 'KYC Verified' : 'KYC Pending'}
                </span>
              </div>
            </div>
          </div>
        </div>
        {isExpanded && hasChildren && (
          <div className="ml-4 border-l-2 border-gray-200 pl-4">
            {node.children.map(child => renderHierarchyNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };
  
  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">Entrepreneur Dashboard</h2>
            
            {/* Financial Overview */}
            <div className="mb-8 p-4 bg-blue-50 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Financial Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg shadow">
                  <div className="text-sm text-gray-500 mb-1">Total Payout</div>
                  <div className="text-2xl font-bold text-blue-600">
                    ${financialData.directIncome + financialData.indirectIncome}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Direct: ${financialData.directIncome} | Indirect: ${financialData.indirectIncome}
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  <div className="text-sm text-gray-500 mb-1">Income Wallet</div>
                  <div className="text-2xl font-bold text-green-600">
                    ${financialData.incomeWallet}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Available for withdrawal</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  <div className="text-sm text-gray-500 mb-1">E-Wallet</div>
                  <div className="text-2xl font-bold text-purple-600">
                    ${financialData.eWallet}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Available for purchases</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  <div className="text-sm text-gray-500 mb-1">Total Purchase Value</div>
                  <div className="text-lg font-bold text-orange-600">
                    Franchise A: ${financialData.franchiseAPurchaseValue}
                  </div>
                  <div className="text-lg font-bold text-orange-600">
                    Franchise B: ${financialData.franchiseBPurchaseValue}
                  </div>
                </div>
              </div>
            </div>
            
            {/* User Information */}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">KYC Status</label>
                <div className="flex items-center">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    userData?.kycVerified 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {userData?.kycVerified ? 'Verified' : 'Not Verified'}
                  </span>
                  {!userData?.kycVerified && (
                    <button 
                      onClick={() => setActiveTab('kyc')}
                      className="ml-3 text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Verify Now
                    </button>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bank Account</label>
                <div className="flex items-center">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    userData?.bankAccount 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {userData?.bankAccount ? 'Added' : 'Not Added'}
                  </span>
                  {!userData?.bankAccount && (
                    <button 
                      onClick={() => setActiveTab('bank')}
                      className="ml-3 text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Add Now
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'franchiseA':
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">Franchise A (Left Team)</h2>
            {franchiseA ? (
              <div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          S.No
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User ID
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User Name
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date of Joining
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          KYC Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {franchiseA.direct ? (
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">1</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{franchiseA.direct.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{franchiseA.direct.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{franchiseA.direct.joinDate}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              franchiseA.direct.kycVerified 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {franchiseA.direct.kycVerified ? 'Verified' : 'Not Verified'}
                            </span>
                          </td>
                        </tr>
                      ) : (
                        <tr>
                          <td colSpan="5" className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                            No direct referral in Franchise A
                          </td>
                        </tr>
                      )}
                      {franchiseA.grandchildren.map((child, index) => (
                        <tr key={child.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 2}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{child.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{child.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{child.joinDate}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              child.kycVerified 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {child.kycVerified ? 'Verified' : 'Not Verified'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                <p className="text-center text-gray-500">No data available for Franchise A</p>
              </div>
            )}
          </div>
        );
        
      case 'franchiseB':
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">Franchise B (Right Team)</h2>
            {franchiseB ? (
              <div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          S.No
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User ID
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User Name
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date of Joining
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          KYC Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {franchiseB.direct ? (
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">1</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{franchiseB.direct.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{franchiseB.direct.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{franchiseB.direct.joinDate}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              franchiseB.direct.kycVerified 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {franchiseB.direct.kycVerified ? 'Verified' : 'Not Verified'}
                            </span>
                          </td>
                        </tr>
                      ) : (
                        <tr>
                          <td colSpan="5" className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                            No direct referral in Franchise B
                          </td>
                        </tr>
                      )}
                      {franchiseB.grandchildren.map((child, index) => (
                        <tr key={child.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 2}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{child.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{child.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{child.joinDate}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              child.kycVerified 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {child.kycVerified ? 'Verified' : 'Not Verified'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                <p className="text-center text-gray-500">No data available for Franchise B</p>
              </div>
            )}
          </div>
        );
        
      case 'hierarchy':
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">Hierarchy</h2>

            {hierarchy ? (
              <div>
                {/* Parent Section */}
                {hierarchy.parent && (
                  <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-blue-50">
                    <h3 className="text-lg font-semibold mb-2">Parent</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-gray-500">User ID:</span>
                        <p className="font-medium">{hierarchy.parent.id}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Name:</span>
                        <p className="font-medium">{hierarchy.parent.name}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Level:</span>
                        <p className="font-medium">{hierarchy.parent.level}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">KYC Status:</span>
                        <p className="font-medium">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              hierarchy.parent.kycVerified
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {hierarchy.parent.kycVerified
                              ? 'Verified'
                              : 'Not Verified'}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* You Section */}
                <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-green-50">
                  <h3 className="text-lg font-semibold mb-2">You</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-500">User ID:</span>
                      <p className="font-medium">{hierarchy.user.id}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Name:</span>
                      <p className="font-medium">{hierarchy.user.name}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Level:</span>
                      <p className="font-medium">{hierarchy.user.level}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">KYC Status:</span>
                      <p className="font-medium">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            hierarchy.user.kycVerified
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {hierarchy.user.kycVerified
                            ? 'Verified'
                            : 'Not Verified'}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Children Section */}
                {hierarchy.children.length > 0 ? (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Children</h3>
                    <div className="space-y-4">
                      {hierarchy.children.map((child) => (
                        <div
                          key={child.id}
                          className="p-4 border border-gray-200 rounded-lg"
                        >
                          <div className="flex items-center mb-2">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium mr-2 ${
                                child.position === 'left'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-purple-100 text-purple-800'
                              }`}
                            >
                              {child.position === 'left'
                                ? 'Franchise A'
                                : 'Franchise B'}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <span className="text-sm text-gray-500">User ID:</span>
                              <p className="font-medium">{child.id}</p>
                            </div>
                            <div>
                              <span className="text-sm text-gray-500">Name:</span>
                              <p className="font-medium">{child.name}</p>
                            </div>
                            <div>
                              <span className="text-sm text-gray-500">Level:</span>
                              <p className="font-medium">{child.level}</p>
                            </div>
                            <div>
                              <span className="text-sm text-gray-500">KYC Status:</span>
                              <p className="font-medium">
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    child.kycVerified
                                      ? 'bg-green-100 text-green-800'
                                      : 'bg-red-100 text-red-800'
                                  }`}
                                >
                                  {child.kycVerified
                                    ? 'Verified'
                                    : 'Not Verified'}
                                </span>
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <p className="text-center text-gray-500">
                      No children in your hierarchy
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                <p className="text-center text-gray-500">
                  No hierarchy data available
                </p>
              </div>
            )}
          </div>
        );

      case 'kyc':
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">KYC Verification</h2>
            {userData?.kycVerified ? (
              <div className="p-4 border border-green-200 rounded-lg bg-green-50">
                <div className="flex items-center">
                  <Check className="text-green-600 mr-2" size={24} />
                  <div>
                    <h3 className="text-lg font-semibold text-green-800">KYC Verified</h3>
                    <p className="text-green-700">Your KYC has been successfully verified.</p>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleKYCSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">PAN Number</label>
                    <input 
                      type="text" 
                      value={kycData.pan}
                      onChange={(e) => setKycData({...kycData, pan: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your PAN number"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">PAN Card Photo</label>
                    <div className="flex items-center space-x-4">
                      <input 
                        type="file" 
                        id="pan-photo"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'panPhoto')}
                        className="hidden"
                      />
                      <label 
                        htmlFor="pan-photo"
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 cursor-pointer"
                      >
                        Choose File
                      </label>
                      {kycData.panPhoto && (
                        <div className="flex items-center">
                          <span className="text-sm text-green-600">Photo uploaded</span>
                          <button 
                            type="button"
                            onClick={() => setKycData({...kycData, panPhoto: null})}
                            className="ml-2 text-red-500 hover:text-red-700"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Aadhaar Number</label>
                    <input 
                      type="text" 
                      value={kycData.aadhaar}
                      onChange={(e) => setKycData({...kycData, aadhaar: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your Aadhaar number"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Aadhaar Card Photo</label>
                    <div className="flex items-center space-x-4">
                      <input 
                        type="file" 
                        id="aadhaar-photo"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'aadhaarPhoto')}
                        className="hidden"
                      />
                      <label 
                        htmlFor="aadhaar-photo"
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 cursor-pointer"
                      >
                        Choose File
                      </label>
                      {kycData.aadhaarPhoto && (
                        <div className="flex items-center">
                          <span className="text-sm text-green-600">Photo uploaded</span>
                          <button 
                            type="button"
                            onClick={() => setKycData({...kycData, aadhaarPhoto: null})}
                            className="ml-2 text-red-500 hover:text-red-700"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                    <textarea 
                      value={kycData.address}
                      onChange={(e) => setKycData({...kycData, address: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={3}
                      placeholder="Enter your address"
                      required
                    />
                  </div>
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="kyc-terms"
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      required
                    />
                    <label htmlFor="kyc-terms" className="ml-2 text-sm text-gray-700">
                      I agree to the terms and conditions for KYC verification
                    </label>
                  </div>
                  <button 
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Submit KYC Verification
                  </button>
                </div>
              </form>
            )}
          </div>
        );
        
      case 'bank':
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">Bank Account</h2>
            {userData?.bankAccount ? (
              <div className="p-4 border border-green-200 rounded-lg bg-green-50">
                <div className="flex items-center">
                  <Check className="text-green-600 mr-2" size={24} />
                  <div>
                    <h3 className="text-lg font-semibold text-green-800">Bank Account Added</h3>
                    <p className="text-green-700">Your bank account has been successfully added.</p>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-500">Account Number:</span>
                    <p className="font-medium">XXXXXX{userData.bankAccount.accountNumber.slice(-4)}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">IFSC Code:</span>
                    <p className="font-medium">{userData.bankAccount.ifsc}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Bank Name:</span>
                    <p className="font-medium">{userData.bankAccount.bankName}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Account Holder:</span>
                    <p className="font-medium">{userData.bankAccount.accountHolder}</p>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleBankSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Account Number</label>
                    <input 
                      type="text" 
                      value={bankData.accountNumber}
                      onChange={(e) => setBankData({...bankData, accountNumber: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your account number"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">IFSC Code</label>
                    <input 
                      type="text" 
                      value={bankData.ifsc}
                      onChange={(e) => setBankData({...bankData, ifsc: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your IFSC code"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bank Name</label>
                    <input 
                      type="text" 
                      value={bankData.bankName}
                      onChange={(e) => setBankData({...bankData, bankName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your bank name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Account Holder Name</label>
                    <input 
                      type="text" 
                      value={bankData.accountHolder}
                      onChange={(e) => setBankData({...bankData, accountHolder: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter account holder name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bank Passbook Photo</label>
                    <div className="flex items-center space-x-4">
                      <input 
                        type="file" 
                        id="passbook-photo"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'passbookPhoto')}
                        className="hidden"
                      />
                      <label 
                        htmlFor="passbook-photo"
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 cursor-pointer"
                      >
                        Choose File
                      </label>
                      {bankData.passbookPhoto && (
                        <div className="flex items-center">
                          <span className="text-sm text-green-600">Photo uploaded</span>
                          <button 
                            type="button"
                            onClick={() => setBankData({...bankData, passbookPhoto: null})}
                            className="ml-2 text-red-500 hover:text-red-700"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="bank-terms"
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      required
                    />
                    <label htmlFor="bank-terms" className="ml-2 text-sm text-gray-700">
                      I agree to the terms and conditions for adding bank account
                    </label>
                  </div>
                  <button 
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Add Bank Account
                  </button>
                </div>
              </form>
            )}
          </div>
        );
        
      default:
        return null;
    }
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
          setCurrentPage={() => {}}
          setShowAuth={() => {}}
          showSecondaryHeader={true}
          secondaryTitle="Customer Dashboard"
          onMenuClick={() => setIsMenuOpen(!isMenuOpen)}
        />
      </CartContext.Provider>
      
      {/* Dashboard Header with Menu */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-8xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              {/* Menu Button */}
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              
              <div className="flex items-center space-x-4">
                <div className="text-1xl text-gray-600">
                  Welcome, <span className="font-semibold">{user.name}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Side Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black opacity-50" onClick={() => setIsMenuOpen(false)}></div>
          <div className="relative flex flex-col w-64 bg-white h-full shadow-xl">
            <div className="flex items-center justify-between p-4 border-b">
              <div className="text-lg font-semibold">Menu</div>
              <button 
                onClick={() => setIsMenuOpen(false)}
                className="p-1 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto py-2">
              <button
                onClick={() => {
                  setActiveTab('profile');
                  setIsMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm font-medium ${
                  activeTab === 'profile' 
                    ? 'bg-blue-100 text-blue-700 border-r-4 border-blue-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => {
                  setActiveTab('franchiseA');
                  setIsMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm font-medium ${
                  activeTab === 'franchiseA' 
                    ? 'bg-blue-100 text-blue-700 border-r-4 border-blue-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Franchise A
              </button>
              <button
                onClick={() => {
                  setActiveTab('franchiseB');
                  setIsMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm font-medium ${
                  activeTab === 'franchiseB' 
                    ? 'bg-blue-100 text-blue-700 border-r-4 border-blue-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Franchise B
              </button>
              <button
                onClick={() => {
                  setActiveTab('hierarchy');
                  setIsMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm font-medium ${
                  activeTab === 'hierarchy' 
                    ? 'bg-blue-100 text-blue-700 border-r-4 border-blue-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Hierarchy
              </button>
              <button
                onClick={() => {
                  setActiveTab('kyc');
                  setIsMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm font-medium ${
                  activeTab === 'kyc' 
                    ? 'bg-blue-100 text-blue-700 border-r-4 border-blue-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                KYC Verification
              </button>
              <button
                onClick={() => {
                  setActiveTab('bank');
                  setIsMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm font-medium ${
                  activeTab === 'bank' 
                    ? 'bg-blue-100 text-blue-700 border-r-4 border-blue-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Add Bank Account
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <div className="max-w-8xl mx-auto px-4 py-8">
        {renderTabContent()}
      </div>
      
      {/* Profile Modal */}
      {showProfileModal && (
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
      )}
      
      {/* Footer */}
      <Footer />
    </div>
  );
}

// Brand Owner Dashboard Component
function BrandOwnerDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [kycData, setKycData] = useState({
    pan: '',
    aadhaar: '',
    address: '',
    panPhoto: null,
    aadhaarPhoto: null
  });
  const [bankData, setBankData] = useState({
    accountNumber: '',
    ifsc: '',
    bankName: '',
    accountHolder: '',
    passbookPhoto: null
  });
  const [products, setProducts] = useState([]);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    price: '',
    offer: '',
    fitType: '',
    colors: '',
    sizes: '',
    material: '',
    care: '',
    images: [],
    instagramLink: ''
  });
  const companyDropdownRef = React.useRef(null);
  
  // Get user data from tree manager
  const userData = treeManager.getUserById(user.userId);
  
  // Generate referral link
  const referralLink = `${window.location.origin}?ref=${user.userId}`;
  
  // Financial data - in a real app, this would come from an API
  const [financialData, setFinancialData] = useState({
    directIncome: 0,
    indirectIncome: 0,
    incomeWallet: 0,
    eWallet: 0,
    totalPayout: 0
  });
  
  // Load data when component mounts
  React.useEffect(() => {
    if (userData) {
      // Load KYC and bank data if available
      if (userData.kycVerified) {
        setKycData({
          pan: 'XXXXXX1234',
          aadhaar: 'XXXXXX5678',
          address: '123 Main Street, City, State',
          panPhoto: userData.kycData?.panPhoto || null,
          aadhaarPhoto: userData.kycData?.aadhaarPhoto || null
        });
      }
      
      if (userData.bankAccount) {
        setBankData({
          ...userData.bankAccount,
          passbookPhoto: userData.bankAccount.passbookPhoto || null
        });
      }
      
      // Load products
      setProducts(treeManager.getProducts(user.userId));
      
      // Load financial data
      const data = treeManager.getFinancialData(user.userId);
      if (data) {
        setFinancialData(data);
      }
    }
  }, [userData, user.userId]);
  
  const handleCopyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleKYCSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would submit to a backend
    const result = treeManager.updateKYC(user.userId, kycData);
    if (result.success) {
      alert('KYC verification submitted successfully!');
      // Update user data
      const updatedUser = treeManager.getUserById(user.userId);
      if (updatedUser) {
        // Update state with real data
        setKycData({
          pan: 'XXXXXX1234',
          aadhaar: 'XXXXXX5678',
          address: kycData.address,
          panPhoto: kycData.panPhoto,
          aadhaarPhoto: kycData.aadhaarPhoto
        });
      }
    } else {
      alert('Error submitting KYC verification');
    }
  };
  
  const handleBankSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would submit to a backend
    const result = treeManager.addBankAccount(user.userId, bankData);
    if (result.success) {
      alert('Bank account added successfully!');
      // Update user data
      const updatedUser = treeManager.getUserById(user.userId);
      if (updatedUser) {
        setBankData({
          ...bankData,
          passbookPhoto: bankData.passbookPhoto
        });
      }
    } else {
      alert('Error adding bank account');
    }
  };
  
  const handleFileUpload = (e, fileType) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (fileType === 'panPhoto') {
          setKycData({...kycData, panPhoto: reader.result});
        } else if (fileType === 'aadhaarPhoto') {
          setKycData({...kycData, aadhaarPhoto: reader.result});
        } else if (fileType === 'passbookPhoto') {
          setBankData({...bankData, passbookPhoto: reader.result});
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleProductImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const readers = files.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
    });
    
    Promise.all(readers).then(images => {
      setProductForm({
        ...productForm,
        images: [...productForm.images, ...images]
      });
    });
  };
  
  const removeProductImage = (index) => {
    setProductForm({
      ...productForm,
      images: productForm.images.filter((_, i) => i !== index)
    });
  };
  
  const handleProductSubmit = (e) => {
    e.preventDefault();
    
    if (editingProduct) {
      // Update existing product - REAL TIME UPDATE
      const updatedProducts = products.map(p => 
        p.id === editingProduct.id 
          ? { ...productForm, id: editingProduct.id }
          : p
      );
      setProducts(updatedProducts);
      
      // Update in treeManager
      treeManager.updateProduct(user.userId, { ...productForm, id: editingProduct.id });
      
      alert('Product updated successfully!');
    } else {
      // Add new product - REAL TIME UPDATE
      const newProduct = {
        ...productForm,
        id: Date.now().toString()
      };
      setProducts([...products, newProduct]);
      
      // Save to treeManager
      treeManager.addProduct(user.userId, newProduct);
      
      alert('Product added successfully!');
    }
    
    // Reset form
    setProductForm({
      name: '',
      price: '',
      offer: '',
      fitType: '',
      colors: '',
      sizes: '',
      material: '',
      care: '',
      images: [],
      instagramLink: ''
    });
    setEditingProduct(null);
    setShowProductModal(false);
  };
  
  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setProductForm(product);
    setShowProductModal(true);
  };
  
  const handleDeleteProduct = (productId) => {
    if (confirm('Are you sure you want to delete this product?')) {
      // Delete from state - REAL TIME UPDATE
      setProducts(products.filter(p => p.id !== productId));
      
      // Delete from treeManager
      treeManager.deleteProduct(user.userId, productId);
      
      alert('Product deleted successfully!');
    }
  };
  
  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">Brand Owner Dashboard</h2>
            
            {/* Financial Overview - REAL TIME DATA */}
            <div className="mb-8 p-4 bg-blue-50 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Financial Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg shadow">
                  <div className="text-sm text-gray-500 mb-1">Total Payout</div>
                  <div className="text-2xl font-bold text-blue-600">
                    ${financialData.totalPayout}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Total earnings from direct income</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  <div className="text-sm text-gray-500 mb-1">Income Wallet</div>
                  <div className="text-2xl font-bold text-green-600">
                    ${financialData.incomeWallet}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Available for withdrawal</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  <div className="text-sm text-gray-500 mb-1">E-Wallet</div>
                  <div className="text-2xl font-bold text-purple-600">
                    ${financialData.eWallet}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Available for purchases</div>
                </div>
              </div>
            </div>
            
            {/* User Status - REAL TIME DATA */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">KYC Status</label>
                <div className="flex items-center">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    userData?.kycVerified 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {userData?.kycVerified ? 'Verified' : 'Not Verified'}
                  </span>
                  {!userData?.kycVerified && (
                    <button 
                      onClick={() => setActiveTab('kyc')}
                      className="ml-3 text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Verify Now
                    </button>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bank Account</label>
                <div className="flex items-center">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    userData?.bankAccount 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {userData?.bankAccount ? 'Added' : 'Not Added'}
                  </span>
                  {!userData?.bankAccount && (
                    <button 
                      onClick={() => setActiveTab('bank')}
                      className="ml-3 text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Add Now
                    </button>
                  )}
                </div>
              </div>
            </div>
            
            {/* Product Statistics - REAL TIME DATA */}
            <div className="mb-8 p-4 bg-green-50 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Product Statistics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg shadow">
                  <div className="text-sm text-gray-500 mb-1">Total Products</div>
                  <div className="text-2xl font-bold text-green-600">
                    {products.length}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Products uploaded</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  <div className="text-sm text-gray-500 mb-1">Product Views</div>
                  <div className="text-2xl font-bold text-orange-600">
                    {products.reduce((sum, p) => sum + (p.views || 0), 0)}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Total product views</div>
                </div>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => setActiveTab('products')}
                className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-md"
              >
                <div className="text-lg font-semibold">Manage Products</div>
                <div className="text-sm opacity-90 mt-1">Add, edit, or remove products</div>
              </button>
              <button
                onClick={() => setActiveTab('kyc')}
                className="p-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-md"
              >
                <div className="text-lg font-semibold">KYC Verification</div>
                <div className="text-sm opacity-90 mt-1">Complete your verification</div>
              </button>
              <button
                onClick={() => setActiveTab('bank')}
                className="p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all shadow-md"
              >
                <div className="text-lg font-semibold">Bank Details</div>
                <div className="text-sm opacity-90 mt-1">Add or update bank info</div>
              </button>
            </div>
          </div>
        );
        
      case 'products':
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Product Management</h2>
              <button
                onClick={() => {
                  setEditingProduct(null);
                  setProductForm({
                    name: '',
                    price: '',
                    offer: '',
                    fitType: '',
                    colors: '',
                    sizes: '',
                    material: '',
                    care: '',
                    images: [],
                    instagramLink: ''
                  });
                  setShowProductModal(true);
                }}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <Plus size={20} className="mr-2" />
                Add Product
              </button>
            </div>
            
            {products.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map(product => (
                  <div key={product.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    {product.images && product.images.length > 0 ? (
                      <img 
                        src={product.images[0]} 
                        alt={product.name}
                        className="w-full h-48 object-cover"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400">No Image</span>
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                      <div className="space-y-1 text-sm text-gray-600 mb-4">
                        <p><span className="font-medium">Price:</span> ${product.price}</p>
                        {product.offer && <p><span className="font-medium">Offer:</span> {product.offer}</p>}
                        {product.fitType && <p><span className="font-medium">Fit & Type:</span> {product.fitType}</p>}
                        {product.colors && <p><span className="font-medium">Colors:</span> {product.colors}</p>}
                        {product.sizes && <p><span className="font-medium">Sizes:</span> {product.sizes}</p>}
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditProduct(product)}
                          className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                          <Edit size={16} className="mr-1" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="flex-1 flex items-center justify-center px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                        >
                          <Trash2 size={16} className="mr-1" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 border border-gray-200 rounded-lg bg-gray-50 text-center">
                <p className="text-gray-500 mb-4">No products added yet</p>
                <button
                  onClick={() => setShowProductModal(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Add Your First Product
                </button>
              </div>
            )}
          </div>
        );
        
      case 'kyc':
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">KYC Verification</h2>
            {userData?.kycVerified ? (
              <div className="p-4 border border-green-200 rounded-lg bg-green-50">
                <div className="flex items-center">
                  <Check className="text-green-600 mr-2" size={24} />
                  <div>
                    <h3 className="text-lg font-semibold text-green-800">KYC Verified</h3>
                    <p className="text-green-700">Your KYC has been successfully verified.</p>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleKYCSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">PAN Number</label>
                    <input 
                      type="text" 
                      value={kycData.pan}
                      onChange={(e) => setKycData({...kycData, pan: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your PAN number"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">PAN Card Photo</label>
                    <div className="flex items-center space-x-4">
                      <input 
                        type="file" 
                        id="pan-photo"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'panPhoto')}
                        className="hidden"
                      />
                      <label 
                        htmlFor="pan-photo"
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 cursor-pointer"
                      >
                        Choose File
                      </label>
                      {kycData.panPhoto && (
                        <div className="flex items-center">
                          <span className="text-sm text-green-600">Photo uploaded</span>
                          <button 
                            type="button"
                            onClick={() => setKycData({...kycData, panPhoto: null})}
                            className="ml-2 text-red-500 hover:text-red-700"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Aadhaar Number</label>
                    <input 
                      type="text" 
                      value={kycData.aadhaar}
                      onChange={(e) => setKycData({...kycData, aadhaar: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your Aadhaar number"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Aadhaar Card Photo</label>
                    <div className="flex items-center space-x-4">
                      <input 
                        type="file" 
                        id="aadhaar-photo"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'aadhaarPhoto')}
                        className="hidden"
                      />
                      <label 
                        htmlFor="aadhaar-photo"
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 cursor-pointer"
                      >
                        Choose File
                      </label>
                      {kycData.aadhaarPhoto && (
                        <div className="flex items-center">
                          <span className="text-sm text-green-600">Photo uploaded</span>
                          <button 
                            type="button"
                            onClick={() => setKycData({...kycData, aadhaarPhoto: null})}
                            className="ml-2 text-red-500 hover:text-red-700"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                    <textarea 
                      value={kycData.address}
                      onChange={(e) => setKycData({...kycData, address: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={3}
                      placeholder="Enter your address"
                      required
                    />
                  </div>
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="kyc-terms"
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      required
                    />
                    <label htmlFor="kyc-terms" className="ml-2 text-sm text-gray-700">
                      I agree to the terms and conditions for KYC verification
                    </label>
                  </div>
                  <button 
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Submit KYC Verification
                  </button>
                </div>
              </form>
            )}
          </div>
        );
        
      case 'bank':
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">Bank Account</h2>
            {userData?.bankAccount ? (
              <div className="p-4 border border-green-200 rounded-lg bg-green-50">
                <div className="flex items-center">
                  <Check className="text-green-600 mr-2" size={24} />
                  <div>
                    <h3 className="text-lg font-semibold text-green-800">Bank Account Added</h3>
                    <p className="text-green-700">Your bank account has been successfully added.</p>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-500">Account Number:</span>
                    <p className="font-medium">XXXXXX{userData.bankAccount.accountNumber.slice(-4)}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">IFSC Code:</span>
                    <p className="font-medium">{userData.bankAccount.ifsc}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Bank Name:</span>
                    <p className="font-medium">{userData.bankAccount.bankName}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Account Holder:</span>
                    <p className="font-medium">{userData.bankAccount.accountHolder}</p>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleBankSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Account Number</label>
                    <input 
                      type="text" 
                      value={bankData.accountNumber}
                      onChange={(e) => setBankData({...bankData, accountNumber: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your account number"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">IFSC Code</label>
                    <input 
                      type="text" 
                      value={bankData.ifsc}
                      onChange={(e) => setBankData({...bankData, ifsc: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your IFSC code"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bank Name</label>
                    <input 
                      type="text" 
                      value={bankData.bankName}
                      onChange={(e) => setBankData({...bankData, bankName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your bank name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Account Holder Name</label>
                    <input 
                      type="text" 
                      value={bankData.accountHolder}
                      onChange={(e) => setBankData({...bankData, accountHolder: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter account holder name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bank Passbook Photo</label>
                    <div className="flex items-center space-x-4">
                      <input 
                        type="file" 
                        id="passbook-photo"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'passbookPhoto')}
                        className="hidden"
                      />
                      <label 
                        htmlFor="passbook-photo"
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 cursor-pointer flex items-center"
                      >
                        <Upload size={16} className="mr-2" />
                        Choose File
                      </label>
                      {bankData.passbookPhoto && (
                        <div className="flex items-center">
                          <span className="text-sm text-green-600">Photo uploaded</span>
                          <button 
                            type="button"
                            onClick={() => setBankData({...bankData, passbookPhoto: null})}
                            className="ml-2 text-red-500 hover:text-red-700"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="bank-terms"
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      required
                    />
                    <label htmlFor="bank-terms" className="ml-2 text-sm text-gray-700">
                      I agree to the terms and conditions for adding bank account
                    </label>
                  </div>
                  <button 
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Add Bank Account
                  </button>
                </div>
              </form>
            )}
          </div>
        );
        
      default:
        return null;
    }
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
          setCurrentPage={() => {}}
          setShowAuth={() => {}}
          showSecondaryHeader={true}
          secondaryTitle="Brand Owner Dashboard"
          onMenuClick={() => setIsMenuOpen(!isMenuOpen)}
        />
      </CartContext.Provider>
      
      {/* Dashboard Header with Menu */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-8xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              
              <div className="flex items-center space-x-4">
                <div className="text-1xl text-gray-600">
                  Welcome, <span className="font-semibold">{user.name}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Side Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black opacity-50" onClick={() => setIsMenuOpen(false)}></div>
          <div className="relative flex flex-col w-64 bg-white h-full shadow-xl">
            <div className="flex items-center justify-between p-4 border-b">
              <div className="text-lg font-semibold">Menu</div>
              <button 
                onClick={() => setIsMenuOpen(false)}
                className="p-1 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto py-2">
              <button
                onClick={() => {
                  setActiveTab('dashboard');
                  setIsMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm font-medium ${
                  activeTab === 'dashboard' 
                    ? 'bg-blue-100 text-blue-700 border-r-4 border-blue-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => {
                  setActiveTab('products');
                  setIsMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm font-medium ${
                  activeTab === 'products' 
                    ? 'bg-blue-100 text-blue-700 border-r-4 border-blue-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Manage Products
              </button>
              <button
                onClick={() => {
                  setActiveTab('kyc');
                  setIsMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm font-medium ${
                  activeTab === 'kyc' 
                    ? 'bg-blue-100 text-blue-700 border-r-4 border-blue-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                KYC Verification
              </button>
              <button
                onClick={() => {
                  setActiveTab('bank');
                  setIsMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm font-medium ${
                  activeTab === 'bank' 
                    ? 'bg-blue-100 text-blue-700 border-r-4 border-blue-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Add Bank Account
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <div className="max-w-8xl mx-auto px-4 py-8">
        {renderTabContent()}
      </div>
      
      {/* Profile Modal */}
      {showProfileModal && (
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Brand Name</label>
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
                <p className="text-xs text-gray-500 mt-1">Share this link to register new users under you</p>
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
      )}
      
      {/* Product Modal */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-lg w-full max-w-2xl p-6 my-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button 
                onClick={() => {
                  setShowProductModal(false);
                  setProductForm({
                    name: '',
                    price: '',
                    offer: '',
                    fitType: '',
                    colors: '',
                    sizes: '',
                    material: '',
                    care: '',
                    images: [],
                    instagramLink: ''
                  });
                  setEditingProduct(null);
                }}
                className="p-1 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleProductSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
                <input 
                  type="text" 
                  value={productForm.name}
                  onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter product name"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹) *</label>
                  <input 
                    type="number" 
                    value={productForm.price}
                    onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter price"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Offer</label>
                  <input 
                    type="text" 
                    value={productForm.offer}
                    onChange={(e) => setProductForm({...productForm, offer: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 20% OFF"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fit</label>
                  <input 
                    type="text" 
                    value={productForm.fitType}
                    onChange={(e) => setProductForm({...productForm, fitType: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Regular Fit"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <input 
                    type="text" 
                    value={productForm.colors}
                    onChange={(e) => setProductForm({...productForm, colors: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., T-Shirt, Jeans"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sizes</label>
                <input 
                  type="text" 
                  value={productForm.sizes}
                  onChange={(e) => setProductForm({...productForm, sizes: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., S, M, L, XL"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Material</label>
                <input 
                  type="text" 
                  value={productForm.material}
                  onChange={(e) => setProductForm({...productForm, material: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 100% Cotton"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Care Instructions</label>
                <textarea 
                  value={productForm.care}
                  onChange={(e) => setProductForm({...productForm, care: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={2}
                  placeholder="e.g., Machine wash cold"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Instagram Video Link</label>
                <input 
                  type="url" 
                  value={productForm.instagramLink}
                  onChange={(e) => setProductForm({...productForm, instagramLink: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://instagram.com/..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Images</label>
                <div className="flex items-center space-x-4 mb-2">
                  <input 
                    type="file" 
                    id="product-images"
                    accept="image/*"
                    multiple
                    onChange={handleProductImageUpload}
                    className="hidden"
                  />
                  <label 
                    htmlFor="product-images"
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 cursor-pointer flex items-center"
                  >
                    <Upload size={16} className="mr-2" />
                    Upload Images
                  </label>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {productForm.images.map((image, idx) => (
                    <div key={idx} className="relative">
                      <img 
                        src={image} 
                        alt={`Product ${idx + 1}`}
                        className="w-full h-24 object-cover rounded border"
                      />
                      <button 
                        type="button"
                        onClick={() => removeProductImage(idx)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button 
                  type="button"
                  onClick={() => {
                    setShowProductModal(false);
                    setProductForm({
                      name: '',
                      price: '',
                      offer: '',
                      fitType: '',
                      colors: '',
                      sizes: '',
                      material: '',
                      care: '',
                      images: [],
                      instagramLink: ''
                    });
                    setEditingProduct(null);
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Footer */}
      <Footer />
    </div>
  );
}

// Rest of the components remain the same...
function CustomerRegistration({ onSwitchView, onTreeUpdate }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    contact: "",
    dateOfBirth: ""
  });
  const [parentInfo, setParentInfo] = useState({ parentId: "", parentName: "" });
  const [isManualParent, setIsManualParent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  useEffect(() => {
    updateParentInfo();
  }, []);

  const updateParentInfo = () => {
    const info = treeManager.getNextCustomerParentInfo();
    if (info) {
      setParentInfo({ parentId: info.parentId, parentName: info.parentName });
      setIsManualParent(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleParentIdChange = (e) => {
    const newParentId = e.target.value.trim().toUpperCase();
    setIsManualParent(true);
    
    if (newParentId === "") {
      updateParentInfo();
      return;
    }
    
    const parentNode = treeManager.getUserById(newParentId);
    if (parentNode) {
      setParentInfo({ 
        parentId: newParentId, 
        parentName: parentNode.name 
      });
    } else {
      setParentInfo({ 
        parentId: newParentId, 
        parentName: ""
      });
    }
  };

  const handleRegister = async () => {
    setError("");
    setLoading(true);

    if (!agreeToTerms) {
      setError("Please agree to Terms and Conditions");
      setLoading(false);
      return;
    }

    if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim() || !formData.contact.trim()) {
      setError("Please fill in all required fields");
      setLoading(false);
      return;
    }

    if (isManualParent) {
      const parentNode = treeManager.getUserById(parentInfo.parentId);
      if (!parentNode) {
        setError("Invalid Parent ID. Please enter a valid User ID.");
        setLoading(false);
        return;
      }
    }

    try {
      await mockAuth.createUserWithEmailAndPassword(mockFirebaseAuth, formData.email, formData.password);
      
      const result = treeManager.registerCustomer(
        formData.name,
        formData.email,
        formData.password,
        formData.contact,
        formData.dateOfBirth,
        isManualParent ? parentInfo.parentId : null
      );
      
      if (result.success) {
        let message = `Customer Registration Successful!\n\nYour User ID: ${result.userId}\nYour Name: ${formData.name}\n\n`;
        
        if (result.isThirdPlusChild) {
          message += `✅ Registered as DIRECT CHILD of:\n${result.directParentId} - ${result.directParentName}\n(Direct Referral #${treeManager.getUserById(result.directParentId).directReferrals.length})\n\n`;
          message += `📍 Placed in Tree Under:\n${result.placementParentId} - ${result.placementParentName}\nPosition: ${result.position.toUpperCase()}\nYour Level: ${result.level}\n\n`;
          message += `💡 Note: You are a DIRECT child of ${result.directParentName} (receives direct income) but placed in their subtree for tree balance.`;
        } else if (isManualParent) {
          message += `✅ Manually Placed Under:\nParent ID: ${result.directParentId}\nParent Name: ${result.directParentName}\nPosition: ${result.position.toUpperCase()}\nYour Level: ${result.level}`;
        } else {
          message += `🤖 Auto-Placed (BFS) Under:\nParent ID: ${result.directParentId}\nParent Name: ${result.directParentName}\nPosition: ${result.position.toUpperCase()}\nYour Level: ${result.level}`;
        }
        
        alert(message);
        
        if (onTreeUpdate) onTreeUpdate();
        
        setFormData({
          name: "",
          email: "",
          password: "",
          contact: "",
          dateOfBirth: ""
        });
        setAgreeToTerms(false);
        
        setTimeout(updateParentInfo, 500);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <LogoAndHomeButton onSwitchView={onSwitchView} />
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">ENGINEERS</h1>
          <p className="text-gray-600 text-sm">Customer Registration</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Parent ID *</label>
              <input
                className="w-full px-4 py-3 border border-blue-300 rounded-lg bg-white text-gray-700 font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                type="text"
                placeholder="Parent ID"
                value={parentInfo.parentId}
                onChange={handleParentIdChange}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Parent Name</label>
              <input
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 font-medium"
                type="text"
                placeholder="Auto-filled"
                value={parentInfo.parentName}
                readOnly
              />
            </div>
          </div>

          <div className={`p-3 border rounded-lg text-sm ${
            isManualParent 
              ? 'bg-amber-50 border-amber-300' 
              : 'bg-blue-50 border-blue-300'
          }`}>
            <div className={`font-semibold ${
              isManualParent ? 'text-amber-800' : 'text-blue-800'
            }`}>
              {isManualParent ? "✏️ Manual Parent Selection" : "🤖 Auto-Assigned (BFS Allocation)"}
            </div>
            <div className={`text-xs mt-1 ${
              isManualParent ? 'text-amber-700' : 'text-blue-700'
            }`}>
              {isManualParent 
                ? parentInfo.parentName 
                  ? `You selected: ${parentInfo.parentId} - ${parentInfo.parentName}`
                  : `Validating: ${parentInfo.parentId}...`
                : `Next available: ${parentInfo.parentId} - ${parentInfo.parentName}`}
            </div>
            {isManualParent && (
              <div className="text-xs mt-2 text-amber-600 font-medium">
                💡 For 3+ direct referrals: Enter sponsor's ID - you'll be their DIRECT child, placed in their subtree
              </div>
            )}
          </div>

          <input
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
            type="text"
            name="name"
            placeholder="Enter Your Full Name *"
            value={formData.name}
            onChange={handleInputChange}
            required
          />

          <input
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
            type="email"
            name="email"
            placeholder="Enter valid email *"
            value={formData.email}
            onChange={handleInputChange}
            required
          />

          <input
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
            type="password"
            name="password"
            placeholder="Enter password *"
            value={formData.password}
            onChange={handleInputChange}
            required
          />

          <input
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
            type="tel"
            name="contact"
            placeholder="Enter valid contact *"
            value={formData.contact}
            onChange={handleInputChange}
            required
          />

          <input
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-600"
            type="date"
            name="dateOfBirth"
            placeholder="Date of Birth"
            value={formData.dateOfBirth}
            onChange={handleInputChange}
          />

          <div className="flex items-start space-x-2">
            <input
              type="checkbox"
              id="terms"
              checked={agreeToTerms}
              onChange={(e) => setAgreeToTerms(e.target.checked)}
              className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            />
            <label htmlFor="terms" className="text-sm text-gray-700">
              Agree to our <span className="text-blue-600 underline cursor-pointer">Terms and Conditions</span>
            </label>
          </div>

          <button
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 font-medium disabled:opacity-50 transition transform hover:scale-105"
            onClick={handleRegister}
            disabled={loading}
          >
            {loading ? "Registering..." : "Register as Customer"}
          </button>
        </div>

        <p className="text-center text-sm text-gray-600 mt-6">
          Want to register as a brand owner?{" "}
          <button
            onClick={() => onSwitchView('brandOwner')}
            className="text-purple-600 hover:underline font-semibold"
          >
            Click here
          </button>
        </p>
      </div>
    </div>
  );
}

function BrandOwnerRegistration({ onSwitchView, onTreeUpdate }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    contact: "",
    brandName: "",
    businessRegNo: "",
    gstNo: ""
  });
  const [parentInfo, setParentInfo] = useState({ parentId: "", parentName: "", willReplace: false });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  useEffect(() => {
    updateParentInfo();
  }, []);

  const updateParentInfo = () => {
    const info = treeManager.getNextBrandOwnerParentInfo();
    if (info) {
      setParentInfo({ 
        parentId: info.parentId, 
        parentName: info.parentName,
        willReplace: !!info.replacingCustomer,
        replacingCustomerInfo: info.replacingCustomer ? {
          id: info.replacingCustomer.id,
          name: info.replacingCustomer.name
        } : null
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRegister = async () => {
    setError("");
    setLoading(true);

    if (!agreeToTerms) {
      setError("Please agree to Terms and Conditions");
      setLoading(false);
      return;
    }

    if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim() || 
        !formData.contact.trim() || !formData.brandName.trim() || 
        !formData.businessRegNo.trim() || !formData.gstNo.trim()) {
      setError("All fields are mandatory including Business Registration and GST Number");
      setLoading(false);
      return;
    }

    try {
      await mockAuth.createUserWithEmailAndPassword(mockFirebaseAuth, formData.email, formData.password);
      
      const result = treeManager.registerBrandOwner(
        formData.name,
        formData.email,
        formData.password,
        formData.contact,
        formData.brandName,
        formData.businessRegNo,
        formData.gstNo
      );
      
      if (result.success) {
        let message = `✅ Brand Owner Registration Successful!\n\nYour User ID: ${result.userId}\nYour Name: ${formData.name}\nBrand: ${formData.brandName}\n\n📍 Placed Under (BFS):\nParent ID: ${result.parentId}\nParent Name: ${result.parentName}\nPosition: ${result.position.toUpperCase()}\nYour Level: ${result.level}`;
        
        if (result.replacedCustomer) {
          message += `\n\n🔄 Customer Replaced:\nCustomer ${result.replacedCustomer.customerId} (${result.replacedCustomer.customerName}) was moved under your LEFT leg.\n\n💡 Brand owners earn DIRECT income only (5% on referrals).`;
        } else {
          message += `\n\n💡 Brand owners earn DIRECT income only (5% on referrals).`;
        }
        
        alert(message);
        
        if (onTreeUpdate) onTreeUpdate();
        
        setFormData({
          name: "",
          email: "",
          password: "",
          contact: "",
          brandName: "",
          businessRegNo: "",
          gstNo: ""
        });
        setAgreeToTerms(false);
        
        setTimeout(updateParentInfo, 500);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4">
      <LogoAndHomeButton onSwitchView={onSwitchView} />
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">ENGINEERS</h1>
          <p className="text-gray-600 text-sm">Brand Owner Registration</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <input
              className="px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 font-medium"
              type="text"
              placeholder="Parent ID"
              value={parentInfo.parentId}
              readOnly
            />
            <input
              className="px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 font-medium"
              type="text"
              placeholder="Parent Name"
              value={parentInfo.parentName}
              readOnly
            />
          </div>

          <div className="p-3 bg-purple-50 border border-purple-300 rounded-lg text-sm">
            <div className="font-semibold text-purple-800">🤖 Auto-Assigned (BFS: Founder/Brand Owner Only)</div>
            <div className="text-purple-700 text-xs mt-1">
              Next placement: {parentInfo.parentId} - {parentInfo.parentName}
            </div>
            {parentInfo.willReplace && parentInfo.replacingCustomerInfo && (
              <div className="mt-2 p-2 bg-amber-100 border border-amber-300 rounded text-xs">
                <div className="font-medium text-amber-800">⚠️ Customer Replacement</div>
                <div className="text-amber-700 mt-1">
                  Customer {parentInfo.replacingCustomerInfo.id} ({parentInfo.replacingCustomerInfo.name}) will be moved under your LEFT leg.
                </div>
              </div>
            )}
            <div className="text-purple-600 text-xs mt-2 font-medium">
              💰 Brand owners earn DIRECT income only (no indirect income)
            </div>
          </div>

          <input
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition"
            type="text"
            name="name"
            placeholder="Owner Full Name *"
            value={formData.name}
            onChange={handleInputChange}
            required
          />

          <input
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition"
            type="text"
            name="brandName"
            placeholder="Brand Name *"
            value={formData.brandName}
            onChange={handleInputChange}
            required
          />

          <input
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition"
            type="email"
            name="email"
            placeholder="Business Email *"
            value={formData.email}
            onChange={handleInputChange}
            required
          />

          <input
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition"
            type="password"
            name="password"
            placeholder="Enter password *"
            value={formData.password}
            onChange={handleInputChange}
            required
          />

          <input
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition"
            type="tel"
            name="contact"
            placeholder="Business Contact *"
            value={formData.contact}
            onChange={handleInputChange}
            required
          />

          <input
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition"
            type="text"
            name="businessRegNo"
            placeholder="Business Registration Number *"
            value={formData.businessRegNo}
            onChange={handleInputChange}
            required
          />

          <input
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition"
            type="text"
            name="gstNo"
            placeholder="GST Number *"
            value={formData.gstNo}
            onChange={handleInputChange}
            required
          />

          <div className="flex items-start space-x-2">
            <input
              type="checkbox"
              id="terms-brand"
              checked={agreeToTerms}
              onChange={(e) => setAgreeToTerms(e.target.checked)}
              className="mt-1 h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
            />
            <label htmlFor="terms-brand" className="text-sm text-gray-700">
              Agree to our <span className="text-purple-600 underline cursor-pointer">Terms and Conditions</span>
            </label>
          </div>

          <button
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 font-medium disabled:opacity-50 transition transform hover:scale-105"
            onClick={handleRegister}
            disabled={loading}
          >
            {loading ? "Registering..." : "Register as Brand Owner"}
          </button>
        </div>

        <p className="text-center text-sm text-gray-600 mt-6">
          Want to register as a customer?{" "}
          <button
            onClick={() => onSwitchView('customer')}
            className="text-purple-600 hover:underline font-semibold"
          >
            Click here
          </button>
        </p>
      </div>
    </div>
  );
}

function TreeVisualization({ onRunConsolidation }) {
  const [treeData, setTreeData] = useState([]);
  const [expandedLevels, setExpandedLevels] = useState(new Set([0, 1, 2]));
  
  useEffect(() => {
    refreshTree();
  }, []);

  const refreshTree = () => {
    setTreeData(treeManager.getTreeVisualization());
  };

  const toggleLevel = (level) => {
    const newExpanded = new Set(expandedLevels);
    if (newExpanded.has(level)) {
      newExpanded.delete(level);
    } else {
      newExpanded.add(level);
    }
    setExpandedLevels(newExpanded);
  };

  const getUserTypeColor = (userType) => {
    switch(userType) {
      case 'founder': return 'bg-yellow-50 border-yellow-400 text-yellow-900';
      case 'customer': return 'bg-blue-50 border-blue-300 text-blue-900';
      case 'brand_owner': return 'bg-purple-50 border-purple-300 text-purple-900';
      default: return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getUserTypeBadge = (userType) => {
    switch(userType) {
      case 'founder': return 'bg-yellow-200 text-yellow-800';
      case 'customer': return 'bg-blue-200 text-blue-800';
      case 'brand_owner': return 'bg-purple-200 text-purple-800';
      default: return 'bg-gray-200 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <LogoAndHomeButton onSwitchView={() => {}} />
      
      <div className="max-w-7xl mx-auto pt-20">
        <div className="bg-white p-6 rounded-xl shadow-xl mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-1">Binary Tree Visualization</h3>
              <p className="text-sm text-gray-600">BFS Allocation: Left to Right, Top to Bottom</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={refreshTree}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium transition transform hover:scale-105"
              >
                🔄 Refresh
              </button>
              <button
                onClick={() => {
                  const result = treeManager.monthlyConsolidation();
                  alert(`${result.message}\n\nTotal Users: ${result.totalUsers}\n\n💡 Note: Brand owners earn DIRECT income only.`);
                  refreshTree();
                  if (onRunConsolidation) onRunConsolidation();
                }}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium transition transform hover:scale-105"
              >
                💰 Monthly Consolidation
              </button>
            </div>
          </div>
          
          <div className="mb-6 flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-50 border-2 border-yellow-400 rounded"></div>
              <span className="font-medium">Founder (Direct + Indirect)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-50 border-2 border-blue-300 rounded"></div>
              <span className="font-medium">Customer (Direct + Indirect)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-purple-50 border-2 border-purple-300 rounded"></div>
              <span className="font-medium">Brand Owner (Direct ONLY)</span>
            </div>
          </div>
          
          <div className="space-y-6">
            {treeData.map((level, levelIndex) => (
              <div key={levelIndex} className="border-t pt-4">
                <button
                  onClick={() => toggleLevel(levelIndex)}
                  className="flex items-center gap-2 mb-3 text-lg font-semibold text-gray-700 hover:text-gray-900 transition"
                >
                  <span className="text-blue-600">{expandedLevels.has(levelIndex) ? '▼' : '▶'}</span>
                  <span>Level {levelIndex}</span>
                  <span className="text-sm font-normal text-gray-500">({level.length} users)</span>
                </button>
                
                {expandedLevels.has(levelIndex) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {level.map((user) => (
                      <div
                        key={user.id}
                        className={`border-2 rounded-xl px-4 py-4 text-sm shadow-md hover:shadow-lg transition ${getUserTypeColor(user.userType)}`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="font-bold text-lg">{user.id}</div>
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getUserTypeBadge(user.userType)}`}>
                            {user.userType.replace('_', ' ').toUpperCase()}
                          </span>
                        </div>
                        
                        <div className="font-semibold text-base mb-1">{user.name}</div>
                        {user.brandName && (
                          <div className="text-xs italic mb-1 text-purple-700 font-medium">
                            🏢 {user.brandName}
                          </div>
                        )}
                        <div className="text-xs mb-3 text-gray-600">{user.email}</div>
                        
                        {user.directParentId && (
                          <div className="mb-2 p-2 bg-green-50 border border-green-200 rounded">
                            <div className="text-xs font-semibold text-green-800">
                              👤 Direct Parent (Sponsor):
                            </div>
                            <div className="text-xs text-green-700 mt-1">
                              {user.directParentId} - {user.directParentName}
                            </div>
                          </div>
                        )}
                        
                        <div className="border-t pt-2 mb-2">
                          <div className="text-xs font-semibold mb-1 text-gray-700">Tree Structure:</div>
                          <div className="flex gap-2 text-xs">
                            <span className={`px-2 py-1 rounded ${user.hasLeft ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                              L: {user.hasLeft ? `✓ ${user.leftChildId}` : '✗'}
                            </span>
                            <span className={`px-2 py-1 rounded ${user.hasRight ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                              R: {user.hasRight ? `✓ ${user.rightChildId}` : '✗'}
                            </span>
                          </div>
                        </div>
                        
                        <div className="border-t pt-2 mb-2">
                          <div className="text-xs font-semibold mb-1 text-gray-700">
                            Direct Referrals: {user.directReferralsCount}
                          </div>
                          {user.directReferralIds.length > 0 && (
                            <div className="text-xs text-gray-600 max-h-20 overflow-y-auto">
                              {user.directReferralIds.map((refId, idx) => (
                                <div key={idx} className="text-xs bg-blue-50 px-2 py-1 rounded mb-1">
                                  {idx + 1}. {refId}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        
                        <div className="border-t pt-2 space-y-1">
                          <div className="text-xs text-green-700 font-semibold">
                            💵 Direct Income: ₹{user.directIncome.toFixed(2)}
                          </div>
                          <div className={`text-xs font-semibold ${
                            user.userType === 'brand_owner' 
                              ? 'text-gray-400 line-through' 
                              : 'text-blue-700'
                          }`}>
                            💰 Indirect Income: ₹{user.indirectIncome.toFixed(2)}
                            {user.userType === 'brand_owner' && (
                              <span className="text-red-600 ml-1">(N/A)</span>
                            )}
                          </div>
                          <div className="text-xs font-medium text-gray-700">
                            📊 Total Sales: ₹{user.totalSales.toFixed(2)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm mb-20">
          <div className="font-semibold text-blue-900 mb-2">📋 Multiple Direct Children System:</div>
          <ul className="space-y-1 text-blue-800">
            <li>✅ <strong>Direct Parent (Sponsor):</strong> The person who referred you - receives direct income from your sales</li>
            <li>✅ <strong>Tree Placement:</strong> For 3+ children, placed in sponsor's subtree using BFS for balance</li>
            <li>✅ <strong>Income Rules:</strong> Direct income goes to your sponsor, indirect income flows through tree structure</li>
            <li>⚠️ <strong>Brand Owners:</strong> Earn ONLY direct income (no indirect income)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function Login({ onSwitchView }) {
  const [credentials, setCredentials] = useState({
    username: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };

  const handleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      await mockAuth.signInWithEmailAndPassword(mockFirebaseAuth, credentials.username, credentials.password);
      
      // Check if user exists in tree manager
      const user = treeManager.getUserById(credentials.username);
      if (!user) {
        setError("Invalid User ID or Password");
        setLoading(false);
        return;
      }
      
      // Redirect to appropriate dashboard based on user type
      if (user.userType === 'customer') {
        onSwitchView('customerDashboard', {
          userId: user.id,
          name: user.name,
          email: user.email,
          userType: user.userType
        });
      } else if (user.userType === 'brand_owner') {
        onSwitchView('brandOwnerDashboard', {
          userId: user.id,
          name: user.name,
          email: user.email,
          userType: user.userType,
          brandName: user.brandName
        });
      } else if (user.userType === 'founder') {
        onSwitchView('customerDashboard', {
          userId: user.id,
          name: user.name,
          email: user.email,
          userType: user.userType
        });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 p-4">
      <LogoAndHomeButton onSwitchView={onSwitchView} />
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">ENGINEERS</h1>
          <p className="text-gray-600 text-sm">Welcome to Engineers Ecom Pvt Ltd</p>
        </div>

        <h2 className="text-xl font-semibold mb-6 text-center text-gray-800">Login</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-6">
          <input
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
            type="text"
            name="username"
            placeholder="User ID"
            value={credentials.username}
            onChange={handleInputChange}
          />

          <input
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
            type="password"
            name="password"
            placeholder="Password"
            value={credentials.password}
            onChange={handleInputChange}
          />

          <button
            className="w-full bg-gradient-to-r from-gray-700 to-gray-900 text-white py-3 rounded-lg hover:from-gray-800 hover:to-black font-medium disabled:opacity-50 transition transform hover:scale-105"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </div>

        <div className="flex justify-end mt-4">
          <button
            onClick={() => onSwitchView('forgot')}
            className="text-sm text-gray-600 hover:text-blue-600 transition"
          >
            Forgot Password?
          </button>
        </div>

        <p className="text-center text-sm text-gray-600 mt-6">
          Are you not a member yet?{" "}
          <button
            onClick={() => onSwitchView('customer')}
            className="text-blue-600 hover:underline font-semibold"
          >
            Register here
          </button>
        </p>
      </div>
    </div>
  );
}

function ForgotPassword({ onBackToLogin }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleResetPassword = async () => {
    setLoading(true);
    setMessage("");

    await new Promise(resolve => setTimeout(resolve, 1000));
    setMessage("Password reset instructions have been sent to your email.");
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 p-4">
      <LogoAndHomeButton onSwitchView={onBackToLogin} />
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">ENGINEERS</h1>
          <p className="text-gray-600 text-sm">Welcome to Engineers Ecom Pvt Ltd</p>
        </div>

        <h2 className="text-xl font-semibold mb-6 text-center text-gray-800">Forgot Password</h2>

        {message && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm">
            {message}
          </div>
        )}

        <div className="space-y-6">
          <input
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
            type="email"
            placeholder="Enter E-mail address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button
            className="w-full bg-gradient-to-r from-gray-700 to-gray-900 text-white py-3 rounded-lg hover:from-gray-800 hover:to-black font-medium disabled:opacity-50 transition transform hover:scale-105"
            onClick={handleResetPassword}
            disabled={loading}
          >
            {loading ? "Sending..." : "Reset Password"}
          </button>
        </div>

        <p className="text-center text-sm text-gray-600 mt-6">
          Remember your password?{" "}
          <button
            onClick={onBackToLogin}
            className="text-blue-600 hover:underline font-semibold"
          >
            Login here
          </button>
        </p>
      </div>
    </div>
  );
}

// Icon components
function ChevronDown({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  );
}

function ChevronUp({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="18 15 12 9 6 15"></polyline>
    </svg>
  );
}

function ChevronRight({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6"></polyline>
    </svg>
  );
}

function Check({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  );
}

function Copy({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
    </svg>
  );
}

function X({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  );
}

function Menu({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="12" x2="21" y2="12"></line>
      <line x1="3" y1="6" x2="21" y2="6"></line>
      <line x1="3" y1="18" x2="21" y2="18"></line>
    </svg>
  );
}

function Plus({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  );
}

function Edit({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
    </svg>
  );
}

function Trash2({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"></polyline>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
      <line x1="10" y1="11" x2="10" y2="17"></line>
      <line x1="14" y1="11" x2="14" y2="17"></line>
    </svg>
  );
}

function Upload({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
      <polyline points="17 8 12 3 7 8"></polyline>
      <line x1="12" y1="3" x2="12" y2="15"></line>
    </svg>
  );
}

function User({ size = 24, className }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      className={className}
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  );
}

function Search({ size = 24, className }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="11" cy="11" r="8"></circle>
      <path d="m21 21-4.35-4.35"></path>
    </svg>
  );
}

export default function AuthApp() {
  const [currentView, setCurrentView] = useState("login");
  const [treeUpdateTrigger, setTreeUpdateTrigger] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);

  const handleTreeUpdate = () => {
    setTreeUpdateTrigger(prev => prev + 1);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView("login");
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case "customer":
        return <CustomerRegistration onSwitchView={setCurrentView} onTreeUpdate={handleTreeUpdate} />;
      case "brandOwner":
        return <BrandOwnerRegistration onSwitchView={setCurrentView} onTreeUpdate={handleTreeUpdate} />;
      case "forgot":
        return <ForgotPassword onBackToLogin={() => setCurrentView("login")} />;
      case "tree":
        return <TreeVisualization key={treeUpdateTrigger} onRunConsolidation={handleTreeUpdate} />;
      case "customerDashboard":
        return <CustomerDashboard user={currentUser} onLogout={handleLogout} />;
      case "brandOwnerDashboard":
        return <BrandOwnerDashboard user={currentUser} onLogout={handleLogout} />;
      default:
        return <Login onSwitchView={(view, user) => {
          if (user) {
            setCurrentUser(user);
            setCurrentView(view);
          } else {
            setCurrentView(view);
          }
        }} />;
    }
  };

  return (
    <div>
      {renderCurrentView()}
      
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white rounded-full shadow-2xl p-2 flex space-x-2 border-2 border-gray-200 z-50">
        <button
          onClick={() => {
            setCurrentUser(null);
            setCurrentView("login");
          }}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            currentView === "login"
              ? "bg-gray-700 text-white shadow-md"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          🔐 Login
        </button>
        <button
          onClick={() => {
            setCurrentUser(null);
            setCurrentView("customer");
          }}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            currentView === "customer"
              ? "bg-blue-500 text-white shadow-md"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          👤 Customer
        </button>
        <button
          onClick={() => {
            setCurrentUser(null);
            setCurrentView("brandOwner");
          }}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            currentView === "brandOwner"
              ? "bg-purple-500 text-white shadow-md"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          🏢 Brand
        </button>
        <button
          onClick={() => {
            setCurrentUser(null);
            setCurrentView("tree");
          }}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            currentView === "tree"
              ? "bg-green-500 text-white shadow-md"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          🌳 Tree
        </button>
      </div>
    </div>
  );
}