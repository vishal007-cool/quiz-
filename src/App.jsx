import React, { useState, useEffect, useContext, useReducer, createContext, useMemo } from 'react';
import { 
  ShoppingCart, Search, Menu, X, Star, Heart, User, LogOut, 
  ChevronRight, ChevronLeft, Trash2, Plus, Minus, CreditCard, 
  MapPin, Check, LayoutDashboard, Package, Edit, Settings, ArrowRight 
} from 'lucide-react';

/**
 * MOCK DATA & CONFIGURATION
 * ------------------------------------------------------------------
 */
const MOCK_CATEGORIES = ["Electronics", "Fashion", "Home & Garden", "Books"];

const INITIAL_PRODUCTS = [
  { id: 1, title: "Pro Noise-Cancelling Headphones", price: 299.99, category: "Electronics", rating: 4.8, reviews: 124, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop", description: "Industry-leading noise cancellation, 30-hour battery life, and premium sound quality.", stock: 15 },
  { id: 2, title: "Ergonomic Mesh Office Chair", price: 149.50, category: "Home & Garden", rating: 4.5, reviews: 89, image: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?q=80&w=1000&auto=format&fit=crop", description: "Breathable mesh back, adjustable lumbar support, and heavy-duty base.", stock: 5 },
  { id: 3, title: "Minimalist Cotton T-Shirt", price: 24.99, category: "Fashion", rating: 4.2, reviews: 230, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1000&auto=format&fit=crop", description: "100% organic cotton, pre-shrunk, classic fit suitable for all occasions.", stock: 100 },
  { id: 4, title: "The Art of Code", price: 39.99, category: "Books", rating: 5.0, reviews: 45, image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=1000&auto=format&fit=crop", description: "A comprehensive guide to software architecture and design patterns.", stock: 30 },
  { id: 5, title: "4K Ultra HD Smart TV 55\"", price: 699.00, category: "Electronics", rating: 4.6, reviews: 312, image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?q=80&w=1000&auto=format&fit=crop", description: "Vibrant colors, smart connectivity, and cinema-quality sound.", stock: 8 },
  { id: 6, title: "Running Sneakers v3", price: 89.95, category: "Fashion", rating: 4.3, reviews: 67, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop", description: "Lightweight, responsive cushioning for long-distance runs.", stock: 22 },
  { id: 7, title: "Smart Home Assistant Speaker", price: 49.99, category: "Electronics", rating: 4.1, reviews: 540, image: "https://images.unsplash.com/photo-1589003077984-8334030db52a?q=80&w=1000&auto=format&fit=crop", description: "Control your home with voice commands. Compact and powerful.", stock: 45 },
  { id: 8, title: "Ceramic Coffee Mug Set", price: 34.00, category: "Home & Garden", rating: 4.7, reviews: 28, image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?q=80&w=1000&auto=format&fit=crop", description: "Set of 4 handcrafted ceramic mugs. Dishwasher safe.", stock: 12 },
];

const MOCK_USER = {
  id: 'u1',
  name: 'Demo User',
  email: 'demo@example.com',
  addresses: [{ id: 1, line1: "123 React Lane", city: "Component City", zip: "90210", default: true }],
  isAdmin: false
};

const MOCK_ADMIN = {
  id: 'a1',
  name: 'Admin User',
  email: 'admin@example.com',
  addresses: [],
  isAdmin: true
};

/**
 * CONTEXT & STATE MANAGEMENT
 * ------------------------------------------------------------------
 */
const ShopContext = createContext();

const shopReducer = (state, action) => {
  switch (action.type) {
    case 'INIT_APP':
      return { ...state, cart: action.payload.cart || [], user: action.payload.user || null };
    case 'SET_VIEW':
      return { ...state, currentView: action.payload.view, viewParams: action.payload.params || {} };
    case 'LOGIN':
      localStorage.setItem('nexstore_user', JSON.stringify(action.payload));
      return { ...state, user: action.payload, currentView: 'home' };
    case 'LOGOUT':
      localStorage.removeItem('nexstore_user');
      return { ...state, user: null, currentView: 'login' };
    case 'ADD_TO_CART': {
      const existingItem = state.cart.find(item => item.id === action.payload.id);
      let newCart;
      if (existingItem) {
        newCart = state.cart.map(item => 
          item.id === action.payload.id ? { ...item, qty: item.qty + 1 } : item
        );
      } else {
        newCart = [...state.cart, { ...action.payload, qty: 1 }];
      }
      localStorage.setItem('nexstore_cart', JSON.stringify(newCart));
      return { ...state, cart: newCart };
    }
    case 'UPDATE_CART_QTY': {
      const newCart = state.cart.map(item => 
        item.id === action.payload.id ? { ...item, qty: Math.max(0, action.payload.qty) } : item
      ).filter(item => item.qty > 0);
      localStorage.setItem('nexstore_cart', JSON.stringify(newCart));
      return { ...state, cart: newCart };
    }
    case 'CLEAR_CART':
      localStorage.removeItem('nexstore_cart');
      return { ...state, cart: [] };
    case 'UPDATE_PRODUCTS':
      return { ...state, products: action.payload };
    default:
      return state;
  }
};

const ShopProvider = ({ children }) => {
  const [state, dispatch] = useReducer(shopReducer, {
    user: null,
    cart: [],
    products: INITIAL_PRODUCTS,
    currentView: 'home',
    viewParams: {},
    isLoading: false,
  });

  // Load persistence
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('nexstore_cart'));
    const savedUser = JSON.parse(localStorage.getItem('nexstore_user'));
    dispatch({ type: 'INIT_APP', payload: { cart: savedCart, user: savedUser } });
  }, []);

  // Simulating Toast/Notification
  const [notification, setNotification] = useState(null);
  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const actions = {
    setView: (view, params) => dispatch({ type: 'SET_VIEW', payload: { view, params } }),
    login: (email, password) => {
      // Mock Auth Logic
      if (email === 'admin@example.com' && password === 'admin') {
        dispatch({ type: 'LOGIN', payload: MOCK_ADMIN });
        showNotification("Welcome back, Admin!");
        return true;
      } else if (email === 'demo@example.com' && password === 'password') {
        dispatch({ type: 'LOGIN', payload: MOCK_USER });
        showNotification("Welcome back, Demo User!");
        return true;
      }
      return false;
    },
    logout: () => {
      dispatch({ type: 'LOGOUT' });
      showNotification("Logged out successfully.");
    },
    addToCart: (product) => {
      dispatch({ type: 'ADD_TO_CART', payload: product });
      showNotification(`Added ${product.title} to cart`);
    },
    updateQty: (id, qty) => dispatch({ type: 'UPDATE_CART_QTY', payload: { id, qty } }),
    clearCart: () => dispatch({ type: 'CLEAR_CART' }),
    updateProduct: (product) => {
      const updated = state.products.map(p => p.id === product.id ? product : p);
      dispatch({ type: 'UPDATE_PRODUCTS', payload: updated });
      showNotification("Product updated successfully");
    }
  };

  return (
    <ShopContext.Provider value={{ ...state, ...actions, notification }}>
      {children}
    </ShopContext.Provider>
  );
};

const useShop = () => useContext(ShopContext);

/**
 * REUSABLE UI COMPONENTS (Design System)
 * ------------------------------------------------------------------
 */
const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyle = "px-4 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    secondary: "bg-gray-100 text-gray-800 hover:bg-gray-200 focus:ring-gray-400",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-400",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500"
  };
  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

const Input = ({ label, error, className = '', ...props }) => (
  <div className={`mb-4 ${className}`}>
    {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
    <input 
      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${error ? 'border-red-500' : 'border-gray-300'}`}
      {...props}
    />
    {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
  </div>
);

const Rating = ({ value, count }) => (
  <div className="flex items-center text-sm">
    {[...Array(5)].map((_, i) => (
      <Star 
        key={i} 
        size={16} 
        className={i < Math.round(value) ? "text-yellow-400 fill-current" : "text-gray-300"} 
      />
    ))}
    {count !== undefined && <span className="ml-1 text-gray-500">({count})</span>}
  </div>
);

const Badge = ({ children, color = "blue" }) => (
  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-${color}-100 text-${color}-800`}>
    {children}
  </span>
);

const LoadingSpinner = () => (
  <div className="flex justify-center items-center p-12">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

/**
 * FEATURE COMPONENTS
 * ------------------------------------------------------------------
 */

const ProductCard = ({ product }) => {
  const { addToCart, setView } = useShop();

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full group">
      <div 
        className="h-48 flex items-center justify-center bg-gray-50 rounded-t-lg cursor-pointer relative overflow-hidden"
        onClick={() => setView('product', { id: product.id })}
      >
        <img src={product.image} alt={product.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <div className="text-xs text-gray-500 mb-1">{product.category}</div>
        <h3 
          className="text-lg font-semibold text-gray-900 mb-1 cursor-pointer hover:text-blue-600 line-clamp-2"
          onClick={() => setView('product', { id: product.id })}
        >
          {product.title}
        </h3>
        <Rating value={product.rating} count={product.reviews} />
        <div className="mt-auto pt-4 flex items-center justify-between">
          <span className="text-xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
          <Button size="sm" onClick={() => addToCart(product)} aria-label={`Add ${product.title} to cart`}>
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
};

const Navbar = () => {
  const { cart, user, setView, currentView, logout } = useShop();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const cartCount = cart.reduce((acc, item) => acc + item.qty, 0);

  const handleSearch = (e) => {
    e.preventDefault();
    setView('listing', { search: searchTerm });
  };

  return (
    <nav className="bg-gray-900 text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Mobile Menu Button */}
          <div className="flex items-center">
            <button className="sm:hidden p-2 mr-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div 
              className="flex items-center cursor-pointer font-bold text-xl tracking-tight"
              onClick={() => setView('home')}
            >
              <span className="text-blue-400 mr-1">NXT</span>Store
            </div>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden sm:flex flex-1 max-w-2xl mx-8">
            <form onSubmit={handleSearch} className="w-full relative">
              <input 
                type="text" 
                placeholder="Search products..." 
                className="w-full bg-gray-800 text-white border-none rounded-l-md py-2 px-4 focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button type="submit" className="absolute right-0 top-0 h-full bg-blue-600 px-4 rounded-r-md hover:bg-blue-700">
                <Search size={20} />
              </button>
            </form>
          </div>

          {/* Right Icons */}
          <div className="flex items-center space-x-4">
            <div className="relative cursor-pointer" onClick={() => setView('cart')}>
              <ShoppingCart size={24} className="hover:text-blue-400 transition-colors" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </div>
            
            {user ? (
              <div className="relative group">
                <div className="flex items-center cursor-pointer hover:text-blue-400">
                  <User size={24} />
                  <span className="ml-2 text-sm font-medium hidden md:block">Hi, {user.name.split(' ')[0]}</span>
                </div>
                {/* Dropdown */}
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 hidden group-hover:block text-gray-800 border border-gray-100">
                  <div className="px-4 py-2 text-xs text-gray-500 border-b">Signed in as<br/><b>{user.email}</b></div>
                  {user.isAdmin && (
                     <button onClick={() => setView('admin')} className="block w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2">
                       <LayoutDashboard size={16}/> Admin Dashboard
                     </button>
                  )}
                  <button onClick={() => setView('profile')} className="block w-full text-left px-4 py-2 hover:bg-gray-100">Orders & Profile</button>
                  <button onClick={logout} className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600">Sign Out</button>
                </div>
              </div>
            ) : (
              <Button variant="primary" size="sm" onClick={() => setView('login')}>Sign In</Button>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile Search & Menu */}
      {isMenuOpen && (
        <div className="sm:hidden bg-gray-800 px-4 pt-2 pb-4 space-y-3">
          <form onSubmit={handleSearch} className="flex">
            <input 
              className="flex-1 bg-gray-700 text-white p-2 rounded-l-md" 
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="bg-blue-600 p-2 rounded-r-md"><Search size={20}/></button>
          </form>
          <div className="space-y-1">
            {MOCK_CATEGORIES.map(cat => (
              <div 
                key={cat} 
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700 cursor-pointer"
                onClick={() => { setView('listing', { category: cat }); setIsMenuOpen(false); }}
              >
                {cat}
              </div>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

/**
 * PAGE VIEWS
 * ------------------------------------------------------------------
 */

const HomePage = () => {
  const { products, setView } = useShop();

  const featured = products.slice(0, 4);
  const bestSellers = products.slice(4, 8);

  return (
    <div className="space-y-8 pb-12">
      {/* Hero */}
      <div className="bg-gray-900 text-white py-16 px-4 sm:px-8 rounded-b-xl sm:rounded-xl mx-0 sm:mx-4 mt-0 sm:mt-4 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <Badge color="blue">New Arrivals</Badge>
          <h1 className="text-4xl sm:text-5xl font-extrabold mt-4 mb-6 leading-tight">
            Discover the Future <br/><span className="text-blue-400">Of Shopping</span>
          </h1>
          <p className="text-lg text-gray-300 mb-8">
            Experience premium quality products delivered to your doorstep with our lightning-fast logistics network.
          </p>
          <Button size="lg" onClick={() => setView('listing')}>
            Shop Now <ArrowRight size={20} className="ml-2 inline" />
          </Button>
        </div>
        <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-blue-900 to-transparent opacity-50 pointer-events-none"></div>
      </div>

      {/* Categories */}
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {MOCK_CATEGORIES.map(cat => (
            <div 
              key={cat} 
              onClick={() => setView('listing', { category: cat })}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md cursor-pointer transition-all hover:-translate-y-1 text-center group"
            >
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform inline-block">
                {cat === 'Electronics' ? '💻' : cat === 'Fashion' ? '👗' : cat === 'Home & Garden' ? '🏡' : '📚'}
              </div>
              <h3 className="font-semibold text-gray-800">{cat}</h3>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Rows */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-end mb-6">
          <h2 className="text-2xl font-bold">Featured Products</h2>
          <button className="text-blue-600 hover:underline text-sm font-medium" onClick={() => setView('listing')}>View All</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {featured.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>

      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Best Sellers</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {bestSellers.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </div>
    </div>
  );
};

const ListingPage = () => {
  const { products, viewParams } = useShop();
  const [filters, setFilters] = useState({
    category: viewParams.category || 'All',
    maxPrice: 1000,
    search: viewParams.search || ''
  });

  // Filter Logic
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchCat = filters.category === 'All' || p.category === filters.category;
      const matchPrice = p.price <= filters.maxPrice;
      const matchSearch = p.title.toLowerCase().includes(filters.search.toLowerCase());
      return matchCat && matchPrice && matchSearch;
    });
  }, [products, filters]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-4 gap-8">
      {/* Sidebar Filters */}
      <div className="space-y-6">
        <div>
          <h3 className="font-bold text-gray-900 mb-3">Categories</h3>
          <div className="space-y-2">
            <label className="flex items-center">
              <input 
                type="radio" 
                name="category" 
                checked={filters.category === 'All'} 
                onChange={() => setFilters({ ...filters, category: 'All' })}
                className="text-blue-600 focus:ring-blue-500" 
              />
              <span className="ml-2 text-gray-700">All Categories</span>
            </label>
            {MOCK_CATEGORIES.map(cat => (
              <label key={cat} className="flex items-center">
                <input 
                  type="radio" 
                  name="category" 
                  checked={filters.category === cat}
                  onChange={() => setFilters({ ...filters, category: cat })}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-gray-700">{cat}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-bold text-gray-900 mb-3">Price Range</h3>
          <input 
            type="range" 
            min="0" 
            max="1000" 
            value={filters.maxPrice}
            onChange={(e) => setFilters({...filters, maxPrice: Number(e.target.value)})}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-500 mt-1">
            <span>$0</span>
            <span>${filters.maxPrice}</span>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="md:col-span-3">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold">
            {filters.search ? `Results for "${filters.search}"` : 
             filters.category !== 'All' ? filters.category : 'All Products'}
          </h1>
          <span className="text-sm text-gray-500">{filteredProducts.length} items found</span>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No products match your criteria.</p>
            <Button variant="outline" className="mt-4" onClick={() => setFilters({category: 'All', maxPrice: 1000, search: ''})}>Clear Filters</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
};

const ProductDetailPage = () => {
  const { products, viewParams, addToCart, setView } = useShop();
  const product = products.find(p => p.id === viewParams.id);

  if (!product) return <div>Product not found</div>;

  const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Button variant="outline" className="mb-6 flex items-center" onClick={() => setView('listing')}>
        <ChevronLeft size={16} className="mr-1" /> Back to Results
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white rounded-xl shadow-sm p-6 sm:p-10 mb-12">
        {/* Image */}
        <div className="flex items-center justify-center bg-gray-50 rounded-xl min-h-[400px] overflow-hidden">
          <img src={product.image} alt={product.title} className="w-full h-full object-cover animate-fade-in" />
        </div>

        {/* Details */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-600 tracking-wide uppercase">{product.category}</span>
            <div className="flex items-center text-gray-500 text-sm">
              <Star size={16} className="text-yellow-400 fill-current mr-1" />
              <span className="font-bold text-gray-900 mr-1">{product.rating}</span>
              <span>({product.reviews} reviews)</span>
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.title}</h1>
          <p className="text-4xl font-bold text-gray-900 mb-6">${product.price.toFixed(2)}</p>
          
          <p className="text-gray-600 leading-relaxed mb-8">{product.description}</p>
          
          <div className="flex items-center space-x-4 mb-8">
            <div className="text-green-600 font-medium flex items-center">
              <Check size={16} className="mr-1" /> In Stock ({product.stock} available)
            </div>
          </div>

          <div className="flex gap-4">
            <Button className="flex-1 py-3 text-lg" onClick={() => addToCart(product)}>Add to Cart</Button>
            <Button variant="secondary" className="px-4"><Heart size={20}/></Button>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div className="mt-16">
          <h3 className="text-xl font-bold mb-6">Related Products</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {related.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}
    </div>
  );
};

const CartPage = () => {
  const { cart, updateQty, setView } = useShop();
  
  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="inline-block p-6 bg-gray-100 rounded-full mb-4">
          <ShoppingCart size={48} className="text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
        <Button onClick={() => setView('listing')}>Start Shopping</Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Shopping Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map(item => (
            <div key={item.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="h-20 w-20 bg-gray-50 rounded-md flex items-center justify-center overflow-hidden">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.category}</p>
                <div className="font-bold mt-1">${item.price.toFixed(2)}</div>
              </div>
              <div className="flex items-center gap-3">
                <button className="p-1 hover:bg-gray-100 rounded" onClick={() => updateQty(item.id, item.qty - 1)}>
                  <Minus size={16} />
                </button>
                <span className="w-8 text-center font-medium">{item.qty}</span>
                <button className="p-1 hover:bg-gray-100 rounded" onClick={() => updateQty(item.id, item.qty + 1)}>
                  <Plus size={16} />
                </button>
              </div>
              <button className="text-red-500 p-2 hover:bg-red-50 rounded" onClick={() => updateQty(item.id, 0)}>
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 h-fit">
          <h3 className="text-lg font-bold mb-4">Order Summary</h3>
          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Tax (8%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="border-t pt-3 flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
          <Button className="w-full" size="lg" onClick={() => setView('checkout')}>
            Proceed to Checkout
          </Button>
        </div>
      </div>
    </div>
  );
};

const CheckoutPage = () => {
  const { cart, user, clearCart, setView } = useShop();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Checkout Form State
  const [formData, setFormData] = useState({
    name: user?.name || '',
    address: user?.addresses[0]?.line1 || '',
    city: user?.addresses[0]?.city || '',
    zip: user?.addresses[0]?.zip || '',
    cardName: '',
    cardNumber: '',
    expiry: '',
    cvv: ''
  });

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const total = subtotal * 1.08;

  const handlePlaceOrder = () => {
    setLoading(true);
    // Simulate API Call
    setTimeout(() => {
      setLoading(false);
      clearCart();
      setView('profile'); // Should redirect to success page in real app, simplified here
      alert("Order placed successfully!");
    }, 2000);
  };

  const StepIndicator = () => (
    <div className="flex justify-center mb-8">
      {[1, 2, 3].map(i => (
        <div key={i} className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= i ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
            {i}
          </div>
          {i < 3 && <div className={`w-12 h-1 mx-2 ${step > i ? 'bg-blue-600' : 'bg-gray-200'}`} />}
        </div>
      ))}
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-center mb-6">Checkout</h1>
      <StepIndicator />

      <div className="bg-white shadow-md rounded-xl p-8 border border-gray-100">
        {step === 1 && (
          <div>
            <h2 className="text-xl font-bold mb-4 flex items-center"><MapPin className="mr-2"/> Shipping Address</h2>
            <div className="grid grid-cols-1 gap-4">
              <Input label="Full Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              <Input label="Address Line 1" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
              <div className="grid grid-cols-2 gap-4">
                <Input label="City" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
                <Input label="ZIP / Postal Code" value={formData.zip} onChange={e => setFormData({...formData, zip: e.target.value})} />
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <Button onClick={() => setStep(2)}>Next: Payment</Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-xl font-bold mb-4 flex items-center"><CreditCard className="mr-2"/> Payment Method</h2>
            <div className="p-4 bg-gray-50 rounded-lg border mb-4">
              <p className="text-sm text-gray-500 mb-2">This is a mock checkout. No real money is charged.</p>
              <div className="flex gap-2 text-2xl opacity-50">
                 💳 💳 💳
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <Input label="Name on Card" placeholder="John Doe" value={formData.cardName} onChange={e => setFormData({...formData, cardName: e.target.value})} />
              <Input label="Card Number" placeholder="0000 0000 0000 0000" value={formData.cardNumber} onChange={e => setFormData({...formData, cardNumber: e.target.value})} />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Expiry Date" placeholder="MM/YY" value={formData.expiry} onChange={e => setFormData({...formData, expiry: e.target.value})} />
                <Input label="CVV" placeholder="123" value={formData.cvv} onChange={e => setFormData({...formData, cvv: e.target.value})} />
              </div>
            </div>
            <div className="mt-6 flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
              <Button onClick={() => setStep(3)}>Next: Review</Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-xl font-bold mb-4">Review Order</h2>
            <div className="border-b pb-4 mb-4">
              <div className="text-gray-600 mb-1">Shipping to:</div>
              <div className="font-medium">{formData.name}</div>
              <div>{formData.address}, {formData.city} {formData.zip}</div>
            </div>
            <div className="space-y-2 mb-6">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>{item.qty}x {item.title}</span>
                  <span className="font-medium">${(item.price * item.qty).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xl font-bold border-t pt-4 mb-8">
              <span>Order Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(2)} disabled={loading}>Back</Button>
              <Button onClick={handlePlaceOrder} disabled={loading} className="w-1/2">
                {loading ? 'Processing...' : `Pay $${total.toFixed(2)}`}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const AuthPage = () => {
  const { login } = useShop();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('demo@example.com');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      const success = login(email, password);
      if (!success) setError("Invalid credentials. Try demo@example.com / password");
    } else {
      // Fake registration
      login(email, password); // just log them in for MVP
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
          <p className="text-gray-500 mt-2">
            {isLogin ? 'Sign in to access your orders' : 'Join the marketplace today'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input 
            label="Email Address" 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
          <Input 
            label="Password" 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
          {error && <div className="text-red-500 text-sm">{error}</div>}
          
          <Button type="submit" className="w-full py-3">
            {isLogin ? 'Sign In' : 'Sign Up'}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm">
          <span className="text-gray-600">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
          </span>
          <button 
            className="text-blue-600 font-bold hover:underline"
            onClick={() => { setIsLogin(!isLogin); setError(''); }}
          >
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </div>
        
        <div className="mt-8 pt-6 border-t text-xs text-center text-gray-400">
          Demo User: demo@example.com / password<br/>
          Admin User: admin@example.com / admin
        </div>
      </div>
    </div>
  );
};

const AdminPage = () => {
  const { products, updateProduct, setView, user } = useShop();
  const [editingId, setEditingId] = useState(null);
  
  // Guard clause
  if (!user || !user.isAdmin) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-red-600">Access Denied</h2>
        <Button onClick={() => setView('home')} className="mt-4">Go Home</Button>
      </div>
    );
  }

  const handleSave = (id, field, value) => {
    const product = products.find(p => p.id === id);
    if (product) {
      updateProduct({ ...product, [field]: value });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold flex items-center"><LayoutDashboard className="mr-2"/> Admin Dashboard</h1>
        <Button>Add New Product</Button>
      </div>

      <div className="bg-white shadow-sm rounded-lg border overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map(product => (
              <tr key={product.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                      <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{product.title}</div>
                      <div className="text-sm text-gray-500">{product.category}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingId === product.id ? (
                     <input 
                       type="number" 
                       className="w-20 border rounded px-2"
                       value={product.price}
                       onChange={(e) => handleSave(product.id, 'price', parseFloat(e.target.value))}
                     />
                  ) : (
                    <div className="text-sm text-gray-900">${product.price.toFixed(2)}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${product.stock > 10 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {product.stock} left
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button 
                    onClick={() => setEditingId(editingId === product.id ? null : product.id)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    {editingId === product.id ? 'Done' : 'Edit Price'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ProfilePage = () => {
  const { user } = useShop();

  if(!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center mb-4">
          <div className="bg-blue-100 p-4 rounded-full mr-4">
            <User size={32} className="text-blue-600"/>
          </div>
          <div>
            <h2 className="text-xl font-bold">{user.name}</h2>
            <p className="text-gray-500">{user.email}</p>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
      <div className="bg-white rounded-lg shadow border border-gray-100 p-8 text-center text-gray-500">
        <Package size={48} className="mx-auto mb-2 opacity-20"/>
        <p>No recent orders found.</p>
      </div>
    </div>
  );
};

const Toast = () => {
  const { notification } = useShop();
  if (!notification) return null;
  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 text-white px-6 py-3 rounded-lg shadow-xl z-50 animate-fade-in-up">
      {notification}
    </div>
  );
};

const Footer = () => (
  <footer className="bg-gray-900 text-gray-400 py-12 mt-auto">
    <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
      <div>
        <div className="text-2xl font-bold text-white mb-4">NexStore</div>
        <p className="text-sm">The best mock marketplace on the web. Built with React & Tailwind.</p>
      </div>
      <div>
        <h4 className="text-white font-bold mb-4">Shop</h4>
        <ul className="space-y-2 text-sm">
          <li>All Products</li>
          <li>Featured</li>
          <li>Deals</li>
        </ul>
      </div>
      <div>
        <h4 className="text-white font-bold mb-4">Support</h4>
        <ul className="space-y-2 text-sm">
          <li>Help Center</li>
          <li>Returns</li>
          <li>Privacy Policy</li>
        </ul>
      </div>
      <div>
        <h4 className="text-white font-bold mb-4">Newsletter</h4>
        <div className="flex">
          <input className="bg-gray-800 text-white px-3 py-2 rounded-l-md w-full" placeholder="Email"/>
          <button className="bg-blue-600 text-white px-4 rounded-r-md">Subscribe</button>
        </div>
      </div>
    </div>
    <div className="max-w-7xl mx-auto px-4 mt-8 pt-8 border-t border-gray-800 text-center text-sm">
      &copy; 2023 NexStore Marketplace. All rights reserved.
    </div>
  </footer>
);

/**
 * MAIN APP COMPONENT
 * ------------------------------------------------------------------
 */
const MainApp = () => {
  const { currentView } = useShop();

  const renderView = () => {
    switch (currentView) {
      case 'home': return <HomePage />;
      case 'listing': return <ListingPage />;
      case 'product': return <ProductDetailPage />;
      case 'cart': return <CartPage />;
      case 'checkout': return <CheckoutPage />;
      case 'login': return <AuthPage />;
      case 'admin': return <AdminPage />;
      case 'profile': return <ProfilePage />;
      default: return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 font-sans">
      <Navbar />
      <main className="flex-grow">
        {renderView()}
      </main>
      <Footer />
      <Toast />
    </div>
  );
};

const App = () => (
  <ShopProvider>
    <MainApp />
  </ShopProvider>
);

export default App;