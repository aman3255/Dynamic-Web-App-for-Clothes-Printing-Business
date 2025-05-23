import React, { useState, useEffect, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, Search, LogOut } from 'lucide-react';
import { Input } from "../contexts/InputContext";
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import HowItWorks from '../pages/HowItWorks';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const categories = [
    { name: 'T-shirts', path: '/products/t-shirts' },
    { name: 'Bags', path: '/products/bags' },
    { name: 'Awards', path: '/products/awards' },
    { name: 'Bottles', path: '/products/bottles' },
    { name: 'Packaging', path: '/products/packaging' },
    { name: 'Photo Gifts', path: '/products/photo-gifts' },
    { name: 'Stickers', path: '/products/stickers' },
    { name: 'ID Cards', path: '/products/id-cards' },
    { name: 'Banners', path: '/products/banners' },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md' : 'bg-transparent'
        }`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="text-3xl font-bold text-wine flex items-center transition-transform duration-200 hover:scale-105 hover:font-semibold cursor-pointer">
            Pixora
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-xl text-wine hover:text-wine transition-colors transition-transform duration-200 hover:scale-105 hover:font-semibold cursor-pointer">
              Home
            </Link>
            <div className="relative group">
              <button className="text-xl text-wine hover:bg-whine-700 transition-colors transition-transform duration-200 hover:scale-105 hover:font-semibold cursor-pointer">
                Products
              </button>
              <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                {categories.map((category) => (
                  <Link
                    key={category.path}
                    to={category.path}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-wine hover:text-white"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>
            <Link to="/HowItWorks" className="text-xl text-wine hover:text-wine transition-colors transition-transform duration-200 hover:scale-105 hover:font-semibold cursor-pointer">
              How It Works
            </Link>
            {user && (
              <Link to="/orders" className="text-gray-800 hover:text-wine transition-colors">
                My Orders
              </Link>
            )}
          </nav>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex relative min-w-[250px] max-w-xs">
            <form onSubmit={handleSearch} className="w-full relative">
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-10 bg-wine/10 border-wine focus:border-wine"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-wine hover:text-wine/70"
              >
                <Search size={16} />
              </button>
            </form>
          </div>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-6">
            {user ? (
              <div className="flex items-center space-x-4">
                <Link to="/profile" className="flex items-center text-gray-800 hover:text-wine">
                  <User size={20} className="mr-1" />
                  <span>{user.fullName}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center text-gray-800 hover:text-wine"
                >
                  <LogOut size={20} className="mr-1" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-md text-gray-800 hover:text-wine transition-colors transition-transform duration-200 hover:scale-105 hover:font-semibold cursor-pointer"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-wine text-white rounded-md hover:bg-wine transition-colors transition-transform duration-200 hover:scale-105 hover:font-semibold cursor-pointer"
                >
                  Sign Up
                </Link>
              </div>
            )}
            <Link to="/cart" className="relative">
              <ShoppingCart size={24} className="text-wine hover:text-wine transition-all duration-300 transform hover:scale-110 hover:font-extrabold cursor-pointer" />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-4 md:hidden">
            <Link to="/cart" className="relative">
              <ShoppingCart size={24} className="text-wine" />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </Link>
            <button onClick={toggleMenu} className="text-wine focus:outline-none">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg">
          {/* Mobile Search Bar */}
          <form onSubmit={handleSearch} className="px-4 py-3 border-b border-gray-200">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-10 bg-wine/10 border-wine focus:border-wine"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-wine hover:text-wine/70"
              >
                <Search size={16} />
              </button>
            </div>
          </form>

          <div className="flex flex-col px-4 py-2">
            <Link
              to="/"
              className="py-3 border-b border-gray-200 text-wine transition-transform duration-200 hover:scale-105 hover:font-semibold cursor-pointer"
              onClick={toggleMenu}
            >
              Home
            </Link>
            <div className="py-3 border-b border-gray-200">
              <div className="font-medium mb-2 text-wine transition-transform duration-200 hover:scale-105 hover:font-semibold cursor-pointer">Products</div>
              <div className="pl-4 space-y-2">
                {categories.map((category) => (
                  <Link
                    key={category.path}
                    to={category.path}
                    className="block text-sm text-wine hover:text-wine transition-transform duration-200 hover:scale-105 hover:font-semibold cursor-pointer"
                    onClick={toggleMenu}
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>
            {user ? (
              <>
                <Link
                  to="/orders"
                  className="py-3 border-b border-gray-200 text-wine transition-transform duration-200 hover:scale-105 hover:font-semibold cursor-pointer"
                  onClick={toggleMenu}
                >
                  My Orders
                </Link>
                <Link
                  to="/profile"
                  className="py-3 border-b border-gray-200 text-wine transition-transform duration-200 hover:scale-105 hover:font-semibold cursor-pointer"
                  onClick={toggleMenu}
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    toggleMenu();
                  }}
                  className="py-3 text-left text-gray-800"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="py-3 border-b border-gray-200 text-wine transition-transform duration-200 hover:scale-105 hover:font-semibold cursor-pointer"
                  onClick={toggleMenu}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="py-3 text-wine transition-transform duration-200 hover:scale-105 hover:font-semibold cursor-pointer"
                  onClick={toggleMenu}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;