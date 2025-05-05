import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, CreditCard, CheckCircle } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { CardElement, Elements, useStripe, useElements } from '@stripe/react-stripe-js';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import Input from '../components/Input';
import Button from '../components/Button';
import toast from 'react-hot-toast';

// Initialize Stripe
const stripePromise = loadStripe('pk_test_your_stripe_key');

interface ShippingInfo {
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  email: string;
  phone: string;
}

const defaultShippingInfo: ShippingInfo = {
  name: '',
  address: '',
  city: '',
  state: '',
  zip: '',
  country: '',
  email: '',
  phone: '',
};

// Child component for the checkout form
const CheckoutForm: React.FC = () => {
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>(defaultShippingInfo);
  const [errors, setErrors] = useState<Partial<ShippingInfo>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState('');
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    if (user) {
      setShippingInfo(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
      }));
    }
  }, [user]);

  useEffect(() => {
    if (getTotalPrice() <= 0) {
      navigate('/cart');
      return;
    }

    const createPaymentIntent = async () => {
      try {
        const response = await api.createPaymentIntent(getTotalPrice() * 100);
        setClientSecret(response.data.clientSecret);
      } catch (error) {
        console.error('Error creating payment intent:', error);
        setPaymentError('Failed to initialize payment. Please try again.');
      }
    };

    createPaymentIntent();
  }, [getTotalPrice, navigate]);

  const validateForm = (): boolean => {
    const newErrors: Partial<ShippingInfo> = {};
    let isValid = true;

    if (!shippingInfo.name) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

    if (!shippingInfo.address) {
      newErrors.address = 'Address is required';
      isValid = false;
    }

    if (!shippingInfo.city) {
      newErrors.city = 'City is required';
      isValid = false;
    }

    if (!shippingInfo.state) {
      newErrors.state = 'State is required';
      isValid = false;
    }

    if (!shippingInfo.zip) {
      newErrors.zip = 'ZIP code is required';
      isValid = false;
    }

    if (!shippingInfo.country) {
      newErrors.country = 'Country is required';
      isValid = false;
    }

    if (!shippingInfo.email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(shippingInfo.email)) {
      newErrors.email = 'Email is invalid';
      isValid = false;
    }

    if (!shippingInfo.phone) {
      newErrors.phone = 'Phone is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingInfo({
      ...shippingInfo,
      [name]: value,
    });
    
    // Clear error when user types
    if (errors[name as keyof ShippingInfo]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      return;
    }

    if (!validateForm()) {
      toast.error('Please fill out all required fields.');
      return;
    }

    setIsProcessing(true);
    setPaymentError(null);

    try {
      const cardElement = elements.getElement(CardElement);
      
      if (!cardElement) {
        throw new Error('Card element not found');
      }

      // Confirm payment
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: shippingInfo.name,
            email: shippingInfo.email,
          },
        },
      });

      if (error) {
        setPaymentError(error.message || 'An error occurred with your payment');
        setIsProcessing(false);
        return;
      }

      if (paymentIntent.status === 'succeeded') {
        // Create the order in your backend
        try {
          const orderData = {
            items: cartItems.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
              designUrl: item.designUrl,
              notes: item.notes,
            })),
            shippingInfo,
            paymentIntentId: paymentIntent.id,
            total: getTotalPrice(),
          };
          
          const orderResponse = await api.createOrder(orderData);
          setOrderId(orderResponse.data.id);
          setOrderComplete(true);
          clearCart();
          
          toast.success('Order placed successfully!');
        } catch (orderError) {
          console.error('Error creating order:', orderError);
          toast.error('Payment processed but we had trouble creating your order. Please contact support.');
        }
      }
    } catch (err) {
      console.error('Payment error:', err);
      setPaymentError('An unexpected error occurred. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (orderComplete) {
    return (
      <div className="text-center py-8">
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank you for your order!</h2>
        <p className="text-gray-600 mb-6">Your order has been placed successfully.</p>
        <p className="text-gray-600 mb-6">Order ID: {orderId}</p>
        <div className="flex justify-center space-x-4">
          <Button
            variant="outline"
            onClick={() => navigate('/products')}
          >
            Continue Shopping
          </Button>
          <Button
            variant="primary"
            onClick={() => navigate('/orders')}
          >
            View Your Orders
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Shipping Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
          <Input
            label="Full Name"
            type="text"
            name="name"
            value={shippingInfo.name}
            onChange={handleInputChange}
            error={errors.name}
            fullWidth
          />
          <Input
            label="Email"
            type="email"
            name="email"
            value={shippingInfo.email}
            onChange={handleInputChange}
            error={errors.email}
            fullWidth
          />
          <Input
            label="Address"
            type="text"
            name="address"
            value={shippingInfo.address}
            onChange={handleInputChange}
            error={errors.address}
            fullWidth
          />
          <Input
            label="Phone"
            type="tel"
            name="phone"
            value={shippingInfo.phone}
            onChange={handleInputChange}
            error={errors.phone}
            fullWidth
          />
          <Input
            label="City"
            type="text"
            name="city"
            value={shippingInfo.city}
            onChange={handleInputChange}
            error={errors.city}
            fullWidth
          />
          <Input
            label="State/Province"
            type="text"
            name="state"
            value={shippingInfo.state}
            onChange={handleInputChange}
            error={errors.state}
            fullWidth
          />
          <Input
            label="ZIP/Postal Code"
            type="text"
            name="zip"
            value={shippingInfo.zip}
            onChange={handleInputChange}
            error={errors.zip}
            fullWidth
          />
          <Input
            label="Country"
            type="text"
            name="country"
            value={shippingInfo.country}
            onChange={handleInputChange}
            error={errors.country}
            fullWidth
          />
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Information</h2>
        <div className="border border-gray-300 rounded-md p-4 mb-4">
          <CardElement 
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }}
          />
        </div>
        {paymentError && (
          <div className="text-red-600 text-sm mb-4">
            {paymentError}
          </div>
        )}
      </div>

      <div className="border-t border-gray-200 pt-6 mb-6">
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">Subtotal</span>
          <span className="text-gray-900">${getTotalPrice().toFixed(2)}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">Shipping</span>
          <span className="text-gray-900">$0.00</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">Tax</span>
          <span className="text-gray-900">$0.00</span>
        </div>
        <div className="flex justify-between font-semibold text-lg">
          <span>Total</span>
          <span>${getTotalPrice().toFixed(2)}</span>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <button
          type="button"
          onClick={() => navigate('/cart')}
          className="text-blue-600 hover:text-blue-800 flex items-center"
        >
          <ChevronLeft size={16} className="mr-1" />
          Back to Cart
        </button>
        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={!stripe || isProcessing}
          isLoading={isProcessing}
          className="md:w-64"
        >
          <CreditCard size={18} className="mr-2" />
          {isProcessing ? 'Processing...' : `Pay $${getTotalPrice().toFixed(2)}`}
        </Button>
      </div>
    </form>
  );
};

const CheckoutPage: React.FC = () => {
  const { cartItems, getTotalPrice } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <Elements stripe={stripePromise}>
              <CheckoutForm />
            </Elements>
          </div>
        </div>

        <div>
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
            
            <div className="max-h-96 overflow-y-auto mb-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex py-4 border-b border-gray-100">
                  <div className="w-20 h-20 flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">Qty: {item.quantity}</p>
                    <p className="text-sm font-medium text-gray-900 mt-1">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-900">${getTotalPrice().toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Shipping</span>
                <span className="text-gray-900">$0.00</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Tax</span>
                <span className="text-gray-900">$0.00</span>
              </div>
              <div className="flex justify-between font-semibold text-lg mt-2">
                <span>Total</span>
                <span>${getTotalPrice().toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;