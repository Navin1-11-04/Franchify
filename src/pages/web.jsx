import React, { useState, useEffect } from 'react';
import { Menu, X, Instagram, Facebook, Youtube, Play, User, CreditCard, Wallet, Camera, Home, Building, LogIn, UserPlus } from 'lucide-react';

// Mock auth functions
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

// Tree Node class
class TreeNode {
  constructor(id, name, level = 0) {
    this.id = id;
    this.name = name;
    this.level = level;
    this.left = null;
    this.right = null;
    this.parent = null;
  }
}

// MLM Tree Manager
class MLMTreeManager {
  constructor() {
    this.root = new TreeNode("ROOT001", "Admin User", 0);
    this.allNodes = new Map();
    this.allNodes.set("ROOT001", this.root);
    this.addSampleUsers();
  }

  addSampleUsers() {
    const user1 = new TreeNode("USER001", "John Doe", 1);
    const user2 = new TreeNode("USER002", "Jane Smith", 1);
    
    this.root.left = user1;
    this.root.right = user2;
    user1.parent = this.root;
    user2.parent = this.root;
    
    this.allNodes.set("USER001", user1);
    this.allNodes.set("USER002", user2);
  }

  findNextAvailablePosition() {
    const queue = [this.root];
    
    while (queue.length > 0) {
      const current = queue.shift();
      
      if (!current.left) {
        return { parent: current, position: 'left' };
      }
      if (!current.right) {
        return { parent: current, position: 'right' };
      }
      
      if (current.left) queue.push(current.left);
      if (current.right) queue.push(current.right);
    }
    
    return null;
  }

  generateNextUserId() {
    const userIds = Array.from(this.allNodes.keys())
      .filter(id => id.startsWith('USER'))
      .map(id => parseInt(id.substring(4)))
      .sort((a, b) => b - a);
    
    const nextNumber = userIds.length > 0 ? userIds[0] + 1 : 1;
    return `USER${String(nextNumber).padStart(3, '0')}`;
  }

  getParentInfoForNewUser() {
    const nextPosition = this.findNextAvailablePosition();
    if (!nextPosition) return null;
    
    return {
      parentId: nextPosition.parent.id,
      parentName: nextPosition.parent.name,
      position: nextPosition.position,
      level: nextPosition.parent.level + 1
    };
  }

  addNewUser(name, email) {
    const parentInfo = this.getParentInfoForNewUser();
    if (!parentInfo) return null;
    
    const newUserId = this.generateNextUserId();
    const newUser = new TreeNode(newUserId, name, parentInfo.level);
    
    const parent = this.allNodes.get(parentInfo.parentId);
    if (parentInfo.position === 'left') {
      parent.left = newUser;
    } else {
      parent.right = newUser;
    }
    newUser.parent = parent;
    
    this.allNodes.set(newUserId, newUser);
    
    return {
      userId: newUserId,
      parentId: parentInfo.parentId,
      parentName: parentInfo.parentName,
      level: parentInfo.level
    };
  }

  getTreeVisualization() {
    const result = [];
    const queue = [{ node: this.root, level: 0 }];
    
    while (queue.length > 0) {
      const { node, level } = queue.shift();
      
      if (!result[level]) result[level] = [];
      result[level].push({
        id: node.id,
        name: node.name,
        hasLeft: !!node.left,
        hasRight: !!node.right
      });
      
      if (node.left) queue.push({ node: node.left, level: level + 1 });
      if (node.right) queue.push({ node: node.right, level: level + 1 });
    }
    
    return result;
  }
}

const treeManager = new MLMTreeManager();

