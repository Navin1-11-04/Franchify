import React, { useState, useEffect, useRef } from 'react';
import { 
  Menu, X, ChevronDown, ChevronUp, Search, Heart, Plus,
  Star, Share2, Play, User, Upload, CheckCircle,
  Instagram, Youtube, Linkedin, Twitter,
  Eye, ShoppingCart, Copy, Check, Minus, Plus as PlusIcon,
  Package, CreditCard, MapPin, Calendar, Download,
  Filter, Clock, CheckCircle2, Truck, Home
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
  },
  {
    id: 4,
    name: 'Sporty Track Pants',
    brand: 'Engineers',
    price: 999,
    originalPrice: 1299,
    rating: 4.2,
    reviews: 102,
    fit: 'Regular Fit',
    type: 'Sports',
    category: 'men',
    colors: ['Black', 'Grey', 'Navy'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    images: [
      'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=500&fit=crop'
    ],
    videoUrl: 'https://www.instagram.com/p/CQ8XJ2vJ_5d/',
    description: 'Comfortable track pants for workouts and casual wear.',
    material: 'Polyester',
    care: 'Machine wash cold',
    offers: '20% off on sports collection',
    bankOffers: '5% cashback on select cards'
  },
  {
    id: 5,
    name: 'Classic Leather Jacket',
    brand: 'Engineers',
    price: 4999,
    originalPrice: 6999,
    rating: 4.8,
    reviews: 74,
    fit: 'Regular Fit',
    type: 'Casual',
    category: 'men',
    colors: ['Black', 'Brown'],
    sizes: ['S', 'M', 'L', 'XL'],
    images: [
      'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1574342397350-337b2831e6e2?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=500&fit=crop'
    ],
    videoUrl: 'https://www.instagram.com/p/CQ8XJ2vJ_5d/',
    description: 'Premium leather jacket for a stylish look.',
    material: 'Genuine Leather',
    care: 'Professional clean only',
    offers: 'Limited time offer',
    bankOffers: 'No cost EMI available'
  },
  {
    id: 6,
    name: 'Summer Floral Dress',
    brand: 'Engineers',
    price: 1799,
    originalPrice: 2299,
    rating: 4.4,
    reviews: 91,
    fit: 'A-line',
    type: 'Casual',
    category: 'women',
    colors: ['Floral', 'Yellow', 'Pink'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    images: [
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1572804013427-37d909342567?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1578681920702-a10c3186346c?w=400&h=500&fit=crop'
    ],
    videoUrl: 'https://www.instagram.com/p/CQ8XJ2vJ_5d/',
    description: 'Light and comfortable floral dress for summer.',
    material: 'Cotton Blend',
    care: 'Machine wash cold',
    offers: 'Buy 2 get 10% off',
    bankOffers: '5% cashback on select cards'
  },
  {
    id: 7,
    name: 'Designer Handbag',
    brand: 'Engineers',
    price: 2499,
    originalPrice: 2999,
    rating: 4.6,
    reviews: 67,
    fit: 'One Size',
    type: 'Accessories',
    category: 'accessories',
    colors: ['Black', 'Brown', 'Tan'],
    sizes: ['One Size'],
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1584917865442-8a5f06e68d7a?w=400&h=500&fit=crop'
    ],
    videoUrl: 'https://www.instagram.com/p/CQ8XJ2vJ_5d/',
    description: 'Elegant designer handbag for special occasions.',
    material: 'Genuine Leather',
    care: 'Professional clean only',
    offers: '15% off on first purchase',
    bankOffers: 'No cost EMI available'
  },
  {
    id: 8,
    name: 'Luxury Watch',
    brand: 'Engineers',
    price: 5999,
    originalPrice: 7999,
    rating: 4.9,
    reviews: 112,
    fit: 'One Size',
    type: 'Accessories',
    category: 'accessories',
    colors: ['Silver', 'Gold', 'Rose Gold'],
    sizes: ['One Size'],
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1542496658-e33a6d0d5046?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=500&fit=crop'
    ],
    videoUrl: 'https://www.instagram.com/p/CQ8XJ2vJ_5d/',
    description: 'Premium luxury watch with leather strap.',
    material: 'Stainless Steel, Leather',
    care: 'Professional clean only',
    offers: 'Limited time offer',
    bankOffers: 'No cost EMI available'
  }
];

// Categories data
const categories = [
  { id: 'tshirts', name: 'T-shirts', count: 245 },
  { id: 'jackets', name: 'Jackets', count: 128 },
  { id: 'sweaters', name: 'Sweaters', count: 97 },
  { id: 'jeans', name: 'Jeans', count: 186 },
  { id: 'shorts', name: 'Shorts', count: 73 },
  { id: 'sunglasses', name: 'Sunglasses', count: 42 },
  { id: 'crossbody-bags', name: 'Crossbody Bags', count: 38 },
  { id: 'backpacks', name: 'Backpacks', count: 56 }
];

// Brands data
const brands = [
  { id: 'zara', name: 'Zara', count: 142 },
  { id: 'hm', name: 'H&M', count: 168 },
  { id: 'uniqlo', name: 'Uniqlo', count: 94 },
  { id: 'levis', name: "Levi's", count: 112 },
  { id: 'nike', name: 'Nike', count: 187 },
  { id: 'adidas', name: 'Adidas', count: 156 },
  { id: 'puma', name: 'Puma', count: 98 },
  { id: 'tommy', name: 'Tommy Hilfiger', count: 73 }
];

// Colors data
const colors = [
  { id: 'black', name: 'Black', hex: '#000000' },
  { id: 'blue', name: 'Blue', hex: '#1E40AF' },
  { id: 'purple', name: 'Purple', hex: '#7C3AED' },
  { id: 'orange', name: 'Orange', hex: '#F97316' },
  { id: 'pink', name: 'Pink', hex: '#EC4899' },
  { id: 'yellow', name: 'Yellow', hex: '#EAB308' },
  { id: 'red', name: 'Red', hex: '#DC2626' },
  { id: 'green', name: 'Green', hex: '#16A34A' }
];

// Discount options
const discountOptions = [
  { id: '10', label: '10% and above' },
  { id: '20', label: '20% and above' },
  { id: '30', label: '30% and above' },
  { id: '40', label: '40% and above' },
  { id: '50', label: '50% and above' }
];

// Cart Context
const CartContext = React.createContext();

