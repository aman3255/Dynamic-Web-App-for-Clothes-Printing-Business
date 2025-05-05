import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ChevronLeft, Upload } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/Button';
import FileUpload from '../components/FileUpload';
import toast from 'react-hot-toast';

const CartPage: React.FC = () => {
  const { cartItems, removeFromCart, updateQuantity, updateDesign, updateNotes, getTotalPrice } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [uploadingIndex, setUploadingIndex] = useState<string | null>(null);

  const handleQuantityChange = (id: string, quantity: number) => {
    updateQuantity(id, quantity);
  };

  const handleRemoveItem = (id: string) => {
    removeFromCart(id);
    toast.success('Item removed from cart');
  };

  const handleFileChange = async (id: string, file: File | null) => {
    if (!file) {
      updateDesign(id, null);
      return;
    }

    try {
      setUploadingIndex(id);
      // Simulate file upload to server
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create a local URL for preview
      const objectUrl = URL.createObjectURL(file);
      updateDesign(id, file, objectUrl);
      setUploadingIndex(null);
      toast.success('Design updated');
    } catch (error) {
      console.error('Failed to upload design:', error);
      toast.error('Failed to upload design. Please try again.');
      setUploadingIndex(null);
    }
  };

  const handleNotesChange = (id: string, notes: string) => {
    updateNotes(id, notes);
  };

  const handleCheckout = () => {
    if (user) {
      navigate('/checkout');
    } else {
      toast.error('Please log in to proceed to checkout');
      navigate('/login');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ChevronLeft size={20} />
            <span>Continue Shopping</span>
          </button>
        </div>
        <h1 className="text-2xl font-bold">Your Cart</h1>
      </div>

      {cartItems.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg shadow-md">
          <div className="mb-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 text-gray-400 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Looks like you haven't added any products to your cart yet.</p>
          <Link to="/products">
            <Button variant="primary">Browse Products</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Items in Your Cart</h2>
                
                <div className="divide-y divide-gray-200">
                  {cartItems.map((item) => (
                    <div key={item.id} className="py-6 flex flex-col sm:flex-row">
                      <div className="flex-shrink-0 sm:w-32 sm:h-32 mb-4 sm:mb-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover rounded-md"
                        />
                      </div>
                      
                      <div className="flex-1 ml-0 sm:ml-6">
                        <div className="flex justify-between">
                          <h3 className="text-base font-medium text-gray-900">{item.name}</h3>
                          <p className="text-base font-medium text-gray-900">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">${item.price.toFixed(2)} each</p>
                        
                        <div className="mt-4 flex flex-wrap gap-4">
                          <div>
                            <label htmlFor={`quantity-${item.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                              Quantity
                            </label>
                            <div className="flex w-32">
                              <button
                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                className="px-3 py-1 border border-r-0 border-gray-300 rounded-l-md hover:bg-gray-100"
                              >
                                -
                              </button>
                              <input
                                id={`quantity-${item.id}`}
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                                className="w-full px-3 py-1 border border-gray-300 text-center focus:outline-none focus:ring-1 focus:ring-blue-500"
                              />
                              <button
                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                className="px-3 py-1 border border-l-0 border-gray-300 rounded-r-md hover:bg-gray-100"
                              >
                                +
                              </button>
                            </div>
                          </div>
                          
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-red-600 hover:text-red-800 text-sm flex items-center"
                          >
                            <Trash2 size={16} className="mr-1" />
                            Remove
                          </button>
                        </div>
                        
                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Your Design
                          </label>
                          {item.designUrl ? (
                            <div className="flex items-center">
                              <div className="relative w-16 h-16 mr-2 border rounded overflow-hidden">
                                <img
                                  src={item.designUrl}
                                  alt="Design preview"
                                  className="w-full h-full object-contain"
                                />
                              </div>
                              <button
                                onClick={() => handleFileChange(item.id, null)}
                                className="text-sm text-blue-600 hover:text-blue-800"
                              >
                                Change
                              </button>
                            </div>
                          ) : uploadingIndex === item.id ? (
                            <div className="flex items-center">
                              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-600 mr-2"></div>
                              <span className="text-sm text-gray-500">Uploading...</span>
                            </div>
                          ) : (
                            <div className="flex items-center">
                              <button
                                onClick={() => document.getElementById(`file-upload-${item.id}`)?.click()}
                                className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                              >
                                <Upload size={14} className="mr-1" />
                                Upload Design
                              </button>
                              <input
                                id={`file-upload-${item.id}`}
                                type="file"
                                accept="image/*,.pdf,.ai,.psd"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0] || null;
                                  handleFileChange(item.id, file);
                                }}
                              />
                            </div>
                          )}
                        </div>
                        
                        <div className="mt-3">
                          <label htmlFor={`notes-${item.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                            Special Instructions
                          </label>
                          <textarea
                            id={`notes-${item.id}`}
                            rows={2}
                            placeholder="Add any special instructions..."
                            value={item.notes || ''}
                            onChange={(e) => handleNotesChange(item.id, e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">${getTotalPrice().toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-900">Calculated at checkout</span>
                </div>
                
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="flex justify-between">
                    <span className="text-lg font-medium text-gray-900">Total</span>
                    <span className="text-lg font-bold text-gray-900">${getTotalPrice().toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Tax calculated at checkout</p>
                </div>
                
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={handleCheckout}
                >
                  Proceed to Checkout
                </Button>
                
                <div className="text-center">
                  <Link to="/products" className="text-sm text-blue-600 hover:text-blue-800">
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;