const EngineersDesktopApp = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [treeData, setTreeData] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    setTreeData(treeManager.getTreeVisualization());
  }, []);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const refreshTree = () => {
    setTreeData(treeManager.getTreeVisualization());
  };

  // Sidebar Component
  const Sidebar = () => (
    <div className={`fixed left-0 top-0 h-full bg-gradient-to-b from-gray-900 to-black text-white transition-all duration-300 z-40 ${sidebarOpen ? 'w-64' : 'w-16'}`}>
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          {sidebarOpen && <h1 className="text-xl font-bold italic">ENGINEERS</h1>}
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <Menu size={20} />
          </button>
        </div>
      </div>
      
      <nav className="p-4 space-y-2">
        <button
          onClick={() => setCurrentPage('home')}
          className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
            currentPage === 'home' ? 'bg-gray-800 text-white' : 'hover:bg-gray-800'
          }`}
        >
          <Home size={20} />
          {sidebarOpen && <span>Home</span>}
        </button>
        
        {!isLoggedIn ? (
          <>
            <button
              onClick={() => setCurrentPage('login')}
              className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                currentPage === 'login' ? 'bg-gray-800 text-white' : 'hover:bg-gray-800'
              }`}
            >
              <LogIn size={20} />
              {sidebarOpen && <span>Login</span>}
            </button>
            
            <button
              onClick={() => setCurrentPage('signup')}
              className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                currentPage === 'signup' ? 'bg-gray-800 text-white' : 'hover:bg-gray-800'
              }`}
            >
              <UserPlus size={20} />
              {sidebarOpen && <span>Register</span>}
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setCurrentPage('profile')}
              className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                currentPage === 'profile' ? 'bg-gray-800 text-white' : 'hover:bg-gray-800'
              }`}
            >
              <User size={20} />
              {sidebarOpen && <span>Profile</span>}
            </button>
            
            <button
              onClick={() => {
                setIsLoggedIn(false);
                setCurrentPage('home');
              }}
              className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-red-800 transition-colors"
            >
              <X size={20} />
              {sidebarOpen && <span>Logout</span>}
            </button>
          </>
        )}
        
        <button
          onClick={() => setCurrentPage('tree')}
          className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
            currentPage === 'tree' ? 'bg-gray-800 text-white' : 'hover:bg-gray-800'
          }`}
        >
          <Building size={20} />
          {sidebarOpen && <span>View Tree</span>}
        </button>
      </nav>
    </div>
  );

  // Home Page
  const HomePage = () => (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
        <h1 className="text-4xl font-bold mb-4 italic text-center text-gray-900">ENGINEERS</h1>
        <p className="text-center text-gray-600">Welcome to Engineers Ecom Pvt Ltd</p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
        <div className="relative mb-6 max-w-2xl mx-auto">
          <img 
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop" 
            alt="Engineer working" 
            className="w-full h-64 object-cover rounded-lg shadow-lg"
          />
          <button className="absolute inset-0 flex items-center justify-center hover:bg-black hover:bg-opacity-10 transition-colors rounded-lg">
            <div className="bg-black bg-opacity-60 rounded-full p-4 hover:bg-opacity-80 transition-all">
              <Play size={28} className="text-white ml-1" />
            </div>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <div className="relative group cursor-pointer">
            <img 
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop" 
              alt="Fashion for Men" 
              className="w-full h-64 object-cover rounded-lg shadow-lg group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-50 flex items-center justify-center rounded-lg transition-all duration-300">
              <h2 className="text-white text-2xl font-bold italic">FASHION FOR MEN</h2>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <div className="relative group cursor-pointer">
            <img 
              src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&h=400&fit=crop" 
              alt="Fashion for Women" 
              className="w-full h-64 object-cover rounded-lg shadow-lg group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-50 flex items-center justify-center rounded-lg transition-all duration-300">
              <h2 className="text-white text-2xl font-bold italic">FASHION FOR WOMEN</h2>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
        <h3 className="text-xl font-semibold mb-6 text-center text-gray-900">Follow Us</h3>
        <div className="flex justify-center space-x-6">
          <a href="#" className="p-4 bg-black text-white rounded-full hover:scale-110 hover:bg-gray-800 transition-all duration-300 shadow-lg">
            <Instagram size={24} />
          </a>
          <a href="#" className="p-4 bg-black text-white rounded-full hover:scale-110 hover:bg-gray-800 transition-all duration-300 shadow-lg">
            <Facebook size={24} />
          </a>
          <a href="#" className="p-4 bg-black text-white rounded-full hover:scale-110 hover:bg-gray-800 transition-all duration-300 shadow-lg">
            <Youtube size={24} />
          </a>
        </div>
      </div>
    </div>
  );

  // Login Page
  const LoginPage = () => {
    const [credentials, setCredentials] = useState({ username: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
      setError("");
      setLoading(true);
      try {
        await mockAuth.signInWithEmailAndPassword({}, credentials.username, credentials.password);
        setIsLoggedIn(true);
        setCurrentPage('profile');
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="max-w-md mx-auto">
        <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-200">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">ENGINEERS</h1>
            <p className="text-gray-600 text-sm">Welcome to Engineers Ecom Pvt Ltd</p>
          </div>

          <h2 className="text-xl font-semibold mb-6 text-center text-gray-800">Login</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-6">
            <input
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              type="text"
              placeholder="Username"
              value={credentials.username}
              onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
            />

            <input
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              type="password"
              placeholder="Password"
              value={credentials.password}
              onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
            />

            <button
              className="w-full bg-gray-800 text-white py-3 rounded-lg hover:bg-gray-900 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </div>

          <p className="text-center text-sm text-gray-600 mt-6">
            Not a member yet?{" "}
            <button
              onClick={() => setCurrentPage('signup')}
              className="text-blue-600 hover:underline font-medium"
            >
              Register here.
            </button>
          </p>
        </div>
      </div>
    );
  };

  // Signup Page  
  const SignupPage = () => {
    const [formData, setFormData] = useState({
      parentCode: "",
      parentName: "",
      name: "",
      email: "",
      password: "",
      contact: ""
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [agreeToTerms, setAgreeToTerms] = useState(false);

    useEffect(() => {
      const parentInfo = treeManager.getParentInfoForNewUser();
      if (parentInfo) {
        setFormData(prev => ({
          ...prev,
          parentCode: parentInfo.parentId,
          parentName: parentInfo.parentName
        }));
      }
    }, []);

    const handleSignup = async () => {
      setError("");
      setLoading(true);

      if (!agreeToTerms) {
        setError("Please agree to Terms and Conditions");
        setLoading(false);
        return;
      }

      try {
        await mockAuth.createUserWithEmailAndPassword({}, formData.email, formData.password);
        const newUserInfo = treeManager.addNewUser(formData.name, formData.email);
        
        if (newUserInfo) {
          alert(`Registration successful! Your User ID: ${newUserInfo.userId}`);
          refreshTree();
          setCurrentPage('login');
        } else {
          setError("Failed to assign position in referral tree");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="max-w-md mx-auto">
        <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-200">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">ENGINEERS</h1>
            <p className="text-gray-600 text-sm">Welcome to Engineers Ecom Pvt Ltd</p>
          </div>

          <h2 className="text-xl font-semibold mb-6 text-center text-gray-800">Register</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <input
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
              type="text"
              placeholder="Parent Code (Auto-generated)"
              value={formData.parentCode}
              readOnly
            />

            <input
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
              type="text"
              placeholder="Parent Name (Auto-generated)"
              value={formData.parentName}
              readOnly
            />

            <input
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              type="text"
              placeholder="Enter Your Full Name *"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            />

            <input
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              type="email"
              placeholder="Enter valid email *"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            />

            <input
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              type="password"
              placeholder="Enter password *"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
            />

            <input
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              type="tel"
              placeholder="Enter valid contact *"
              value={formData.contact}
              onChange={(e) => setFormData(prev => ({ ...prev, contact: e.target.value }))}
            />

            <div className="flex items-start space-x-2">
              <input
                type="checkbox"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="text-sm text-gray-700">
                Agree to our <span className="text-blue-600 underline cursor-pointer">Terms and Conditions</span>
              </label>
            </div>

            <button
              className="w-full bg-gray-800 text-white py-3 rounded-lg hover:bg-gray-900 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleSignup}
              disabled={loading}
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </div>

          <p className="text-center text-sm text-gray-600 mt-6">
            Already a member?{" "}
            <button
              onClick={() => setCurrentPage('login')}
              className="text-blue-600 hover:underline font-medium"
            >
              Login here.
            </button>
          </p>
        </div>
      </div>
    );
  };

  // Profile Page
  const ProfilePage = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 shadow-xl border border-gray-100">
        <h2 className="text-black text-2xl font-bold mb-8 text-center">Welcome to Your Dashboard</h2>
        
        <div className="flex flex-col items-center space-y-6">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-800 to-black rounded-full flex items-center justify-center overflow-hidden shadow-2xl border-4 border-gray-200">
              {profileImage ? (
                <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="w-12 h-12 text-white" />
              )}
            </div>
            <button 
              className="absolute -bottom-2 -right-2 bg-black hover:bg-gray-800 rounded-full p-3 shadow-2xl transition-all duration-300"
              onClick={() => document.getElementById('imageUpload').click()}
            >
              <Camera className="w-4 h-4 text-white" />
            </button>
            <input
              id="imageUpload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          <div className="bg-gradient-to-r from-gray-100 to-gray-200 px-6 py-3 rounded-full shadow-lg border">
            <span className="text-black text-sm font-semibold">KYC - Pending Verification</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 text-center shadow-lg border">
          <div className="text-black text-3xl font-bold">₹0</div>
          <p className="text-gray-600 text-sm mt-2 font-medium">Total Payout</p>
        </div>
        <div className="bg-white rounded-2xl p-6 text-center shadow-lg border">
          <div className="text-black text-2xl font-bold">₹0</div>
          <p className="text-gray-600 text-sm mt-2 font-medium">Self PV</p>
        </div>
        <div className="bg-white rounded-2xl p-6 text-center shadow-lg border">
          <div className="text-black text-2xl font-bold">₹0</div>
          <p className="text-gray-600 text-sm mt-2 font-medium">Direct Income</p>
        </div>
        <div className="bg-white rounded-2xl p-6 text-center shadow-lg border">
          <div className="text-black text-2xl font-bold">₹0</div>
          <p className="text-gray-600 text-sm mt-2 font-medium">Network Income</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-8 text-center shadow-lg border">
          <div className="bg-black rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Wallet className="w-8 h-8 text-white" />
          </div>
          <div className="text-black text-2xl font-bold">₹0</div>
          <p className="text-gray-600 text-sm mt-2 font-medium">Income Wallet</p>
        </div>
        
        <div className="bg-white rounded-2xl p-8 text-center shadow-lg border">
          <div className="bg-black rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <CreditCard className="w-8 h-8 text-white" />
          </div>
          <div className="text-black text-2xl font-bold">₹0</div>
          <p className="text-gray-600 text-sm mt-2 font-medium">E-Wallet</p>
        </div>
      </div>
    </div>
  );

  // Tree Page
  const TreePage = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Referral Tree Structure</h3>
          <button
            onClick={refreshTree}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Refresh Tree
          </button>
        </div>
        
        <div className="overflow-x-auto">
          {treeData.map((level, levelIndex) => (
            <div key={levelIndex} className="mb-6">
              <div className="text-sm font-medium text-gray-600 mb-3">
                Level {levelIndex}
              </div>
              <div className="flex flex-wrap gap-4">
                {level.map((user) => (
                  <div
                    key={user.id}
                    className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-sm min-w-48"
                  >
                    <div className="font-medium text-blue-800">{user.id}</div>
                    <div className="text-blue-600">{user.name}</div>
                    <div className="text-xs text-gray-500 mt-2">
                      Left: {user.hasLeft ? '✓' : '✗'} | Right: {user.hasRight ? '✓' : '✗'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return <LoginPage />;
      case 'signup':
        return <SignupPage />;
      case 'profile':
        return <ProfilePage />;
      case 'tree':
        return <TreePage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      
      <main className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'} p-6`}>
        <div className="max-w-7xl mx-auto">
          {renderPage()}
        </div>
      </main>
    </div>
  );
};

export default EngineersDesktopApp;