const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [orders, setOrders] = useState([]);
  
  const addToCart = (product, selectedSize, selectedColor) => {
    const existingItem = cartItems.find(
      item => item.id === product.id && 
      item.selectedSize === selectedSize && 
      item.selectedColor === selectedColor
    );
    
    if (existingItem) {
      setCartItems(
        cartItems.map(item =>
          item.id === product.id && 
          item.selectedSize === selectedSize && 
          item.selectedColor === selectedColor
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCartItems([
        ...cartItems,
        {
          ...product,
          quantity: 1,
          selectedSize,
          selectedColor
        }
      ]);
    }
  };
  
  const removeFromCart = (productId, selectedSize, selectedColor) => {
    setCartItems(
      cartItems.filter(
        item => !(item.id === productId && 
        item.selectedSize === selectedSize && 
        item.selectedColor === selectedColor)
      )
    );
  };
  
  const updateQuantity = (productId, selectedSize, selectedColor, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId, selectedSize, selectedColor);
    } else {
      setCartItems(
        cartItems.map(item =>
          item.id === productId && 
          item.selectedSize === selectedSize && 
          item.selectedColor === selectedColor
            ? { ...item, quantity }
            : item
        )
      );
    }
  };
  
  const moveToWishlist = (productId, selectedSize, selectedColor) => {
    const item = cartItems.find(
      item => item.id === productId && 
      item.selectedSize === selectedSize && 
      item.selectedColor === selectedColor
    );
    
    if (item) {
      removeFromCart(productId, selectedSize, selectedColor);
      
      const existingWishlistItem = wishlistItems.find(
        wItem => wItem.id === productId && 
        wItem.selectedSize === selectedSize && 
        wItem.selectedColor === selectedColor
      );
      
      if (!existingWishlistItem) {
        setWishlistItems([...wishlistItems, item]);
      }
    }
  };
  
  const addToWishlist = (product, selectedSize, selectedColor) => {
    const existingWishlistItem = wishlistItems.find(
      item => item.id === product.id && 
      item.selectedSize === selectedSize && 
      item.selectedColor === selectedColor
    );
    
    if (!existingWishlistItem) {
      setWishlistItems([
        ...wishlistItems,
        {
          ...product,
          quantity: 1,
          selectedSize,
          selectedColor
        }
      ]);
    }
  };
  
  const removeFromWishlist = (productId, selectedSize, selectedColor) => {
    setWishlistItems(
      wishlistItems.filter(
        item => !(item.id === productId && 
        item.selectedSize === selectedSize && 
        item.selectedColor === selectedColor)
      )
    );
  };
  
  const moveToCart = (productId, selectedSize, selectedColor) => {
    const item = wishlistItems.find(
      item => item.id === productId && 
      item.selectedSize === selectedSize && 
      item.selectedColor === selectedColor
    );
    
    if (item) {
      removeFromWishlist(productId, selectedSize, selectedColor);
      
      const existingCartItem = cartItems.find(
        cItem => cItem.id === productId && 
        cItem.selectedSize === selectedSize && 
        cItem.selectedColor === selectedColor
      );
      
      if (!existingCartItem) {
        setCartItems([...cartItems, item]);
      }
    }
  };
  
  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };
  
  const calculateOriginalTotal = () => {
    return cartItems.reduce(
      (total, item) => total + (item.originalPrice || item.price) * item.quantity,
      0
    );
  };
  
  const calculateDiscount = () => {
    return calculateOriginalTotal() - calculateTotal();
  };
  
  const calculateGST = () => {
    return Math.round(calculateTotal() * 0.18);
  };
  
  const calculateFinalTotal = () => {
    return calculateTotal() + calculateGST();
  };
  
  const placeOrder = (deliveryDetails, paymentMethod) => {
    const newOrder = {
      id: `ORD${Date.now()}`,
      date: new Date().toISOString(),
      status: 'Processing',
      items: [...cartItems],
      deliveryDetails,
      paymentMethod,
      subtotal: calculateTotal(),
      discount: calculateDiscount(),
      gst: calculateGST(),
      total: calculateFinalTotal(),
      deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days from now
    };
    
    setOrders([...orders, newOrder]);
    setCartItems([]);
    
    return newOrder;
  };
  
  return (
    <CartContext.Provider
      value={{
        cartItems,
        wishlistItems,
        orders,
        addToCart,
        removeFromCart,
        updateQuantity,
        moveToWishlist,
        addToWishlist,
        removeFromWishlist,
        moveToCart,
        calculateTotal,
        calculateOriginalTotal,
        calculateDiscount,
        calculateGST,
        calculateFinalTotal,
        placeOrder
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Share Product Modal Component
const ShareProductModal = ({ product, isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  
  useEffect(() => {
    if (product && isOpen) {
      // Generate shareable URL with product ID
      const baseUrl = window.location.origin;
      const productUrl = `${baseUrl}/product/${product.id}`;
      setShareUrl(productUrl);
    }
  }, [product, isOpen]);
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  
  const handleShare = async (platform) => {
    const shareText = `Check out this ${product.name} from ${product.brand} - Only ₹${product.price}!`;
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedText = encodeURIComponent(shareText);
    
    let shareLink = '';
    
    switch(platform) {
      case 'whatsapp':
        shareLink = `https://wa.me/?text=${encodedText}%20${encodedUrl}`;
        break;
      case 'facebook':
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'twitter':
        shareLink = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
        break;
      case 'email':
        shareLink = `mailto:?subject=${encodeURIComponent(`Check out ${product.name}`)}&body=${encodedText}%20${encodedUrl}`;
        break;
      default:
        // Native share API for mobile
        if (navigator.share) {
          try {
            await navigator.share({
              title: product.name,
              text: shareText,
              url: shareUrl
            });
            return;
          } catch (err) {
            console.log('Error sharing:', err);
          }
        }
        return;
    }
    
    window.open(shareLink, '_blank', 'width=600,height=400');
  };
  
  if (!isOpen || !product) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Share Product</h3>
          <button onClick={onClose} className="p-1">
            <X size={20} />
          </button>
        </div>
        
        <div className="flex items-center gap-3 mb-4">
          <img 
            src={product.images[0]} 
            alt={product.name} 
            className="w-16 h-16 object-cover rounded"
          />
          <div>
            <h4 className="font-semibold">{product.name}</h4>
            <p className="text-sm text-gray-500">{product.brand}</p>
            <p className="font-bold">₹{product.price}</p>
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Share Link</label>
          <div className="flex gap-2">
            <input 
              type="text" 
              value={shareUrl}
              readOnly
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm"
            />
            <button 
              onClick={handleCopyLink}
              className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>
        
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700 mb-2">Share via</p>
          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={() => handleShare('whatsapp')}
              className="flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              <div className="w-5 h-5 bg-green-500 rounded-full"></div>
              <span className="text-sm">WhatsApp</span>
            </button>
            <button 
              onClick={() => handleShare('facebook')}
              className="flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              <div className="w-5 h-5 bg-blue-600 rounded-full"></div>
              <span className="text-sm">Facebook</span>
            </button>
            <button 
              onClick={() => handleShare('twitter')}
              className="flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              <div className="w-5 h-5 bg-sky-500 rounded-full"></div>
              <span className="text-sm">Twitter</span>
            </button>
            <button 
              onClick={() => handleShare('email')}
              className="flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              <div className="w-5 h-5 bg-gray-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">@</span>
              </div>
              <span className="text-sm">Email</span>
            </button>
          </div>
        </div>
        
        {navigator.share && (
          <button 
            onClick={() => handleShare('native')}
            className="w-full mt-4 px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition-colors"
          >
            More Options
          </button>
        )}
      </div>
    </div>
  );
};

// Product Filter Component
const ProductFilter = ({ 
  filters, 
  handleFilterChange, 
  clearFilters, 
  isFilterOpen, 
  setIsFilterOpen 
}) => {
  return (
    <div className={`${isFilterOpen ? 'block' : 'hidden'} md:block md:w-64 flex-shrink-0`}>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg">Filters</h3>
          <button 
            onClick={clearFilters}
            className="text-sm text-blue-600 hover:underline"
          >
            Clear All
          </button>
        </div>
        
        {/* Categories */}
        <div className="mb-6">
          <h4 className="font-semibold mb-3">Categories</h4>
          <div className="space-y-2">
            {categories.map((category) => (
              <label key={category.id} className="flex items-center">
                <input 
                  type="checkbox" 
                  className="mr-2"
                  checked={filters.categories.includes(category.id)}
                  onChange={() => handleFilterChange('categories', category.id)}
                />
                <span className="text-sm">{category.name}</span>
                <span className="text-xs text-gray-500 ml-auto">({category.count})</span>
              </label>
            ))}
          </div>
        </div>
        
        {/* Brands */}
        <div className="mb-6">
          <h4 className="font-semibold mb-3">Brands</h4>
          <div className="space-y-2">
            {brands.map((brand) => (
              <label key={brand.id} className="flex items-center">
                <input 
                  type="checkbox" 
                  className="mr-2"
                  checked={filters.brands.includes(brand.id)}
                  onChange={() => handleFilterChange('brands', brand.id)}
                />
                <span className="text-sm">{brand.name}</span>
                <span className="text-xs text-gray-500 ml-auto">({brand.count})</span>
              </label>
            ))}
          </div>
        </div>
        
        {/* Colors */}
        <div className="mb-6">
          <h4 className="font-semibold mb-3">Colors</h4>
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => (
              <button
                key={color.id}
                className={`w-8 h-8 rounded-full border-2 ${
                  filters.colors.includes(color.id) ? 'border-blue-500' : 'border-gray-300'
                }`}
                style={{ backgroundColor: color.hex }}
                onClick={() => handleFilterChange('colors', color.id)}
                title={color.name}
              />
            ))}
          </div>
        </div>
        
        {/* Discount */}
        <div className="mb-6">
          <h4 className="font-semibold mb-3">Discount</h4>
          <div className="space-y-2">
            {discountOptions.map((option) => (
              <label key={option.id} className="flex items-center">
                <input 
                  type="radio" 
                  name="discount"
                  className="mr-2"
                  checked={filters.discount === option.id}
                  onChange={() => handleFilterChange('discount', option.id)}
                />
                <span className="text-sm">{option.label}</span>
              </label>
            ))}
          </div>
        </div>
        
        {/* Price Range */}
        <div className="mb-6">
          <h4 className="font-semibold mb-3">Price Range</h4>
          <div className="flex items-center gap-2">
            <input 
              type="number" 
              placeholder="Min"
              className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
              value={filters.minPrice}
              onChange={(e) => handleFilterChange('minPrice', e.target.value)}
            />
            <span>-</span>
            <input 
              type="number" 
              placeholder="Max"
              className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
              value={filters.maxPrice}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Wishlist Page Component
const WishlistPage = ({ setCurrentPage }) => {
  const { wishlistItems, removeFromWishlist, moveToCart } = React.useContext(CartContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false);
  const companyDropdownRef = useRef(null);
  
  return (
    <div className="min-h-screen bg-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Assistant:wght@200;300;400;500;600;700;800&display=swap');
        
        * {
          font-family: 'Assistant', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
        }
      `}</style>
      
      <Header 
        setCurrentPage={setCurrentPage} 
        setShowAuth={() => {}} 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isCompanyDropdownOpen={isCompanyDropdownOpen}
        setIsCompanyDropdownOpen={setIsCompanyDropdownOpen}
        companyDropdownRef={companyDropdownRef}
        showSecondaryHeader={true}
        secondaryTitle="My Wishlist"
      />
      
      <div className="max-w-8xl mx-auto px-4 py-8">
        {wishlistItems.length === 0 ? (
          <div className="text-center py-12">
            <Heart size={64} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-6">Looks like you haven't added anything to your wishlist yet.</p>
            <button 
              onClick={() => setCurrentPage('landing')}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-semibold"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((item) => (
              <div key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="relative">
                  <img 
                    src={item.images[0]} 
                    alt={item.name} 
                    className="w-full h-64 object-cover rounded-t-lg"
                  />
                  <button 
                    onClick={() => removeFromWishlist(item.id, item.selectedSize, item.selectedColor)}
                    className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
                  >
                    <X size={16} className="text-gray-600" />
                  </button>
                </div>
                
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-1">{item.name}</h3>
                  <p className="text-sm text-gray-500 mb-2">{item.brand}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="text-sm bg-gray-100 px-2 py-1 rounded">Size: {item.selectedSize}</span>
                    <span className="text-sm bg-gray-100 px-2 py-1 rounded">Color: {item.selectedColor}</span>
                  </div>
                  
                  <div className="flex items-center mb-3">
                    <span className="font-bold text-lg">₹{item.price}</span>
                    {item.originalPrice > item.price && (
                      <span className="text-sm text-gray-500 line-through ml-2">₹{item.originalPrice}</span>
                    )}
                    {item.originalPrice > item.price && (
                      <span className="ml-2 bg-red-100 text-red-600 text-xs px-2 py-1 rounded font-bold">
                        {Math.round((1 - item.price / item.originalPrice) * 100)}% OFF
                      </span>
                    )}
                  </div>
                  
                  <button 
                    onClick={() => moveToCart(item.id, item.selectedSize, item.selectedColor)}
                    className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-semibold"
                  >
                    Move to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

// Header Component
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
  const { cartItems, wishlistItems } = React.useContext(CartContext);
  
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
              {/* Search Bar */}
              <form onSubmit={handleSearch} className="hidden md:flex items-center border border-gray-300 rounded-md px-4 py-2 gap-2 w-72">
                <Search className="w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search Products..." 
                  className="outline-none text-sm flex-1"
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
                    <User className="w-5 h-5 text-gray-700" />
                    <span className="absolute -top-1 -right-1 bg-green-500 w-2 h-2 rounded-full"></span>
                  </div>
                  <span className="text-[13px] font-semibold text-slate-900">Profile</span>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-0.5 cursor-pointer">
                  <User className="w-5 h-5 text-gray-700" />
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
      
      {showSecondaryHeader && (
          <div className="bg-gray-50 border-b border-gray-200 py-3">
            <div className="max-w-8xl mx-auto px-4 flex items-center gap-4">
            {showSecondaryHeader && (
             <button onClick={onMenuClick} className="p-1">
              <Menu size={24} />
             </button>
            )}
             <h2 className="text-xl font-bold text-gray-800">{secondaryTitle}</h2>
              <div className="flex items-center gap-2 ml-auto">
              <ShoppingCart size={20} className="text-gray-600" />
               <span className="text-sm font-semibold text-gray-600">
                 {cartItems.reduce((total, item) => total + item.quantity, 0)} Items
               </span>
             </div>
          </div>
        </div>
       )}
    </>
  );
};

// Footer Component
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
              <a href="#">
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

// Shopping Cart Page Component
const ShoppingCartPage = ({ setCurrentPage }) => {
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    moveToWishlist,
    calculateTotal,
    calculateOriginalTotal,
    calculateDiscount,
    calculateGST,
    calculateFinalTotal
  } = React.useContext(CartContext);
  
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false);
  const companyDropdownRef = useRef(null);
  
  const handleRemoveClick = (item) => {
    setItemToRemove(item);
    setShowRemoveModal(true);
  };
  
  const confirmRemove = (moveToWishlistOption) => {
    if (moveToWishlistOption) {
      moveToWishlist(itemToRemove.id, itemToRemove.selectedSize, itemToRemove.selectedColor);
    } else {
      removeFromCart(itemToRemove.id, itemToRemove.selectedSize, itemToRemove.selectedColor);
    }
    setShowRemoveModal(false);
    setItemToRemove(null);
  };
  
  const handleMenuClick = (option) => {
    setIsMenuOpen(false);
    if (option === 'orderSummary') {
      setCurrentPage('orderSummary');
    } else if (option === 'orderHistory') {
      setCurrentPage('orderHistory');
    } else if (option === 'orderTracking') {
      setCurrentPage('orderTracking');
    }
  };
  
  return (
    <div className="min-h-screen bg-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Assistant:wght@200;300;400;500;600;700;800&display=swap');
        
        * {
          font-family: 'Assistant', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
        }
      `}</style>
      
      <Header 
        setCurrentPage={setCurrentPage} 
        setShowAuth={() => {}} 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isCompanyDropdownOpen={isCompanyDropdownOpen}
        setIsCompanyDropdownOpen={setIsCompanyDropdownOpen}
        companyDropdownRef={companyDropdownRef}
        showSecondaryHeader={true}
        secondaryTitle="Shopping Cart"
        onMenuClick={() => setIsMenuOpen(!isMenuOpen)}
      />
      
      {/* Menu Dropdown */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={() => setIsMenuOpen(false)}>
          <div className="bg-white w-64 h-full shadow-lg" onClick={(e) => e.stopPropagation()}>
            <div className="p-4">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold">Menu</h3>
                <button onClick={() => setIsMenuOpen(false)} className="p-1">
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-2">
                <button 
                  onClick={() => handleMenuClick('orderSummary')}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded font-semibold"
                >
                  Order Summary
                </button>
                <button 
                  onClick={() => handleMenuClick('orderHistory')}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded font-semibold"
                >
                  Order History
                </button>
                <button 
                  onClick={() => handleMenuClick('orderTracking')}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded font-semibold"
                >
                  Order Tracking
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="max-w-8xl mx-auto px-4 py-8">
        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingCart size={64} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Looks like you haven't added anything to your cart yet.</p>
            <button 
              onClick={() => setCurrentPage('landing')}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-semibold"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="md:col-span-2">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Cart Items ({cartItems.length})</h2>
              
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                    <div className="flex flex-col md:flex-row gap-4">
                      <img 
                        src={item.images[0]} 
                        alt={item.name} 
                        className="w-full md:w-24 h-32 object-cover rounded"
                      />
                      
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1">{item.name}</h3>
                        <p className="text-sm text-gray-500 mb-2">{item.brand}</p>
                        
                        <div className="flex flex-wrap gap-2 mb-3">
                          <span className="text-sm bg-gray-100 px-2 py-1 rounded">Size: {item.selectedSize}</span>
                          <span className="text-sm bg-gray-100 px-2 py-1 rounded">Color: {item.selectedColor}</span>
                        </div>
                        
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center">
                            <span className="font-bold text-lg">₹{item.price}</span>
                            {item.originalPrice > item.price && (
                              <span className="text-sm text-gray-500 line-through ml-2">₹{item.originalPrice}</span>
                            )}
                            {item.originalPrice > item.price && (
                              <span className="ml-2 bg-red-100 text-red-600 text-xs px-2 py-1 rounded font-bold">
                                {Math.round((1 - item.price / item.originalPrice) * 100)}% OFF
                              </span>
                            )}
                          </div>
                          
                          <div className="flex items-center">
                            <button 
                              onClick={() => updateQuantity(item.id, item.selectedSize, item.selectedColor, item.quantity - 1)}
                              className="p-1 border border-gray-300 rounded-l hover:bg-gray-100"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="px-3 py-1 border-t border-b border-gray-300 min-w-[40px] text-center">
                              {item.quantity}
                            </span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.selectedSize, item.selectedColor, item.quantity + 1)}
                              className="p-1 border border-gray-300 rounded-r hover:bg-gray-100"
                            >
                              <PlusIcon size={16} />
                            </button>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleRemoveClick(item)}
                            className="px-3 py-1 border border-red-300 text-red-600 text-sm rounded hover:bg-red-50 transition-colors font-semibold"
                          >
                            Remove
                          </button>
                          <button 
                            onClick={() => moveToWishlist(item.id, item.selectedSize, item.selectedColor)}
                            className="px-3 py-1 border border-blue-300 text-blue-600 text-sm rounded hover:bg-blue-50 transition-colors font-semibold"
                          >
                            Move to Wishlist
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Order Summary */}
              <div className="mt-8 bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Order Summary</h3>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total MRP</span>
                    <span className="font-semibold">₹{calculateOriginalTotal()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Discount</span>
                    <span className="font-semibold text-green-600">-₹{calculateDiscount()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">GST (18%)</span>
                    <span className="font-semibold">₹{calculateGST()}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t">
                    <span>Total</span>
                    <span>₹{calculateFinalTotal()}</span>
                  </div>
                </div>
                
                <button 
                  onClick={() => setCurrentPage('checkout')}
                  className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
            
            {/* Right Sidebar - Could be empty or have recommendations */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4">You may also like</h3>
              
              <div className="space-y-4">
                {productsData.slice(0, 3).map((product) => (
                  <div key={product.id} className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
                    <div className="flex gap-3">
                      <img 
                        src={product.images[0]} 
                        alt={product.name} 
                        className="w-16 h-20 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-sm mb-1">{product.name}</h4>
                        <div className="flex items-center justify-between">
                          <span className="font-bold">₹{product.price}</span>
                          <button className="text-blue-600 text-sm hover:underline font-semibold">
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Remove Confirmation Modal */}
      {showRemoveModal && itemToRemove && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <h3 className="text-lg font-bold mb-4">Remove Item</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to remove "{itemToRemove.name}" from your cart?
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => confirmRemove(false)}
                className="flex-1 py-2 border border-red-300 text-red-600 rounded hover:bg-red-50 transition-colors font-semibold"
              >
                Remove
              </button>
              <button 
                onClick={() => confirmRemove(true)}
                className="flex-1 py-2 border border-blue-300 text-blue-600 rounded hover:bg-blue-50 transition-colors font-semibold"
              >
                Move to Wishlist
              </button>
              <button 
                onClick={() => setShowRemoveModal(false)}
                className="flex-1 py-2 border border-gray-300 text-gray-600 rounded hover:bg-gray-50 transition-colors font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  );
};

// Checkout Page Component
const CheckoutPage = ({ setCurrentPage }) => {
  const { 
    cartItems, 
    calculateTotal,
    calculateOriginalTotal,
    calculateDiscount,
    calculateGST,
    calculateFinalTotal,
    placeOrder
  } = React.useContext(CartContext);
  
  const [deliveryDetails, setDeliveryDetails] = useState({
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
  const [searchQuery, setSearchQuery] = useState('');
  const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false);
  const companyDropdownRef = useRef(null);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDeliveryDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
  };
  
  const handleCompletePurchase = () => {
    // Validate form
    if (!deliveryDetails.firstName || !deliveryDetails.lastName || 
        !deliveryDetails.email || !deliveryDetails.phone || 
        !deliveryDetails.address || !deliveryDetails.city || 
        !deliveryDetails.state || !deliveryDetails.zipCode) {
      alert('Please fill in all delivery details');
      return;
    }
    
    // Place order
    const newOrder = placeOrder(deliveryDetails, paymentMethod);
    
    // Redirect to order summary
    setCurrentPage('orderSummary');
  };
  
  return (
    <div className="min-h-screen bg-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Assistant:wght@200;300;400;500;600;700;800&display=swap');
        
        * {
          font-family: 'Assistant', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
        }
      `}</style>
      
      <Header 
        setCurrentPage={setCurrentPage} 
        setShowAuth={() => {}} 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isCompanyDropdownOpen={isCompanyDropdownOpen}
        setIsCompanyDropdownOpen={setIsCompanyDropdownOpen}
        companyDropdownRef={companyDropdownRef}
      />
      
      <div className="max-w-8xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-8">Checkout</h1>
        
        <div className="grid md:grid-cols-3 gap-8">
          {/* Cart Summary */}
          <div className="md:col-span-2">
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Cart Summary</h2>
              
              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} className="flex gap-4 pb-4 border-b">
                    <img 
                      src={item.images[0]} 
                      alt={item.name} 
                      className="w-16 h-20 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-gray-500">
                        Size: {item.selectedSize}, Color: {item.selectedColor}, Qty: {item.quantity}
                      </p>
                      <p className="font-semibold">₹{item.price * item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="space-y-2 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total MRP</span>
                  <span className="font-semibold">₹{calculateOriginalTotal()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Discount</span>
                  <span className="font-semibold text-green-600">-₹{calculateDiscount()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">GST (18%)</span>
                  <span className="font-semibold">₹{calculateGST()}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span>Total</span>
                  <span>₹{calculateFinalTotal()}</span>
                </div>
              </div>
              
              <button 
                onClick={handleCompletePurchase}
                className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Complete Purchase
              </button>
            </div>
            
            {/* Delivery Details Form */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Delivery Details</h2>
              
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input 
                    type="text" 
                    name="firstName"
                    value={deliveryDetails.firstName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input 
                    type="text" 
                    name="lastName"
                    value={deliveryDetails.lastName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input 
                  type="email" 
                  name="email"
                  value={deliveryDetails.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input 
                  type="tel" 
                  name="phone"
                  value={deliveryDetails.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <textarea 
                  name="address"
                  value={deliveryDetails.address}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="grid md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input 
                    type="text" 
                    name="city"
                    value={deliveryDetails.city}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <input 
                    type="text" 
                    name="state"
                    value={deliveryDetails.state}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Zip Code</label>
                  <input 
                    type="text" 
                    name="zipCode"
                    value={deliveryDetails.zipCode}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Payment Section */}
          <div>
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Payment Method</h2>
              
              <div className="space-y-3 mb-6">
                <button 
                  onClick={() => handlePaymentMethodChange('card')}
                  className={`w-full flex items-center gap-3 p-3 border rounded-md ${paymentMethod === 'card' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
                >
                  <CreditCard size={20} />
                  <span className="font-medium">Card Payment</span>
                </button>
                
                <button 
                  onClick={() => handlePaymentMethodChange('upi')}
                  className={`w-full flex items-center gap-3 p-3 border rounded-md ${paymentMethod === 'upi' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
                >
                  <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">U</div>
                  <span className="font-medium">UPI</span>
                </button>
                
                <button 
                  onClick={() => handlePaymentMethodChange('wallet')}
                  className={`w-full flex items-center gap-3 p-3 border rounded-md ${paymentMethod === 'wallet' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
                >
                  <div className="w-5 h-5 bg-green-600 rounded-full flex items-center justify-center text-white text-xs font-bold">W</div>
                  <span className="font-medium">Platform Wallet</span>
                </button>
              </div>
              
              {paymentMethod === 'card' && (
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                    <input 
                      type="text" 
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                      <input 
                        type="text" 
                        placeholder="MM/YY"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                      <input 
                        type="text" 
                        placeholder="123"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              )}
              
              {paymentMethod === 'upi' && (
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">UPI ID</label>
                    <input 
                      type="text" 
                      placeholder="yourname@upi"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors font-semibold">
                      Google Pay
                    </button>
                    <button className="flex-1 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors font-semibold">
                      PhonePe
                    </button>
                    <button className="flex-1 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors font-semibold">
                      Paytm
                    </button>
                  </div>
                </div>
              )}
              
              {paymentMethod === 'wallet' && (
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Wallet Type</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option>Income Wallet</option>
                      <option>E-Wallet</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Available Balance</label>
                    <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                      <p className="text-green-800 font-semibold">₹5,000</p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex gap-3">
                <button 
                  onClick={() => setCurrentPage('cart')}
                  className="flex-1 py-2 border border-gray-300 text-gray-600 rounded hover:bg-gray-50 transition-colors font-semibold"
                >
                  Continue Shopping
                </button>
                <button 
                  onClick={handleCompletePurchase}
                  className="flex-1 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-semibold"
                >
                  Pay Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

// Order Summary Page Component
const OrderSummaryPage = ({ setCurrentPage }) => {
  const { orders } = React.useContext(CartContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false);
  const companyDropdownRef = useRef(null);
  
  // Get the most recent order
  const latestOrder = orders.length > 0 ? orders[orders.length - 1] : null;
  
  return (
    <div className="min-h-screen bg-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Assistant:wght@200;300;400;500;600;700;800&display=swap');
        
        * {
          font-family: 'Assistant', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
        }
      `}</style>
      
      <Header 
        setCurrentPage={setCurrentPage} 
        setShowAuth={() => {}} 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isCompanyDropdownOpen={isCompanyDropdownOpen}
        setIsCompanyDropdownOpen={setIsCompanyDropdownOpen}
        companyDropdownRef={companyDropdownRef}
      />
      
      <div className="max-w-8xl mx-auto px-4 py-8">
        {latestOrder ? (
          <>
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <CheckCircle size={32} className="text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Order Placed Successfully!</h1>
              <p className="text-gray-600">Thank you for your purchase. Your order has been confirmed.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {/* Order Details */}
              <div className="md:col-span-2">
                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                  <h2 className="text-lg font-bold text-gray-800 mb-4">Order Details</h2>
                  
                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Delivery Date</p>
                      <p className="font-semibold">
                        {new Date(latestOrder.deliveryDate).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Order ID</p>
                      <p className="font-semibold">{latestOrder.id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Payment Method</p>
                      <p className="font-semibold capitalize">{latestOrder.paymentMethod}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Delivery Address</p>
                      <p className="font-semibold">
                        {latestOrder.deliveryDetails.address}, {latestOrder.deliveryDetails.city}, {latestOrder.deliveryDetails.state} - {latestOrder.deliveryDetails.zipCode}
                      </p>
                    </div>
                  </div>
                  
                  <h3 className="font-bold text-gray-800 mb-3">Items in this Order</h3>
                  
                  <div className="space-y-4">
                    {latestOrder.items.map((item, index) => (
                      <div key={index} className="flex gap-4 pb-4 border-b last:border-b-0">
                        <img 
                          src={item.images[0]} 
                          alt={item.name} 
                          className="w-16 h-20 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-sm text-gray-500">
                            Size: {item.selectedSize}, Color: {item.selectedColor}, Qty: {item.quantity}
                          </p>
                          <p className="font-semibold">₹{item.price * item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Billing Details */}
              <div>
                <div className="bg-gray-50 rounded-lg p-6">
                  <h2 className="text-lg font-bold text-gray-800 mb-4">Billing Details</h2>
                  
                  <div className="space-y-2 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-semibold">₹{latestOrder.subtotal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-semibold">FREE</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax</span>
                      <span className="font-semibold">₹{latestOrder.gst}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold pt-2 border-t">
                      <span>Total</span>
                      <span>₹{latestOrder.total}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <button 
                      onClick={() => setCurrentPage('orderTracking')}
                      className="flex-1 py-2 border border-blue-300 text-blue-600 rounded hover:bg-blue-50 transition-colors font-semibold"
                    >
                      Track Order
                    </button>
                    <button 
                      onClick={() => setCurrentPage('landing')}
                      className="flex-1 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-semibold"
                    >
                      Continue Shopping
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <Package size={64} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No Orders Found</h2>
            <p className="text-gray-600 mb-6">You haven't placed any orders yet.</p>
            <button 
              onClick={() => setCurrentPage('landing')}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-semibold"
            >
              Start Shopping
            </button>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

// Order History Page Component
const OrderHistoryPage = ({ setCurrentPage }) => {
  const { orders } = React.useContext(CartContext);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false);
  const companyDropdownRef = useRef(null);
  
  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return order.status.toLowerCase() === filter.toLowerCase();
  });
  
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'processing': return 'text-blue-600 bg-blue-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };
  
  return (
    <div className="min-h-screen bg-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Assistant:wght@200;300;400;500;600;700;800&display=swap');
        
        * {
          font-family: 'Assistant', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
        }
      `}</style>
      
      <Header 
        setCurrentPage={setCurrentPage} 
        setShowAuth={() => {}} 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isCompanyDropdownOpen={isCompanyDropdownOpen}
        setIsCompanyDropdownOpen={setIsCompanyDropdownOpen}
        companyDropdownRef={companyDropdownRef}
      />
      
      <div className="max-w-8xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Order History</h1>
          
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-600" />
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Orders</option>
              <option value="completed">Completed</option>
              <option value="processing">Processing</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
        
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <Package size={64} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No Orders Found</h2>
            <p className="text-gray-600 mb-6">
              {filter === 'all' 
                ? "You haven't placed any orders yet." 
                : `You don't have any ${filter} orders.`}
            </p>
            <button 
              onClick={() => setCurrentPage('landing')}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-semibold"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div key={order.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex gap-4">
                    <img 
                      src={order.items[0].images[0]} 
                      alt={order.items[0].name} 
                      className="w-20 h-24 object-cover rounded"
                    />
                    <div>
                      <h3 className="font-semibold text-lg">{order.items[0].name}</h3>
                      <p className="text-sm text-gray-500 mb-1">Order ID: {order.id}</p>
                      {order.items.length > 1 && (
                        <p className="text-sm text-gray-500">+{order.items.length - 1} more items</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex-1 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex flex-col gap-1">
                      <p className="text-sm text-gray-600">
                        Order Date: {new Date(order.date).toLocaleDateString()}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-2">
                      <p className="font-bold text-lg">₹{order.total}</p>
                      <button 
                        onClick={() => setCurrentPage('orderTracking')}
                        className="text-blue-600 hover:underline text-sm font-semibold"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

// Order Tracking Page Component
const OrderTrackingPage = ({ setCurrentPage }) => {
  const { orders } = React.useContext(CartContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false);
  const companyDropdownRef = useRef(null);
  
  // Get the most recent order for tracking
  const latestOrder = orders.length > 0 ? orders[orders.length - 1] : null;
  
  // Mock tracking stages
  const trackingStages = [
    { 
      name: 'Order Placed', 
      completed: true, 
      date: new Date(latestOrder?.date || Date.now()).toLocaleDateString(),
      icon: <Package size={20} />
    },
    { 
      name: 'Arrived at Courier Warehouse', 
      completed: latestOrder?.status !== 'Processing' ? false : true, 
      date: latestOrder?.status !== 'Processing' ? '' : new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      icon: <Home size={20} />
    },
    { 
      name: 'Out for Delivery', 
      completed: latestOrder?.status === 'Completed' ? true : false, 
      date: latestOrder?.status === 'Completed' ? new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString() : '',
      icon: <Truck size={20} />
    },
    { 
      name: 'Products Delivered', 
      completed: latestOrder?.status === 'Completed' ? true : false, 
      date: latestOrder?.status === 'Completed' ? new Date(latestOrder.deliveryDate).toLocaleDateString() : '',
      icon: <CheckCircle2 size={20} />
    }
  ];
  
  return (
    <div className="min-h-screen bg-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Assistant:wght@200;300;400;500;600;700;800&display=swap');
        
        * {
          font-family: 'Assistant', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
        }
      `}</style>
      
      <Header 
        setCurrentPage={setCurrentPage} 
        setShowAuth={() => {}} 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isCompanyDropdownOpen={isCompanyDropdownOpen}
        setIsCompanyDropdownOpen={setIsCompanyDropdownOpen}
        companyDropdownRef={companyDropdownRef}
      />
      
      <div className="max-w-8xl mx-auto px-4 py-8">
        {latestOrder ? (
          <>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">Order Details</h1>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors font-semibold">
                <Download size={18} />
                Download Invoice
              </button>
            </div>
            
            {/* Order Information Grid */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Order Information</h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Order Number</p>
                  <p className="font-semibold">{latestOrder.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Order Placed Date</p>
                  <p className="font-semibold">
                    {new Date(latestOrder.date).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Order Delivered Date</p>
                  <p className="font-semibold">
                    {latestOrder.status === 'Completed' 
                      ? new Date(latestOrder.deliveryDate).toLocaleDateString()
                      : 'Expected in 7 days'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Number of Items</p>
                  <p className="font-semibold">{latestOrder.items.length}</p>
                </div>
              </div>
            </div>
            
            {/* Order Tracking Section */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Order Tracking</h2>
              
              <div className="relative">
                <div className="absolute left-5 top-8 bottom-0 w-0.5 bg-gray-300"></div>
                
                <div className="space-y-6">
                  {trackingStages.map((stage, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center ${
                        stage.completed ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
                      }`}>
                        {stage.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-semibold ${stage.completed ? 'text-gray-800' : 'text-gray-500'}`}>
                          {stage.name}
                        </h3>
                        {stage.date && (
                          <p className="text-sm text-gray-600">{stage.date}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Items from the Order */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Items from this Order</h2>
              
              <div className="space-y-4">
                {latestOrder.items.map((item, index) => (
                  <div key={index} className="flex gap-4 pb-4 border-b last:border-b-0">
                    <img 
                      src={item.images[0]} 
                      alt={item.name} 
                      className="w-16 h-20 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-gray-500">
                        Size: {item.selectedSize}, Color: {item.selectedColor}, Qty: {item.quantity}
                      </p>
                      <p className="font-semibold">₹{item.price * item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Billing Details */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Billing Details</h2>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total MRP</span>
                  <span className="font-semibold">₹{latestOrder.subtotal + latestOrder.discount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Discount</span>
                  <span className="font-semibold text-green-600">-₹{latestOrder.discount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">GST (18%)</span>
                  <span className="font-semibold">₹{latestOrder.gst}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span>Total</span>
                  <span>₹{latestOrder.total}</span>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <Package size={64} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No Orders Found</h2>
            <p className="text-gray-600 mb-6">You haven't placed any orders yet.</p>
            <button 
              onClick={() => setCurrentPage('landing')}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-semibold"
            >
              Start Shopping
            </button>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

// Category Page Component
const CategoryPage = ({ category, setCurrentPage, searchQuery, setSearchQuery }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [activeProductSlide, setActiveProductSlide] = useState(0);
  const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    categories: [],
    brands: [],
    colors: [],
    discount: '',
    minPrice: '',
    maxPrice: ''
  });
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const companyDropdownRef = useRef(null);
  
  const { addToCart, addToWishlist } = React.useContext(CartContext);
  
  // Filter products based on category
  const getFilteredProducts = () => {
    let products = [];
    
    if (category === 'all') {
      products = productsData;
    } else if (category === 'accessories') {
      products = productsData.filter(p => p.category === 'accessories');
    } else if (category === 'mens') {
      products = productsData.filter(p => p.category === 'men');
    } else if (category === 'womens') {
      products = productsData.filter(p => p.category === 'women');
    }
    
    // Apply additional filters
    if (filters.categories.length > 0) {
      // This is a simplified filter since we don't have exact category mapping
      // In a real app, you would map the filter categories to product properties
    }
    
    if (filters.brands.length > 0) {
      products = products.filter(p => filters.brands.includes(p.brand.toLowerCase()));
    }
    
    if (filters.colors.length > 0) {
      products = products.filter(p => 
        p.colors.some(color => 
          filters.colors.includes(color.toLowerCase())
        )
      );
    }
    
    if (filters.discount) {
      const minDiscount = parseInt(filters.discount);
      products = products.filter(p => {
        const discount = Math.round((1 - p.price / p.originalPrice) * 100);
        return discount >= minDiscount;
      });
    }
    
    if (filters.minPrice) {
      products = products.filter(p => p.price >= parseInt(filters.minPrice));
    }
    
    if (filters.maxPrice) {
      products = products.filter(p => p.price <= parseInt(filters.maxPrice));
    }
    
    return products;
  };
  
  // Filter products based on search query
  const filteredProducts = getFilteredProducts().filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.type.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const getPageTitle = () => {
    switch(category) {
      case 'all': return 'All Products';
      case 'mens': return "Men's Fashion";
      case 'womens': return "Women's Fashion";
      case 'accessories': return 'Accessories';
      default: return 'Products';
    }
  };
  
  const handleSearch = (e) => {
    e.preventDefault();
    // Search is already handled by the filteredProducts
  };
  
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => {
      if (filterType === 'discount' || filterType === 'minPrice' || filterType === 'maxPrice') {
        return { ...prev, [filterType]: value };
      } else {
        const updatedValues = [...prev[filterType]];
        if (updatedValues.includes(value)) {
          return { ...prev, [filterType]: updatedValues.filter(v => v !== value) };
        } else {
          return { ...prev, [filterType]: [...updatedValues, value] };
        }
      }
    });
  };
  
  const clearFilters = () => {
    setFilters({
      categories: [],
      brands: [],
      colors: [],
      discount: '',
      minPrice: '',
      maxPrice: ''
    });
  };
  
  const handleAddToCart = (product) => {
    if (!selectedSize || !selectedColor) {
      alert('Please select size and color');
      return;
    }
    
    addToCart(product, selectedSize, selectedColor);
    setProductModalOpen(false);
    alert('Product added to cart!');
  };
  
  const handleAddToWishlist = (product) => {
    if (!selectedSize || !selectedColor) {
      alert('Please select size and color');
      return;
    }
    
    addToWishlist(product, selectedSize, selectedColor);
    alert('Product added to wishlist!');
  };
  
  const handleShareProduct = (product) => {
    setSelectedProduct(product);
    setShareModalOpen(true);
  };
  
  return (
    <div className="min-h-screen bg-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Assistant:wght@200;300;400;500;600;700;800&display=swap');
        
        * {
          font-family: 'Assistant', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
        }
      `}</style>
      
      <Header 
        setCurrentPage={setCurrentPage} 
        setShowAuth={setShowAuth} 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isCompanyDropdownOpen={isCompanyDropdownOpen}
        setIsCompanyDropdownOpen={setIsCompanyDropdownOpen}
        companyDropdownRef={companyDropdownRef}
      />
      
      {/* Category Header */}
      <section className="py-12 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-8xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">{getPageTitle()}</h1>
          <p className="text-gray-600 text-lg">
            {category === 'all' 
              ? 'Explore our complete collection of fashion products' 
              : `Discover our latest ${category === 'mens' ? "men's" : category === 'womens' ? "women's" : ''} fashion collection`}
          </p>
        </div>
      </section>
      
      {/* Products Grid with Filter */}
      <section className="py-12">
        <div className="max-w-8xl mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Filter Section */}
            <ProductFilter 
              filters={filters}
              handleFilterChange={handleFilterChange}
              clearFilters={clearFilters}
              isFilterOpen={isFilterOpen}
              setIsFilterOpen={setIsFilterOpen}
            />
            
            {/* Products Section */}
            <div className="flex-1">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                  {filteredProducts.length} Products Found
                </h2>
                <button 
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="md:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md"
                >
                  <Filter size={18} />
                  <span>Filters</span>
                </button>
              </div>
              
              {filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
                  <button 
                    onClick={clearFilters}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-semibold"
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {filteredProducts.map((product) => (
                    <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden group hover:shadow-xl transition-shadow">
                      <div className="relative">
                        <img 
                          src={product.images[0]} 
                          alt={product.name} 
                          className="w-full h-64 object-cover"
                        />
                        <button 
                          onClick={() => {
                            setSelectedProduct(product);
                            setSelectedSize(product.sizes[0]);
                            setSelectedColor(product.colors[0]);
                            setProductModalOpen(true);
                          }}
                          className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 flex items-center justify-center transition-all"
                        >
                          <Eye size={24} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                        {product.originalPrice > product.price && (
                          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded font-semibold">
                            {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                          </div>
                        )}
                      </div>
                      
                      <div className="p-4">
                        <p className="text-sm text-gray-500 mb-1 font-semibold">{product.brand}</p>
                        <h4 className="font-semibold mb-2">{product.name}</h4>
                        
                        <div className="flex items-center mb-2">
                          <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} size={14} fill={i < Math.floor(product.rating) ? "currentColor" : "none"} />
                            ))}
                          </div>
                          <span className="text-xs text-gray-500 ml-1 font-semibold">({product.reviews})</span>
                        </div>
                        
                        <div className="flex items-center mb-3">
                          <span className="font-bold text-lg">₹{product.price}</span>
                          {product.originalPrice > product.price && (
                            <span className="text-sm text-gray-500 line-through ml-2">₹{product.originalPrice}</span>
                          )}
                        </div>
                        
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => {
                              setSelectedProduct(product);
                              setSelectedSize(product.sizes[0]);
                              setSelectedColor(product.colors[0]);
                              setProductModalOpen(true);
                            }}
                            className="flex-1 px-3 py-1.5 border border-blue-600 text-blue-600 text-sm rounded hover:bg-blue-50 transition-colors font-semibold"
                          >
                            View Details
                          </button>
                          <button 
                            onClick={() => {
                              setSelectedSize(product.sizes[0]);
                              setSelectedColor(product.colors[0]);
                              handleAddToWishlist(product);
                            }}
                            className="p-1.5 border border-gray-300 text-gray-600 rounded hover:bg-gray-50 transition-colors"
                          >
                            <Heart size={16} />
                          </button>
                          <button 
                            onClick={() => handleShareProduct(product)}
                            className="p-1.5 border border-gray-300 text-gray-600 rounded hover:bg-gray-50 transition-colors"
                          >
                            <Share2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <Footer />
      
      {/* Product Details Modal */}
      {productModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">{selectedProduct.name}</h3>
                <button onClick={() => setProductModalOpen(false)} className="p-1">
                  <X size={20} />
                </button>
              </div>
             
             <div className="grid md:grid-cols-2 gap-6">
               <div>
                 <div className="relative">
                   <img 
                     src={selectedProduct.images[activeProductSlide]} 
                     alt={selectedProduct.name} 
                     className="w-full h-80 object-cover rounded-lg"
                   />
                   <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                     {selectedProduct.images.map((_, index) => (
                       <button 
                         key={index}
                         onClick={() => setActiveProductSlide(index)}
                         className={`w-2 h-2 rounded-full ${index === activeProductSlide ? 'bg-blue-600' : 'bg-gray-300'}`}
                       />
                     ))}
                   </div>
                 </div>
                 
                 <div className="flex space-x-2 mt-4">
                   {selectedProduct.images.map((image, index) => (
                     <img 
                       key={index}
                       src={image} 
                       alt={`${selectedProduct.name} ${index + 1}`}
                       className={`w-20 h-20 object-cover rounded cursor-pointer ${index === activeProductSlide ? 'ring-2 ring-blue-600' : ''}`}
                       onClick={() => setActiveProductSlide(index)}
                     />
                   ))}
                 </div>

                 {selectedProduct.videoUrl && (
                         <div className="mt-4">
                           <h4 className="font-bold mb-2">Product Video</h4>
                           <div className="relative">
                             <div className="bg-gray-200 rounded-lg overflow-hidden h-50 flex items-center justify-center">
                               <div className="text-center">
                                 <div className="bg-purple-600 bg-opacity-80 rounded-full p-3 inline-block mb-2">
                                   <Instagram size={24} className="text-white" />
                                 </div>
                                 <p className="text-white font-semibold">View on Instagram</p>
                               </div>
                             </div>
                             <a 
                               href={selectedProduct.videoUrl} 
                               target="_blank" 
                               rel="noopener noreferrer"
                               className="absolute inset-0 flex items-center justify-center"
                             >
                               <div className="bg-black bg-opacity-50 rounded-full p-3">
                                 <Play size={24} className="text-white ml-1" />
                               </div>
                             </a>
                           </div>
                         </div>
                       )}  
               </div>
               
               <div>
                 <p className="text-sm text-gray-500 mb-2 font-semibold">{selectedProduct.brand}</p>
                 <h4 className="text-xl font-bold mb-4">{selectedProduct.name}</h4>
                 
                 <div className="flex items-center mb-4">
                   <div className="flex text-yellow-400">
                     {[...Array(5)].map((_, i) => (
                       <Star key={i} size={16} fill={i < Math.floor(selectedProduct.rating) ? "currentColor" : "none"} />
                     ))}
                   </div>
                   <span className="text-sm text-gray-500 ml-2 font-semibold">({selectedProduct.reviews} reviews)</span>
                 </div>
                 
                 <div className="flex items-center mb-4">
                   <span className="text-2xl font-bold">₹{selectedProduct.price}</span>
                   {selectedProduct.originalPrice > selectedProduct.price && (
                     <span className="text-lg text-gray-500 line-through ml-3">₹{selectedProduct.originalPrice}</span>
                   )}
                   {selectedProduct.originalPrice > selectedProduct.price && (
                     <span className="ml-3 bg-red-100 text-red-600 text-sm px-2 py-1 rounded font-bold">
                       {Math.round((1 - selectedProduct.price / selectedProduct.originalPrice) * 100)}% OFF
                     </span>
                   )}
                 </div>
                 
                 <div className="mb-4">
                   <p className="text-sm font-bold mb-2">Fit</p>
                   <p className="text-sm text-gray-600 font-semibold">{selectedProduct.fit}</p>
                 </div>
                 
                 <div className="mb-4">
                   <p className="text-sm font-bold mb-2">Type</p>
                   <p className="text-sm text-gray-600 font-semibold">{selectedProduct.type}</p>
                 </div>
                 
                 <div className="mb-4">
                   <p className="text-sm font-bold mb-2">Available Colors</p>
                   <div className="flex space-x-2">
                     {selectedProduct.colors.map((color, index) => (
                       <button 
                         key={index}
                         onClick={() => setSelectedColor(color)}
                         className={`px-3 py-1 border rounded text-sm transition-colors font-semibold ${
                           selectedColor === color 
                             ? 'border-blue-600 bg-blue-50 text-blue-600' 
                             : 'border-gray-300 hover:bg-gray-100'
                         }`}
                       >
                         {color}
                       </button>
                     ))}
                   </div>
                 </div>

                 <div className="mb-4">
                   <p className="text-sm font-bold mb-2">Select Size</p>
                   <div className="flex space-x-2">
                     {selectedProduct.sizes.map((size, index) => (
                       <button 
                         key={index}
                         onClick={() => setSelectedSize(size)}
                         className={`px-3 py-1 border rounded text-sm transition-colors font-semibold ${
                           selectedSize === size 
                             ? 'border-blue-600 bg-blue-50 text-blue-600' 
                             : 'border-gray-300 hover:bg-gray-100'
                         }`}
                       >
                         {size}
                       </button>
                     ))}
                   </div>
                 </div>
                 
                 <div className="mb-4">
                   <p className="text-sm font-bold mb-2">Offers</p>
                   <p className="text-sm text-green-600 font-semibold">{selectedProduct.offers}</p>
                 </div>
                 
                 <div className="mb-4">
                   <p className="text-sm font-bold mb-2">Bank Offers</p>
                   <p className="text-sm text-blue-600 font-semibold">{selectedProduct.bankOffers}</p>
                 </div>
                 
                 <div className="flex space-x-3 mt-3">
                   <button 
                     onClick={() => handleAddToWishlist(selectedProduct)}
                     className="flex-1 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors flex items-center justify-center"
                   >
                     <Heart size={18} className="mr-2" />
                     <span className="text-sm font-bold">Wishlist</span>
                   </button>
                   <button 
                     onClick={() => handleShareProduct(selectedProduct)}
                     className="flex-1 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors flex items-center justify-center"
                   >
                     <Share2 size={18} className="mr-2" />
                     <span className="text-sm font-bold">Share</span>
                   </button>
                 </div>
                 <div className="flex space-x-3 mt-3">
                         <button 
                           onClick={() => handleAddToCart(selectedProduct)}
                           className="flex-1 py-2 border border-gray-300 bg-gray-800 rounded hover:bg-transparent hover:text-slate-900 text-white text-sm font-medium cursor-pointer transition-all duration-300"
                         >
                           <span className="text-sm font-bold">Buy now</span>
                         </button>
                         <button 
                           onClick={() => handleAddToCart(selectedProduct)}
                           className="flex-1 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors flex items-center justify-center"
                         >
                           <span className="text-sm font-bold">Add to cart</span>
                         </button>
                       </div>
               </div>
             </div>
             
             <div className="mt-8 border-t pt-6">
               <div className="grid md:grid-cols-3 gap-6">
                 <div>
                   <h5 className="font-bold mb-3">Product Details</h5>
                   <p className="text-sm text-gray-600 font-medium">{selectedProduct.description}</p>
                 </div>
                 
                 <div>
                   <h5 className="font-bold mb-3">Material & Care</h5>
                   <p className="text-sm text-gray-600 mb-2 font-medium">Material: {selectedProduct.material}</p>
                   <p className="text-sm text-gray-600 font-medium">Care: {selectedProduct.care}</p>
                 </div>
                 
                 <div>
                   <h5 className="font-bold mb-3">Size & Fit</h5>
                   <p className="text-sm text-gray-600 mb-2 font-medium">Fit: {selectedProduct.fit}</p>
                   <button className="text-sm text-blue-600 hover:underline font-bold">Size Chart</button>
                 </div>
               </div>
             </div>
             
             <div className="mt-6 border-t pt-6">
               <h5 className="font-bold mb-3">Customer Reviews & Ratings</h5>
               <div className="space-y-4">
                 <div className="border-b pb-4">
                   <div className="flex items-center mb-2">
                     <div className="flex text-yellow-400">
                       {[...Array(5)].map((_, i) => (
                         <Star key={i} size={14} fill="currentColor" />
                       ))}
                     </div>
                     <span className="text-sm text-gray-500 ml-2 font-semibold">John Doe</span>
                   </div>
                   <p className="text-sm text-gray-600 font-medium">Great product! Exactly as described and fits perfectly.</p>
                 </div>
                 
                 <div className="border-b pb-4">
                   <div className="flex items-center mb-2">
                     <div className="flex text-yellow-400">
                       {[...Array(4)].map((_, i) => (
                         <Star key={i} size={14} fill="currentColor" />
                       ))}
                       <Star size={14} />
                     </div>
                     <span className="text-sm text-gray-500 ml-2 font-semibold">Jane Smith</span>
                   </div>
                   <p className="text-sm text-gray-600 font-medium">Good quality product. The material is soft and comfortable.</p>
                 </div>
               </div>
             </div>
           </div>
         </div>
       </div>
     )}
     
     {/* Share Product Modal */}
     <ShareProductModal 
       product={selectedProduct}
       isOpen={shareModalOpen}
       onClose={() => setShareModalOpen(false)}
     />
   </div>
 );
};

// Landing Page Component
const LandingPage = ({ setCurrentPage, setUserType, setIsLoggedIn, setShowAuth }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [activeProductSlide, setActiveProductSlide] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [shareModalOpen, setShareModalOpen] = useState(false);
  
  // Refs for dropdown handling
  const companyDropdownRef = useRef(null);
  
  const { addToCart, addToWishlist } = React.useContext(CartContext);
  
  // Auto-scroll products
   useEffect(() => {
     const productContainer = document.getElementById('product-container');
     if (productContainer) {
       const scrollAmount = 1;
       const interval = setInterval(() => {
         if (productContainer.scrollLeft >= productContainer.scrollWidth - productContainer.clientWidth) {
           productContainer.scrollLeft = 0;
         } else {
           productContainer.scrollLeft += scrollAmount;
         }
       }, 30);
       
       return () => clearInterval(interval);
     }
   }, []);
   
   const handleAddToCart = (product) => {
    if (!selectedSize || !selectedColor) {
      alert('Please select size and color');
      return;
    }
    
    addToCart(product, selectedSize, selectedColor);
    setProductModalOpen(false);
    alert('Product added to cart!');
  };
  
  const handleAddToWishlist = (product) => {
    if (!selectedSize || !selectedColor) {
      alert('Please select size and color');
      return;
    }
    
    addToWishlist(product, selectedSize, selectedColor);
    alert('Product added to wishlist!');
  };
  
  const handleShareProduct = (product) => {
    setSelectedProduct(product);
    setShareModalOpen(true);
  };
   
   return (
     <div className="min-h-screen bg-white">
       <style>{`
         @import url('https://fonts.googleapis.com/css2?family=Assistant:wght@200;300;400;500;600;700;800&display=swap');
         
         * {
           font-family: 'Assistant', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
         }
       `}</style>
      
      <Header 
        setCurrentPage={setCurrentPage} 
        setShowAuth={setShowAuth} 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isCompanyDropdownOpen={isCompanyDropdownOpen}
        setIsCompanyDropdownOpen={setIsCompanyDropdownOpen}
        companyDropdownRef={companyDropdownRef}
      />
      
      {/* Hero Section with Video */}
      <section className="relative py-12">
        <div className="max-w-8xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl font-bold text-black mb-4">Welcome to ENGINEERS Fashion</h2>
              <p className="text-gray-600 mb-6">
                Discover premium fashion for both customers and brand owners. Join our network and experience the future of fashion.
              </p>
              <div className="flex space-x-4">
                <button className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-semibold">
                  Shop Now
                </button>
                <button className="px-6 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 transition-colors font-semibold">
                  Learn More
                </button>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gray-100 rounded-lg overflow-hidden">
                <div className="relative aspect-video bg-gray-200 flex items-center justify-center">
                  <img src="/api/placeholder/600/400" alt="Video" className="w-full h-full object-cover" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-xs">
                    <div className="flex items-center gap-2">
                      <Play className="w-4 h-4" />
                      <span>0:00 / 1:05</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Top Categories Section */}
      <div className="py-2 px-4 sm:px-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-8">Top Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 sm:gap-6 gap-4">
          <div className="cursor-pointer relative">
            <div className="aspect-square overflow-hidden mx-auto">
              <img src="https://readymadeui.com/images/fashion-img-1.webp" alt="product1"
                className="h-full w-full object-cover object-top" />
            </div>
            <div className="mt-4 px-2">
              <h4 className="text-slate-900 text-sm font-semibold">Up To 40% OFF</h4>
              <p className="mt-1 text-xs text-slate-600 font-medium">The colors of this season</p>
              <a href='#' className="mt-2 block text-[13px] text-blue-600 font-medium">Explore →</a>
            </div>
          </div>

          <div className="cursor-pointer relative">
            <div className="aspect-square overflow-hidden mx-auto">
              <img src="https://readymadeui.com/images/fashion-img-2.webp" alt="product1"
                className="h-full w-full object-cover object-top" />
            </div>
            <div className="mt-4 px-2">
              <h4 className="text-slate-900 text-sm font-semibold">Fresh Looks</h4>
              <p className="mt-1 text-xs text-slate-600 font-medium">The colors of this season</p>
              <a href='#' className="mt-2 block text-[13px] text-blue-600 font-medium">Explore →</a>
            </div>
          </div>

          <div className="cursor-pointer relative">
            <div className="aspect-square overflow-hidden mx-auto">
              <img src="https://readymadeui.com/images/fashion-img-7.webp" alt="product1"
                className="h-full w-full object-cover object-top" />
            </div>
            <div className="mt-4 px-2">
              <h4 className="text-slate-900 text-sm font-semibold">Up To 30% OFF</h4>
              <p className="mt-1 text-xs text-slate-600 font-medium">The colors of this season</p>
              <a href='#' className="mt-2 block text-[13px] text-blue-600 font-medium">Explore →</a>
            </div>
          </div>

          <div className="cursor-pointer relative">
            <div className="aspect-square overflow-hidden mx-auto">
              <img src="https://readymadeui.com/images/fashion-img-4.webp" alt="product1"
                className="h-full w-full object-cover object-top" />
            </div>
            <div className="mt-4 px-2">
              <h4 className="text-slate-900 text-sm font-semibold">Exclusive Fashion</h4>
              <p className="mt-1 text-xs text-slate-600 font-medium">The colors of this season</p>
              <a href='#' className="mt-2 block text-[13px] text-blue-600 font-medium">Explore →</a>
            </div>
          </div>

          <div className="cursor-pointer relative">
            <div className="aspect-square overflow-hidden mx-auto">
              <img src="https://readymadeui.com/images/fashion-img-5.webp" alt="product1"
                className="h-full w-full object-cover object-top" />
            </div>
            <div className="mt-4 px-2">
              <h4 className="text-slate-900 text-sm font-semibold">Top Picks for Less</h4>
              <p className="mt-1 text-xs text-slate-600 font-medium">The colors of this season</p>
              <a href='javascript:void(0);' className="mt-2 block text-[13px] text-blue-600 font-medium">Explore →</a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Category Links Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-10">
          <div className="flex justify-start space-x-8">
            <a 
              href="#men" 
              onClick={(e) => {
                e.preventDefault();
                setCurrentPage('mens');
              }}
              className="text-gray-800 hover:text-black font-bold transition-colors text-center"
            >
              <h3 className="mb-8 text-center uppercase tracking-wide">Men</h3>
              <div className="relative group cursor-pointer">
                <img 
                  src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop" 
                  alt="Fashion for Men" 
                  className="w-full h-60 object-cover rounded-2xl shadow-2xl group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </a>
            
            <a 
              href="#women" 
              onClick={(e) => {
                e.preventDefault();
                setCurrentPage('womens');
              }}
              className="text-gray-800 hover:text-black font-bold transition-colors text-center"
            >
              <h3 className="mb-8 text-center uppercase tracking-wide">Women</h3>
              <div className="relative group cursor-pointer">
                <img 
                  src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&h=400&fit=crop" 
                  alt="Fashion for Women" 
                  className="w-full h-60 object-cover rounded-2xl shadow-2xl group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </a>

            <a 
              href="#accessories" 
              onClick={(e) => {
                e.preventDefault();
                setCurrentPage('accessories');
              }}
              className="text-gray-800 hover:text-black font-bold transition-colors text-center"
            >
              <h3 className="mb-8 text-center uppercase tracking-wide">Accessories</h3>
              <div className="relative group cursor-pointer">
                <img 
                  src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&h=400&fit=crop" 
                  alt="Accessories" 
                  className="w-full h-60 object-cover rounded-2xl shadow-2xl group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </a>
          </div>
        </div>
      </section>
      
      {/* Join Us Section */}
      <div className="bg-gradient-to-r from-[#6626d9] via-[#a91079] to-[#e91e63] py-10 px-6">
        <div className="max-w-9xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Join Us Today</h2>
          <p className="text-lg text-white mb-12">Experience the future of our innovative solutions. Sign up now for exclusive access.</p>
          <button 
            onClick={() => setShowAuth(true)}
            className="bg-white text-[#a91079] hover:bg-[#a91079] hover:text-white py-3 px-8 rounded-full text-lg font-medium transition duration-300 hover:shadow-lg"
          >
            Get Started
          </button>
        </div>
      </div>
      
      {/* Products Section */}
            <section id="products" className="py-12">
              <div className="max-w-8xl mx-auto px-4">
                <h3 className="text-2xl font-bold text-black mb-8 text-center">Featured Products</h3>
                
                <div className="relative">
                  <div id="product-container" className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
                    {productsData.map((product, index) => (
                      <div key={product.id} className="flex-shrink-0 w-64 bg-white rounded-lg shadow-md overflow-hidden group">
                        <div className="relative">
                          <img 
                            src={product.images[0]} 
                            alt={product.name} 
                            className="w-full h-48 object-cover"
                          />
                          <button 
                            onClick={() => {
                              setSelectedProduct(product);
                              setSelectedSize(product.sizes[0]);
                              setSelectedColor(product.colors[0]);
                              setProductModalOpen(true);
                            }}
                            className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 flex items-center justify-center transition-all"
                          >
                            <Eye size={24} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                          </button>
                          {product.originalPrice > product.price && (
                            <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded font-semibold">
                              {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                            </div>
                          )}
                          {product.videoUrl && (
                            <div className="absolute bottom-2 right-2 bg-purple-600 text-white p-1 rounded-full">
                              <Instagram size={16} />
                            </div>
                          )}
                        </div>
                        
                        <div className="p-4">
                          <p className="text-sm text-gray-500 mb-1 font-semibold">{product.brand}</p>
                          <h4 className="font-semibold mb-2">{product.name}</h4>
                          
                          <div className="flex items-center mb-2">
                            <div className="flex text-yellow-400">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} size={14} fill={i < Math.floor(product.rating) ? "currentColor" : "none"} />
                              ))}
                            </div>
                            <span className="text-xs text-gray-500 ml-1 font-semibold">({product.reviews})</span>
                          </div>
                          
                          <div className="flex items-center mb-3">
                            <span className="font-bold text-lg">₹{product.price}</span>
                            {product.originalPrice > product.price && (
                              <span className="text-sm text-gray-500 line-through ml-2">₹{product.originalPrice}</span>
                            )}
                          </div>
                          
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => {
                                setSelectedProduct(product);
                                setSelectedSize(product.sizes[0]);
                                setSelectedColor(product.colors[0]);
                                setProductModalOpen(true);
                              }}
                              className="flex-1 px-3 py-1.5 border border-blue-600 text-blue-600 text-sm rounded hover:bg-blue-50 transition-colors font-semibold"
                            >
                              View Details
                            </button>
                            <button 
                              onClick={() => {
                                setSelectedSize(product.sizes[0]);
                                setSelectedColor(product.colors[0]);
                                handleAddToWishlist(product);
                              }}
                              className="p-1.5 border border-gray-300 text-gray-600 rounded hover:bg-gray-50 transition-colors"
                            >
                              <Heart size={16} />
                            </button>
                            <button 
                              onClick={() => handleShareProduct(product)}
                              className="p-1.5 border border-gray-300 text-gray-600 rounded hover:bg-gray-50 transition-colors"
                            >
                              <Share2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
      
      {/* Footer */}
      <Footer />
      
      {/* Product Details Modal */}
            {productModalOpen && selectedProduct && (
              <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-bold">{selectedProduct.name}</h3>
                      <button onClick={() => setProductModalOpen(false)} className="p-1">
                        <X size={20} />
                      </button>
                    </div>
                   
                   <div className="grid md:grid-cols-2 gap-6">
                     <div>
                       <div className="relative">
                         <img 
                           src={selectedProduct.images[activeProductSlide]} 
                           alt={selectedProduct.name} 
                           className="w-full h-80 object-cover rounded-lg"
                         />
                         <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                           {selectedProduct.images.map((_, index) => (
                             <button 
                               key={index}
                               onClick={() => setActiveProductSlide(index)}
                               className={`w-2 h-2 rounded-full ${index === activeProductSlide ? 'bg-blue-600' : 'bg-gray-300'}`}
                             />
                           ))}
                         </div>
                       </div>
                       
                       <div className="flex space-x-2 mt-4">
                         {selectedProduct.images.map((image, index) => (
                           <img 
                             key={index}
                             src={image} 
                             alt={`${selectedProduct.name} ${index + 1}`}
                             className={`w-20 h-20 object-cover rounded cursor-pointer ${index === activeProductSlide ? 'ring-2 ring-blue-600' : ''}`}
                             onClick={() => setActiveProductSlide(index)}
                           />
                         ))}
                       </div>
                       
                       {selectedProduct.videoUrl && (
                         <div className="mt-4">
                           <h4 className="font-bold mb-2">Product Video</h4>
                           <div className="relative">
                             <div className="bg-gray-200 rounded-lg overflow-hidden h-50 flex items-center justify-center">
                               <div className="text-center">
                                 <div className="bg-purple-600 bg-opacity-80 rounded-full p-3 inline-block mb-2">
                                   <Instagram size={24} className="text-white" />
                                 </div>
                                 <p className="text-white font-semibold">View on Instagram</p>
                               </div>
                             </div>
                             <a 
                               href={selectedProduct.videoUrl} 
                               target="_blank" 
                               rel="noopener noreferrer"
                               className="absolute inset-0 flex items-center justify-center"
                             >
                               <div className="bg-black bg-opacity-50 rounded-full p-3">
                                 <Play size={24} className="text-white ml-1" />
                               </div>
                             </a>
                           </div>
                         </div>
                       )}  
               </div>
                     
                     <div>
                       <p className="text-sm text-gray-500 mb-2 font-semibold">{selectedProduct.brand}</p>
                       <h4 className="text-xl font-bold mb-4">{selectedProduct.name}</h4>
                       
                       <div className="flex items-center mb-4">
                         <div className="flex text-yellow-400">
                           {[...Array(5)].map((_, i) => (
                             <Star key={i} size={16} fill={i < Math.floor(selectedProduct.rating) ? "currentColor" : "none"} />
                           ))}
                         </div>
                         <span className="text-sm text-gray-500 ml-2 font-semibold">({selectedProduct.reviews} reviews)</span>
                       </div>
                       
                       <div className="flex items-center mb-4">
                         <span className="text-2xl font-bold">₹{selectedProduct.price}</span>
                         {selectedProduct.originalPrice > selectedProduct.price && (
                           <span className="text-lg text-gray-500 line-through ml-3">₹{selectedProduct.originalPrice}</span>
                         )}
                         {selectedProduct.originalPrice > selectedProduct.price && (
                           <span className="ml-3 bg-red-100 text-red-600 text-sm px-2 py-1 rounded font-bold">
                             {Math.round((1 - selectedProduct.price / selectedProduct.originalPrice) * 100)}% OFF
                           </span>
                         )}
                       </div>
                       
                       <div className="mb-4">
                         <p className="text-sm font-bold mb-2">Fit</p>
                         <p className="text-sm text-gray-600 font-semibold">{selectedProduct.fit}</p>
                       </div>
                       
                       <div className="mb-4">
                         <p className="text-sm font-bold mb-2">Type</p>
                         <p className="text-sm text-gray-600 font-semibold">{selectedProduct.type}</p>
                       </div>
                       
                       <div className="mb-4">
                         <p className="text-sm font-bold mb-2">Available Colors</p>
                         <div className="flex space-x-2">
                           {selectedProduct.colors.map((color, index) => (
                             <button 
                               key={index}
                               onClick={() => setSelectedColor(color)}
                               className={`px-3 py-1 border rounded text-sm transition-colors font-semibold ${
                                 selectedColor === color 
                                   ? 'border-blue-600 bg-blue-50 text-blue-600' 
                                   : 'border-gray-300 hover:bg-gray-100'
                               }`}
                             >
                               {color}
                             </button>
                           ))}
                         </div>
                       </div>
                       
                       <div className="mb-4">
                         <p className="text-sm font-bold mb-2">Select Size</p>
                         <div className="flex space-x-2">
                           {selectedProduct.sizes.map((size, index) => (
                             <button 
                               key={index}
                               onClick={() => setSelectedSize(size)}
                               className={`px-3 py-1 border rounded text-sm transition-colors font-semibold ${
                                 selectedSize === size 
                                   ? 'border-blue-600 bg-blue-50 text-blue-600' 
                                   : 'border-gray-300 hover:bg-gray-100'
                               }`}
                             >
                               {size}
                             </button>
                           ))}
                         </div>
                       </div>
                       
                       <div className="mb-4">
                         <p className="text-sm font-bold mb-2">Offers</p>
                         <p className="text-sm text-green-600 font-semibold">{selectedProduct.offers}</p>
                       </div>
                       
                       <div className="mb-4">
                         <p className="text-sm font-bold mb-2">Bank Offers</p>
                         <p className="text-sm text-blue-600 font-semibold">{selectedProduct.bankOffers}</p>
                       </div>
                       
                       <div className="flex space-x-3 mt-3">
                         <button 
                           onClick={() => handleAddToWishlist(selectedProduct)}
                           className="flex-1 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors flex items-center justify-center"
                         >
                           <Heart size={18} className="mr-2" />
                           <span className="text-sm font-bold">Wishlist</span>
                         </button>
                         <button 
                           onClick={() => handleShareProduct(selectedProduct)}
                           className="flex-1 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors flex items-center justify-center"
                         >
                           <Share2 size={18} className="mr-2" />
                           <span className="text-sm font-bold">Share</span>
                         </button>
                       </div>
                       <div className="flex space-x-3 mt-3">
                         <button 
                           onClick={() => handleAddToCart(selectedProduct)}
                           className="flex-1 py-2 border border-gray-300 bg-gray-800 rounded hover:bg-transparent hover:text-slate-900 text-white text-sm font-medium cursor-pointer transition-all duration-300"
                         >
                           <span className="text-sm font-bold">Buy now</span>
                         </button>
                         <button 
                           onClick={() => handleAddToCart(selectedProduct)}
                           className="flex-1 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors flex items-center justify-center"
                         >
                           <span className="text-sm font-bold">Add to cart</span>
                         </button>
                       </div>
                     </div>
                   </div>
                   
                   <div className="mt-8 border-t pt-6">
                     <div className="grid md:grid-cols-3 gap-6">
                       <div>
                         <h5 className="font-bold mb-3">Product Details</h5>
                         <p className="text-sm text-gray-600 font-medium">{selectedProduct.description}</p>
                       </div>
                       
                       <div>
                         <h5 className="font-bold mb-3">Material & Care</h5>
                         <p className="text-sm text-gray-600 mb-2 font-medium">Material: {selectedProduct.material}</p>
                         <p className="text-sm text-gray-600 font-medium">Care: {selectedProduct.care}</p>
                       </div>
                       
                       <div>
                         <h5 className="font-bold mb-3">Size & Fit</h5>
                         <p className="text-sm text-gray-600 mb-2 font-medium">Fit: {selectedProduct.fit}</p>
                         <button className="text-sm text-blue-600 hover:underline font-bold">Size Chart</button>
                       </div>
                     </div>
                   </div>
                   
                   <div className="mt-6 border-t pt-6">
                     <h5 className="font-bold mb-3">Customer Reviews & Ratings</h5>
                     <div className="space-y-4">
                       <div className="border-b pb-4">
                         <div className="flex items-center mb-2">
                           <div className="flex text-yellow-400">
                             {[...Array(5)].map((_, i) => (
                               <Star key={i} size={14} fill="currentColor" />
                             ))}
                           </div>
                           <span className="text-sm text-gray-500 ml-2 font-semibold">John Doe</span>
                         </div>
                         <p className="text-sm text-gray-600 font-medium">Great product! Exactly as described and fits perfectly.</p>
                       </div>
                       
                       <div className="border-b pb-4">
                         <div className="flex items-center mb-2">
                           <div className="flex text-yellow-400">
                             {[...Array(4)].map((_, i) => (
                               <Star key={i} size={14} fill="currentColor" />
                             ))}
                             <Star size={14} />
                           </div>
                           <span className="text-sm text-gray-500 ml-2 font-semibold">Jane Smith</span>
                         </div>
                         <p className="text-sm text-gray-600 font-medium">Good quality product. The material is soft and comfortable.</p>
                       </div>
                     </div>
                   </div>
                 </div>
               </div>
             </div>
           )}
           
           {/* Share Product Modal */}
           <ShareProductModal 
             product={selectedProduct}
             isOpen={shareModalOpen}
             onClose={() => setShareModalOpen(false)}
           />
    </div>
  );
};

// Main Fashion Web App
const FashionWebApp = () => {
  const [currentPage, setCurrentPage] = useState('landing');
  const [userType, setUserType] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  
  const handleLoginSuccess = (userData) => {
    setCurrentUser(userData);
    setUserType(userData.userType);
    setIsLoggedIn(true);
    setShowAuth(false);
    
    // Redirect to appropriate dashboard
    if (userData.userType === 'customer') {
      setCurrentPage('customerDashboard');
    } else if (userData.userType === 'brand_owner') {
      setCurrentPage('brandOwnerDashboard');
    } else {
      setCurrentPage('landing');
    }
  };
  
  const handleLogout = () => {
    setCurrentUser(null);
    setUserType(null);
    setIsLoggedIn(false);
    setCurrentPage('landing');
  };
  
  const renderPage = () => {
    if (showAuth) {
      return <AuthApp onSwitchView={(view) => {
        if (view === 'home') {
          setShowAuth(false);
          setCurrentPage('landing');
        }
      }} onLoginSuccess={handleLoginSuccess} />;
    }
    
    if (currentPage === 'landing') {
      return <LandingPage setCurrentPage={setCurrentPage} setUserType={setUserType} setIsLoggedIn={setIsLoggedIn} setShowAuth={setShowAuth} />;
    } else if (currentPage === 'customerDashboard' && userType === 'customer') {
      return <CustomerDashboard setCurrentPage={setCurrentPage} user={currentUser} onLogout={handleLogout} />;
    } else if (currentPage === 'brandOwnerDashboard' && userType === 'brand_owner') {
      return <BrandOwnerDashboard setCurrentPage={setCurrentPage} />;
    } else if (currentPage === 'cart') {
      return <ShoppingCartPage setCurrentPage={setCurrentPage} />;
    } else if (currentPage === 'checkout') {
      return <CheckoutPage setCurrentPage={setCurrentPage} />;
    } else if (currentPage === 'orderSummary') {
      return <OrderSummaryPage setCurrentPage={setCurrentPage} />;
    } else if (currentPage === 'orderHistory') {
      return <OrderHistoryPage setCurrentPage={setCurrentPage} />;
    } else if (currentPage === 'orderTracking') {
      return <OrderTrackingPage setCurrentPage={setCurrentPage} />;
    } else if (currentPage === 'wishlist') {
      return <WishlistPage setCurrentPage={setCurrentPage} />;
    } else if (currentPage === 'mens' || currentPage === 'womens' || currentPage === 'accessories' || currentPage === 'all') {
      return <CategoryPage 
        category={currentPage} 
        setCurrentPage={setCurrentPage} 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />;
    } else if (currentPage === 'tree') {
      return <TreeVisualization setCurrentPage={setCurrentPage} />;
    } else {
      return <LandingPage setCurrentPage={setCurrentPage} setUserType={setUserType} setIsLoggedIn={setIsLoggedIn} setShowAuth={setShowAuth} />;
    }
  };
  
  return (
    <CartProvider>
      <div className="min-h-screen bg-white">
        {renderPage()}
      </div>
    </CartProvider>
  );
};

export default FashionWebApp;