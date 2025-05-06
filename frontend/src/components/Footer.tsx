import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white text-wine">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold text-wine mb-4">Pixora</h3>
            <p className="mb-4">
              Your one-stop shop for high-quality customizable products. Design and order your unique items with ease.
            </p>

            <div className="flex space-x-4">
              {/* Facebook */}
              <div className="relative group inline-block">
                <a
                  href="#"
                  className="text-wine transition-transform duration-200 hover:scale-110 hover:font-semibold hover:text-wine cursor-pointer"
                >
                  <Facebook size={20} />
                </a>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-3 py-1 text-sm text-white bg-wine rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                  Pixora Facebook available soon. Stay tuned!
                </div>
              </div>

              {/* Twitter */}
              <div className="relative group inline-block">
                <a
                  href="#"
                  className="text-wine transition-transform duration-200 hover:scale-110 hover:font-semibold hover:text-wine cursor-pointer"
                >
                  <Twitter size={20} />
                </a>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-3 py-1 text-sm text-white bg-wine rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                  Pixora Twitter available soon. Stay tuned!
                </div>
              </div>

              {/* Instagram */}
              <div className="relative group inline-block">
                <a
                  href="#"
                  className="text-wine transition-transform duration-200 hover:scale-110 hover:font-semibold hover:text-wine cursor-pointer"
                >
                  <Instagram size={20} />
                </a>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-3 py-1 text-sm text-white bg-wine rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                  Pixora Instagram available soon. Stay tuned!
                </div>
              </div>
            </div>
          </div>




          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-wine mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-wine text-wine hover:wine transition-colors transition-transform duration-200 hover:scale-105 hover:font-semibold cursor-pointer transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-wine text-wine hover:wine transition-colors transition-transform duration-200 hover:scale-105 hover:font-semibold cursor-pointer transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/orders" className="hover:text-wine text-wine hover:wine transition-colors transition-transform duration-200 hover:scale-105 hover:font-semibold cursor-pointer transition-colors">
                  My Orders
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-wine text-wine hover:wine transition-colors transition-transform duration-200 hover:scale-105 hover:font-semibold cursor-pointer transition-colors">
                  Cart
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-wine text-wine hover:wine transition-colors transition-transform duration-200 hover:scale-105 hover:font-semibold cursor-pointer transition-colors">
                  My Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-lg font-semibold text-wine mb-4">Products</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/products/t-shirts" className="hover:text-wine transition-colors transition-transform duration-200 hover:scale-105 hover:font-semibold cursor-pointer">
                  T-shirts
                </Link>
              </li>
              <li>
                <Link to="/products/bags" className="hover:text-wine transition-colors transition-transform duration-200 hover:scale-105 hover:font-semibold cursor-pointer">
                  Bags
                </Link>
              </li>
              <li>
                <Link to="/products/awards" className="hover:text-wine transition-colors transition-transform duration-200 hover:scale-105 hover:font-semibold cursor-pointer">
                  Awards
                </Link>
              </li>
              <li>
                <Link to="/products/bottles" className="hover:text-wine transition-colors transition-transform duration-200 hover:scale-105 hover:font-semibold cursor-pointer">
                  Bottles
                </Link>
              </li>
              <li>
                <Link to="/products/stickers" className="hover:text-wine transition-colors transition-transform duration-200 hover:scale-105 hover:font-semibold cursor-pointer">
                  Stickers
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold text-wine mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin size={20} className="mr-2 mt-1 flex-shrink-0" />
                <span>QJ8H+7G7, Vaderamanchana Halli, Bengaluru, Karnataka 560105, India</span>
              </li>
              <li className="flex items-center">
                <Phone size={20} className="mr-2 flex-shrink-0" />
                <span>+91 8858824642</span>
              </li>
              <li className="flex items-center">
                <Mail size={20} className="mr-2 flex-shrink-0" />
                <span>support@pixora.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p>© {currentYear} Pixora. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;