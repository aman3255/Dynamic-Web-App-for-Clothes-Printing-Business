import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Input from '../components/Input';
import Button from '../components/Button';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState(''); // Required by your backend
  const [password, setPassword] = useState('');
  const [formErrors, setFormErrors] = useState({
    email: '',
    phone: '',
    password: '',
  });
  
  const { login, user, loading, error, clearError } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If user is already logged in, redirect to home
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const validateForm = () => {
    let valid = true;
    const errors = {
      email: '',
      phone: '',
      password: '',
    };

    // Either email or phone must be provided
    if (!email && !phone) {
      errors.email = 'Email or phone number is required';
      errors.phone = 'Email or phone number is required';
      valid = false;
    } else {
      // Validate email if provided
      if (email && !/\S+@\S+\.\S+/.test(email)) {
        errors.email = 'Email is invalid';
        valid = false;
      }
  
      // Validate phone if provided
      if (phone && !/^\d{10}$/.test(phone)) {
        errors.phone = 'Please enter a valid 10-digit phone number';
        valid = false;
      }
    }

    if (!password) {
      errors.password = 'Password is required';
      valid = false;
    }

    setFormErrors(errors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    if (validateForm()) {
      try {
        await login(email, phone, password);
        navigate('/');
      } catch (err) {
        console.error('Login failed:', err);
        // Error is handled by the context and displayed from there
      }
    }
  };

  return (
    <div className="flex min-h-screen">

      {/* Left side - Image with quote */}
      <div className="hidden md:flex md:w-1/2 bg-wine relative">
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        <img 
          src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d" 
          alt="Person using laptop" 
          className="w-full h-full object-cover" 
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">Your Vision, Our Printing Excellence</h2>
          <p className="text-xl md:text-2xl text-center">
            "Quality is remembered long after the price is forgotten."
          </p>
          <p className="mt-2 text-lg font-light italic">— Aman Prajapati</p>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="w-full md:w-1/2 bg-wine flex items-center justify-center p-4 md:p-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-wine">Sign in to your account</h2>
            <p className="mt-2 text-sm text-gray-600">
              Or{' '}
              <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
                create a new account
              </Link>
            </p>
          </div>
          
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm space-y-4">
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                label="Email address"
                error={formErrors.email}
                fullWidth
              />
              
              <Input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone number (10 digits)"
                label="Phone number"
                error={formErrors.phone}
                fullWidth
              />
              
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                label="Password"
                error={formErrors.password}
                fullWidth
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <Button
                type="submit"
                variant="primary"
                fullWidth
                isLoading={loading}
                disabled={loading}
              >
                Sign in
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;